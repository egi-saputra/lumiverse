<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Siswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RoleSelectionController extends Controller
{
    private const FINAL_ROLES = ['admin', 'staff', 'proktor', 'guru', 'siswa', 'user'];

    public function create(): Response|RedirectResponse
    {
        $user = Auth::user();

        if (in_array($user->role, self::FINAL_ROLES, true)) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/RoleSelect');
    }

    /**
     * Khusus peran siswa — tidak butuh input tambahan, langsung diproses.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate(['peran' => 'required|in:siswa']);

        // Role BELUM disimpan di sini — sama seperti flow guru.
        // Role baru jadi final setelah data siswa berhasil disimpan
        // di FormController@store, supaya user masih bisa "batal" dan
        // balik pilih peran lain tanpa nyangkut di role siswa.

        $siswaExists = Siswa::where('user_id', Auth::id())->exists();

        if (!$siswaExists) {
            return redirect()->route('siswa.form.create');
        }

        // Edge case: data siswa sudah ada tapi role belum final (jarang terjadi,
        // misal race condition) — set role di sini biar konsisten lalu lanjut dashboard.
        Auth::user()->update(['role' => 'siswa']);

        return redirect()->route('siswa.dashboard');
    }

    public function createGuru(): Response|RedirectResponse
    {
        if (in_array(Auth::user()->role, self::FINAL_ROLES, true)) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/RoleGuru');
    }

    public function storeGuru(Request $request): RedirectResponse
    {
        $request->validate(['kode_guru' => 'required|string']);

        $guru = Guru::where('kode_guru', $request->kode_guru)->first();

        if (!$guru) {
            throw ValidationException::withMessages([
                'kode_guru' => 'Kode guru tidak ditemukan. Periksa kembali kode dari sekolah.',
            ]);
        }

        if ($guru->user_id && $guru->user_id !== Auth::id()) {
            throw ValidationException::withMessages([
                'kode_guru' => 'Kode guru ini sudah dipakai akun lain.',
            ]);
        }

        $guru->update(['user_id' => Auth::id()]);
        Auth::user()->update(['role' => 'guru']);

        return redirect()->route('guru.dashboard')
            ->with('success', 'Akun kamu berhasil dihubungkan sebagai guru.');
    }

    public function createOrangTua(): Response|RedirectResponse
    {
        if (in_array(Auth::user()->role, self::FINAL_ROLES, true)) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/RoleOrangTua');
    }

    public function storeOrangTua(Request $request): RedirectResponse
    {
        $request->validate(['id_siswa' => 'required|string']);

        $siswa = Siswa::where('id_siswa', $request->id_siswa)->first();

        if (!$siswa) {
            throw ValidationException::withMessages([
                'id_siswa' => 'ID siswa tidak ditemukan. Periksa kembali dengan anak kamu.',
            ]);
        }

        Auth::user()->update(['role' => 'user']);
        $siswa->wali()->syncWithoutDetaching([Auth::id()]);

        return redirect()->route('user.dashboard')
            ->with('success', 'Akun kamu berhasil dihubungkan sebagai orang tua/wali.');
    }

    public function lookupGuru(Request $request)
    {
        $request->validate(['kode_guru' => 'required|string']);

        $guru = Guru::where('kode_guru', $request->kode_guru)->first();

        if (!$guru) {
            return response()->json([
                'message' => 'Kode guru tidak ditemukan. Periksa kembali kode dari sekolah.',
            ], 404);
        }

        if ($guru->user_id && $guru->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Kode guru ini sudah dipakai akun lain.',
            ], 409);
        }

        return response()->json([
            'nama_lengkap' => $guru->nama_lengkap,
        ]);
    }

    public function lookupOrangTua(Request $request)
    {
        $request->validate(['id_siswa' => 'required|string']);

        $siswa = Siswa::where('id_siswa', $request->id_siswa)->first();

        if (!$siswa) {
            return response()->json([
                'message' => 'ID siswa tidak ditemukan. Periksa kembali dengan anak kamu.',
            ], 404);
        }

        return response()->json([
            'nama_lengkap' => $siswa->nama_lengkap,
            'kelas'        => $siswa->kelas->kelas ?? null, // hapus baris ini kalau relasi 'kelas' beda/tidak ada
        ]);
    }
}