<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

// Models
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\Kejuruan;

class SiswaController extends Controller
{
    /**
     * Cek apakah tenant saat ini berjenjang SMK.
     */
    protected function isSmk(): bool
    {
        $tenant = tenant();

        if (! $tenant) {
            return false;
        }

        return strtolower((string) $tenant->school_level) === 'smk';
    }

    /**
     * Halaman list siswa
     */
    public function index()
    {
        $siswa = Siswa::with(['kelas', 'kejuruan'])
            ->orderBy('nama_lengkap', 'asc')
            ->get();

        return Inertia::render('Admin/Siswa/Index', [
            'siswa' => $siswa,
            'isSmk' => $this->isSmk(),
        ]);
    }

    /**
     * Halaman register siswa
     */
    public function create()
    {
        $isSmk = $this->isSmk();

        return Inertia::render('Admin/Siswa/Create', [
            'kelas'    => Kelas::select('id', 'kelas')->get(),
            'kejuruan' => $isSmk
                ? Kejuruan::select('id', 'kejuruan')->get()
                : [],
            'isSmk'    => $isSmk,
        ]);
    }

    /**
     * Simpan data siswa
     */
    public function store(Request $request)
    {
        $isSmk = $this->isSmk();

        $validated = $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'],

            'nis'  => ['nullable', 'unique:siswa,nis'],
            'nisn' => ['nullable', 'digits:10', 'unique:siswa,nisn'],

            'kelas_id'    => ['required'],
            'kejuruan_id' => [
                $isSmk ? 'required' : 'nullable',
                Rule::exists('kejuruan', 'id'),
            ],
        ]);

        Siswa::create([
            'nama_lengkap' => $validated['nama_lengkap'],
            'nis'          => $validated['nis'] ?? null,
            'nisn'         => $validated['nisn'] ?? null,
            'kelas_id'     => $validated['kelas_id'],
            'kejuruan_id'  => $isSmk ? ($validated['kejuruan_id'] ?? null) : null,

            // ID internal siswa (7 karakter)
            'id_siswa' => strtoupper(substr(uniqid(), 0, 7)),
            'status'   => 'Activated',
        ]);

        return redirect()
            ->route('admin.siswa.create')
            ->with('success', 'Siswa berhasil didaftarkan');
    }

    public function edit(Siswa $siswa)
    {
        $isSmk = $this->isSmk();

        return Inertia::render('Admin/Siswa/Edit', [
            'siswa'    => $siswa,
            'kelas'    => Kelas::select('id', 'kelas')->get(),
            'kejuruan' => $isSmk
                ? Kejuruan::select('id', 'kejuruan')->get()
                : [],
            'isSmk'    => $isSmk,
        ]);
    }

    public function update(Request $request, Siswa $siswa)
    {
        $isSmk = $this->isSmk();

        $validated = $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'nis'  => ['nullable', 'unique:siswa,nis,' . $siswa->id],
            'nisn' => ['nullable', 'digits:10', 'unique:siswa,nisn,' . $siswa->id],
            'kelas_id'    => ['required'],
            'kejuruan_id' => [
                $isSmk ? 'required' : 'nullable',
                Rule::exists('kejuruan', 'id'),
            ],
            'status' => ['required', 'in:Activated,Deactivated'],
            'osis'   => ['required', 'in:yes,no'],
        ]);

        // Override kejuruan_id jadi null kalau tenant bukan SMK,
        // supaya data lama pun ikut "dibersihkan" saat di-update.
        $validated['kejuruan_id'] = $isSmk ? ($validated['kejuruan_id'] ?? null) : null;

        $siswa->update($validated);

        return redirect()
            ->route('admin.siswa.index')
            ->with('success', 'Data siswa berhasil diperbarui');
    }

    public function destroy(Siswa $siswa)
    {
        $siswa->delete();

        return redirect()
            ->route('admin.siswa.index')
            ->with('success', 'Data siswa berhasil dihapus');
    }

    /**
     * Hapus semua siswa berdasarkan kelas_id (bulk delete)
     */
    public function destroyByKelas(Request $request)
    {
        $request->validate([
            'kelas_id' => ['required', 'exists:kelas,id'],
        ]);

        Siswa::where('kelas_id', $request->kelas_id)->delete();

        return redirect()
            ->route('admin.siswa.index')
            ->with('success', 'Semua siswa di kelas tersebut berhasil dihapus');
    }
}