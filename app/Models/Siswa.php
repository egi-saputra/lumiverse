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

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'user_id', 'id');
    }
}