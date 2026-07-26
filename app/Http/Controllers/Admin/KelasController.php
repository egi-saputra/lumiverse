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

    // Halaman tambah kelas (bulk, hanya guru yang belum jadi wali kelas)
    public function create()
    {
        return Inertia::render('Admin/Kelas/Create', [
            'guru' => Guru::whereDoesntHave('kelas')
                ->orderBy('nama_lengkap')
                ->get(['id', 'nama_lengkap']),
        ]);
    }

    // Simpan data kelas baru (bulk)
    public function store(Request $request)
    {
        $data = $request->validate([
            'items'           => ['required', 'array', 'min:1'],
            'items.*.kelas'   => ['required', 'string', 'max:100', 'distinct'],
            'items.*.guru_id' => ['nullable', 'exists:guru,id'],
        ], [
            'items.*.kelas.distinct' => 'Terdapat nama kelas yang sama di dalam input.',
        ]);

        $items = $data['items'];
        $namaList = array_column($items, 'kelas');

        // cek duplikat terhadap data yang sudah ada di DB
        $existing = Kelas::whereIn('kelas', $namaList)->pluck('kelas');

        if ($existing->isNotEmpty()) {
            return back()->withErrors([
                'items' => 'Kelas berikut sudah terdaftar: ' . $existing->implode(', '),
            ])->withInput();
        }

        foreach ($items as $item) {
            Kelas::create([
                'kelas'   => $item['kelas'],
                'guru_id' => $item['guru_id'] ?: null,
            ]);
        }

        return redirect()->route('admin.kelas.index')
            ->with('success', count($items) . ' kelas berhasil ditambahkan');
    }

    // Update data kelas
    public function update(Request $request, Kelas $kelas)
    {
        $request->validate([
            'kelas'   => ['required', 'string', 'max:100', 'unique:kelas,kelas,' . $kelas->id],
            'guru_id' => ['nullable', 'exists:guru,id'],
        ]);

        $kelas->update([
            'kelas'   => $request->kelas,
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