<?php

namespace App\Exports;

use App\Models\Journal;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class JournalRekapExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    private int $nomor = 0;

    public function __construct(
        private int $bulan,
        private int $tahun,
        private ?string $search = null
    ) {}

    public function collection()
    {
        return Journal::selectRaw('guru_id, SUM(jumlah_jam) as total_jam, COUNT(*) as total_pertemuan')
            ->with('guru:id,nama_lengkap')
            ->whereMonth('tanggal', $this->bulan)
            ->whereYear('tanggal', $this->tahun)
            ->when($this->search, function ($query) {
                $query->whereHas('guru', function ($q) {
                    $q->where('nama_lengkap', 'like', "%{$this->search}%");
                });
            })
            ->groupBy('guru_id')
            ->get()
            ->sortBy(fn ($item) => $item->guru?->nama_lengkap)
            ->values();
    }

    public function headings(): array
    {
        return ['No', 'Nama Guru', 'Jumlah Pertemuan', 'Total Jam Mengajar'];
    }

    public function map($item): array
    {
        $this->nomor++;

        return [
            $this->nomor,
            $item->guru?->nama_lengkap ?? '-',
            $item->total_pertemuan,
            $item->total_jam,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}