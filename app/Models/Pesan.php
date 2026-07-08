<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
 
class Pesan extends Model
{
    protected $table = 'pesan';
 
    protected $fillable = [
        'judul',
        'isi',
        'penerima',
        'kelas_id',
        'pengirim_id',
    ];
 
    /* ─── Relations ─────────────────────────────────────── */
 
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }
 
    public function pengirim(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pengirim_id');
    }
}