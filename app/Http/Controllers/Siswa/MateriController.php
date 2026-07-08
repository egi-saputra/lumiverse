<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Materi;
use App\Models\User;
use App\Models\Guru;
use App\Models\Mapel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MateriController extends Controller
{
    // 🔹 Show all materials for current user
    public function index()
    {
        $user = Auth::user();

        $kelasId = $user->siswa->kelas_id;

        return Inertia::render('Siswa/Material/Index', [
            'materials' => Materi::where('kelas_id', $kelasId)
                ->with(['mapel', 'guru'])
                ->latest()
                ->get(),
            'title' => 'Learning Material',
        ]);
    }

    public function show($id)
    {
        $kelasId = Auth::user()->siswa->kelas_id;

        $material = Materi::where('id', $id)
            ->where('kelas_id', $kelasId)
            ->with(['mapel', 'guru'])
            ->firstOrFail();

        return Inertia::render('Siswa/Material/Show', [
            'material' => $material,
            'title' => 'Material Detail',
        ]);
    }

}
