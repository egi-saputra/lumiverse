<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\SubscriptionOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Owner/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('owner')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('owner.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Email atau password salah.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::guard('owner')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        // return redirect()->route('owner.login');
        return redirect('/');
    }

    public function dashboard(): Response
    {
        $owner  = Auth::guard('owner')->user();
        $tenant = Tenant::with('domains')->find($owner->tenant_id);
        $plan = $tenant->plan_id ? \App\Models\Plan::find($tenant->plan_id) : null;
        $userCount = $tenant->run(fn() => \App\Models\User::count());

        // Order pending terbaru — bisa dari renewal otomatis atau checkout yang belum kelar
        $pendingOrder = SubscriptionOrder::where('tenant_id', $tenant->id)
            ->where('status', 'pending')
            ->latest()
            ->first();

        return Inertia::render('Owner/Dashboard', [
            'owner' => [
                'name'  => $owner->name,
                'email' => $owner->email,
                'phone' => $owner->phone,
            ],
            'tenant' => [
                'name'                   => $tenant->name,
                'product_type'           => $tenant->product_type,
                'subdomain'              => $tenant->domains->first()?->domain,
                'code'                   => $tenant->code,
                'institution_type'       => $tenant->institution_type,
                'institution_type_other' => $tenant->institution_type_other,
                'school_level'           => $tenant->school_level,
                'npsn'                   => $tenant->npsn,
                'nss'                    => $tenant->nss,
                'registration_number'    => $tenant->registration_number,
                'contact_phone'          => $tenant->contact_phone,
                'institution_email'      => $tenant->institution_email,
                'institution_website'    => $tenant->institution_website,
                'address'                => $tenant->address,
                'logo_path'              => $tenant->logo_path,
                'max_users'              => $tenant->max_users ?? $plan?->max_users,
                'user_count'             => $userCount,
                'expires_at'             => $tenant->expires_at?->toDateString(),
                'days_left'              => $tenant->daysLeft(),
                'status'                 => $tenant->statusLabel(),
                'is_active'              => $tenant->is_active,
                'plan'                   => $plan?->name,
                'plan_key'               => $plan?->key,
                'plan_accent'            => $plan?->accent_color,
            ],
            'pendingOrderId' => $pendingOrder?->order_id,
        ]);
    }
}