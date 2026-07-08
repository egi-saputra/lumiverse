<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'google_id',
        'avatar',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // ✅ Flexible role check
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    public function Proktor()
    {
        return $this->hasOne(\App\Models\Proktor::class, 'user_id', 'id');
    }

    public function Guru()
    {
        return $this->hasOne(\App\Models\Guru::class, 'user_id', 'id');
    }

    public function siswa()
    {
        return $this->hasOne(\App\Models\Siswa::class, 'user_id', 'id');
    }

    public function soal()
    {
        return $this->hasMany(Soal::class);
    }

}
