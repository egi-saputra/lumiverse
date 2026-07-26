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

    // Halaman tambah mapel (bulk)
    public function create()
    {
        return Inertia::render('Admin/Mapel/Create', [
            'guru' => Guru::whereDoesntHave('mapel')
                ->orderBy('nama_lengkap')
                ->get(['id', 'nama_lengkap']),
        ]);
    }

    // Simpan data mapel baru (bulk)
    public function store(Request $request)
    {
        $data = $request->validate([
            'items'            => ['required', 'array', 'min:1'],
            'items.*.mapel'    => ['required', 'string', 'max:100', 'distinct'],
            'items.*.guru_id'  => ['nullable', 'exists:guru,id'],
        ], [
            'items.*.mapel.distinct' => 'Terdapat nama mapel yang sama di dalam input.',
        ]);

        $items = $data['items'];
        $namaList = array_column($items, 'mapel');

        // cek duplikat terhadap data yang sudah ada di DB
        $existing = Mapel::whereIn('mapel', $namaList)->pluck('mapel');

        if ($existing->isNotEmpty()) {
            return back()->withErrors([
                'items' => 'Mapel berikut sudah terdaftar: ' . $existing->implode(', '),
            ])->withInput();
        }

        foreach ($items as $item) {
            Mapel::create([
                'mapel'   => $item['mapel'],
                'guru_id' => $item['guru_id'] ?: null,
            ]);
        }

        return redirect()->route('admin.mapel.index')
            ->with('success', count($items) . ' mapel berhasil ditambahkan');
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