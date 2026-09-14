<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Materi;
use App\Models\Kelas;
use App\Models\Mapel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MaterialController extends Controller
{
    // 🔹 Show all materials for current user
    public function index()
    {
        $material = Materi::with(['kelas', 'mapel'])
            ->where('user_id', Auth::id())
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Guru/Material/Index', [
            'materials' => $material,
            'title' => 'Materials',
        ]);
    }
    
    // Show material form
    public function create()
    {
        $kelas = Kelas::select('id', 'kelas')->orderBy('kelas')->get();
        $subjects = Mapel::select('id', 'mapel')->orderBy('mapel')->get();

        return Inertia::render('Guru/Material/Create', [
            'kelas' => $kelas,
            'subjects' => $subjects,
            'title' => 'New Material',
        ]);
    }

    // Store material
    public function store(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'mapel_id' => 'required|exists:mapel,id',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf,xls,xlsx,doc,docx,zip|max:10240',
            'link' => 'nullable|url',
            'ai_document_path' => 'nullable|string',
        ]);

        // Kuota cuma berlaku kalau materi ini pakai file attachment (upload manual
        // atau PDF hasil AI). Materi link-only tidak dibatasi — sama seperti
        // MaterialUploadQuotaService di versi non-multitenant.
        $usesFileAttachment = $request->hasFile('file') || $request->filled('ai_document_path');

        if ($usesFileAttachment && tenant()->hasReachedFreeLimitForUser(
            Materi::class,
            3,
            fn ($query) => $query->whereNotNull('file_path')->where('file_path', 'not like', 'http%')
        )) {
            return back()
                ->with('error', 'Plan Free hanya dapat membuat maksimal 3 materi dengan file attachment per akun. Silakan upgrade plan, atau gunakan link eksternal (tidak dibatasi).')
                ->withInput();
        }

        $filePath = null;

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('materials', 'r2');
        } elseif ($request->filled('ai_document_path')) {
            $filePath = $request->ai_document_path;
        }

        Materi::create([
            'user_id' => Auth::id(),
            'kelas_id' => $request->kelas_id,
            'mapel_id' => $request->mapel_id,
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'file_path' => $filePath ?? $request->link,
        ]);

        return redirect()->route('guru.material.index')->with('success', 'Material submitted successfully!');
    }

    public function destroy(Materi $material)
    {
        abort_unless($material->user_id === Auth::id(), 403);

        $filePath = $material->file_path;

        $material->delete();

        if ($filePath && !str_starts_with($filePath, 'http') && Storage::disk('r2')->exists($filePath)) {
            Storage::disk('r2')->delete($filePath);
        }

        return redirect()->back()->with('success', 'Material deleted successfully.');
    }
}
