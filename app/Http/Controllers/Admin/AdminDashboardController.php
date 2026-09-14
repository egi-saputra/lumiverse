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
    // ... method index() tetap sama, tidak diubah ...

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