<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengumuman;
use Illuminate\Http\JsonResponse;

class AnnouncementController extends Controller
{
    /**
     * Pengumuman untuk semua role yang login (guru, siswa, admin, staff,
     * proktor, user) — dipakai oleh layar notifikasi Expo yang sama untuk
     * semua role, disambungkan dari ikon bell di Navbar.
     */
    public function index(): JsonResponse
    {
        $announcements = Pengumuman::with('user:id,name')
            ->latest()
            ->get(['id', 'judul', 'pengumuman', 'file_path', 'video_url', 'user_id', 'created_at'])
            ->map(fn (Pengumuman $item) => $this->transform($item));

        return response()->json(['announcements' => $announcements]);
    }

    public function show(Pengumuman $pengumuman): JsonResponse
    {
        $pengumuman->load('user:id,name');

        return response()->json(['announcement' => $this->transform($pengumuman)]);
    }

    private function transform(Pengumuman $item): array
    {
        // Strip HTML dari editor Quill — Expo cuma menampilkan teks polos,
        // tidak ada render HTML native supaya tidak butuh dependency tambahan.
        $plainText = trim(preg_replace('/\s+/', ' ', strip_tags((string) $item->pengumuman)));

        return [
            'id' => $item->id,
            'title' => $item->judul,
            'body' => $plainText,
            'author' => $item->user?->name ?? 'Tidak diketahui',
            'image_url' => $item->file_url,
            'video_url' => $item->video_url,
            'created_at' => $item->created_at?->toISOString(),
        ];
    }
}
