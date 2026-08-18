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
            'ai_document_path' => 'nullable|string', // ← tambahkan ini
        ]);

        if (tenant()->hasReachedFreeLimitForUser(Materi::class, 3)) {
            return back()->with('error', 'Plan Free hanya dapat membuat maksimal 3 materi per akun. Silakan upgrade plan untuk menambah materi lebih banyak.');
        }

        $filePath = null;

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('materials', 'r2');
        } elseif ($request->filled('ai_document_path')) {
            // PDF sudah ada di R2 dari proses generateAi, tinggal pakai path-nya
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
        if ($material->file_path && Storage::disk('r2')->exists($material->file_path)) {   // ← ganti dari 'public'
            Storage::disk('r2')->delete($material->file_path);   // ← ganti dari 'public'
        }

        $material->delete();

        return redirect()->back()->with('success', 'Material deleted successfully.');
    }
}
