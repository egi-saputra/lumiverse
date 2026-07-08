<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mapel;
use App\Models\Guru;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapelController extends Controller
{
    // Menampilkan daftar mapel
    public function index()
    {
        return Inertia::render('Admin/Mapel/Index', [
            'mapel' => Mapel::with('guru')
                ->orderBy('mapel', 'asc')
                ->get(),

            'guru' => Guru::orderBy('nama_lengkap', 'asc')
                ->get(['id', 'nama_lengkap']),
        ]);
    }

    // Halaman tambah mapel
    public function create()
    {
        return Inertia::render('Admin/Mapel/Create', [
            'guru' => Guru::orderBy('nama_lengkap')->get(['id', 'nama_lengkap']),
        ]);
    }

    // Simpan data mapel baru
    public function store(Request $request)
    {
        $request->validate([
            'mapel'   => ['required', 'string', 'max:100', 'unique:mapel,mapel'],
            'guru_id' => ['nullable', 'exists:guru,id'],
        ]);

        Mapel::create([
            'mapel'   => $request->mapel,
            'guru_id' => $request->guru_id,
        ]);

        return redirect()->route('admin.mapel.index')
            ->with('success', 'Mapel berhasil ditambahkan');
    }

    // Update data mapel
    public function update(Request $request, Mapel $mapel)
    {
        $request->validate([
            'mapel'   => ['required', 'string', 'max:100', 'unique:mapel,mapel,' . $mapel->id],
            'guru_id' => ['nullable', 'exists:guru,id'],
        ]);

        $mapel->update([
            'mapel'   => $request->mapel,
            'guru_id' => $request->guru_id,
        ]);

        return redirect()->route('admin.mapel.index')
            ->with('success', 'Mapel berhasil diperbarui');
    }

    // Hapus mapel
    public function destroy(Mapel $mapel)
    {
        $mapel->delete();

        return redirect()->route('admin.mapel.index')
            ->with('success', 'Mapel berhasil dihapus');
    }
}
