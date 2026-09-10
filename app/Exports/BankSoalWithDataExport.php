<?php

namespace App\Exports;

use App\Models\BankSoal;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class BankSoalWithDataExport implements FromCollection, WithHeadings, WithEvents
{
    public function __construct(private int $soalId) {}

    public function collection(): Collection
    {
        return BankSoal::where('soal_id', $this->soalId)
            ->orderBy('id')
            ->get()
            ->map(function ($item, $index) {
                // Tipe soal → label yang dikenali importer
                $tipe = $item->tipe_soal === 'Essay' ? 'Essay' : 'Pilihan Ganda';

                // Jawaban benar:
                // – PG   → simpan huruf A–E agar importer bisa memetakan ke opsi_x
                // – Essay → dikosongkan (dinilai manual)
                $jawaban = $item->jawaban_benar
                    ? strtoupper(str_replace('opsi_', '', $item->jawaban_benar))
                    : '';

                return [
                    $index + 1,            // No
                    strip_tags($item->soal ?? ''), // Soal (hilangkan tag HTML dari Quill)
                    $tipe,                 // Tipe Soal
                    $jawaban,              // Jawaban Benar
                    $item->opsi_a ?? '',   // Opsi A
                    $item->opsi_b ?? '',   // Opsi B
                    $item->opsi_c ?? '',   // Opsi C
                    $item->opsi_d ?? '',   // Opsi D
                    $item->opsi_e ?? '',   // Opsi E
                ];
            });
    }

    public function headings(): array
    {
        return [
            'No',
            'Soal',
            'Tipe Soal',
            'Jawaban Benar',
            'Opsi A',
            'Opsi B',
            'Opsi C',
            'Opsi D',
            'Opsi E',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {

                $sheet    = $event->sheet->getDelegate();
                $headings = $this->headings();
                $lastCol  = Coordinate::stringFromColumnIndex(count($headings));
                $lastRow  = $sheet->getHighestRow();

                // ── 1. Proteksi heading (dropdown 1 pilihan) ──────────────
                foreach ($headings as $index => $heading) {
                    $colLetter  = Coordinate::stringFromColumnIndex($index + 1);
                    $validation = $sheet->getCell("{$colLetter}1")->getDataValidation();
                    $validation->setType(DataValidation::TYPE_LIST);
                    $validation->setAllowBlank(false);
                    $validation->setShowDropDown(true);
                    $validation->setFormula1(sprintf('"%s"', $heading));
                }

                // ── 2. Dropdown Tipe Soal (kolom C, baris 2 dst) ─────────
                for ($row = 2; $row <= max($lastRow, 2); $row++) {
                    $val = $sheet->getCell("C{$row}")->getDataValidation();
                    $val->setType(DataValidation::TYPE_LIST);
                    $val->setAllowBlank(true);
                    $val->setShowDropDown(true);
                    $val->setFormula1('"Pilihan Ganda,Essay"');
                }

                // ── 3. Lebar kolom ────────────────────────────────────────
                $sheet->getColumnDimension('A')->setWidth(6);   // No
                $sheet->getColumnDimension('B')->setWidth(55);  // Soal
                $sheet->getColumnDimension('C')->setAutoSize(true); // Tipe Soal
                $sheet->getColumnDimension('D')->setAutoSize(true); // Jawaban Benar
                foreach (['E', 'F', 'G', 'H', 'I'] as $col) { // Opsi A–E
                    $sheet->getColumnDimension($col)->setWidth(25);
                }

                // ── 4. Tinggi baris ───────────────────────────────────────
                $sheet->getRowDimension(1)->setRowHeight(25);
                for ($row = 2; $row <= $lastRow; $row++) {
                    $sheet->getRowDimension($row)->setRowHeight(28);
                }

                // ── 5. Heading styling ────────────────────────────────────
                $sheet->getStyle("A1:{$lastCol}1")->applyFromArray([
                    'font' => [
                        'bold'  => true,
                        'color' => ['rgb' => 'FFFFFF'],
                    ],
                    'fill' => [
                        'fillType'   => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '3B5BDB'],
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical'   => Alignment::VERTICAL_CENTER,
                    ],
                ]);

                // ── 6. Data rows styling ──────────────────────────────────
                if ($lastRow >= 2) {
                    // Semua kolom data → center + middle
                    $sheet->getStyle("A2:{$lastCol}{$lastRow}")->getAlignment()
                        ->setHorizontal(Alignment::HORIZONTAL_CENTER)
                        ->setVertical(Alignment::VERTICAL_CENTER);

                    // Kolom Soal (B) → left + wrap
                    $sheet->getStyle("B2:B{$lastRow}")->getAlignment()
                        ->setHorizontal(Alignment::HORIZONTAL_LEFT)
                        ->setVertical(Alignment::VERTICAL_CENTER)
                        ->setWrapText(true);

                    // Kolom Opsi (E–I) → left
                    $sheet->getStyle("E2:I{$lastRow}")->getAlignment()
                        ->setHorizontal(Alignment::HORIZONTAL_LEFT)
                        ->setVertical(Alignment::VERTICAL_CENTER);

                    // Zebra stripe ringan
                    for ($row = 2; $row <= $lastRow; $row++) {
                        if ($row % 2 === 0) {
                            $sheet->getStyle("A{$row}:{$lastCol}{$row}")->getFill()
                                ->setFillType(Fill::FILL_SOLID)
                                ->getStartColor()->setRGB('F8F9FF');
                        }
                    }
                }

                // ── 7. Border tipis seluruh tabel ─────────────────────────
                $sheet->getStyle("A1:{$lastCol}{$lastRow}")->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                            'color'       => ['rgb' => 'E2E8F0'],
                        ],
                    ],
                ]);
            },
        ];
    }
}