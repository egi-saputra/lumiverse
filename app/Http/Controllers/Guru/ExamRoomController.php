<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\UjianSiswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamRoomController extends Controller
{
    public function index()
    {
        $peserta = UjianSiswa::with([
            'user.siswa.kelas',  // ambil nama lengkap + kelas
            'soal.mapel',        // ambil mapel
        ])
        ->orderBy('id', 'DESC')
        ->get();

        return Inertia::render('Proktor/RuangUjian', [
            'peserta' => $peserta
        ]);
    }

    public function refreshToken($peserta)
    {
        $peserta = UjianSiswa::findOrFail($peserta);

        return response()->json([
            'token' => $peserta->token
        ]);
    }

    public function destroyPeserta($peserta)
    {
        try {
            $pesertaModel = UjianSiswa::findOrFail($peserta);
            $pesertaModel->delete();

            return response()->json([
                'message' => 'Peserta berhasil dihapus!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus peserta!'
            ], 500);
        }
    }

    // RuangUjianController.php
    public function refreshAll(Request $request)
    {
        $peserta = UjianSiswa::with([
            'user.siswa.kelas',
            'soal.mapel',
        ])
        ->orderBy('id', 'DESC')
        ->get();

        return response()->json([
            'peserta' => $peserta
        ]);
    }
}
