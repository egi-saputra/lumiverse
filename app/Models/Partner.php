<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use App\Models\Concerns\HasDevices;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Auth\Passwords\CanResetPassword as CanResetPasswordTrait;
use App\Notifications\ApiPasswordResetNotification;

class Partner extends Authenticatable implements MustVerifyEmail, CanResetPassword
{
    use HasFactory, Notifiable, HasDevices, HasApiTokens, CanResetPasswordTrait;

    /**
     * Guard login terpisah, lihat config/auth.php ('guards.partner').
     */
    protected $guard = 'partner';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'google_id',
        'avatar',
        'password',
        'referral_code',
        'referral_credit_balance',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at'       => 'datetime',
        'is_active'               => 'boolean',
        'referral_credit_balance' => 'integer',
        'password'                => 'hashed',
    ];

    /**
     * Semua reward yang pernah didapat partner ini sebagai referrer.
     */
    public function referralRewards()
    {
        return $this->hasMany(ReferralReward::class, 'referrer_partner_id');
    }

    /**
     * Semua rekening bank yang pernah didaftarkan partner ini.
     */
    public function bankAccounts()
    {
        return $this->hasMany(PartnerBankAccount::class, 'partner_id');
    }

    /**
     * Rekening yang jadi tujuan pencairan otomatis (kalau ada & sudah verified).
     */
    public function primaryBankAccount()
    {
        return $this->hasOne(PartnerBankAccount::class, 'partner_id')
                    ->where('is_primary', true);
    }

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ApiPasswordResetNotification($token));
    }

    /**
     * Generate referral_code unik (dipanggil saat partner baru dibuat).
     * Format bebas — sesuaikan kalau sudah ada konvensi kode di tempat lain.
     */
    public static function generateUniqueReferralCode(int $length = 8): string
    {
        do {
            $code = Str::upper(Str::random($length));
        } while (self::where('referral_code', $code)->exists());

        return $code;
    }

    /**
     * Tambah saldo kredit referral (dipanggil saat reward di-credit).
     */
    public function addReferralCredit(int $amount): void
    {
        $this->increment('referral_credit_balance', $amount);
    }

    /**
     * Tiering reward referral — MURNI berdasarkan urutan tenant ke berapa
     * yang berhasil "lock" pakai kode referral partner ini, TIDAK ada
     * kaitan sama sekali dengan Plan yang dipakai tenant. Plan tetap
     * bersih dari skema referral.
     *
     * Rank 1-3  -> 10%
     * Rank 4-6  -> 15%
     * Rank 7-10 -> 20%
     *
     * Tinggal tambah baris kalau nanti mau nambah tingkatan baru
     * (mis. rank 11-15 -> 25%, dst).
     */
    public const REFERRAL_REWARD_TIERS = [
        ['min' => 1, 'max' => 3, 'percent' => 10],
        ['min' => 4, 'max' => 6, 'percent' => 15],
        ['min' => 7, 'max' => 10, 'percent' => 20],
    ];

    /**
     * Rank tenant ini di antara semua tenant yang pernah di-lock partner
     * ini (1 = tenant pertama yang lock, 2 = kedua, dst). Dihitung dari
     * urutan id di tenant_referrals (mengikuti urutan attributed_at
     * karena auto increment), bukan dari plan atau order.
     */
    public function referralRankFor(TenantReferral $referral): int
    {
        return $this->referredTenants()
            ->where('id', '<=', $referral->id)
            ->count();
    }

    /**
     * Persen reward untuk rank tertentu, sesuai tier di atas. Rank yang
     * lebih besar dari tier tertinggi yang didefinisikan tetap dapat
     * persentase tier terakhir (bukan error) — biar aman kalau tier
     * baru belum sempat ditambah.
     */
    public function rewardPercentForRank(int $rank): int
    {
        foreach (self::REFERRAL_REWARD_TIERS as $tier) {
            if ($rank >= $tier['min'] && $rank <= $tier['max']) {
                return $tier['percent'];
            }
        }

        return collect(self::REFERRAL_REWARD_TIERS)->last()['percent'];
    }

    /**
     * Shortcut: langsung dari TenantReferral, tanpa perlu hitung rank
     * manual di tempat lain. Dipakai saat order tenant tsb dibayar &
     * ReferralReward mau di-generate.
     *
     * Contoh pakai di listener/job pembayaran:
     *   $referral = $order->tenant->referral;
     *   $percent  = $referral->partner->rewardPercentForReferral($referral);
     *   $amount   = intdiv($order->subtotal * $percent, 100);
     */
    public function rewardPercentForReferral(TenantReferral $referral): int
    {
        return $this->rewardPercentForRank(
            $this->referralRankFor($referral)
        );
    }

    /**
     * Semua tenant yang atribusinya terkunci ke partner ini (permanen,
     * lepas dari referral_code partner ini yang sekarang lagi aktif).
     */
    public function referredTenants()
    {
        return $this->hasMany(TenantReferral::class, 'partner_id');
    }

    public function payoutRequests()
    {
        return $this->hasMany(PayoutRequest::class, 'partner_id');
    }
}