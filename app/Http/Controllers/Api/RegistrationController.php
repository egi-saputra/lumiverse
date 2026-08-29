<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRegistrationRequest;
use App\Models\Registration;
use App\Services\RegistrationSpamGuard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;   // ← tambahkan ini
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class RegistrationController extends Controller
{
    public function __construct(
        private readonly RegistrationSpamGuard $spamGuard
    ) {}

    public function store(StoreRegistrationRequest $request): JsonResponse
    {
        $validated   = $request->validated();
        $fingerprint = $validated['device_fingerprint'] ?? null;

        // ── 1. Cek anti-spam / rate limit ─────────────────────────
        $spamCheck = $this->spamGuard->check($request, $fingerprint);

        if ($spamCheck['blocked']) {
            return response()->json([
                'success'     => false,
                'message'     => $spamCheck['reason'],
                'retry_after' => $spamCheck['retry_after'],
            ], 429);
        }

        // ── 2. Normalisasi nomor telepon ───────────────────────────
        $normalizedPhone = Registration::normalizePhone($validated['phone']);

        // ── 3. Cek duplikasi nomor telepon ─────────────────────────
        $existingByPhone = Registration::where('phone', $normalizedPhone)
            ->orWhere('phone', $validated['phone'])
            ->withTrashed()
            ->first();

        if ($existingByPhone) {
            $this->spamGuard->record($request, $fingerprint);

            throw ValidationException::withMessages([
                'phone' => ['Nomor WhatsApp ini sudah terdaftar. Silakan hubungi kami langsung jika ada pertanyaan.'],
            ]);
        }

        // ── 4. Cek duplikasi device fingerprint ────────────────────
        if ($fingerprint) {
            $existingByDevice = Registration::where('device_fingerprint', $fingerprint)
                ->where('status', '!=', 'rejected')
                ->exists();

            if ($existingByDevice) {
                $this->spamGuard->record($request, $fingerprint);

                return response()->json([
                    'success' => false,
                    'message' => 'Perangkat ini sudah pernah melakukan pendaftaran.',
                ], 409);
            }
        }

        // ── 5. Simpan ke database dalam transaksi ──────────────────
        try {
            $registration = DB::transaction(function () use ($validated, $normalizedPhone, $request, $fingerprint) {
                return Registration::create([
                    'name'               => $validated['name'],
                    'phone'              => $normalizedPhone,
                    'program'            => $validated['program'],
                    'message'            => $validated['message'] ?? null,
                    'device_fingerprint' => $fingerprint,
                    'ip_address'         => $request->ip(),
                    'user_agent'         => substr($request->userAgent() ?? '', 0, 255),
                    'device_info'        => $validated['device_info'] ?? null,
                    'status'             => 'pending',
                    'last_submission_at' => now(),
                ]);
            });

            $this->spamGuard->record($request, $fingerprint);

            Log::info('New registration submitted', [
                'id'      => $registration->id,
                'program' => $registration->program,
            ]);

            // ── 6. Kirim notifikasi WA ─────────────────────────────
            // Dipanggil SEBELUM return, di dalam blok try
            $this->sendWhatsAppNotification($registration);

            return response()->json([
                'success' => true,
                'message' => 'Pendaftaran berhasil! Tim kami akan menghubungi kamu dalam 1×24 jam.',
                'data'    => [
                    'id'      => $registration->id,
                    'name'    => $registration->name,
                    'program' => $registration->program,
                ],
            ], 201);

        } catch (\Throwable $e) {
            Log::error('Registration store failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server. Silakan coba beberapa saat lagi.',
            ], 500);
        }
    }

    private function sendWhatsAppNotification(Registration $registration): void
    {
        $gatewayUrl = config('services.wa_gateway.url', 'http://localhost:3001');
        $secret     = config('services.wa_gateway.secret');

        try {
            $response = Http::timeout(5)
                ->when($secret, fn ($http) => $http->withHeaders([
                    'X-Gateway-Secret' => $secret,
                ]))
                ->post("{$gatewayUrl}/notify-registration", [
                    'name'    => $registration->name,
                    'phone'   => $registration->phone,
                    'program' => $registration->program,
                    'message' => $registration->message,
                ]);

            if (!$response->successful()) {
                Log::warning('[WA Gateway] Notifikasi gagal', [
                    'registration_id' => $registration->id,
                    'status'          => $response->status(),
                    'body'            => $response->body(),
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('[WA Gateway] Exception saat kirim notifikasi', [
                'registration_id' => $registration->id,
                'error'           => $e->getMessage(),
            ]);
        }
    }

    // ──────────────────────────────────────────────────────────────
    // GET /api/admin/registrations  (butuh autentikasi)
    // ──────────────────────────────────────────────────────────────

    /**
     * Daftar semua pendaftaran (admin only).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Registration::query()
            ->when($request->status, fn ($q, $v) => $q->where('status', $v))
            ->when($request->program, fn ($q, $v) => $q->byProgram($v))
            ->when($request->search, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->per_page ?? 25);

        return response()->json([
            'success' => true,
            'data'    => $query,
        ]);
    }

    // ──────────────────────────────────────────────────────────────
    // PATCH /api/admin/registrations/{id}/status
    // ──────────────────────────────────────────────────────────────

    /**
     * Update status pendaftaran (admin only).
     */
    public function updateStatus(Request $request, Registration $registration): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:pending,contacted,enrolled,rejected'],
        ]);

        $registration->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Status pendaftaran berhasil diperbarui.',
            'data'    => $registration->fresh(),
        ]);
    }
}