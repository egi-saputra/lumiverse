<?php

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use App\Models\ReferralReward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ReferralController extends Controller
{
    public const CODE_MIN_LENGTH = 4;
    public const CODE_MAX_LENGTH = 20;

    public function index(Request $request)
    {
        $partner = Auth::guard('partner')->user();

        $rewards = ReferralReward::with(['order.plan', 'order.tenant'])
            ->where('referrer_partner_id', $partner->id)
            ->latest('credited_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (ReferralReward $r) => [
                'id'             => $r->id,
                'referred_name'  => $r->order?->tenant?->name,
                'plan_name'      => $r->order?->plan?->name,
                'billing_cycle'  => $r->order?->billing_cycle,
                'order_action'   => $r->order?->action, // subscribe/upgrade/renewal
                'reward_percent' => $r->reward_percent,
                'reward_amount'  => $r->reward_amount,
                'credited_at'    => $r->credited_at?->toDateTimeString(),
            ]);

        // COUNT(DISTINCT tenant_id dari order) — tenant unik yang PERNAH BAYAR
        // lewat referral partner ini, bukan jumlah baris reward (satu tenant
        // bisa muncul berkali-kali kalau reward-nya recurring tiap renewal)
        // dan bukan juga jumlah tenant_referrals (yang termasuk tenant yang
        // sekadar terkunci tapi belum pernah bayar apa-apa).
        $referredCount = ReferralReward::where('referral_rewards.referrer_partner_id', $partner->id)
            ->join('subscription_orders', 'subscription_orders.id', '=', 'referral_rewards.order_id')
            ->distinct()
            ->count('subscription_orders.tenant_id');

        $totalEarned = ReferralReward::where('referral_rewards.referrer_partner_id', $partner->id)
            ->sum('reward_amount');

        return Inertia::render('Partner/Referral', [
            'stats' => [
                'balance'        => (int) ($partner->referral_credit_balance ?? 0),
                'total_earned'   => (int) $totalEarned,
                'referred_count' => $referredCount,
                'referral_code'  => $partner->referral_code,
            ],
            'rewards' => $rewards,
        ]);
    }

    public function updateCode(Request $request)
    {
        $partner = Auth::guard('partner')->user();

        $data = $request->validate([
            'referral_code' => [
                'required',
                'string',
                'min:' . self::CODE_MIN_LENGTH,
                'max:' . self::CODE_MAX_LENGTH,
                'regex:/^[A-Za-z0-9]+$/',
                Rule::unique('partners', 'referral_code')->ignore($partner->id),
            ],
        ], [
            'referral_code.regex' => 'Kode hanya boleh berisi huruf dan angka, tanpa spasi atau simbol.',
            'referral_code.unique' => 'Kode ini sudah dipakai partner lain, coba kode lain.',
            'referral_code.min' => 'Kode minimal ' . self::CODE_MIN_LENGTH . ' karakter.',
            'referral_code.max' => 'Kode maksimal ' . self::CODE_MAX_LENGTH . ' karakter.',
        ]);

        $newCode = strtoupper($data['referral_code']);

        // Tidak ada perubahan sama sekali, tidak perlu query update.
        if ($newCode === $partner->referral_code) {
            return back()->with('success', 'Kode referral berhasil diperbarui.');
        }

        $partner->update(['referral_code' => $newCode]);

        return back()->with('success', 'Kode referral berhasil diperbarui. Kode lama sudah tidak berlaku lagi.');
    }
}