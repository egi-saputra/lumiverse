<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Auth\Passwords\CanResetPassword as CanResetPasswordTrait;
use App\Notifications\ApiPasswordResetNotification;

class TenantOwner extends Authenticatable implements CanResetPassword
{
    use HasApiTokens, Notifiable, CanResetPasswordTrait;

    protected $fillable = [
        'tenant_id', 'name', 'email', 'phone', 'password', 'google_id',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class, 'tenant_id', 'id');
    }

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ApiPasswordResetNotification($token));
    }
}