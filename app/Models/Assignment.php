<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Siswa;
use App\Models\User;
use App\Models\Guru;
use App\Models\Mapel;
use App\Concerns\HasTenantFileUrl;

class Assignment extends Model
{
    use HasFactory, HasTenantFileUrl;

    protected $table = 'tugas';

    protected $fillable = [
        'user_id',
        'guru_id',
        'mapel_id',
        'judul',
        'deskripsi',
        'file_path',
        'is_read',
        'is_updated',
        'revision_count',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'is_updated' => 'boolean',
        'revision_count' => 'integer',
    ];

    protected $appends = ['file_url'];

    public function getFileUrlAttribute(): ?string
    {
        return $this->tenantFileUrl($this->file_path);
    }

    // ── Relationships ────────────────────────────────────────────
    // Relasi ke user (opsional, kalau masih dipakai)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** The student (User) who submitted this assignment. */
    public function siswa()
    {
        return $this->belongsTo(Siswa::class, 'user_id', 'user_id');
    }

    /** The teacher this assignment was sent to. */
    public function guru()
    {
        return $this->belongsTo(Guru::class, 'guru_id');
    }

    /** The subject (mapel) this assignment is for. */
    public function mapel()
    {
        return $this->belongsTo(Mapel::class, 'mapel_id');
    }

    // ── Scopes ───────────────────────────────────────────────────

    /** Assignments that have not been read by the teacher yet. */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function revisions()
    {
        return $this->hasMany(AssignmentRevision::class, 'tugas_id')
                    ->orderByDesc('revision_number');
    }
}