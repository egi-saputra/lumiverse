<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kejuruan;
use App\Models\Guru;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KejuruanController extends Controller
{
    // Menampilkan daftar kejuruan
    public function index()
    {
        return Inertia::render('Admin/Kejuruan/Index', [
            'kejuruan' => Kejuruan::with('guru')
                ->orderBy('kejuruan', 'asc')
                ->get(),

            'guru' => Guru::orderBy('nama_lengkap', 'asc')
                ->get(['id', 'nama_lengkap']),
        ]);
    }

    // Halaman tambah kejuruan
    public function create()
    {
        return Inertia::render('Admin/Kejuruan/Create', [
            'guru' => Guru::orderBy('nama_lengkap')->get(['id','nama_lengkap']),
        ]);
    }

    // Simpan data kejuruan baru
    public function store(Request $request)
    {
        $request->validate([
            'kejuruan' => ['required', 'string', 'max:100', 'unique:kejuruan,kejuruan'],
            'guru_id'  => ['nullable', 'exists:guru,id'], // kaprog
        ]);

        Kejuruan::create([
            'kejuruan' => $request->kejuruan,
            'guru_id'  => $request->guru_id,
        ]);

        return redirect()->route('admin.kejuruan.index')
            ->with('success', 'Kejuruan berhasil ditambahkan');
    }

    // Update data kejuruan
    public function update(Request $request, Kejuruan $kejuruan)
    {
        $request->validate([
            'kejuruan' => ['required', 'string', 'max:100', 'unique:kejuruan,kejuruan,' . $kejuruan->id],
            'guru_id'  => ['nullable', 'exists:guru,id'], // kaprog
        ]);

        $kejuruan->update([
            'kejuruan' => $request->kejuruan,
            'guru_id'  => $request->guru_id,
        ]);

        return redirect()->route('admin.kejuruan.index')
            ->with('success', 'Kejuruan berhasil diperbarui');
    }

    // Hapus kejuruan
    public function destroy(Kejuruan $kejuruan)
    {
        $kejuruan->delete();

        return redirect()->route('admin.kejuruan.index')
            ->with('success', 'Kejuruan berhasil dihapus');
    }
}
