<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class AbsensiHarian extends Model
{
    protected $table = 'absensi_harian';

    protected $fillable = [
        'siswa_id',
        'kelas_id',
        'tanggal',
        'status',
        'keterangan',
        'dicatat_oleh',
    ];

    protected $casts = [
        'tanggal'    => 'date',
        'siswa_id'   => 'integer',
        'kelas_id'   => 'integer',
        'dicatat_oleh' => 'integer',
    ];

    // ─── Status constants ───────────────────────────────────────────────────
    const STATUS_HADIR = 'hadir';
    const STATUS_SAKIT = 'sakit';
    const STATUS_IZIN  = 'izin';
    const STATUS_ALPHA = 'alpha';

    const STATUSES = [
        self::STATUS_HADIR,
        self::STATUS_SAKIT,
        self::STATUS_IZIN,
        self::STATUS_ALPHA,
    ];

    // ─── Relasi ─────────────────────────────────────────────────────────────

    public function siswa(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Siswa::class, 'siswa_id');
    }

    public function kelas(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    public function pencatat(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'dicatat_oleh');
    }

    // ─── Scopes ─────────────────────────────────────────────────────────────

    public function scopeTanggal(Builder $q, string $tanggal): Builder
    {
        return $q->whereDate('tanggal', $tanggal);
    }

    public function scopeKelas(Builder $q, int $kelasId): Builder
    {
        return $q->where('kelas_id', $kelasId);
    }

    public function scopeBulan(Builder $q, int $bulan, int $tahun): Builder
    {
        return $q->whereMonth('tanggal', $bulan)
                 ->whereYear('tanggal', $tahun);
    }
}