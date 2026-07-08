<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\RegistrationResource;
use App\Models\Registration;
use App\Models\RegistrationRateLimit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminRegistrationController extends Controller
{
    // ──────────────────────────────────────────────────────────────
    // GET /admin/registrations
    // ──────────────────────────────────────────────────────────────

    public function index(Request $request): Response
    {
        $query = Registration::query()
            ->when($request->status,  fn ($q, $v) => $q->where('status', $v))
            ->when($request->program, fn ($q, $v) => $q->byProgram($v))
            ->when($request->search, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name',  'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->per_page ?? 20)
            ->withQueryString();

        // ── Statistik ringkas ──────────────────────────────────────
        $stats = Registration::query()
            ->selectRaw("
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending'   THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted,
                SUM(CASE WHEN status = 'enrolled'  THEN 1 ELSE 0 END) as enrolled,
                SUM(CASE WHEN status = 'rejected'  THEN 1 ELSE 0 END) as rejected
            ")
            ->first();

        // ── Breakdown per program ──────────────────────────────────
        $byProgram = Registration::query()
            ->select('program', DB::raw('COUNT(*) as count'))
            ->groupBy('program')
            ->pluck('count', 'program');

        return Inertia::render('Admin/Registrations/Index', [
            'registrations' => RegistrationResource::collection($query),
            'stats'         => $stats,
            'byProgram'     => $byProgram,
            'filters'       => $request->only('status', 'program', 'search', 'per_page'),
            'programs'      => [
                'MPLB — Manajemen Perkantoran & Lembaga Bisnis',
                'BR — Bisnis Retail & Pemasaran',
            ],
            'statusOptions' => [
                ['value' => '',          'label' => 'Semua Status'],
                ['value' => 'pending',   'label' => 'Pending'],
                ['value' => 'contacted', 'label' => 'Diproses'],
                ['value' => 'enrolled',  'label' => 'Diterima'],
                ['value' => 'rejected',  'label' => 'Ditolak'],
            ],
        ]);
    }

    // ──────────────────────────────────────────────────────────────
    // PATCH /admin/registrations/{registration}/status
    // ──────────────────────────────────────────────────────────────

    public function updateStatus(Request $request, Registration $registration): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:pending,contacted,enrolled,rejected'],
        ]);

        $registration->update(['status' => $request->status]);

        return back()->with('success', 'Status pendaftaran berhasil diperbarui.');
    }

    // ──────────────────────────────────────────────────────────────
    // DELETE /admin/registrations/{registration}
    // Hard-delete satu data + bersihkan rate-limit fingerprint terkait.
    // ──────────────────────────────────────────────────────────────

    public function destroy(Registration $registration): RedirectResponse
    {
        // Bersihkan record rate-limit untuk fingerprint ini agar bisa daftar ulang jika perlu
        if ($registration->device_fingerprint) {
            RegistrationRateLimit::where('identifier', $registration->device_fingerprint)
                ->where('identifier_type', 'fingerprint')
                ->delete();
        }

        $registration->forceDelete(); // hard delete — hapus permanen dari DB

        return back()->with('success', 'Data pendaftaran berhasil dihapus.');
    }

    // ──────────────────────────────────────────────────────────────
    // DELETE /admin/registrations  (bulk)
    //
    // Logika:
    //   • Ada filter aktif  → hard-delete hanya data yang cocok filter
    //   • Tanpa filter      → hard-delete SEMUA registrations
    //                         + hard-delete SEMUA registration_rate_limits
    //
    // Catatan: model Registration pakai SoftDeletes, sehingga .delete()
    // hanya mengisi deleted_at. Gunakan .forceDelete() agar baris
    // benar-benar terhapus dari tabel.
    // ──────────────────────────────────────────────────────────────

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $hasFilter = filled($request->status)
            || filled($request->program)
            || filled($request->search);

        if ($hasFilter) {
            // ── Hapus data sesuai filter yang aktif ───────────────
            // withTrashed() agar data yang sebelumnya soft-deleted juga ikut terhapus
            $query = Registration::withTrashed();

            if ($request->status) {
                $query->where('status', $request->status);
            }
            if ($request->program) {
                $query->byProgram($request->program);
            }
            if ($request->search) {
                $query->where(function ($sub) use ($request) {
                    $sub->where('name',  'like', "%{$request->search}%")
                        ->orWhere('phone', 'like', "%{$request->search}%");
                });
            }

            $count = $query->count();

            if ($count === 0) {
                return back()->with('info', 'Tidak ada data yang cocok dengan filter aktif.');
            }

            $query->forceDelete(); // hard delete — hapus permanen

            return back()->with('success', "{$count} data pendaftaran berhasil dihapus.");
        }

        // ── Tanpa filter: hapus semua dari kedua tabel ─────────────
        // withTrashed() agar soft-deleted records juga ikut terhapus
        $count = Registration::withTrashed()->count();

        DB::transaction(function () {
            Registration::withTrashed()->forceDelete(); // hard delete semua registrations
            RegistrationRateLimit::query()->delete();    // hard delete semua rate limits
        });

        return back()->with('success', "Semua {$count} data pendaftaran dan seluruh data rate-limit berhasil dihapus.");
    }
}