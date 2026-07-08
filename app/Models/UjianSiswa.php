<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UjianSiswa extends Model
{
    protected $table = 'ujian_siswa';

    protected $fillable = [
        'user_id',
        'soal_id',
        'status',
        'token',
        'waktu_mulai',
        'waktu_selesai',
    ];

    protected $casts = [
        'waktu_mulai'   => 'datetime',
        'waktu_selesai' => 'datetime',
    ];

    // ── Relationships ─────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function soal(): BelongsTo
    {
        return $this->belongsTo(Soal::class);
    }

    public function riwayat(): HasMany
    {
        return $this->hasMany(RiwayatUjian::class, 'ujian_siswa_id');
    }
}