<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PesertaUjian extends Model
{
    use HasFactory;

    protected $table = 'peserta_ujian';

    protected $fillable = [
        'nama',
        'kelas',
        'no_peserta',
        'status',
    ];

    // Jika menggunakan enum string: Activated / Deactivated
    protected $casts = [
        'status' => 'string',
    ];
}
