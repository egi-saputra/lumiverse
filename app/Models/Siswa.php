<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    protected $table = 'siswa';

    protected $fillable = [
        'user_id',
        'nama_lengkap',
        // Data pribadi
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'agama',
        'no_hp',
        'no_hp_ortu',
        'alamat',
        'kelurahan',
        'kecamatan',
        'kota',
        'kode_pos',
        // Identitas sekolah
        'nis',
        'nisn',
        'kelas_id',
        'kejuruan_id',
        'id_siswa',
        'status',
        'sekretaris',
        'bendahara',
        'osis',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Siswa $siswa) {
            if (empty($siswa->id_siswa)) {
                $siswa->id_siswa = self::generateIdSiswa();
            }
        });
    }

    /**
     * Generate ID siswa unik.
     * $length bisa disesuaikan sesuai kebutuhan.
     */
    public static function generateIdSiswa(int $length = 10): string
    {
        do {
            $id = str_pad((string) random_int(0, (10 ** $length) - 1), $length, '0', STR_PAD_LEFT);
        } while (self::where('id_siswa', $id)->exists());

        return $id;
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    public function kejuruan()
    {
        return $this->belongsTo(Kejuruan::class, 'kejuruan_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function wali()
    {
        return $this->belongsToMany(User::class, 'siswa_wali');
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'user_id', 'id');
    }
}