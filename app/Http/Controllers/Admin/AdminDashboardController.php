<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AbsensiHarian;
use App\Models\Assignment;
use App\Models\Materi;
use App\Models\Pengumuman;
use App\Models\RiwayatUjian;
use App\Models\Soal;
use App\Models\UjianSiswa;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $usersCount = [
            'proktor' => $this->countUsersByRole('proktor'),
            'guru'    => $this->countUsersByRole('guru'),
            'siswa'   => $this->countUsersByRole('siswa'),
            'user'    => $this->countUsersByRole('user'),
            'total'   => \App\Models\User::count(),
        ];

        $materials = Materi::with(['user:id,name', 'mapel:id,mapel', 'kelas:id,kelas'])
            ->latest()
            ->get(['id', 'user_id', 'mapel_id', 'kelas_id', 'judul', 'file_path', 'created_at'])
            ->map(fn ($material) => [
                'id' => $material->id,
                'title' => $material->judul,
                'author' => $material->user?->name ?? 'Tidak diketahui',
                'subject' => $material->mapel?->mapel ?? '-',
                'class' => $material->kelas?->kelas ?? '-',
                'has_file' => (bool) $material->file_path,
                'created_at' => $material->created_at?->toISOString(),
            ]);

        $assignments = Assignment::with(['siswa:id,nama_lengkap,user_id', 'guru:id,nama_lengkap', 'mapel:id,mapel'])
            ->latest()
            ->get(['id', 'user_id', 'guru_id', 'mapel_id', 'judul', 'is_read', 'is_updated', 'created_at'])
            ->map(fn ($assignment) => [
                'id' => $assignment->id,
                'title' => $assignment->judul,
                'student' => $assignment->siswa?->nama_lengkap ?? 'Tidak diketahui',
                'teacher' => $assignment->guru?->nama_lengkap ?? '-',
                'subject' => $assignment->mapel?->mapel ?? '-',
                'status' => $assignment->is_updated ? 'Perlu ditinjau ulang' : ($assignment->is_read ? 'Sudah dibaca' : 'Belum dibaca'),
                'created_at' => $assignment->created_at?->toISOString(),
            ]);

        $quizzes = Soal::with(['user:id,name', 'mapel:id,mapel'])
            ->withCount('bank_soal')
            ->latest()
            ->get(['id', 'user_id', 'mapel_id', 'title', 'kelas', 'status', 'created_at'])
            ->map(fn ($quiz) => [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'author' => $quiz->user?->name ?? 'Tidak diketahui',
                'subject' => $quiz->mapel?->mapel ?? '-',
                'class' => $quiz->kelas,
                'questions' => (int) $quiz->bank_soal_count,
                'status' => $quiz->status,
                'created_at' => $quiz->created_at?->toISOString(),
            ]);

        $completedExams = UjianSiswa::with(['user:id,name', 'soal:id,title'])
            ->where('status', 'Selesai')
            ->latest('waktu_selesai')
            ->limit(12)
            ->get(['id', 'user_id', 'soal_id', 'status', 'waktu_selesai'])
            ->map(fn ($exam) => [
                'id' => $exam->id,
                'student' => $exam->user?->name ?? 'Tidak diketahui',
                'exam' => $exam->soal?->title ?? '-',
                'score' => (float) RiwayatUjian::where('ujian_siswa_id', $exam->id)->sum('nilai'),
                'completed_at' => $exam->waktu_selesai?->toISOString(),
            ]);

        $attendanceThisMonth = AbsensiHarian::whereBetween('tanggal', [now()->startOfMonth(), now()->endOfMonth()])
            ->selectRaw("COUNT(*) AS total, SUM(CASE WHEN status = 'hadir' THEN 1 ELSE 0 END) AS hadir, SUM(CASE WHEN status = 'sakit' THEN 1 ELSE 0 END) AS sakit, SUM(CASE WHEN status = 'izin' THEN 1 ELSE 0 END) AS izin, SUM(CASE WHEN status = 'alpha' THEN 1 ELSE 0 END) AS alpha")
            ->first();

        $attendanceRecent = AbsensiHarian::with('siswa:id,nama_lengkap')
            ->latest('tanggal')
            ->latest('id')
            ->limit(12)
            ->get(['id', 'siswa_id', 'tanggal', 'status', 'keterangan'])
            ->map(fn ($attendance) => [
                'id' => $attendance->id,
                'student' => $attendance->siswa?->nama_lengkap ?? 'Tidak diketahui',
                'date' => $attendance->tanggal?->toDateString(),
                'status' => $attendance->status,
                'note' => $attendance->keterangan,
            ]);

        $announcements = Pengumuman::with('user:id,name')
            ->latest()
            ->get(['id', 'judul', 'pengumuman', 'user_id', 'created_at'])
            ->map(fn ($announcement) => [
                'id' => $announcement->id,
                'title' => $announcement->judul,
                'body' => $announcement->pengumuman,
                'author' => $announcement->user?->name ?? 'Tidak diketahui',
                'created_at' => $announcement->created_at?->toISOString(),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'auth' => [
                'user' => $user,
                'role' => $user->role,
            ],
            'usersCount' => $usersCount,
            'insights' => [
                'materials' => ['total' => $materials->count(), 'items' => $materials->take(8)->values()],
                'assignments' => ['total' => $assignments->count(), 'unread' => $assignments->where('status', 'Belum dibaca')->count(), 'items' => $assignments->take(8)->values()],
                'quizzes' => ['total' => $quizzes->count(), 'active' => $quizzes->where('status', 'Aktif')->count(), 'questions' => $quizzes->sum('questions'), 'items' => $quizzes->take(8)->values()],
                'exams' => ['sessions' => UjianSiswa::count(), 'completed' => UjianSiswa::where('status', 'Selesai')->count(), 'in_progress' => UjianSiswa::where('status', 'Sedang Dikerjakan')->count(), 'items' => $completedExams],
                'attendance' => ['total' => (int) ($attendanceThisMonth->total ?? 0), 'hadir' => (int) ($attendanceThisMonth->hadir ?? 0), 'sakit' => (int) ($attendanceThisMonth->sakit ?? 0), 'izin' => (int) ($attendanceThisMonth->izin ?? 0), 'alpha' => (int) ($attendanceThisMonth->alpha ?? 0), 'items' => $attendanceRecent],
                'announcements' => ['total' => $announcements->count(), 'items' => $announcements->take(8)->values()],
            ],
        ]);
    }

    public function reset(string $resource)
    {
        $tables = [
            'attendance' => 'absensi_harian',
            'materials' => 'materi',
            'assignments' => 'tugas',
            'question-bank' => 'bank_soal',
            'announcements' => 'pengumuman',
        ];

        abort_unless(array_key_exists($resource, $tables), 404);

        DB::transaction(fn () => DB::table($tables[$resource])->delete());

        return back()->with('success', 'Seluruh data berhasil direset.');
    }

    private function countUsersByRole(string $role): int
    {
        return \App\Models\User::where('role', $role)->count();
    }
}
