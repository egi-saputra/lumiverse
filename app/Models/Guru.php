<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Guru extends Model
{
    protected $table = 'guru';

    protected $fillable = [
        'user_id',
        'nama_lengkap',
        'kode_guru',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Guru $guru) {
            if (empty($guru->kode_guru)) {
                $guru->kode_guru = self::generateKodeGuru();
            }
        });
    }

    /**
     * Generate kode guru unik.
     * $length bisa 6, 8, atau berapapun sesuai kebutuhan.
     */
    public static function generateKodeGuru(int $length = 8): string
    {
        do {
            $kode = str_pad((string) random_int(0, (10 ** $length) - 1), $length, '0', STR_PAD_LEFT);
        } while (self::where('kode_guru', $kode)->exists());

        return $kode;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function kelas()
    {
        return $this->hasOne(Kelas::class, 'guru_id', 'id');
    }

    public function mapel()
    {
        return $this->hasOne(Mapel::class, 'guru_id', 'id');
    }

    public function kejuruan()
    {
        return $this->hasOne(Kejuruan::class, 'guru_id', 'id');
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'guru_id');
    }

    public function materi()
    {
        return $this->hasMany(Materi::class);
    }
}