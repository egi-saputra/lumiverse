<?php

namespace App\Services\Ai;

use Illuminate\Support\Collection;

class MateriAdequacyChecker
{
    // Estimasi kasar: tiap soal butuh minimal sekian karakter konten sumber
    // supaya AI bisa bikin soal yang variatif & tidak mengarang/mengulang-ulang.
    public const MIN_CHARS_PER_SOAL = 120;

    // Minimal total karakter walau soal yang diminta sedikit (mis. cuma 2 soal).
    public const MIN_TOTAL_CHARS = 400;

    /**
     * True kalau total konten materi referensi yang dipilih dianggap cukup
     * untuk membuat $totalSoal soal tanpa perlu riset tambahan dari web.
     *
     * Hanya menghitung $m->deskripsi. Kalau materi juga punya lampiran PDF
     * yang sudah diekstrak teksnya di luar Collection ini (mis. di job),
     * gunakan cukupFromCharCount() supaya PDF ikut dihitung.
     */
    public static function cukup(Collection $materis, int $totalSoal): bool
    {
        if ($materis->isEmpty()) {
            return false;
        }

        $totalChars = $materis->sum(fn ($m) => mb_strlen((string) $m->deskripsi));

        return self::cukupFromCharCount($totalChars, $totalSoal);
    }

    /**
     * Sama seperti cukup(), tapi menerima total karakter konten gabungan
     * secara langsung (mis. deskripsi + hasil ekstraksi PDF), untuk kasus
     * di mana sumber konten sudah dihitung di luar Collection materi.
     */
    public static function cukupFromCharCount(int $totalChars, int $totalSoal): bool
    {
        $minRequired = max(self::MIN_TOTAL_CHARS, $totalSoal * self::MIN_CHARS_PER_SOAL);

        return $totalChars >= $minRequired;
    }
}