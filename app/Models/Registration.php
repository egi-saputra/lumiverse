<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Registration extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'phone',
        'program',
        'message',
        'device_fingerprint',
        'ip_address',
        'user_agent',
        'device_info',
        'status',
        'last_submission_at',
    ];

    protected $casts = [
        'device_info'         => 'array',
        'last_submission_at'  => 'datetime',
    ];

    protected $hidden = [
        // Sembunyikan data sensitif dari serialisasi JSON publik
        'device_fingerprint',
        'ip_address',
        'user_agent',
        'device_info',
    ];

    // ----------------------------------------------------------------
    // Relations
    // ----------------------------------------------------------------

    // (Bisa ditambah relasi ke User admin yang handle pendaftaran)

    // ----------------------------------------------------------------
    // Scopes
    // ----------------------------------------------------------------

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeByProgram($query, string $program)
    {
        return $query->where('program', $program);
    }

    // ----------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------

    /**
     * Normalisasi nomor telepon ke format Indonesia standar.
     * Contoh: 08123456789 → +628123456789
     */
    public static function normalizePhone(string $phone): string
    {
        $clean = preg_replace('/\D/', '', $phone);

        if (str_starts_with($clean, '0')) {
            $clean = '62' . substr($clean, 1);
        }

        if (!str_starts_with($clean, '+')) {
            $clean = '+' . $clean;
        }

        return $clean;
    }
}