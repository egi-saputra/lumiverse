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
            'title' => 'Learning Material List',
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
        ]);

        // ── Cek limit untuk plan Free tier ──────────────────────
        if (tenant()->hasReachedFreeLimitForUser(Materi::class, 3)) {
            return back()->with('error', 'Plan Free hanya dapat membuat maksimal 2 materi per akun. Silakan upgrade plan untuk menambah materi lebih banyak.');
        }

        $filePath = null;

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('materials', 'public');
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
        // Hapus file fisik jika ada
        if ($material->file_path && Storage::disk('public')->exists($material->file_path)) {
            Storage::disk('public')->delete($material->file_path);
        }

        // Hapus data dari database
        $material->delete();

        return redirect()->back()->with('success', 'Material deleted successfully.');
    }
}
