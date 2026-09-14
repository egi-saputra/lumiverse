<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\Materi;
use App\Services\MaterialUploadQuotaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MaterialController extends Controller
{
    protected MaterialUploadQuotaService $quotaService;

    public function __construct(MaterialUploadQuotaService $quotaService)
    {
        $this->quotaService = $quotaService;
    }

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

    public function create()
    {
        $user = Auth::user();

        $kelas = Kelas::select('id', 'kelas')->orderBy('kelas')->get();
        $subjects = Mapel::select('id', 'mapel')->orderBy('mapel')->get();

        return Inertia::render('Guru/Material/Create', [
            'kelas' => $kelas,
            'subjects' => $subjects,
            'title' => 'New Material',
            'uploadQuota' => [
                'plan'      => $user->aiPlanKey(),
                'limit'     => $this->quotaService->limitForUser($user),
                'used'      => $this->quotaService->uploadedCountForUser($user->id),
                'remaining' => $this->quotaService->remainingForUser($user),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'mapel_id' => 'required|exists:mapel,id',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf,xls,xlsx,doc,docx,zip|max:10240',
            'link' => 'nullable|url',
            'ai_document_path' => 'nullable|string',
        ]);

        // Kuota cuma berlaku kalau materi ini pakai file attachment
        // (upload manual atau PDF hasil AI). Materi link-only tidak dibatasi.
        $usesFileAttachment = $request->hasFile('file') || $request->filled('ai_document_path');

        if ($usesFileAttachment && !$this->quotaService->canUpload($user)) {
            $limit = $this->quotaService->limitForUser($user);
            $plan  = strtoupper($user->aiPlanKey());

            return back()
                ->withErrors([
                    'file' => "Kamu sudah mencapai batas {$limit} materi dengan file attachment untuk paket {$plan}. Hapus materi lama, upgrade paket, atau gunakan link eksternal (tidak dibatasi).",
                ])
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