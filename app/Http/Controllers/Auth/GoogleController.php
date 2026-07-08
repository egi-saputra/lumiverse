<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    /**
     * Menentukan callback URL yang benar berdasarkan konteks (tenant vs central).
     */
    // private function centralCallbackUrl(): string
    // {
    //     $centralDomain = config('app.central_domain', env('CENTRAL_DOMAIN', 'localhost:8000'));
    //     $scheme = app()->environment('production') ? 'https' : 'http';

    //     return "{$scheme}://{$centralDomain}/auth/google/callback";
    // }

    private function centralCallbackUrl(): string
    {
        return rtrim(config('app.url'), '/') . '/auth/google/callback';
    }

    public function redirect(Request $request)
    {
        $tenantId = $request->query('from_tenant');
        $state = $tenantId ? "tenant:{$tenantId}" : 'owner';

        return Socialite::driver('google')
            ->redirectUrl($this->centralCallbackUrl())
            ->stateless()
            ->with(['state' => $state])
            ->redirect();
    }

    public function callback(Request $request)
    {

        // dd([
        //     'state_from_query' => $request->query('state'),
        //     'state_from_session' => session('google_oauth_state'),
        //     'all_query' => $request->all(),
        // ]);
    
        // Ambil dari query param dulu, fallback ke session
        $state = $request->query('state') ?: session('google_oauth_state');
        session()->forget('google_oauth_state');

        try {
            $googleUser = Socialite::driver('google')
                ->redirectUrl($this->centralCallbackUrl())
                ->stateless() // ← tambah ini agar tidak konflik dengan state validation Socialite
                ->user();
        } catch (\Exception $e) {
            if (str_starts_with($state ?? '', 'tenant:')) {
                $tenantId = substr($state, 7);
                return redirect()->away($this->buildTenantUrl($tenantId, '/login?error=google_failed'));
            }
            return redirect()->to(route('owner.login') . '?error=google_failed');
        }

        // ── Flow A: Tenant ──────────────────────────────────────────────
        if (str_starts_with($state ?? '', 'tenant:')) {
            $tenantId = substr($state, 7);

            $tenant = Tenant::find($tenantId);
            if (! $tenant) {
                abort(404, 'Sekolah/lembaga tidak ditemukan.');
            }

            try {
                $result = $tenant->run(function () use ($googleUser) {
                    return $this->findOrCreateUser($googleUser);
                });
            } catch (\Exception $e) {
                return redirect()->away($this->buildTenantUrl($tenantId, '/login?error=email_not_registered'));
            }

            // Buat signed URL agar user bisa login di subdomain
            $token = encrypt(['user_id' => $result['user_id'], 'path' => $result['path'], 'tenant_id' => $tenantId, 'exp' => now()->addMinutes(2)->timestamp]);

            return redirect()->away($this->buildTenantUrl($tenantId, '/auth/google/token?token=' . urlencode($token)));
        }

        // ── Flow B: Owner ───────────────────────────────────────────────
        if ($state === 'owner') {
            return $this->handleOwnerGoogleLogin($googleUser);
        }

        abort(400, 'State tidak valid.');
    }

    private function handleOwnerGoogleLogin($googleUser): \Illuminate\Http\RedirectResponse
    {
        $owner = \App\Models\TenantOwner::where('email', $googleUser->getEmail())->first();

        if (! $owner) {
            return redirect()->to(route('owner.login') . '?error=email_not_registered');
        }

        Auth::guard('owner')->login($owner, remember: true);

        return redirect()->route('owner.dashboard');
    }

    /**
     * Cari atau buat user di tenant DB, login, dan return path tujuan.
     */
    // private function findOrCreateUser($googleUser): string
    // {
    //     $user = User::where('email', $googleUser->getEmail())->first();

    //     if (! $user) {
    //         $user = User::create([
    //             'name'      => $googleUser->getName(),
    //             'email'     => $googleUser->getEmail(),
    //             'password'  => null,
    //             'google_id' => $googleUser->getId(),
    //             'avatar'    => $googleUser->getAvatar(),
    //             'role'      => 'user',
    //         ]);
    //     } else {
    //         $user->update([
    //             'google_id' => $googleUser->getId(),
    //             'avatar'    => $googleUser->getAvatar(),
    //         ]);
    //     }

    //     Auth::login($user, remember: true);

    //     return match ($user->role) {
    //         'admin'   => '/admin/dashboard',
    //         'proktor' => '/proktor/dashboard',
    //         'guru'    => '/guru/dashboard',
    //         'siswa'   => '/siswa/dashboard',
    //         default   => '/user/dashboard',
    //     };
    // }

    private function findOrCreateUser($googleUser): array
    {
        $user = User::where('email', $googleUser->getEmail())->first();

        if (! $user) {
            throw new \Exception('Email tidak terdaftar.');
        }

        $user->update([
            'google_id' => $googleUser->getId(),
            'avatar'    => $googleUser->getAvatar(),
        ]);

        // Return user id dan path, bukan langsung login
        return [
            'user_id' => $user->id,
            'path'    => match ($user->role) {
                'admin'   => '/admin/dashboard',
                'proktor' => '/proktor/dashboard',
                'guru'    => '/guru/dashboard',
                'siswa'   => '/siswa/dashboard',
                default   => '/user/dashboard',
            },
        ];
    }

    public function loginWithToken(Request $request)
    {
        try {
            $data = decrypt($request->query('token'));
        } catch (\Exception $e) {
            return redirect()->route('login')->withErrors(['email' => 'Link login tidak valid.']);
        }

        if (now()->timestamp > $data['exp']) {
            return redirect()->route('login')->withErrors(['email' => 'Link login sudah kadaluarsa.']);
        }

        // Ini berjalan di tenant context (subdomain), jadi session valid
        $user = User::find($data['user_id']);

        if (! $user) {
            return redirect()->route('login')->withErrors(['email' => 'User tidak ditemukan.']);
        }

        Auth::login($user, remember: true);

        return redirect()->to($data['path']);
    }

    /**
     * Build URL lengkap ke subdomain tenant.
     */
    private function buildTenantUrl(string $tenantId, string $path): string
    {
        // Parse dari APP_URL supaya port otomatis ikut
        $appUrl = config('app.url'); // http://localhost:8000
        $parsed = parse_url($appUrl);

        $scheme = $parsed['scheme'] ?? 'http';
        $host   = $parsed['host'];                          // localhost
        $port   = isset($parsed['port']) ? ":{$parsed['port']}" : ''; // :8000

        return "{$scheme}://{$tenantId}.{$host}{$port}{$path}";
    }
}