<?php

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use App\Models\PartnerBankAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BankAccountController extends Controller
{
    public const SUPPORTED_BANKS = [
        ['code' => 'BCA', 'name' => 'BCA'],
        ['code' => 'BNI', 'name' => 'BNI'],
        ['code' => 'BRI', 'name' => 'BRI'],
        ['code' => 'MANDIRI', 'name' => 'Bank Mandiri'],
        ['code' => 'PERMATA', 'name' => 'Permata Bank'],
        ['code' => 'CIMB', 'name' => 'CIMB Niaga'],
        ['code' => 'BSI', 'name' => 'Bank Syariah Indonesia'],
        ['code' => 'BTN', 'name' => 'BTN'],
    ];

    /**
     * Jeda minimum sebelum rekening baru boleh dipakai payout.
     */
    public const COOLING_OFF_HOURS = 24;

    public function index(): Response
    {
        $partner = Auth::guard('partner')->user();

        $accounts = PartnerBankAccount::where('partner_id', $partner->id)
            ->orderByDesc('is_primary')
            ->orderByDesc('id')
            ->get()
            ->map(fn (PartnerBankAccount $acc) => [
                'id'                           => $acc->id,
                'bank_code'                    => $acc->bank_code,
                'account_number'               => $acc->account_number,
                'account_holder_name'          => $acc->account_holder_name,
                'is_primary'                   => $acc->is_primary,
                'verification_status'          => $acc->verification_status,
                'verification_failure_reason'  => $acc->verification_failure_reason,
                'created_at'                   => $acc->created_at?->toDateString(),
                'eligible_for_payout'          => $acc->created_at?->lte(now()->subHours(self::COOLING_OFF_HOURS)) ?? false,
            ]);

        return Inertia::render('Partner/BankAccounts/Index', [
            'accounts'          => $accounts,
            'banks'             => self::SUPPORTED_BANKS,
            'cooling_off_hours' => self::COOLING_OFF_HOURS,
        ]);
    }

    public function store(Request $request)
    {
        $partner = Auth::guard('partner')->user();

        $data = $request->validate([
            'bank_code'            => ['required', 'string', Rule::in(array_column(self::SUPPORTED_BANKS, 'code'))],
            'account_number'       => ['required', 'string', 'max:50'],
            'account_holder_name'  => ['required', 'string', 'max:255'],
        ]);

        $exists = PartnerBankAccount::where('partner_id', $partner->id)
            ->where('bank_code', $data['bank_code'])
            ->where('account_number', $data['account_number'])
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'account_number' => 'Rekening ini sudah pernah kamu daftarkan sebelumnya.',
            ])->onlyInput('bank_code', 'account_number', 'account_holder_name');
        }

        $hasAnyAccount = PartnerBankAccount::where('partner_id', $partner->id)->exists();

        $account = PartnerBankAccount::create([
            'partner_id'           => $partner->id,
            'bank_code'            => $data['bank_code'],
            'account_number'       => $data['account_number'],
            'account_holder_name'  => $data['account_holder_name'],
            'verification_status'  => PartnerBankAccount::STATUS_UNVERIFIED,
            'is_primary'           => false,
        ]);

        if (! $hasAnyAccount) {
            $account->markAsPrimary();
        }

        return back()->with(
            'success',
            'Rekening berhasil ditambahkan. Akun bank akan diverifikasi secara otomatis saat melakukan transaksi penarikan / pencairan dana pertama kali, dan baru bisa digunakan untuk penarikan dana setelah '
                . self::COOLING_OFF_HOURS . ' jam sejak ditambahkan.'
        );
    }

    public function setPrimary(PartnerBankAccount $bankAccount)
    {
        $this->authorizeOwnership($bankAccount);

        $bankAccount->markAsPrimary();

        return back()->with('success', 'Rekening utama berhasil diubah.');
    }

    public function destroy(PartnerBankAccount $bankAccount)
    {
        $this->authorizeOwnership($bankAccount);

        $wasPrimary = $bankAccount->is_primary;
        $partnerId  = $bankAccount->partner_id;

        try {
            $bankAccount->delete();
        } catch (\Illuminate\Database\QueryException $e) {
            return back()->withErrors([
                'account' => 'Rekening ini tidak bisa dihapus karena masih memiliki riwayat penarikan dana.',
            ]);
        }

        if ($wasPrimary) {
            $next = PartnerBankAccount::where('partner_id', $partnerId)->first();
            $next?->markAsPrimary();
        }

        return back()->with('success', 'Rekening berhasil dihapus.');
    }

    private function authorizeOwnership(PartnerBankAccount $bankAccount): void
    {
        abort_unless(
            $bankAccount->partner_id === Auth::guard('partner')->id(),
            403
        );
    }
}