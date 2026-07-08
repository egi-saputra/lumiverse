<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class PesertaExport implements FromCollection, WithHeadings, WithEvents
{
    public function collection()
    {
        // 50 baris kosong untuk diisi user, sekarang 4 kolom (tanpa nisn)
        $rows = [];
        for ($i = 0; $i < 50; $i++) {
            $rows[] = ['', '', '', '']; // 4 kolom
        }
        return collect($rows);
    }

    public function headings(): array
    {
        return [
            'email',
            'nama_lengkap',
            'kelas',
            'kejuruan'
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $headings = $this->headings();
                $lastCol = Coordinate::stringFromColumnIndex(count($headings));

                // Proteksi sheet tapi biarkan heading & baris data bisa diisi
                $sheet->getProtection()->setPassword('password'); 
                $sheet->getProtection()->setSheet(true);
                $sheet->getProtection()->setSort(true);
                $sheet->getProtection()->setInsertRows(true);
                $sheet->getProtection()->setFormatCells(false);

                // Unlock semua sel agar bisa diisi
                foreach (range(1, 51) as $row) {
                    foreach (range(1, count($headings)) as $col) {
                        $sheet->getStyleByColumnAndRow($col, $row)->getProtection()->setLocked(false);
                    }
                }

                // Lebar kolom
                $sheet->getColumnDimension('A')->setWidth(40); // Email
                $sheet->getColumnDimension('B')->setWidth(40); // Nama Lengkap
                $sheet->getColumnDimension('C')->setWidth(20); // Kelas
                $sheet->getColumnDimension('D')->setWidth(20); // Kejuruan

                // Heading style
                $sheet->getStyle("A1:{$lastCol}1")->getFont()->setBold(true);
                foreach (range(1, count($headings)) as $col) {
                    $sheet->getStyleByColumnAndRow($col, 1)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                }

                // Alignment baris data
                $sheet->getStyle("A2:A51")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
                $sheet->getStyle("B2:B51")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
                $sheet->getStyle("C2:C51")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle("D2:D51")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            },
        ];
    }

}
