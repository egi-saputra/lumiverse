<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PengumumanController extends Controller
{
    private const ALLOWED_ROLES = ['admin', 'guru'];

    public function index()
    {
        $pengumuman = Pengumuman::with('user:id,name')
            ->latest()
            ->get(['id', 'judul', 'pengumuman', 'file_path', 'video_url', 'user_id', 'created_at']);

        return Inertia::render('Pengumuman/Index', [
            'pengumuman' => $pengumuman,
            'canManage'  => $this->canManage(),
        ]);
    }

    public function create()
    {
        $this->authorizeRole();

        return Inertia::render('Pengumuman/Create');
    }

    public function store(Request $request)
    {
        $this->authorizeRole();

        $validated = $request->validate([
            'judul'      => 'required|string|max:255',
            'pengumuman' => 'required|string|max:100000',
            'file'       => 'nullable|file|mimes:jpg,jpeg,png,webp,gif|max:15360', // 15 MB
            'video_url'  => 'nullable|url|max:500',
        ]);

        if (tenant()->hasReachedFreeLimit(Pengumuman::class, 3)) {
            return back()->with('error', 'Plan Free hanya dapat membuat maksimal 3 pengumuman. Silakan upgrade plan untuk menambah kuis.');
        }

        $filePath = $request->hasFile('file')
            ? $request->file('file')->store('pengumuman', 'r2')
            : null;

        Pengumuman::create([
            'judul'      => $validated['judul'],
            'pengumuman' => $validated['pengumuman'],
            'user_id'    => Auth::id(),
            'file_path'  => $filePath,
            'video_url'  => $validated['video_url'] ?? null,
        ]);

        return redirect()->route('pengumuman.index')
            ->with('success', 'Pengumuman berhasil dibuat!');
    }

    public function show(Pengumuman $pengumuman)
    {
        return Inertia::render('Pengumuman/Show', [
            'pengumuman' => $pengumuman->load('user:id,name'),
            'canManage'  => $this->canManage() && Auth::id() === $pengumuman->user_id,
        ]);
    }

    public function edit(Pengumuman $pengumuman)
    {
        $this->authorizeOwner($pengumuman);

        return Inertia::render('Pengumuman/Edit', [
            'pengumuman' => $pengumuman,
        ]);
    }

    public function update(Request $request, Pengumuman $pengumuman)
    {
        $this->authorizeOwner($pengumuman);

        $validated = $request->validate([
            'judul'       => 'required|string|max:255',
            'pengumuman'  => 'required|string|max:100000',
            'file'        => 'nullable|file|mimes:jpg,jpeg,png,webp,gif|max:15360',
            'video_url'   => 'nullable|url|max:500',
            'remove_file' => 'nullable|boolean',
        ]);

        $filePath = $pengumuman->file_path;

        if ($request->boolean('remove_file') && $filePath) {
            Storage::disk('r2')->delete($filePath);
            $filePath = null;
        }

        if ($request->hasFile('file')) {
            if ($filePath) Storage::disk('r2')->delete($filePath);
            $filePath = $request->file('file')->store('pengumuman', 'r2');
        }

        $pengumuman->update([
            'judul'      => $validated['judul'],
            'pengumuman' => $validated['pengumuman'],
            'file_path'  => $filePath,
            'video_url'  => $validated['video_url'] ?? null,
        ]);

        return redirect()->route('pengumuman.show', $pengumuman)
            ->with('success', 'Pengumuman berhasil diperbarui!');
    }

    public function destroy(Pengumuman $pengumuman)
    {
        $this->authorizeOwner($pengumuman);

        if ($pengumuman->file_path) {
            Storage::disk('r2')->delete($pengumuman->file_path);
        }

        $pengumuman->delete();

        return redirect()->route('pengumuman.index')
            ->with('success', 'Pengumuman berhasil dihapus.');
    }

    // ── Helpers ───────────────────────────────────────────────

    private function canManage(): bool
    {
        return in_array(Auth::user()?->role, self::ALLOWED_ROLES, true);
    }

    private function authorizeRole(): void
    {
        abort_unless($this->canManage(), 403, 'Akses ditolak.');
    }

    private function authorizeOwner(Pengumuman $pengumuman): void
    {
        $this->authorizeRole();
        abort_unless(Auth::id() === $pengumuman->user_id, 403, 'Bukan milik Anda.');
    }
}