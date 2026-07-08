<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kejuruan extends Model
{
    protected $table = 'kejuruan';

    protected $fillable = [
        'guru_id',
        'kejuruan',
    ];

    public function guru()
    {
        return $this->belongsTo(Guru::class, 'guru_id', 'id');
    }
}
