<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProfilSekolahRequest;
use App\Models\ProfilSekolah;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DataSekolahController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/ProfilSekolah', [
            'profil' => ProfilSekolah::first(),
        ]);
    }

    public function storeOrUpdate(ProfilSekolahRequest $request)
    {
        $data   = $request->validated();
        $profil = ProfilSekolah::first();

        if ($request->hasFile('logo')) {
            $data = array_merge($data, $this->processLogo($request, $profil));
        }

        $profil
            ? $profil->update($data)
            : ProfilSekolah::create($data);

        cache()->forget('profil_sekolah'); // ← clear cache setelah update

        return back()->with('success', 'Profil sekolah berhasil diperbarui!');
    }

    // -------------------------------------------------------------------------

    private function processLogo($request, ?ProfilSekolah $profil): array
    {
        $file     = $request->file('logo');
        $filename = uniqid('logo_') . '.' . $file->getClientOriginalExtension();
        $path     = 'logo_sekolah/' . $filename;

        Storage::disk('public')->putFileAs(
            'logo_sekolah',
            $file,
            $filename
        );

        // Hapus logo lama jika ada
        if ($profil?->file_path && Storage::disk('public')->exists($profil->file_path)) {
            Storage::disk('public')->delete($profil->file_path);
        }

        return [
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
        ];
    }
}