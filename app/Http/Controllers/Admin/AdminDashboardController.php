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
use App\Models\Journal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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

        $journals = Journal::with(['guru:id,nama_lengkap', 'kelas:id,kelas', 'mapel:id,mapel'])
            ->latest('tanggal')
            ->latest('id')
            ->limit(8)
            ->get(['id', 'guru_id', 'kelas_id', 'mapel_id', 'tanggal', 'jam_mulai', 'jam_selesai', 'jumlah_jam', 'materi'])
            ->map(fn ($journal) => [
                'id' => $journal->id,
                'teacher' => $journal->guru?->nama_lengkap ?? 'Tidak diketahui',
                'class' => $journal->kelas?->kelas ?? '-',
                'subject' => $journal->mapel?->mapel ?? '-',
                'material' => $journal->materi,
                'date' => $journal->tanggal?->toDateString(),
                'hours' => $journal->jumlah_jam,
            ]);

        $dailyAttendance = DB::table('absensi_harian')
            ->selectRaw("kelas_id, tanggal, (SUM(CASE WHEN status = 'hadir' THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS attendance_percentage")
            ->groupBy('kelas_id', 'tanggal');

        $topAttendanceClasses = DB::query()
            ->fromSub($dailyAttendance, 'daily_attendance')
            ->join('kelas', 'kelas.id', '=', 'daily_attendance.kelas_id')
            ->select('daily_attendance.kelas_id', 'kelas.kelas')
            ->selectRaw('AVG(daily_attendance.attendance_percentage) AS average_percentage')
            ->groupBy('daily_attendance.kelas_id', 'kelas.kelas')
            ->orderByDesc('average_percentage')
            ->limit(3)
            ->get()
            ->map(fn ($class) => [
                'id' => $class->kelas_id,
                'class' => $class->kelas,
                'percentage' => round((float) $class->average_percentage, 1),
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
                'journals' => ['items' => $journals],
                'attendance_classes' => ['items' => $topAttendanceClasses],
            ],
        ]);
    }

    /**
     * Kolom file per resource yang perlu dibersihkan dari R2 setelah
     * row-nya berhasil dihapus dari DB. Satu resource bisa punya lebih
     * dari satu kolom (mis. bank_soal: lampiran soal utama + lampiran
     * tiap opsi jawaban).
     */
    private const FILE_COLUMNS = [
        'materials' => ['file_path'],
        'assignments' => ['file_path'],
        'announcements' => ['file_path'],
        'question-bank' => [
            'link_lampiran',
            'opsi_a_lampiran',
            'opsi_b_lampiran',
            'opsi_c_lampiran',
            'opsi_d_lampiran',
            'opsi_e_lampiran',
        ],
    ];

    /**
     * Teks konfirmasi wajib per resource — beda-beda supaya proktor/admin
     * tidak bisa asal generalisasi satu kata kunci ke semua tombol reset.
     */
    private const CONFIRM_LABELS = [
        'attendance'     => 'RESET ABSENSI',
        'materials'      => 'RESET MATERI',
        'assignments'    => 'RESET TUGAS',
        'question-bank'  => 'RESET BANK SOAL',
        'announcements'  => 'RESET PENGUMUMAN',
    ];

    public function reset(string $resource, Request $request)
    {
        $tables = [
            'attendance' => 'absensi_harian',
            'materials' => 'materi',
            'assignments' => 'tugas',
            'question-bank' => 'bank_soal',
            'announcements' => 'pengumuman',
        ];

        abort_unless(array_key_exists($resource, $tables), 404);

        $expectedLabel = self::CONFIRM_LABELS[$resource];

        $request->validate([
            'confirm_label' => ['required', 'string', "in:{$expectedLabel}"],
        ]);

        $table   = $tables[$resource];
        $columns = self::FILE_COLUMNS[$resource] ?? [];

        // 1. Ambil dulu daftar path file SEBELUM row-nya dihapus
        //    (kalau resource ini punya kolom file untuk dibersihkan).
        $paths = collect();
        if (!empty($columns)) {
            $paths = DB::table($table)
                ->select($columns)
                ->get()
                ->flatMap(fn ($row) => collect($columns)->map(fn ($col) => $row->{$col}))
                ->filter()
                ->filter(fn ($path) => !str_starts_with($path, 'http'))
                ->unique()
                ->values();
        }

        // 2. Hapus baris DB dulu, di dalam transaction.
        DB::transaction(fn () => DB::table($table)->delete());

        // 3. Baru setelah transaction COMMIT sukses, hapus file fisik di R2.
        //    Kalau ini gagal, itu cuma sampah storage yang bisa dibersihkan
        //    belakangan — bukan data yang jadi rusak/pointer ke file hilang.
        if ($paths->isNotEmpty()) {
            Storage::disk('r2')->delete($paths->all());
        }

        return back()->with('success', 'Seluruh data berhasil direset.');
    }

    private function countUsersByRole(string $role): int
    {
        return \App\Models\User::where('role', $role)->count();
    }
}