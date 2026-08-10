<?php

namespace App\Support;

use App\Models\JournalSetting;
use Carbon\Carbon;

/**
 * Aturan jendela waktu pengisian jurnal mengajar guru.
 * Dipakai bareng oleh JournalController (validasi) dan
 * HandleInertiaRequests (status badge di dashboard),
 * supaya aturan jamnya cuma didefinisikan di satu tempat.
 *
 * Nilai jam buka/tutup/durasi sesi/timezone diambil dari tabel
 * `journal_settings` (per-tenant) lewat JournalSetting::current(),
 * bukan lagi hardcode — supaya tiap sekolah bisa beda jam operasional.
 * Nilai di config/journal.php cuma dipakai sebagai default awal saat
 * tenant belum pernah mengisi lewat form admin.
 */
class JournalWindow
{
    public static function timezone(): string
    {
        return JournalSetting::current()->timezone;
    }

    public static function durasiSesiMenit(): int
    {
        return JournalSetting::current()->durasi_sesi_menit;
    }

    /** Format 'H:i', dipotong dari kolom time() ('H:i:s') */
    public static function batasJamBuka(): string
    {
        return substr(JournalSetting::current()->jam_buka, 0, 5);
    }

    public static function batasJamTutup(): string
    {
        return substr(JournalSetting::current()->jam_tutup, 0, 5);
    }

    public static function now(): Carbon
    {
        return Carbon::now(self::timezone());
    }

    public static function isOpen(?Carbon $now = null): bool
    {
        $now = $now ?? self::now();
        $jam = $now->format('H:i');

        return $jam >= self::batasJamBuka() && $jam < self::batasJamTutup();
    }

    /**
     * 'before'  = belum jam buka
     * 'open'    = sedang dalam jendela pengisian
     * 'after'   = sudah lewat jam tutup
     */
    public static function phase(?Carbon $now = null): string
    {
        $now = $now ?? self::now();
        $jam = $now->format('H:i');

        if ($jam < self::batasJamBuka()) {
            return 'before';
        }

        if ($jam >= self::batasJamTutup()) {
            return 'after';
        }

        return 'open';
    }

    public static function pesanDiLuarJendela(?Carbon $now = null): string
    {
        $now = $now ?? self::now();

        if (self::phase($now) === 'before') {
            return 'Pengisian jurnal belum dibuka. Jurnal baru bisa diisi mulai pukul ' . self::batasJamBuka() . '.';
        }

        return 'Pengisian jurnal sudah ditutup. Batas waktu pengisian adalah pukul ' . self::batasJamTutup() . '.';
    }

    /**
     * Payload ringkas untuk dikirim sebagai shared prop Inertia ke front-end.
     */
    public static function toArray(?Carbon $now = null): array
    {
        $now = $now ?? self::now();

        return [
            'isOpen'   => self::isOpen($now),
            'phase'    => self::phase($now),
            'opensAt'  => self::batasJamBuka(),
            'closesAt' => self::batasJamTutup(),
        ];
    }
}