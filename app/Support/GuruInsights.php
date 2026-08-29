<?php

namespace App\Support;

use App\Models\AbsensiHarian;
use App\Models\Journal;
use App\Models\Kelas;
use App\Models\Materi;
// use App\Models\Pengumuman;
use App\Models\RiwayatUjian;
use App\Models\Soal;
use App\Models\UjianSiswa;
use Illuminate\Support\Facades\DB;

/**
 * Bangun data "Insight Pembelajaran" guru — dipakai bareng oleh dashboard
 * Vue (Guru\DashboardController) dan API mobile (Api\GuruDashboardController)
 * supaya datanya selalu konsisten di kedua platform, bukan dua query terpisah
 * yang bisa berbeda hasilnya.
 */
class GuruInsights
{
    public static function build(): array
    {
        $materials = Materi::with(['user:id,name', 'mapel:id,mapel', 'kelas:id,kelas'])
            ->latest()->limit(10)
            ->get(['id', 'user_id', 'mapel_id', 'kelas_id', 'judul', 'created_at'])
            ->map(fn ($item) => [
                'id' => $item->id, 'title' => $item->judul,
                'author' => $item->user?->name ?? 'Tidak diketahui',
                'subject' => $item->mapel?->mapel ?? '-', 'class' => $item->kelas?->kelas ?? '-',
                'created_at' => $item->created_at?->toISOString(),
            ]);

        $quizzes = Soal::with(['user:id,name', 'mapel:id,mapel'])->withCount('bank_soal')
            ->latest()->limit(5)
            ->get(['id', 'user_id', 'mapel_id', 'title', 'kelas', 'status', 'created_at'])
            ->map(fn ($item) => [
                'id' => $item->id, 'title' => $item->title,
                'author' => $item->user?->name ?? 'Tidak diketahui',
                'subject' => $item->mapel?->mapel ?? '-', 'class' => $item->kelas,
                'questions' => (int) $item->bank_soal_count, 'status' => $item->status,
                'created_at' => $item->created_at?->toISOString(),
            ]);

        $journals = Journal::with(['guru:id,nama_lengkap', 'kelas:id,kelas', 'mapel:id,mapel'])
            ->latest('tanggal')->latest('id')->limit(10)
            ->get(['id', 'guru_id', 'kelas_id', 'mapel_id', 'tanggal', 'materi'])
            ->map(fn ($item) => [
                'id' => $item->id, 'teacher' => $item->guru?->nama_lengkap ?? 'Tidak diketahui',
                'class' => $item->kelas?->kelas ?? '-', 'subject' => $item->mapel?->mapel ?? '-',
                'material' => $item->materi, 'date' => $item->tanggal?->toDateString(),
            ]);

        $completedExams = UjianSiswa::with(['user:id,name', 'soal:id,title'])
            ->where('status', 'Selesai')->latest('waktu_selesai')->limit(5)
            ->get(['id', 'user_id', 'soal_id', 'waktu_selesai'])
            ->map(fn ($item) => [
                'id' => $item->id, 'student' => $item->user?->name ?? 'Tidak diketahui',
                'exam' => $item->soal?->title ?? '-',
                'score' => (float) RiwayatUjian::where('ujian_siswa_id', $item->id)->sum('nilai'),
                'completed_at' => $item->waktu_selesai?->toISOString(),
            ]);

        $attendance = AbsensiHarian::whereBetween('tanggal', [now()->startOfMonth(), now()->endOfMonth()])
            ->selectRaw("COUNT(*) AS total, SUM(CASE WHEN status = 'hadir' THEN 1 ELSE 0 END) AS hadir, SUM(CASE WHEN status = 'sakit' THEN 1 ELSE 0 END) AS sakit, SUM(CASE WHEN status = 'izin' THEN 1 ELSE 0 END) AS izin, SUM(CASE WHEN status = 'alpha' THEN 1 ELSE 0 END) AS alpha")
            ->first();

        $dailyAttendance = DB::table('absensi_harian')
            ->selectRaw("kelas_id, tanggal, (SUM(CASE WHEN status = 'hadir' THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS attendance_percentage")
            ->groupBy('kelas_id', 'tanggal');
        $topAttendanceRaw = DB::query()->fromSub($dailyAttendance, 'daily_attendance')
            ->join('kelas', 'kelas.id', '=', 'daily_attendance.kelas_id')
            ->select('daily_attendance.kelas_id', 'kelas.kelas')
            ->selectRaw('AVG(daily_attendance.attendance_percentage) AS average_percentage')
            ->groupBy('daily_attendance.kelas_id', 'kelas.kelas')
            ->orderByDesc('average_percentage')
            ->limit(6)
            ->get();

        // Ambil nama wali kelas lewat relasi 'guru' di model Kelas
        $kelasWalas = Kelas::with('guru:id,nama_lengkap')
            ->whereIn('id', $topAttendanceRaw->pluck('kelas_id'))
            ->get()
            ->keyBy('id');

        $attendanceClasses = $topAttendanceRaw->map(fn ($item) => [
            'id' => $item->kelas_id,
            'class' => $item->kelas,
            'percentage' => round((float) $item->average_percentage, 1),
            'walas' => $kelasWalas->get($item->kelas_id)?->guru?->nama_lengkap ?? 'Belum ada wali kelas',
        ]);

        // $announcements = Pengumuman::with('user:id,name')->latest()->limit(5)
        //     ->get(['id', 'judul', 'user_id', 'created_at'])
        //     ->map(fn ($item) => ['id' => $item->id, 'title' => $item->judul, 'author' => $item->user?->name ?? 'Tidak diketahui', 'created_at' => $item->created_at?->toISOString()]);

        // Status pengisian absen hari ini per kelas
        $today = now()->toDateString();

        $filledKelasIdsToday = DB::table('absensi_harian')
            ->whereDate('tanggal', $today)
            ->distinct()
            ->pluck('kelas_id');

        $allKelasToday = Kelas::select('id', 'kelas')->orderBy('kelas')->get();

        $attendanceToday = [
            'date' => $today,
            'filled' => $allKelasToday->whereIn('id', $filledKelasIdsToday)->values()
                ->map(fn ($k) => ['id' => $k->id, 'class' => $k->kelas]),
            'not_filled' => $allKelasToday->whereNotIn('id', $filledKelasIdsToday)->values()
                ->map(fn ($k) => ['id' => $k->id, 'class' => $k->kelas]),
        ];

        return [
            'materials' => ['total' => Materi::count(), 'items' => $materials],
            'quizzes' => ['total' => Soal::count(), 'items' => $quizzes],
            'journals' => ['items' => $journals],
            'exams' => ['completed' => UjianSiswa::where('status', 'Selesai')->count(), 'in_progress' => UjianSiswa::where('status', 'Sedang Dikerjakan')->count(), 'items' => $completedExams],
            'attendance' => ['total' => (int) ($attendance->total ?? 0), 'hadir' => (int) ($attendance->hadir ?? 0), 'sakit' => (int) ($attendance->sakit ?? 0), 'izin' => (int) ($attendance->izin ?? 0), 'alpha' => (int) ($attendance->alpha ?? 0)],
            'attendance_today' => $attendanceToday,
            'attendance_classes' => ['items' => $attendanceClasses],
            // 'announcements' => ['total' => Pengumuman::count(), 'items' => $announcements],
        ];
    }
}
