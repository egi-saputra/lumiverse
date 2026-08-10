<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Journal;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
}