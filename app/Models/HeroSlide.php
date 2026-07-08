<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSlide extends Model
{
    protected $fillable = [
        'label',
        'heading',
        'accent',
        'sub',
        'image_path',
        // image_url tidak disimpan ke DB — dihasilkan dinamis via accessor
        'tag',
        'cta',
        'cta_target',
        'order',
        'is_active',
    ];

    protected $casts = [
        'heading'   => 'array',
        'is_active' => 'boolean',
        'accent'    => 'integer',
        'order'     => 'integer',
    ];

    // ── Scopes ──────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('order');
    }

    // ── Accessors ────────────────────────────────────────

    /**
     * Return a root-relative URL: /storage/hero-slides/uuid.jpg
     *
     * TIDAK pakai Storage::disk('public')->url() karena method itu
     * menempel APP_URL di depannya. Kalau APP_URL di .env tidak cocok
     * dengan URL yang dibuka browser (beda port, localhost vs 127.0.0.1),
     * gambar jadi 404. Path relatif /storage/... selalu benar selama
     * `php artisan storage:link` sudah dijalankan.
     */
    public function getPublicImageUrlAttribute(): string
    {
        if (! $this->image_path) {
            return '';
        }

        return '/storage/' . $this->image_path;
    }

    // ── Helpers ──────────────────────────────────────────

    public function deleteImage(): void
    {
        if ($this->image_path) {
            $fullPath = storage_path('app/public/' . $this->image_path);
            if (file_exists($fullPath)) {
                unlink($fullPath);
            }
        }
    }
}