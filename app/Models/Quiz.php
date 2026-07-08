<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $table = 'quiz';

    protected $fillable = [
        'mapel',
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
                    $token = random_int(100000, 999999); // Token numerik 6 digit
                } while (self::where('token', $token)->exists());

                $model->token = $token;
            }
        });
    }

    /**
     * Relasi ke Soal (One to Many)
     */
    public function soal()
    {
        return $this->hasMany(Soal::class, 'quiz_id');
    }
}
