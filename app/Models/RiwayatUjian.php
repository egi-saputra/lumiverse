<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiwayatUjian extends Model
{
    protected $table = 'riwayat_ujian';

    protected $fillable = [
        'user_id',
        'soal_id',
        'ujian_siswa_id',
        'quest_id',
        'jawaban',
        'benar',
        'nilai',
        'status',
        'waktu_pengerjaan',
    ];

    protected $casts = [
        'benar'           => 'boolean',
        'waktu_pengerjaan'=> 'datetime',
    ];

    // ── Relationships ─────────────────────────────────────────────

    // Relasi ke user
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke tabel soal (ujian utama)
    public function soal(): BelongsTo
    {
        return $this->belongsTo(Soal::class);
    }

    public function ujianSiswa(): BelongsTo
    {
        return $this->belongsTo(UjianSiswa::class, 'ujian_siswa_id');
    }

    public function bankSoal(): BelongsTo
    {
        return $this->belongsTo(BankSoal::class, 'quest_id');
    }

    // Relasi ke detail soal di bank soal
    public function quest()
    {
        return $this->belongsTo(BankSoal::class, 'quest_id');
    }
}