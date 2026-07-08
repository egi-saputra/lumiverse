<?php

namespace App\Http\Controllers;

use App\Models\Pesan;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PesanController extends Controller
{
    private const VALID_PENERIMA = ['semua', 'admin', 'guru', 'proktor', 'siswa'];

    // ─────────────────────────────────────────────────────────
    //  INBOX — pesan masuk untuk user login
    // ─────────────────────────────────────────────────────────

    public function index(Request $request)
    {
        $user    = $request->user();
        $kelasId = $this->getKelasId($user);

        $pesan = Pesan::with(['kelas:id,kelas', 'pengirim:id,name,role'])
            ->where(function ($q) use ($user, $kelasId) {
                $q->where('penerima', 'semua')
                ->orWhere(function ($q2) use ($user) {
                    $q2->where('penerima', $user->role)
                        ->whereNull('kelas_id');
                });

                if ($user->role === 'siswa' && $kelasId) {
                    $q->orWhere(function ($q2) use ($kelasId) {
                        $q2->where('penerima', 'siswa')
                        ->where('kelas_id', $kelasId);
                    });
                }
            })
            ->latest()
            ->get();

        return Inertia::render('Pesan/Index', [   // ← pastikan view ini ada
            'pesan' => $pesan,
        ]);
    }

    // ─────────────────────────────────────────────────────────
    //  COMPOSE — form kirim + daftar pesan terkirim milik user
    // ─────────────────────────────────────────────────────────

    public function create(Request $request)
    {
        $this->authorizeCanSend();

        // select() terpisah dari get() — lebih aman di semua versi Laravel
        $kelas = Kelas::orderBy('kelas')
            ->select(['id', 'kelas'])
            ->get();

        // Kembalikan array biasa (bukan paginate) agar Vue tidak
        // perlu akses .data — langsung di-slice client-side
        $myPesan = Pesan::with('kelas:id,kelas')
            ->where('pengirim_id', $request->user()->id)
            ->latest()
            ->get(['id', 'judul', 'isi', 'penerima', 'kelas_id', 'created_at']);

        return Inertia::render('Pesan/Create', [
            'kelas'   => $kelas,
            'myPesan' => $myPesan,
        ]);
    }

    // ─────────────────────────────────────────────────────────
    //  STORE
    // ─────────────────────────────────────────────────────────

    public function store(Request $request)
    {
        $this->authorizeCanSend();

        $validated = $request->validate([
            'judul'    => 'required|string|max:255',
            'isi'      => 'required|string|max:50000',
            'penerima' => 'required|in:' . implode(',', self::VALID_PENERIMA),
            'kelas_id' => 'nullable|exists:kelas,id',
        ]);

        if ($validated['penerima'] !== 'siswa') {
            $validated['kelas_id'] = null;
        }

        if (tenant()->hasReachedFreeLimit(Pesan::class, 3)) {
            return back()->with('error', 'Plan Free hanya dapat mengirim maksimal 3 pesan. Silakan upgrade plan untuk menambah kuis.');
        }

        Pesan::create([
            'judul'       => $validated['judul'],
            'isi'         => $validated['isi'],
            'penerima'    => $validated['penerima'],
            'kelas_id'    => $validated['kelas_id'] ?? null,
            'pengirim_id' => Auth::id(),
        ]);

        // Redirect ke route create (bukan back()) agar Inertia
        // menjalankan ulang create() dan props di-refresh dengan data terbaru
        return redirect()->route('pesan.create')
            ->with('success', 'Pesan berhasil dikirim!');
    }

    // ─────────────────────────────────────────────────────────
    //  DESTROY — hapus satu
    // ─────────────────────────────────────────────────────────

    public function destroy(Pesan $pesan)
    {
        $this->authorizeOwner($pesan);
        $pesan->delete();

        return back()->with('success', 'Pesan berhasil dihapus.');
    }

    // ─────────────────────────────────────────────────────────
    //  DELETE ALL
    // ─────────────────────────────────────────────────────────

    public function deleteAll(Request $request)
    {
        $this->authorizeCanSend();
        Pesan::where('pengirim_id', $request->user()->id)->delete();

        return back()->with('success', 'Semua pesan berhasil dihapus.');
    }

    // ─────────────────────────────────────────────────────────
    //  PRIVATE HELPERS
    // ─────────────────────────────────────────────────────────

    private function authorizeCanSend(): void
    {
        abort_unless(
            in_array(Auth::user()->role, ['admin', 'proktor'], true),
            403,
            'Anda tidak memiliki izin untuk mengirim pesan.'
        );
    }

    private function authorizeOwner(Pesan $pesan): void
    {
        abort_unless(
            $pesan->pengirim_id === Auth::id(),
            403,
            'Anda tidak memiliki izin untuk menghapus pesan ini.'
        );
    }

    /**
     * Ambil kelas_id user secara aman.
     * Siswa umumnya menyimpan kelas_id di relasi siswa, bukan di tabel users.
     */
    private function getKelasId($user): ?int
    {
        if (! $user || $user->role !== 'siswa') {
            return null;
        }

        // Prioritas 1: dari relasi siswa
        if ($user->relationLoaded('siswa') || $user->siswa) {
            $k = $user->siswa?->kelas_id;
            if ($k) return (int) $k;
        }

        // Fallback: kolom langsung di tabel users (jika ada)
        if (isset($user->kelas_id) && $user->kelas_id) {
            return (int) $user->kelas_id;
        }

        return null;
    }

    public function show(Pesan $pesan)
    {
        $pesan->load('pengirim', 'kelas');
        return Inertia::render('Pesan/Show', ['pesan' => $pesan]);
    }
}