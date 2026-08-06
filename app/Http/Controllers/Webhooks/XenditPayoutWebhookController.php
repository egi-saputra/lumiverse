<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\PartnerBankAccount;
use App\Models\PayoutRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class XenditPayoutWebhookController extends Controller
{
    private const FAILURE_MESSAGES = [
        'INSUFFICIENT_BALANCE'      => 'Saldo perusahaan tidak mencukupi saat ini. Tim kami akan memproses ulang.',
        'INVALID_DESTINATION'       => 'Rekening tujuan tidak ditemukan atau tidak valid. Silakan cek kembali nomor rekening kamu.',
        'DESTINATION_MAXIMUM_LIMIT' => 'Jumlah pencairan melebihi batas maksimum rekening tujuan.',
        'REJECTED_BY_CHANNEL'       => 'Ditolak oleh bank tujuan. Pastikan rekening aktif dan bisa menerima dana.',
        'TEMPORARY_TRANSFER_ERROR'  => 'Gangguan sementara pada jaringan bank. Silakan coba lagi dalam 1-3 jam.',
        'TRANSFER_ERROR'            => 'Terjadi kesalahan teknis pada pencairan ini. Silakan hubungi support.',
    ];

    public function handle(Request $request)
    {
        $token = $request->header('x-callback-token');

        if (! hash_equals((string) config('services.xendit.callback_token'), (string) $token)) {
            Log::warning('Xendit webhook: token tidak valid', ['ip' => $request->ip()]);
            abort(403);
        }

        $payload = $request->all();
        $data = $payload['data'] ?? [];

        $status = $data['status'] ?? null;
        $referenceId = $data['reference_id'] ?? null;
        $xenditId = $data['id'] ?? null;

        return DB::transaction(function () use ($xenditId, $referenceId, $status, $payload) {
            $payout = PayoutRequest::where('xendit_payout_id', $xenditId)
                ->orWhere('xendit_payout_id', $referenceId)
                ->lockForUpdate()
                ->first();

            if (! $payout) {
                Log::warning('Xendit webhook: payout tidak ditemukan', ['payload' => $payload]);
                return response()->json(['message' => 'ignored']);
            }

            if (in_array($payout->status, [PayoutRequest::STATUS_COMPLETED, PayoutRequest::STATUS_FAILED])) {
                return response()->json(['message' => 'already processed']);
            }

            $bankAccount = $payout->bankAccount;

            if ($status === 'SUCCEEDED') {
                $payout->update([
                    'status'       => PayoutRequest::STATUS_COMPLETED,
                    'completed_at' => now(),
                ]);

                // Payout pertama yang berhasil = rekening ini otomatis
                // tertandai "Terverifikasi". Catatan: ini bukan pengecekan
                // nama pemilik rekening oleh Xendit/bank — Xendit tidak
                // menyediakan layanan itu untuk akun kami. Ini murni penanda
                // "rekening ini sudah terbukti bisa menerima dana".
                if (! $bankAccount->isVerified()) {
                    $bankAccount->update([
                        'verification_status' => PartnerBankAccount::STATUS_VERIFIED,
                        'verified_at'          => now(),
                    ]);
                }
            } elseif (in_array($status, ['FAILED', 'CANCELLED', 'REVERSED'])) {
                $failureCode = $payload['failure_code'] ?? null;

                $friendlyMessage = $status === 'REVERSED'
                    ? 'Payout ditolak oleh bank setelah sempat berhasil — kemungkinan rekening tidak valid/dormant.'
                    : (self::FAILURE_MESSAGES[$failureCode] ?? ($failureCode ?? 'Pencairan gagal diproses oleh bank.'));

                $payout->partner()->increment('referral_credit_balance', $payout->amount);
                $payout->update([
                    'status'         => PayoutRequest::STATUS_FAILED,
                    'failure_reason' => $friendlyMessage,
                ]);

                // Kalau rekening ini belum pernah sukses payout sebelumnya,
                // tandai gagal verifikasi supaya partner tahu ada masalah
                // dengan rekening ini (bukan cuma masalah teknis sesaat).
                if (! $bankAccount->isVerified()) {
                    $bankAccount->update([
                        'verification_status'      => PartnerBankAccount::STATUS_FAILED,
                        'verification_failure_reason' => $friendlyMessage,
                    ]);
                }
            }

            return response()->json(['message' => 'ok']);
        });
    }
}