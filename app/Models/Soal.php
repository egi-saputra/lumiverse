<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Soal extends Model
{
    use HasFactory;

    protected $table = 'soal';

    protected $fillable = [
        'user_id',
        'title',
        'mapel_id',
        'kelas',
        'status',
        'tipe_soal',
        'waktu',
        'token',
    ];

    // Generate token 6 digit angka unik otomatis
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->token) {
                do {
                    $token = random_int(100000, 999999);
                } while (self::where('token', $token)->exists());

                $model->token = $token;
            }
        });
    }

    /**
     * Relasi ke Soal (One to Many)
     */
    public function bank_soal()
    {
        return $this->hasMany(BankSoal::class, 'soal_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mapel()
    {
        return $this->belongsTo(Mapel::class, 'mapel_id');
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

}
