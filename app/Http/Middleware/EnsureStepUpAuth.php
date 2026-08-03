<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Device;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class EnsureStepUpAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $partner = $request->user('partner');
        $deviceUuid = $request->header('X-Device-Uuid');
        $token = $request->header('X-Step-Up-Token');

        if (! $partner || ! $deviceUuid || ! $token) {
            return $this->stepUpRequired($request);
        }

        $cacheKey = $this->cacheKey($partner->id, $deviceUuid);
        $stored = Cache::get($cacheKey);

        // Poin 1: pakai hash_equals, bukan !==, untuk perbandingan token.
        if (! $stored || ! hash_equals((string) $stored, (string) $token)) {
            return $this->stepUpRequired($request);
        }

        // Poin 2: kalau device sempat di-revoke setelah token diterbitkan
        // (mis. HP dicuri lalu di-revoke dari device lain dalam window
        // 5 menit token masih hidup), token lama jangan diterima lagi.
        $revoked = Device::where('device_uuid', $deviceUuid)
            ->where('authenticatable_id', $partner->id)
            ->where('authenticatable_type', get_class($partner))
            ->whereNotNull('revoked_at')
            ->exists();

        if ($revoked) {
            Cache::forget($cacheKey);
            return $this->stepUpRequired($request);
        }

        // One-time use — begitu dipakai, langsung dicabut supaya token
        // step-up nggak bisa dipakai berkali-kali untuk banyak aksi.
        Cache::forget($cacheKey);

        return $next($request);
    }

    /**
     * Request normal (dari composable useStepUp) selalu sudah bawa token
     * valid sebelum sampai sini, jadi cabang ini harusnya jarang kena.
     * Tapi kalau kena (token kadaluarsa pas user lama mikir, race
     * condition, dll), request Inertia (form.post/patch/delete) TIDAK
     * BOLEH dibalas JSON polos — Inertia akan menganggapnya response
     * tidak valid dan menampilkan crash page. Untuk request Inertia,
     * balas dengan redirect + flash error supaya halaman reload dengan
     * pesan yang jelas, bukan crash.
     */
    private function stepUpRequired(Request $request): Response
    {
        if ($request->header('X-Inertia')) {
            return back()->with(
                'error',
                'Konfirmasi keamanan kadaluarsa atau belum lengkap. Silakan coba lagi.'
            );
        }

        return response()->json([
            'error' => 'STEP_UP_REQUIRED',
            'message' => 'Konfirmasi ulang dengan PIN atau biometric.',
        ], 428);
    }

    private function cacheKey(int $partnerId, string $deviceUuid): string
    {
        return "stepup:partner:{$partnerId}:{$deviceUuid}";
    }
}