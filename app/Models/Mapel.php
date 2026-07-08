<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mapel extends Model
{
    protected $table = 'mapel';

    protected $fillable = [
        'guru_id',
        'mapel',
    ];

    public function guru()
    {
        return $this->belongsTo(Guru::class, 'guru_id', 'id');
    }
}
