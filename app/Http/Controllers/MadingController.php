<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use Inertia\Inertia;

class MadingController extends Controller
{
    public function index()
    {
        $announcements = Pengumuman::latest()
            ->get(['id', 'judul', 'pengumuman', 'file_path', 'video_url', 'created_at']);

        return Inertia::render('Mading/Index', [  // ← render ke Mading/Index
            'announcements' => $announcements,
        ]);
    }

    public function show(Pengumuman $pengumuman)
    {
        return Inertia::render('Mading/Show', [   // ← render ke Mading/Show
            'announcement' => $pengumuman,
        ]);
    }
}