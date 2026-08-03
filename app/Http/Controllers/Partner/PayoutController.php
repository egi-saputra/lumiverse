<?php

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use App\Models\PartnerBankAccount;
use App\Models\PayoutRequest;
use App\Services\Xendit\XenditClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class PayoutController extends Controller
{
    public const MIN_PAYOUT_AMOUNT = 50000;

    public function index(): Response
    {
        $partner = Auth::guard('partner')->user();

        $payouts = PayoutRequest::with('bankAccount')
            ->where('partner_id', $partner->id)
            ->latest()
            ->get()
            ->map(fn (PayoutRequest $p) => [
                'id'             => $p->id,
                'amount'         => $p->amount,
                'status'         => $p->status,
                'bank_code'      => $p->bankAccount->bank_code,
                'account_number' => $p->bankAccount->account_number,
                'failure_reason' => $p->failure_reason,
                'requested_at'   => $p->created_at->toDateTimeString(),
                'completed_at'   => $p->completed_at?->toDateTimeString(),
            ]);

        return Inertia::render('Partner/PayoutHistory', [
            'payouts' => $payouts,
            'balance' => (int) ($partner->referral_credit_balance ?? 0),
            'min_amount' => self::MIN_PAYOUT_AMOUNT,
        ]);
    }

    public function store(Request $request)
    {
        $partner = Auth::guard('partner')->user();

        $data = $request->validate([
            'amount' => ['required', 'integer', 'min:' . self::MIN_PAYOUT_AMOUNT],
        ]);

        $bankAccount = PartnerBankAccount::where('partner_id', $partner->id)
            ->where('is_primary', true)
            ->first();

        if (! $bankAccount) {
            return back()->withErrors(['amount' => 'Kamu belum punya rekening utama untuk pencairan.']);
        }

        // Xendit tidak menyediakan verifikasi nama pemilik rekening untuk
        // akun kami, jadi rekening yang baru ditambahkan/baru diganti primary
        // wajib melewati cooling-off period dulu sebelum bisa dipakai payout.
        // Ini pengaman utama terhadap skenario akun partner diretas lalu
        // rekening tujuan diganti untuk langsung mencairkan saldo.
        $coolingOffDeadline = now()->subHours(BankAccountController::COOLING_OFF_HOURS);
        if ($bankAccount->created_at->gt($coolingOffDeadline)) {
            $eligibleAt = $bankAccount->created_at->copy()->addHours(BankAccountController::COOLING_OFF_HOURS);

            // Hitung dari selisih timestamp langsung biar arahnya jelas (selalu positif
            // karena kita sudah tahu $eligibleAt pasti di masa depan dari cek di atas),
            // lalu dibulatkan ke atas biar tidak meremehkan sisa waktu tunggu.
            $jamTersisa = (int) ceil(($eligibleAt->timestamp - now()->timestamp) / 3600);
            $jamTersisa = max($jamTersisa, 1); // minimal tampil "1 jam" biar tidak muncul "0 jam"

            return back()->withErrors([
                'amount' => "Rekening utama kamu baru ditambahkan. Untuk keamanan, tunggu sekitar {$jamTersisa} jam lagi sebelum bisa melakukan penarikan.",
            ]);
        }

        // Kunci baris partner supaya tidak race-condition kalau ada 2
        // request payout bersamaan (mis. double-klik / 2 tab).
        try {
            $payout = DB::transaction(function () use ($partner, $data, $bankAccount) {
                $lockedPartner = $partner->newQuery()->lockForUpdate()->find($partner->id);

                if ($lockedPartner->referral_credit_balance < $data['amount']) {
                    throw new \RuntimeException('Saldo kamu tidak mencukupi.');
                }

                $lockedPartner->decrement('referral_credit_balance', $data['amount']);

                return PayoutRequest::create([
                    'partner_id'              => $partner->id,
                    'partner_bank_account_id' => $bankAccount->id,
                    'amount'                  => $data['amount'],
                    'status'                  => PayoutRequest::STATUS_PENDING,
                ]);
            });
        } catch (\RuntimeException $e) {
            return back()->withErrors(['amount' => $e->getMessage()]);
        }

        // Kirim ke Xendit SETELAH transaksi DB commit, supaya saldo sudah
        // pasti terkunci sebelum kita hubungi pihak ketiga.
        try {
            $referenceId = 'payout-' . $payout->id . '-' . Str::random(6);

            $response = (new XenditClient())->createPayout(
                externalId: $referenceId,
                bankCode: $bankAccount->bank_code,
                accountNumber: $bankAccount->account_number,
                accountHolderName: $bankAccount->account_holder_name,
                amount: $payout->amount,
                description: "Pencairan komisi partner #{$partner->id}",
            );

            $payout->update([
                'status'           => PayoutRequest::STATUS_PROCESSING,
                'xendit_payout_id' => $response['id'] ?? $referenceId,
            ]);
        } catch (Throwable $e) {
            report($e);

            DB::transaction(function () use ($partner, $payout) {
                $lockedPayout = PayoutRequest::where('id', $payout->id)
                    ->lockForUpdate()
                    ->first();

                $partner->increment('referral_credit_balance', $lockedPayout->amount);
                $lockedPayout->update([
                    'status'         => PayoutRequest::STATUS_FAILED,
                    'failure_reason' => 'Gagal menghubungi penyedia pembayaran. Saldo sudah dikembalikan.',
                ]);
            });

            return back()->withErrors([
                'amount' => 'Pencairan gagal diproses. Saldo kamu sudah dikembalikan, silakan coba lagi.',
            ]);
        }

        return back()->with('success', 'Permintaan pencairan sedang diproses.');
    }
}