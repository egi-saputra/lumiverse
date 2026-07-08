<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    protected $table = 'kelas';

    protected $fillable = [
        'guru_id',
        'kelas',
    ];

    // ─── Relasi ─────────────────────────────────────────────────────────────

    public function guru()
    {
        return $this->belongsTo(Guru::class, 'guru_id', 'id');
    }

    /**
     * Siswa yang terdaftar di kelas ini.
     * Relasi ini WAJIB ada agar withCount(['siswa']) bisa bekerja.
     */
    public function siswa()
    {
        return $this->hasMany(Siswa::class, 'kelas_id');
    }

    public function material()
    {
        return $this->hasMany(Materi::class, 'kelas_id');
    }

    public function pesan()
    {
        return $this->hasMany(Materi::class, 'kelas_id');
    }
}