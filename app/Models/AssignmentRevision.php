<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Concerns\HasTenantFileUrl;

class AssignmentRevision extends Model
{
    use HasFactory, HasTenantFileUrl;

     protected $fillable = [
        'tugas_id',
        'judul',
        'deskripsi',
        'file_path',
        'catatan_revisi',
        'revision_number',
    ];

    protected $appends = ['file_url'];

    public function getFileUrlAttribute(): ?string
    {
        return $this->tenantFileUrl($this->file_path);
    }

    public function assignment()
    {
        return $this->belongsTo(Assignment::class, 'tugas_id');
    }
}
