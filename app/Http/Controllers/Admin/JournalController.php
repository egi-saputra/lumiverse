<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Journal;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Exports\JournalRekapExport;
use Maatwebsite\Excel\Facades\Excel;

class JournalController extends Controller
{
    /**
     * Rekap jurnal mengajar dikelompokkan per guru (total jam) untuk periode tertentu.
     */
    public function index(Request $request)
    {
        $bulan = (int) ($request->bulan ?? now()->month);
        $tahun = (int) ($request->tahun ?? now()->year);

        $rekap = Journal::selectRaw('guru_id, SUM(jumlah_jam) as total_jam, COUNT(*) as total_pertemuan')
            ->with('guru:id,nama_lengkap')
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->when($request->search, function ($query) use ($request) {
                $query->whereHas('guru', function ($q) use ($request) {
                    $q->where('nama_lengkap', 'like', "%{$request->search}%");
                });
            })
            ->groupBy('guru_id')
            ->get()
            ->sortBy(fn ($item) => $item->guru?->nama_lengkap)
            ->values();

        return Inertia::render('Admin/Journal/Index', [
            'rekap' => $rekap,
            'filters' => [
                'search' => $request->search,
                'bulan'  => $bulan,
                'tahun'  => $tahun,
            ],
        ]);
    }

    /**
     * Detail rinci jurnal mengajar seorang guru untuk periode tertentu.
     */
    public function show(Request $request, Guru $guru)
    {
        $bulan = (int) ($request->bulan ?? now()->month);
        $tahun = (int) ($request->tahun ?? now()->year);

        $journals = Journal::with(['kelas:id,kelas', 'mapel:id,mapel'])
            ->where('guru_id', $guru->id)
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->orderByDesc('tanggal')
            ->orderByDesc('jam_mulai')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Journal/Show', [
            'guru'     => $guru->only(['id', 'nama_lengkap']),
            'journals' => $journals,
            'filters'  => [
                'bulan' => $bulan,
                'tahun' => $tahun,
            ],
        ]);
    }

    /**
     * Hapus satu entri jurnal spesifik (dipakai di halaman detail/Show).
     */
    public function destroy(Journal $journal)
    {
        $journal->delete();

        return back()->with('success', 'Entri jurnal berhasil dihapus.');
    }

    /**
     * Hapus semua entri jurnal milik seorang guru untuk periode (bulan/tahun)
     * tertentu (dipakai di halaman rekap/Index — tombol hapus per baris).
     */
    public function destroyByGuru(Request $request, Guru $guru)
    {
        $bulan = (int) ($request->bulan ?? now()->month);
        $tahun = (int) ($request->tahun ?? now()->year);

        $jumlahTerhapus = Journal::where('guru_id', $guru->id)
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->delete();

        return back()->with(
            'success',
            "Berhasil menghapus {$jumlahTerhapus} entri jurnal milik {$guru->nama_lengkap} untuk periode ini."
        );
    }

    /**
     * Export rekap jurnal (per guru) ke Excel untuk periode & filter search yang aktif.
     */
    public function export(Request $request)
    {
        $bulan = (int) ($request->bulan ?? now()->month);
        $tahun = (int) ($request->tahun ?? now()->year);

        $namaBulan = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
        ];

        $namaFile = "Rekap-Jurnal-{$namaBulan[$bulan - 1]}-{$tahun}.xlsx";

        return Excel::download(
            new JournalRekapExport($bulan, $tahun, $request->search),
            $namaFile
        );
    }
}