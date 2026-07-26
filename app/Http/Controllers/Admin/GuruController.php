<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuruController extends Controller
{
    // Menampilkan daftar guru
    public function index()
    {
        return Inertia::render('Admin/Guru/Index', [
            'guru' => Guru::orderBy('nama_lengkap', 'asc')->get(),
            'users' => User::where('role', 'guru')
                ->orderBy('name', 'asc')
                ->get(['id', 'name']),
            'title' => '',
        ]);
    }

    // Halaman tambah guru (bulk, tanpa pilih user)
    public function create()
    {
        return Inertia::render('Admin/Guru/Create');
    }

    // Simpan data guru baru (bulk)
    public function store(Request $request)
    {
        $data = $request->validate([
            'nama_lengkap'   => ['required', 'array', 'min:1'],
            'nama_lengkap.*' => ['required', 'string', 'max:100', 'distinct'],
        ], [
            'nama_lengkap.*.distinct' => 'Terdapat nama yang sama di dalam input.',
        ]);

        $namaList = $data['nama_lengkap'];

        $existing = Guru::whereIn('nama_lengkap', $namaList)->pluck('nama_lengkap');

        if ($existing->isNotEmpty()) {
            return back()->withErrors([
                'nama_lengkap' => 'Nama berikut sudah terdaftar: ' . $existing->implode(', '),
            ])->withInput();
        }

        foreach ($namaList as $nama) {
            Guru::create([
                'nama_lengkap' => $nama,
            ]);
        }

        return redirect()->route('admin.guru.index')
            ->with('success', count($namaList) . ' data guru berhasil ditambahkan');
    }

    // Halaman edit guru
    public function edit(Guru $guru)
    {
        $users = User::where('role', 'guru')
                    ->orderBy('name')
                    ->get(['id', 'name']);

        return Inertia::render('Admin/Guru/Edit', [
            'guru'  => $guru,
            'users' => $users
        ]);
    }

    // Update data guru (termasuk kode_guru, misal diganti ke nomor RFID)
    public function update(Request $request, Guru $guru)
    {
        $request->validate([
            // 'user_id'      => ['nullable', 'exists:users,id'],
            'nama_lengkap' => ['required', 'string', 'max:100', 'unique:guru,nama_lengkap,' . $guru->id],
            'kode_guru'    => ['nullable', 'string', 'max:20', 'unique:guru,kode_guru,' . $guru->id],
        ]);

        $guru->update([
            // 'user_id'      => $request->user_id,
            'nama_lengkap' => $request->nama_lengkap,
            'kode_guru'    => $request->kode_guru,
        ]);

        return redirect()->route('admin.guru.index')
            ->with('success', 'Data Guru berhasil diperbarui');
    }

    // Hapus guru
    public function destroy(Guru $guru)
    {
        $guru->delete();

        return redirect()->route('admin.guru.index')
            ->with('success', 'Data Guru berhasil dihapus');
    }
}