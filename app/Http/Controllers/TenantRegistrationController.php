<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Tenant;
use App\Models\TenantOwner;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Stancl\Tenancy\Database\Models\Domain;
use Throwable;

class TenantRegistrationController extends Controller
{
    protected array $reservedSubdomains = [
        'www', 'admin', 'api', 'app', 'mail', 'ftp', 'localhost',
        'central', 'dashboard', 'docs', 'status', 'blog', 'staging',
        'test', 'support', 'help', 'cdn', 'assets', 'akun',
    ];

    protected array $institutionTypes = ['sekolah', 'kursus', 'privat', 'yayasan', 'lainnya'];
    protected array $schoolLevels = ['sd', 'smp', 'smk'];

    public function create(): Response
    {
        return Inertia::render('Tenant/Register');
    }

    public function suggestSubdomain(Request $request)
    {
        $name = $request->input('name', '');
        $base = Str::slug($name);

        if (blank($base)) {
            return response()->json(['subdomain' => '']);
        }

        $subdomain = $base;
        $counter = 1;

        while ($this->isSubdomainTaken($subdomain)) {
            $subdomain = $base . '-' . $counter;
            $counter++;
        }

        return response()->json(['subdomain' => $subdomain]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'institution_type' => ['required', Rule::in($this->institutionTypes)],
            'institution_type_other' => [
                Rule::requiredIf(fn() => $request->input('institution_type') === 'lainnya'),
                'nullable', 'string', 'max:100',
            ],

            'school_name' => ['required', 'unique:tenants,name', 'string', 'max:255'],
            'subdomain' => [
                'required', 'string', 'min:3', 'max:63',
                'regex:/^[a-z0-9]+(-[a-z0-9]+)*$/',
                Rule::notIn($this->reservedSubdomains),
                function ($attribute, $value, $fail) {
                    if ($this->isSubdomainTaken($value)) {
                        $fail('Url ini sudah digunakan lembaga lain.');
                    }
                },
            ],
            'address' => ['nullable', 'string', 'max:500'],

            'school_level' => [
                Rule::requiredIf(fn() => $request->input('institution_type') === 'sekolah'),
                'nullable', Rule::in($this->schoolLevels),
            ],
            'npsn' => [
                Rule::requiredIf(fn() => $request->input('institution_type') === 'sekolah'),
                'nullable', 'string', 'digits:8',
                'unique:tenants,npsn',
                function ($attribute, $value, $fail) {
                    if ($value !== null && $value !== '' && $this->isPatternedNumber($value)) {
                        $fail('NPSN tidak valid — hindari angka berurutan atau berpola seperti 12345678 atau 11111111.');
                    }
                },
            ],
            'registration_number' => [
                Rule::requiredIf(fn() => $request->input('institution_type') !== 'sekolah'),
                'nullable', 'string', 'max:50',
            ],

            'admin_name' => ['required', 'string', 'max:255'],
            'admin_email' => ['required', 'string', 'email:rfc,dns', 'max:255', 'unique:tenant_owners,email'],
            'admin_phone' => ['required', 'string', 'max:20', 'regex:/^[0-9+\-\s]+$/'],
            'admin_password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/',
            ],
        ], [
            'institution_type.required' => 'Jenis lembaga wajib dipilih.',
            'institution_type_other.required' => 'Nama jenis lembaga wajib diisi.',
            'school_name.required' => 'Nama lembaga wajib diisi.',
            'school_name.unique' => 'Nama lembaga ini sudah terdaftar.',
            'subdomain.required' => 'Link akses wajib diisi.',
            'subdomain.regex' => 'Url hanya boleh huruf kecil, angka, dan tanda hubung.',
            'subdomain.not_in' => 'Url ini tidak tersedia.',
            'school_level.required' => 'Jenjang sekolah wajib dipilih.',
            'npsn.required' => 'NPSN wajib diisi untuk sekolah.',
            'npsn.digits' => 'NPSN harus 8 digit angka sesuai standar Kemendikbud.',
            'npsn.unique' => 'NPSN ini sudah terdaftar oleh lembaga lain.',
            'registration_number.required' => 'Nomor legalitas wajib diisi.',
            'admin_name.required' => 'Nama wajib diisi.',
            'admin_email.required' => 'Alamat email wajib diisi.',
            'admin_email.email' => 'Format email tidak valid atau domain email tidak ditemukan.',
            'admin_email.unique' => 'Email ini sudah terdaftar sebagai admin lembaga lain.',
            'admin_phone.required' => 'Nomor WhatsApp admin wajib diisi.',
            'admin_phone.regex' => 'Format nomor WhatsApp tidak valid.',
            'admin_password.required' => 'Password wajib diisi.',
            'admin_password.min' => 'Password minimal 8 karakter.',
            'admin_password.confirmed' => 'Konfirmasi password tidak cocok.',
            'admin_password.regex' => 'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol.',
        ]);

        $tenant = null;
        $owner  = null;

        try {
            // Cek apakah DB tenant orphan masih ada (sisa rollback gagal sebelumnya)
            $this->dropOrphanTenantDatabase($validated['subdomain']);

            $trialPlan     = Plan::where('key', 'trial')->where('is_active', true)->first();
            $trialPlanId   = $trialPlan?->id;
            $trialExpires  = $trialPlan?->duration_days
                ? Carbon::now()->addDays($trialPlan->duration_days)->toDateString()
                : null;
            $trialMaxUsers = $trialPlan?->max_users;

            // 1. Buat tenant + provisioning DB otomatis
            $tenant = Tenant::create([
                'id'                     => $validated['subdomain'],
                'code'                   => $this->generateUniqueCode(),
                'name'                   => $validated['school_name'],
                'institution_type'       => $validated['institution_type'],
                'institution_type_other' => $validated['institution_type_other'] ?? null,
                'school_level'           => $validated['school_level'] ?? null,
                'npsn'                   => $validated['npsn'] ?? null,
                'registration_number'    => $validated['registration_number'] ?? null,
                'address'                => $validated['address'] ?? null,
                'plan_id'                => $trialPlanId,
                'max_users'              => $trialMaxUsers,
                'trial_used_at'          => now(),
                'expires_at'             => $trialExpires,
                'is_active'              => true,
            ]);

            Domain::create([
                'domain'    => $validated['subdomain'],
                'tenant_id' => $tenant->id,
            ]);

            // 2. Buat user admin DI DALAM database tenant
            $tenant->run(function () use ($validated) {
                \App\Models\User::create([
                    'name'     => $validated['admin_name'],
                    'email'    => $validated['admin_email'],
                    'phone'    => $validated['admin_phone'],
                    'password' => Hash::make($validated['admin_password']),
                    'role'     => 'admin',
                ]);
            });

            // 3. Buat TenantOwner DI central
            $owner = TenantOwner::create([
                'tenant_id' => $tenant->id,
                'name'      => $validated['admin_name'],
                'email'     => $validated['admin_email'],
                'phone'     => $validated['admin_phone'],
                'password'  => Hash::make($validated['admin_password']),
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal provisioning tenant', [
                'message'   => $e->getMessage(),
                'subdomain' => $validated['subdomain'] ?? null,
                'trace'     => $e->getTraceAsString(),
            ]);

            if ($owner) {
                try {
                    $owner->delete();
                } catch (Throwable) {
                }
            }

            if ($tenant) {
                try {
                    $tenant->delete();
                } catch (Throwable $deleteException) {
                    Log::error('Gagal rollback tenant', ['message' => $deleteException->getMessage()]);
                }
            }

            return response()->json([
                'message' => 'Terjadi kesalahan saat membuat akun lembaga. Silakan coba lagi atau hubungi support.',
            ], 500);
        }

        // 4. Auto-login sebagai TenantOwner
        Auth::guard('owner')->login($owner);
        $request->session()->regenerate();

        return response()->json([
            'success'  => true,
            'redirect' => route('owner.dashboard'),
        ]);
    }

    protected function generateUniqueCode(): string
    {
        do {
            // 12 digit angka acak (payload), lalu ditutup dengan check digit EAN-13
            // supaya hasil akhirnya 13 digit dan valid untuk dirender sebagai barcode.
            $payload = (string) random_int(100000000000, 999999999999);
            $code    = $payload . $this->calculateEan13CheckDigit($payload);
        } while (Tenant::where('code', $code)->exists());

        return $code;
    }

    /**
     * Hitung check digit EAN-13 dari 12 digit payload,
     * sesuai algoritma standar GS1 (Modulo 10, bobot 1-3 berselang-seling).
     */
    protected function calculateEan13CheckDigit(string $payload12): string
    {
        $sum = 0;

        foreach (str_split($payload12) as $i => $digit) {
            $sum += ($i % 2 === 0) ? (int) $digit : (int) $digit * 3;
        }

        $mod = $sum % 10;

        return (string) ($mod === 0 ? 0 : 10 - $mod);
    }

    /**
     * Deteksi angka berurutan atau berpola pada NPSN — tolak jika:
     * - Semua digit sama, urutan naik/turun penuh, atau pola berulang 2/3 digit.
     */
    protected function isPatternedNumber(string $value): bool
    {
        $digits = str_split($value);
        $len    = count($digits);

        if (count(array_unique($digits)) === 1) {
            return true;
        }

        $ascending = true;
        $descending = true;
        for ($i = 1; $i < $len; $i++) {
            if ((int)$digits[$i] !== ((int)$digits[$i - 1] + 1) % 10) $ascending  = false;
            if ((int)$digits[$i] !== ((int)$digits[$i - 1] - 1 + 10) % 10) $descending = false;
        }
        if ($ascending || $descending) {
            return true;
        }

        foreach ([2, 3] as $unit) {
            if ($len % $unit !== 0) continue;
            $chunk = implode('', array_slice($digits, 0, $unit));
            $repeated = str_repeat($chunk, $len / $unit);
            if ($repeated === $value) {
                return true;
            }
        }

        return false;
    }

    protected function isSubdomainTaken(string $subdomain): bool
    {
        if (in_array($subdomain, $this->reservedSubdomains)) {
            return true;
        }

        return Domain::where('domain', $subdomain)->exists()
            || Tenant::where('id', $subdomain)->exists();
    }

    protected function dropOrphanTenantDatabase(string $subdomain): void
    {
        $existingTenant = Tenant::find($subdomain);
        if ($existingTenant) {
            throw new \RuntimeException("Tenant '{$subdomain}' sudah ada. Gunakan subdomain lain.");
        }

        Domain::where('domain', $subdomain)->delete();

        $prefix = config('tenancy.database.prefix', 'tenant');
        $suffix = config('tenancy.database.suffix', '');
        $dbName = $prefix . $subdomain . $suffix;

        if (!preg_match('/^[a-zA-Z0-9_\-]+$/', $dbName)) {
            return;
        }

        $safeDbName = str_replace('"', '""', $dbName);

        if (\Illuminate\Support\Facades\DB::transactionLevel() > 0) {
            throw new \RuntimeException(
                "Gagal membersihkan database lama untuk subdomain '{$subdomain}'. " .
                "Operasi drop database tidak boleh dijalankan di dalam transaction."
            );
        }

        try {
            $exists = \Illuminate\Support\Facades\DB::selectOne(
                'SELECT 1 FROM pg_database WHERE datname = ?',
                [$dbName]
            );

            if ($exists) {
                \Illuminate\Support\Facades\DB::statement(
                    'SELECT pg_terminate_backend(pg_stat_activity.pid)
                     FROM pg_stat_activity
                     WHERE pg_stat_activity.datname = ?
                       AND pid <> pg_backend_pid()',
                    [$dbName]
                );

                \Illuminate\Support\Facades\DB::statement("DROP DATABASE IF EXISTS \"{$safeDbName}\"");
            }

            \Illuminate\Support\Facades\DB::purge('tenant');
            Log::info("Dropped orphan tenant database: {$dbName}");
        } catch (\Throwable $e) {
            throw new \RuntimeException(
                "Gagal membersihkan database lama untuk subdomain '{$subdomain}'. " .
                "Silakan hubungi administrator. Detail: " . $e->getMessage()
            );
        }
    }
}