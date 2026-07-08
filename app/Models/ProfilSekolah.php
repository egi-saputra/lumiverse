<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfilSekolah extends Model
{
    protected $table = 'profil_sekolah';

    protected $fillable = [
        'nama_sekolah',
        'kepala_yayasan',
        'kepala_sekolah',
        'akreditasi',
        'npsn',
        'no_izin',
        'nss',
        'alamat',
        'rt',
        'rw',
        'kelurahan',
        'kecamatan',
        'kabupaten_kota',
        'provinsi',
        'kode_pos',
        'telepon',
        'email',
        'website',
        'visi',
        'misi',
        'file_name',
        'file_path',
    ];

    /**
     * URL publik logo yang sudah di-cache-bust otomatis.
     */
    public function getLogoUrlAttribute(): ?string
    {
        if (! $this->file_path) {
            return null;
        }

        return url('/logo-sekolah') . '?v=' . $this->updated_at->timestamp;
    }
}