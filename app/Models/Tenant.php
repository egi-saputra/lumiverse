<?php

namespace App\Models;

use Carbon\Carbon;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains;

    protected $fillable = [
        'id', 'code', 'name', 'is_active',
        'plan_id', 'trial_used_at', 'quota_grace_until', 'max_users', 'expires_at',
        'pending_plan_id', 'pending_billing_cycle',
        'institution_type', 'institution_type_other', 'school_level', 'npsn', 'nss',
        'registration_number', 'contact_phone', 'institution_email',
        'institution_website', 'address', 'logo_path',
    ];

    protected $casts = [
        'is_active'      => 'boolean',
        'expires_at'     => 'date',
        'trial_used_at'  => 'datetime',
        'plan_id'        => 'integer',
        'pending_plan_id' => 'integer',
    ];

    public static function getCustomColumns(): array
    {
        return [
            'id', 'code', 'name', 'is_active',
            'plan_id', 'trial_used_at', 'quota_grace_until', 'max_users', 'expires_at',
            'pending_plan_id', 'pending_billing_cycle',
            'institution_type', 'institution_type_other', 'school_level', 'npsn', 'nss',
            'registration_number', 'contact_phone', 'institution_email',
            'institution_website', 'address', 'logo_path',
        ];
    }

    /**
     * URL publik logo tenant, null kalau belum upload.
     */
    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo_path
            ? Storage::disk('central_public')->url($this->logo_path)
            : null;
    }

    // public function setNameAttribute($value): void
    // {
    //     $this->attributes['name'] = $value ? Str::lower($value) : $value;
    // }

    // public function getNameAttribute($value): ?string
    // {
    //     return $value ? Str::upper($value) : $value;
    // }

    /**
     * Relasi ke plan aktif.
     */
    public function planData()
    {
        return $this->belongsTo(Plan::class, 'plan_id');
    }

    /**
     * Relasi ke plan yang dijadwalkan (pending downgrade).
     */
    public function pendingPlan()
    {
        return $this->belongsTo(Plan::class, 'pending_plan_id');
    }

    /**
     * Cek apakah tenant ini sedang aktif (gak di-suspend manual & belum expired).
     */
    public function isCurrentlyActive(): bool
    {
        if ($this->is_active === false) {
            return false;
        }

        if ($this->expires_at && Carbon::parse($this->expires_at)->isPast()) {
            return false;
        }

        return true;
    }

    /**
     * Sisa hari sebelum expired. Null kalau gak ada batas waktu (plan tanpa expiry).
     */
    public function daysLeft(): ?int
    {
        if (! $this->expires_at) {
            return null;
        }

        $days = Carbon::now()->diffInDays(Carbon::parse($this->expires_at), false);

        return (int) ceil($days);
    }

    /**
     * Label status untuk ditampilkan di dashboard admin.
     */
    public function statusLabel(): string
    {
        if (!$this->is_active) {
            return 'Dinonaktifkan';
        }

        if ($this->expires_at && Carbon::parse($this->expires_at)->isPast()) {
            return 'Expired';
        }

        return 'Aktif';
    }

    /**
     * Relasi ke owner/admin lembaga (akun yang mendaftarkan tenant ini).
     */
    public function owner()
    {
        return $this->hasOne(TenantOwner::class, 'tenant_id', 'id');
    }

    /**
     * Ambil batas max_users efektif (kolom tenants, fallback ke plan).
     * Pure — nggak butuh tenant context karena plan_id & max_users ada di central DB.
     */
    public function effectiveMaxUsers(): ?int
    {
        return $this->max_users ?? $this->planData?->max_users;
    }

    /**
     * Cek limit — DIPANGGIL DARI DALAM tenant context yang sudah aktif
     * (misal di dalam closure $tenant->run(...)).
     */
    public function hasReachedUserLimitInContext(): bool
    {
        $max = $this->effectiveMaxUsers();

        if ($max === null) {
            return false;
        }

        return User::count() >= $max;
    }

    /**
     * Cek limit — DIPANGGIL DARI LUAR tenant context.
     * Method ini yang akan switch ke tenant context sendiri.
     */
    public function hasReachedUserLimit(): bool
    {
        return $this->run(fn () => $this->hasReachedUserLimitInContext());
    }

    /**
     * Cek apakah tenant ini masih pakai plan Free/Trial tier.
     */
    public function isFreePlan(): bool
    {
        return $this->planData?->key === 'trial';
    }

    /**
     * Cek limit generik untuk resource tertentu (soal, materi, dll) khusus plan Free.
     * Dipanggil dari controller yang sudah berjalan di tenant context.
     *
     * @param class-string $modelClass  Model yang mau dihitung, misal Soal::class
     * @param int          $freeLimit   Batas maksimal untuk plan Free
     */
    public function hasReachedFreeLimit(string $modelClass, int $freeLimit): bool
    {
        if (! $this->isFreePlan()) {
            return false;
        }

        return $modelClass::count() >= $freeLimit;
    }

    /**
     * Cek limit generik yang di-scope per user (bukan per tenant).
     * Contoh: 1 guru hanya boleh punya maksimal N soal/materi sendiri di plan Free.
     *
     * @param class-string $modelClass  Model yang mau dihitung, misal Soal::class
     * @param int          $freeLimit   Batas maksimal untuk plan Free
     * @param string       $userColumn  Nama kolom foreign key ke user, default 'user_id'
     */
    public function hasReachedFreeLimitForUser(string $modelClass, int $freeLimit, string $userColumn = 'user_id'): bool
    {
        if (! $this->isFreePlan()) {
            return false;
        }

        return $modelClass::where($userColumn, Auth::id())->count() >= $freeLimit;
    }
}