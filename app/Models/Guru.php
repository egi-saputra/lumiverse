<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guru extends Model
{
    protected $table = 'guru';

    protected $fillable = [
        'user_id',
        'nama_lengkap',
        'ttl',
        'alamat',
        'jabatan',
        'nuptk',
        'pesan',
        'artikel',
        'topik',
    ];

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
