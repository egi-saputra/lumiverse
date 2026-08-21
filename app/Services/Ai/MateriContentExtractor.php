<?php

namespace App\Services\Ai;

use App\Models\Materi;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser as PdfParser;

/**
 * Dipindah dari GenerateQuizAiJob supaya bisa dipakai juga oleh
 * QuestAiController::checkAiCost() untuk estimasi kredit sebelum generate,
 * tanpa duplikasi logic (dan tetap pakai cache Redis yang sama).
 */
class MateriContentExtractor
{
    private const MAX_PDF_CHARS = 8000;

    /**
     * Ambil teks PDF materi (dengan cache Redis 30 hari). Return '' kalau
     * materi tidak punya file PDF (link eksternal / bukan PDF / gagal parse).
     */
    public function extractPdfText(Materi $materi): string
    {
        $path = $materi->file_path;

        if (! $path) {
            return '';
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return '';
        }

        if (strtolower(pathinfo($path, PATHINFO_EXTENSION)) !== 'pdf') {
            return '';
        }

        $cacheKey = "materi:{$materi->id}:pdf_text";

        $cached = Cache::store('redis')->get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        $text = $this->parsePdfFromR2($materi, $path);

        if ($text !== '') {
            Cache::store('redis')->put($cacheKey, $text, now()->addDays(30));
        }

        return $text;
    }

    /**
     * Total karakter konten materi (deskripsi + isi PDF) untuk satu koleksi
     * materi. Dipakai buat cek adequacy (materiCukup) tanpa perlu gabungkan
     * teks lengkapnya (lebih ringan untuk endpoint "check cost").
     */
    public function totalContentChars(iterable $materis): int
    {
        $total = 0;

        foreach ($materis as $materi) {
            $deskripsi = trim((string) $materi->deskripsi);
            $pdfText = $this->extractPdfText($materi);
            $total += mb_strlen(trim($deskripsi . ($pdfText ? "\n\n" . $pdfText : '')));
        }

        return $total;
    }

    private function parsePdfFromR2(Materi $materi, string $path): string
    {
        try {
            if (! Storage::disk('r2')->exists($path)) {
                Log::warning('MateriContentExtractor: file PDF materi tidak ditemukan di R2', [
                    'materi_id' => $materi->id,
                    'path' => $path,
                ]);
                return '';
            }

            $binary = Storage::disk('r2')->get($path);

            $parser = new PdfParser();
            $pdf = $parser->parseContent($binary);
            $text = $pdf->getText();

            $text = trim(preg_replace('/[ \t]+/', ' ', $text));
            $text = preg_replace('/\n{3,}/', "\n\n", $text);

            return $this->truncateForBudget($text, self::MAX_PDF_CHARS);
        } catch (\Throwable $e) {
            Log::warning('MateriContentExtractor: gagal ekstrak teks PDF materi', [
                'materi_id' => $materi->id,
                'path' => $path,
                'error' => $e->getMessage(),
            ]);
            return '';
        }
    }

    private function truncateForBudget(string $text, int $maxChars): string
    {
        $text = trim($text);
        if (mb_strlen($text) <= $maxChars) {
            return $text;
        }

        return mb_substr($text, 0, $maxChars) . "\n\n[...konten dipotong karena terlalu panjang...]";
    }
}