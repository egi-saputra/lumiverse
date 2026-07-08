<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Guru;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    // Menampilkan daftar kelas
    public function index()
    {
        return Inertia::render('Admin/Kelas/Index', [
            'kelas' => Kelas::with('guru')
                ->orderBy('kelas', 'asc')
                ->get(),

            'guru' => Guru::orderBy('nama_lengkap', 'asc')
                ->get(['id', 'nama_lengkap']),
        ]);
    }

    // Halaman tambah kelas
    public function create()
    {
        return Inertia::render('Admin/Kelas/Create', [
            'guru' => Guru::orderBy('nama_lengkap')->get(['id', 'nama_lengkap']),
        ]);
    }

    // Simpan data kelas baru
    public function store(Request $request)
    {
        $request->validate([
            'kelas' => ['required', 'string', 'max:100', 'unique:kelas,kelas'],
            'guru_id' => ['nullable', 'exists:guru,id'],
        ]);

        Kelas::create([
            'kelas' => $request->kelas,
            'guru_id' => $request->guru_id,
        ]);

        return redirect()->route('admin.kelas.index')
            ->with('success', 'Kelas berhasil ditambahkan');
    }

    // Update data kelas
    public function update(Request $request, Kelas $kelas)
    {
        $request->validate([
            'kelas' => ['required', 'string', 'max:100', 'unique:kelas,kelas,' . $kelas->id],
            'guru_id' => ['nullable', 'exists:guru,id'],
        ]);

        $kelas->update([
            'kelas' => $request->kelas,
            'guru_id' => $request->guru_id,
        ]);

        return redirect()->route('admin.kelas.index')
            ->with('success', 'Kelas berhasil diperbarui');
    }

    // Hapus kelas
    public function destroy(Kelas $kelas)
    {
        $kelas->delete();

        return redirect()->route('admin.kelas.index')
            ->with('success', 'Kelas berhasil dihapus');
    }
}
