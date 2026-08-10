<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Satu baris "singleton" per tenant: titik lokasi sekolah + jam operasional
 * pengisian jurnal. Digabung dalam satu tabel/cache karena keduanya sama-sama
 * pengaturan yang beda-beda tiap sekolah, dan sama-sama dibaca di request
 * yang sama (form isi jurnal guru).
 */
class JournalSetting extends Model
{
    protected $table = 'journal_settings';

    protected $fillable = [
        'latitude',
        'longitude',
        'radius_meter',
        'toleransi_meter',
        'max_akurasi_meter',
        'kecepatan_maksimum_kmh',
        'jam_buka',
        'jam_tutup',
        'durasi_sesi_menit',
        'timezone',
    ];

    protected $casts = [
        'latitude'  => 'float',
        'longitude' => 'float',
        'radius_meter'           => 'integer',
        'toleransi_meter'        => 'integer',
        'max_akurasi_meter'      => 'integer',
        'kecepatan_maksimum_kmh' => 'integer',
        'durasi_sesi_menit'      => 'integer',
    ];

    private const CACHE_KEY = 'journal:settings';

    /**
     * Ambil (atau buat otomatis dari config .env sebagai default) baris
     * pengaturan jurnal tenant ini. Di-cache forever, jadi TIDAK query DB
     * di setiap request guru buka/submit jurnal — cuma di-invalidate saat
     * admin update lewat clearCache().
     */
    public static function current(): self
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            return self::first() ?? self::create([
                'latitude'                => (float) config('journal.location.latitude'),
                'longitude'               => (float) config('journal.location.longitude'),
                'radius_meter'            => (int) config('journal.location.radius_meter'),
                'toleransi_meter'         => (int) config('journal.location.toleransi_meter', 15),
                'max_akurasi_meter'       => (int) config('journal.location.max_accuracy_meter', 50),
                'kecepatan_maksimum_kmh'  => (int) config('journal.location.kecepatan_maksimum_kmh', 120),
                'jam_buka'                => config('journal.window.jam_buka', '07:00'),
                'jam_tutup'               => config('journal.window.jam_tutup', '14:00'),
                'durasi_sesi_menit'       => (int) config('journal.window.durasi_sesi_menit', 90),
                'timezone'                => config('journal.window.timezone', 'Asia/Jakarta'),
            ]);
        });
    }

    /**
     * Panggil ini setiap kali admin update pengaturan (lokasi ATAU jam)
     * supaya cache tidak basi.
     */
    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}