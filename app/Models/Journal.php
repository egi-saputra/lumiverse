<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    protected $table = 'jurnals';

    protected $fillable = [
        'guru_id',
        'kelas_id',
        'mapel_id',
        'tanggal',
        'jam_mulai',
        'jam_selesai',
        'jumlah_jam',
        'materi',
        'latitude',
        'longitude',
        'akurasi_meter',
        'jarak_meter',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'latitude' => 'float',
        'longitude' => 'float',
        'akurasi_meter' => 'float',
        'jarak_meter' => 'float',
    ];

    public function guru()
    {
        return $this->belongsTo(Guru::class, 'guru_id');
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    public function mapel()
    {
        return $this->belongsTo(Mapel::class, 'mapel_id');
    }
}