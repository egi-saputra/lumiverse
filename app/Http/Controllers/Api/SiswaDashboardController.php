<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\PublicAbsensiAnalyticsController;
use App\Models\Siswa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiswaDashboardController extends Controller
{
    /**
     * Sama persis dengan data dashboard Vue Siswa/Dashboard.vue (profil siswa +
     * analitik kehadiran kelas bulan berjalan), dipakai oleh dashboard Expo.
     */
    public function index(Request $request, PublicAbsensiAnalyticsController $analyticsController): JsonResponse
    {
        $siswa = Siswa::with(['kelas', 'kejuruan'])
            ->where('user_id', $request->user()->id)
            ->first();

        abort_if(! $siswa, 403, 'Akun ini belum melengkapi data siswa.');

        $analyticsData = [
            'analytics' => null,
            'hariEfektif' => [],
            'label' => '',
        ];

        if ($siswa->kelas) {
            $analyticsData = $analyticsController->buildForDashboard($siswa->kelas);
        }

        $analytics = $analyticsData['analytics'];

        $avgKehadiranKelas = null;
        if ($analytics) {
            $valid = collect($analytics['siswa'] ?? [])->filter(fn ($s) => $s['pct_kehadiran'] !== null);
            if ($valid->count() > 0) {
                $avgKehadiranKelas = round($valid->avg('pct_kehadiran'), 1);
            }
        }

        return response()->json([
            'siswa' => [
                'nama_lengkap' => $siswa->nama_lengkap,
                'nis' => $siswa->nis,
                'nisn' => $siswa->nisn,
                'status' => $siswa->status,
                'kelas' => $siswa->kelas?->kelas,
                'kejuruan' => $siswa->kejuruan?->kejuruan,
            ],
            'label' => $analyticsData['label'],
            'hasAnalyticsData' => ! empty($analyticsData['hariEfektif']) && $analytics !== null,
            'rekapKelas' => $analytics['rekap_kelas'] ?? null,
            'avgKehadiranKelas' => $avgKehadiranKelas,
            'trendMingguan' => array_slice($analytics['trend_mingguan'] ?? [], -6),
        ]);
    }
}
