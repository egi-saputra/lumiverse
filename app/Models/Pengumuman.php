<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Concerns\HasTenantFileUrl;

class Pengumuman extends Model
{
    use HasFactory, HasTenantFileUrl;

    protected $table = 'pengumuman';

    protected $fillable = [
        'judul',
        'pengumuman',
        'user_id',
        'file_path',
        'video_url',
    ];

    protected $appends = ['file_url'];

    public function getFileUrlAttribute(): ?string
    {
        return $this->tenantFileUrl($this->file_path);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}