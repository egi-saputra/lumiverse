<?php

namespace App\Exports;

use App\Models\Journal;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

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
        // Baris terakhir yang punya data (minimal 2 supaya range A2:D2 tetap valid
        // walau collection-nya kosong, biar gak error "invalid range").
        $lastRow = max($sheet->getHighestRow(), 2);

        // Heading (baris 1): bold + center semua kolom
        $sheet->getStyle('A1:D1')->getFont()->setBold(true);
        $sheet->getStyle('A1:D1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Data: center semua kolom dulu (A sampai D)...
        $sheet->getStyle("A2:D{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // ...lalu override kolom B (Nama Guru) balik ke rata kiri
        $sheet->getStyle("B1:B{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);

        return [];
    }
}