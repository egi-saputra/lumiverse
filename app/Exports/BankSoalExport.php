<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class BankSoalExport implements FromCollection, WithHeadings, WithEvents
{
    public function collection()
    {
        return collect([
            // ── Contoh 1: Pilihan Ganda ──────────────────────────────
            [
                '1',
                'Ibu kota Indonesia adalah ... (Ini hanya contoh format soal PG)',
                'Pilihan Ganda',
                'B',
                'Bandung',
                'Jakarta',
                'Surabaya',
                'Medan',
                'Semarang',
            ],
            // ── Contoh 2: Essay ───────────────────────────────────────
            [
                '2',
                'Jelaskan secara singkat proses terjadinya hujan! (Ini hanya contoh format soal Essay)',
                'Essay',
                '', // Jawaban Benar dikosongkan — essay dinilai manual
                '', '', '', '', '',
            ],
        ]);
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
            AfterSheet::class => function(AfterSheet $event) {

                $sheet     = $event->sheet->getDelegate();
                $headings  = $this->headings();
                $lastCol   = Coordinate::stringFromColumnIndex(count($headings));
                $exampleFirstRow = 2;
                $exampleLastRow  = 3; // 2 baris contoh

                /** ----------------------------------------------------
                 * 1. Proteksi heading (dropdown berisi 1 pilihan)
                 * ---------------------------------------------------- */
                foreach ($headings as $index => $heading) {
                    $colLetter = Coordinate::stringFromColumnIndex($index + 1);
                    $validation = $sheet->getCell("{$colLetter}1")->getDataValidation();
                    $validation->setType(DataValidation::TYPE_LIST);
                    $validation->setAllowBlank(false);
                    $validation->setShowDropDown(true);
                    $validation->setFormula1(sprintf('"%s"', $heading));
                }

                /** ----------------------------------------------------
                 * 2. Catatan pengingat di cell A1 (hover comment)
                 * ---------------------------------------------------- */
                $comment = $sheet->getComment('A1');
                $comment->setWidth('280pt');
                $comment->setHeight('90pt');
                $richText = $comment->getText();
                $run = $richText->createTextRun(
                    "⚠️ Baris 2 & 3 (kuning, miring) adalah CONTOH pengisian PG dan Essay.\n\n" .
                    "Hapus kedua baris contoh itu sebelum meng-import file ini, lalu isi baris berikutnya dengan soal Anda sendiri."
                );
                $run->getFont()->setBold(true);

                /** ----------------------------------------------------
                 * 3. Lebar kolom rapi
                 * ---------------------------------------------------- */
                $sheet->getColumnDimension('A')->setWidth(10);  // No
                $sheet->getColumnDimension('B')->setWidth(50);  // Soal
                $sheet->getColumnDimension('C')->setAutoSize(true); // Tipe Soal
                $sheet->getColumnDimension('D')->setAutoSize(true); // Jawaban Benar

                foreach (['E','F','G','H','I'] as $col) { // Opsi A–E
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }

                /** ----------------------------------------------------
                 * 4. Tinggi baris
                 * ---------------------------------------------------- */
                $sheet->getRowDimension(1)->setRowHeight(25);
                for ($row = $exampleFirstRow; $row <= $exampleLastRow; $row++) {
                    $sheet->getRowDimension($row)->setRowHeight(30);
                }

                /** ----------------------------------------------------
                 * 5. Heading → Center + Middle + Bold
                 * ---------------------------------------------------- */
                $sheet->getStyle("A1:{$lastCol}1")->applyFromArray([
                    'font' => ['bold' => true],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical'   => Alignment::VERTICAL_CENTER,
                    ],
                ]);

                /** ----------------------------------------------------
                 * 6. Baris contoh (2 & 3) → fill kuning + italic,
                 *    supaya jelas beda dari data asli
                 * ---------------------------------------------------- */
                $exampleRange = "A{$exampleFirstRow}:{$lastCol}{$exampleLastRow}";

                // $sheet->getStyle($exampleRange)->applyFromArray([
                //     'font' => ['italic' => true],
                //     'fill' => [
                //         'fillType'   => Fill::FILL_SOLID,
                //         'startColor' => ['rgb' => 'FFF9C4'],
                //     ],
                // ]);

                // Semua kolom center (kecuali Soal)
                $sheet->getStyle($exampleRange)->getAlignment()
                      ->setHorizontal(Alignment::HORIZONTAL_CENTER)
                      ->setVertical(Alignment::VERTICAL_CENTER);

                // Kolom B (Soal) pada baris contoh → Left + Middle + WrapText
                $sheet->getStyle("B{$exampleFirstRow}:B{$exampleLastRow}")->getAlignment()
                      ->setHorizontal(Alignment::HORIZONTAL_LEFT)
                      ->setVertical(Alignment::VERTICAL_CENTER)
                      ->setWrapText(true);

                // No kolom "Contoh 1"/"Contoh 2" → bold biar makin kelihatan
                $sheet->getStyle("A{$exampleFirstRow}:A{$exampleLastRow}")->getFont()->setBold(true);
            }
        ];
    }
}