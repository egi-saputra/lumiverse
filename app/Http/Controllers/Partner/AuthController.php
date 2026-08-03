<?php

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\PayoutRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Partner/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('partner')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('partner.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Email atau password salah.',
        ])->onlyInput('email');
    }

    public function showRegister(): Response
    {
        return Inertia::render('Partner/Register');
    }

    public function loginWithGoogleToken(Request $request)
    {
        try {
            $data = decrypt($request->query('token'));
        } catch (\Throwable) {
            return redirect()->route('partner.login')->withErrors(['email' => 'Link login Google tidak valid.']);
        }

        if (($data['exp'] ?? 0) < now()->timestamp) {
            return redirect()->route('partner.login')->withErrors(['email' => 'Link login Google sudah kedaluwarsa.']);
        }

        $partner = Partner::find($data['partner_id'] ?? null);
        if (! $partner) return redirect()->route('partner.login')->withErrors(['email' => 'Partner tidak ditemukan.']);

        Auth::guard('partner')->login($partner, true);
        $request->session()->regenerate();
        return redirect()->route('partner.dashboard');
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:partners,email'],
            'phone'    => ['nullable', 'string', 'max:20', 'unique:partners,phone'],
            'password' => ['required', 'min:8'],
        ]);

        $partner = Partner::create([
            'name'          => $data['name'],
            'email'         => $data['email'],
            'phone'         => $data['phone'] ?? null,
            'password'      => Hash::make($data['password']),
            'referral_code' => Partner::generateUniqueReferralCode(),
            'is_active'     => true,
        ]);

        Auth::guard('partner')->login($partner);
        $request->session()->regenerate();

        return redirect()->intended(route('partner.dashboard'));
    }

    public function logout(Request $request)
    {
        Auth::guard('partner')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }

    public function dashboard(): Response
    {
        $partner = Auth::guard('partner')->user();
        $partner->loadCount(['referredTenants', 'referralRewards']);

        $recentPayouts = PayoutRequest::where('partner_id', $partner->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(fn (PayoutRequest $p) => [
                'id'             => $p->id,
                'amount'         => $p->amount,
                'status'         => $p->status,
                'failure_reason' => $p->failure_reason,
                'requested_at'   => $p->created_at->toDateTimeString(),
            ]);

        return Inertia::render('Partner/Dashboard', [
            'partner' => [
                'name'                    => $partner->name,
                'email'                   => $partner->email,
                'phone'                   => $partner->phone,
                'referral_code'           => $partner->referral_code,
                'referral_credit_balance' => $partner->referral_credit_balance,
                'is_active'               => $partner->is_active,
                'referred_tenants_count'  => $partner->referred_tenants_count,
                'referral_rewards_count'  => $partner->referral_rewards_count,
            ],
            'recent_payouts' => $recentPayouts,
        ]);
    }
}