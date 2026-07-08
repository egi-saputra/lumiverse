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

    // Halaman tambah guru
    public function create()
    {
        $users = User::where('role', 'guru')
                    ->orderBy('name')
                    ->get(['id', 'name']);

        return Inertia::render('Admin/Guru/Create', [
            'users' => $users
        ]);
    }

    // Simpan data guru baru
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'nama_lengkap' => ['required', 'string', 'max:100', 'unique:guru,nama_lengkap'],
        ]);

        Guru::create([
            'user_id'      => $request->user_id,
            'nama_lengkap' => $request->nama_lengkap,
        ]);

        return redirect()->route('admin.guru.index')
            ->with('success', 'Data Guru berhasil ditambahkan');
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

    // Update data guru
    public function update(Request $request, Guru $guru)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'nama_lengkap' => ['required', 'string', 'max:100', 'unique:guru,nama_lengkap,' . $guru->id],
        ]);

        $guru->update([
            'user_id'      => $request->user_id,
            'nama_lengkap' => $request->nama_lengkap,
        ]);

        return redirect()->route('admin.guru.index')
            ->with('success', 'Data Guru berhasil diperbarui');
    }

    // Hapus guru
    public function destroy(Guru $guru)
    {
        // hapus user juga
        // User::find($guru->user_id)?->delete();

        // hapus gurunya
        $guru->delete();

        return redirect()->route('admin.guru.index')
            ->with('success', 'Data Guru & User berhasil dihapus');
    }

}
