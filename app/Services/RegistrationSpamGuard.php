<?php

namespace App\Services;

use App\Models\RegistrationRateLimit;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class RegistrationSpamGuard
{
    // ── Konfigurasi ───────────────────────────────────────────────
    /** Maks. percobaan dalam window waktu sebelum diblokir */
    private const MAX_ATTEMPTS = 3;

    /** Window waktu percobaan (menit) */
    private const WINDOW_MINUTES = 60;

    /** Durasi blokir jika melebihi limit (menit) */
    private const BLOCK_DURATION_MINUTES = 24 * 60; // 24 jam

    // ─────────────────────────────────────────────────────────────

    /**
     * Periksa apakah request ini harus diblokir.
     *
     * @return array{blocked: bool, reason: string, retry_after: int}
     */
    public function check(Request $request, ?string $fingerprint): array
    {
        $identifiers = $this->buildIdentifiers($request, $fingerprint);

        foreach ($identifiers as [$identifier, $type]) {
            $record = RegistrationRateLimit::where('identifier', $identifier)
                ->where('identifier_type', $type)
                ->first();

            if (!$record) {
                continue;
            }

            // Sudah diblokir secara eksplisit
            if ($record->isBlocked()) {
                Log::warning('Registration blocked', [
                    'identifier' => $identifier,
                    'type'       => $type,
                    'ip'         => $request->ip(),
                ]);

                return [
                    'blocked'     => true,
                    'reason'      => 'Terlalu banyak percobaan. Coba lagi dalam ' . ceil($record->remainingBlockSeconds() / 3600) . ' jam.',
                    'retry_after' => $record->remainingBlockSeconds(),
                ];
            }

            // Cek window waktu: reset jika sudah lebih dari WINDOW_MINUTES
            $windowStart = now()->subMinutes(self::WINDOW_MINUTES);
            if ($record->first_attempt_at->lessThan($windowStart)) {
                // Reset window
                $record->update([
                    'attempt_count'   => 0,
                    'first_attempt_at' => now(),
                ]);
            }
        }

        return ['blocked' => false, 'reason' => '', 'retry_after' => 0];
    }

    /**
     * Catat percobaan baru dan blokir jika perlu.
     */
    public function record(Request $request, ?string $fingerprint): void
    {
        $identifiers = $this->buildIdentifiers($request, $fingerprint);

        foreach ($identifiers as [$identifier, $type]) {
            $record = RegistrationRateLimit::firstOrNew([
                'identifier'      => $identifier,
                'identifier_type' => $type,
            ]);

            $now          = now();
            $windowStart  = $now->copy()->subMinutes(self::WINDOW_MINUTES);
            $isNewWindow  = !$record->exists || $record->first_attempt_at->lessThan($windowStart);

            if ($isNewWindow) {
                $record->attempt_count   = 1;
                $record->first_attempt_at = $now;
            } else {
                $record->attempt_count = ($record->attempt_count ?? 0) + 1;
            }

            $record->last_attempt_at = $now;
            $record->ip_address      = $request->ip();
            $record->user_agent      = substr($request->userAgent() ?? '', 0, 255);

            // Blokir jika melebihi limit
            if ($record->attempt_count >= self::MAX_ATTEMPTS) {
                $record->blocked_until = $now->addMinutes(self::BLOCK_DURATION_MINUTES);

                Log::warning('Registration rate limit triggered — blocking', [
                    'identifier'     => $identifier,
                    'type'           => $type,
                    'attempt_count'  => $record->attempt_count,
                    'blocked_until'  => $record->blocked_until,
                    'ip'             => $request->ip(),
                ]);
            }

            $record->save();
        }
    }

    /**
     * Bangun daftar identifier yang akan dicek.
     *
     * @return array<array{string, string}>
     */
    private function buildIdentifiers(Request $request, ?string $fingerprint): array
    {
        $identifiers = [];

        // 1. Berdasarkan IP
        if ($ip = $request->ip()) {
            $identifiers[] = [hash('sha256', $ip), 'ip'];
        }

        // 2. Berdasarkan device fingerprint
        if ($fingerprint) {
            $identifiers[] = [$fingerprint, 'fingerprint'];
        }

        // 3. Kombinasi IP + fingerprint (lebih ketat)
        if ($ip && $fingerprint) {
            $identifiers[] = [hash('sha256', $ip . '|' . $fingerprint), 'combined'];
        }

        return $identifiers;
    }

    /**
     * Reset record untuk identifier tertentu (misal: untuk testing).
     */
    public function reset(string $identifier, string $type): void
    {
        RegistrationRateLimit::where('identifier', $identifier)
            ->where('identifier_type', $type)
            ->delete();
    }
}