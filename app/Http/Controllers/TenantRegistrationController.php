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
use Illuminate\Support\Facades\Storage;
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

    protected array $productTypes = ['school', 'workspace'];
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
            // STEP 0 — Pemilihan produk
            'product_type' => ['required', Rule::in($this->productTypes)],

            // STEP 1 (Lumiverse School)
            'institution_type' => [
                Rule::requiredIf(fn() => $request->input('product_type') === 'school'),
                'nullable', Rule::in($this->institutionTypes),
            ],
            'institution_type_other' => [
                Rule::requiredIf(fn() => $request->input('product_type') === 'school' && $request->input('institution_type') === 'lainnya'),
                'nullable', 'string', 'max:100',
            ],

            // STEP 2 (Lumiverse School) / STEP 1 (Lumiverse Workspace — Info Perusahaan)
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
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:15360'],

            'school_level' => [
                Rule::requiredIf(fn() => $request->input('product_type') === 'school' && $request->input('institution_type') === 'sekolah'),
                'nullable', Rule::in($this->schoolLevels),
            ],
            'npsn' => [
                Rule::requiredIf(fn() => $request->input('product_type') === 'school' && $request->input('institution_type') === 'sekolah'),
                'nullable', 'string', 'digits:8',
                'unique:tenants,npsn',
                function ($attribute, $value, $fail) {
                    if ($value !== null && $value !== '' && $this->isPatternedNumber($value)) {
                        $fail('NPSN tidak valid — hindari angka berurutan atau berpola seperti 12345678 atau 11111111.');
                    }
                },
            ],
            'nss' => [
                'nullable', 'string', 'digits:12',
                'unique:tenants,nss',
                function ($attribute, $value, $fail) {
                    if ($value !== null && $value !== '' && $this->isPatternedNumber($value)) {
                        $fail('NSS tidak valid — hindari angka berurutan atau berpola seperti 123456789012 atau 111111111111.');
                    }
                },
            ],
            'registration_number' => [
                Rule::requiredIf(fn() => $request->input('product_type') === 'school' && $request->input('institution_type') !== 'sekolah'),
                'nullable', 'string', 'max:50',
            ],
            'registration_number_school' => [
                'nullable', 'string', 'max:50',
            ],

            // STEP 3 (Lumiverse School) — untuk Workspace, field ini digabung ke step Info Perusahaan
            'contact_phone' => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s]+$/'],
            'institution_email' => ['nullable', 'string', 'email', 'max:255'],
            'institution_website' => ['nullable', 'string', 'url', 'max:255'],
            'address' => ['required', 'string', 'max:500'],

            // STEP 4 (Lumiverse School) / STEP 2 (Lumiverse Workspace — Akun Admin)
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
            'product_type.required' => 'Silakan pilih produk Lumiverse terlebih dahulu.',
            'product_type.in' => 'Produk yang dipilih tidak valid.',
            'institution_type.required' => 'Jenis lembaga wajib dipilih.',
            'institution_type_other.required' => 'Nama jenis lembaga wajib diisi.',
            'school_name.required' => 'Nama lembaga wajib diisi.',
            'school_name.unique' => 'Nama lembaga ini sudah terdaftar.',
            'subdomain.required' => 'Link akses wajib diisi.',
            'subdomain.regex' => 'Url hanya boleh huruf kecil, angka, dan tanda hubung.',
            'subdomain.not_in' => 'Url ini tidak tersedia.',
            'logo.image' => 'File logo harus berupa gambar.',
            'logo.mimes' => 'Format logo harus JPG, PNG, atau WebP.',
            'logo.max' => 'Ukuran logo maksimal 15MB.',
            'school_level.required' => 'Jenjang sekolah wajib dipilih.',
            'npsn.required' => 'NPSN wajib diisi untuk sekolah.',
            'npsn.digits' => 'NPSN harus 8 digit angka sesuai standar Kemendikbud.',
            'npsn.unique' => 'NPSN ini sudah terdaftar oleh lembaga lain.',
            'nss.digits' => 'NSS harus 12 digit angka sesuai standar resmi.',
            'nss.unique' => 'NSS ini sudah terdaftar oleh lembaga lain.',
            'registration_number.required' => 'Nomor legalitas wajib diisi.',
            'contact_phone.regex' => 'Format nomor telepon tidak valid.',
            'institution_email.email' => 'Format email lembaga tidak valid.',
            'institution_website.url' => 'Format website tidak valid (contoh: https://sekolah.id).',
            'address.required' => 'Alamat lembaga wajib diisi.',
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

        // $validated['school_name'] = Str::lower($validated['school_name']);

        $tenant = null;
        $owner = null;
        $logoPath = null;

        try {
            if ($request->hasFile('logo')) {
                $this->ensureCentralStorageExists();
                $logoPath = $request->file('logo')->store('tenant-logos', 'central_public');

                if (!$logoPath) {
                    throw new \RuntimeException('Gagal menyimpan file logo.');
                }
            }

            // Cek apakah DB tenant orphan masih ada (sisa rollback gagal sebelumnya)
            $this->dropOrphanTenantDatabase($validated['subdomain']);

            // Ambil trial plan dari database berdasarkan key 'starter'
            // plan_id = null jika belum ada plan trial di DB (tenant dianggap belum berlangganan)
            // $trialPlan = Plan::where('key', 'starter')->where('is_active', true)->first();
            $trialPlan = Plan::where('key', 'trial')->where('is_active', true)->first();
            $trialPlanId  = $trialPlan?->id;
            $trialExpires = $trialPlan?->duration_days
                ? Carbon::now()->addDays($trialPlan->duration_days)->toDateString()
                : null;
            $trialMaxUsers = $trialPlan?->max_users; // null = unlimited, ikut semantik plans.max_users

            $isWorkspace = $validated['product_type'] === 'workspace';

            // 1. Buat tenant + provisioning DB otomatis
            $tenant = Tenant::create([
                'id'                     => $validated['subdomain'],
                'code'                   => $this->generateUniqueCode(),
                'name'                   => $validated['school_name'],
                'product_type'           => $validated['product_type'],
                'institution_type'       => $isWorkspace ? 'korporasi' : $validated['institution_type'],
                'institution_type_other' => $isWorkspace ? null : ($validated['institution_type_other'] ?? null),
                'school_level'           => $isWorkspace ? null : ($validated['school_level'] ?? null),
                'npsn'                   => $isWorkspace ? null : ($validated['npsn'] ?? null),
                'nss'                    => $isWorkspace ? null : ($validated['nss'] ?? null),
                'registration_number'    => $isWorkspace
                                            ? ($validated['registration_number'] ?? null)
                                            : ($validated['institution_type'] === 'sekolah'
                                                ? ($validated['registration_number_school'] ?? null)
                                                : ($validated['registration_number'] ?? null)),
                'contact_phone'          => $validated['contact_phone'] ?? null,
                'institution_email'      => $validated['institution_email'] ?? null,
                'institution_website'    => $validated['institution_website'] ?? null,
                'address'                => $validated['address'],
                'logo_path'              => $logoPath,
                'plan_id'                => $trialPlanId,
                'max_users'              => $trialMaxUsers,   // ← copy dari plans.max_users
                'trial_used_at'          => now(),
                'expires_at'             => $trialExpires,
                'is_active'              => true,
            ]);

            Domain::create([
                'domain' => $validated['subdomain'],
                'tenant_id' => $tenant->id,
            ]);

            // 2. Buat user admin DI DALAM database tenant (untuk login ke LMS sekolah)
            $tenant->run(function () use ($validated) {
                \App\Models\User::create([
                    'name'     => $validated['admin_name'],
                    'email'    => $validated['admin_email'],
                    'phone'    => $validated['admin_phone'],
                    'password' => Hash::make($validated['admin_password']),
                    'role'     => 'admin',
                ]);
            });

            // 3. Buat TenantOwner DI central (untuk login ke dashboard central)
            $owner = TenantOwner::create([
                'tenant_id' => $tenant->id,
                'name' => $validated['admin_name'],
                'email' => $validated['admin_email'],
                'phone' => $validated['admin_phone'],
                'password' => Hash::make($validated['admin_password']),
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal provisioning tenant', [
                'message' => $e->getMessage(),
                'subdomain' => $validated['subdomain'] ?? null,
                'trace' => $e->getTraceAsString(),
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

            if ($logoPath) {
                try {
                    Storage::disk('central_public')->delete($logoPath);
                } catch (Throwable) {
                }
            }

            return back()
                ->withErrors([
                    'school_name' => 'Terjadi kesalahan saat membuat akun lembaga. Silakan coba lagi atau hubungi support.',
                ])
                ->withInput();
        }

        // 4. Auto-login sebagai TenantOwner, masuk ke dashboard central (BUKAN redirect ke subdomain)
        Auth::guard('owner')->login($owner);
        $request->session()->regenerate();

        return redirect()->route('owner.dashboard');
    }

    protected function ensureCentralStorageExists(): void
    {
        $path = public_path('storage/central/tenant-logos');
        if (!file_exists($path)) {
            mkdir($path, 0755, true);
        }
    }

    /**
     * Generate kode unik 6 digit angka yang belum dipakai tenant lain.
     */
    protected function generateUniqueCode(): string
    {
        do {
            // Pastikan tidak diawali 0 agar selalu 6 digit penuh
            $code = (string) random_int(100000, 999999);
        } while (\App\Models\Tenant::where('code', $code)->exists());

        return $code;
    }

    /**
     * Deteksi angka berurutan atau berpola — tolak jika:
     * - Semua digit sama         : 111111, 222222
     * - Urutan naik/turun penuh  : 123456, 654321
     * - Pola berulang 2-digit    : 121212, 343434
     * - Pola berulang 3-digit    : 123123, 456456
     */
    protected function isPatternedNumber(string $value): bool
    {
        $digits = str_split($value);
        $len    = count($digits);

        // Semua digit sama
        if (count(array_unique($digits)) === 1) {
            return true;
        }

        // Urutan naik penuh (setiap digit = sebelumnya + 1 mod 10)
        $ascending = true;
        $descending = true;
        for ($i = 1; $i < $len; $i++) {
            if ((int)$digits[$i] !== ((int)$digits[$i - 1] + 1) % 10) $ascending  = false;
            if ((int)$digits[$i] !== ((int)$digits[$i - 1] - 1 + 10) % 10) $descending = false;
        }
        if ($ascending || $descending) {
            return true;
        }

        // Pola berulang dengan unit 2 atau 3 digit
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

        // Cek di tabel domains DAN tabel tenants (primary key)
        // agar tidak miss kondisi orphan setengah-jadi
        return Domain::where('domain', $subdomain)->exists()
            || \App\Models\Tenant::where('id', $subdomain)->exists();
    }

    /**
     * Bersihkan sisa orphan dari rollback gagal sebelumnya:
     * hapus record di tenants + domains + drop DB tenant jika tidak ada tenant aktif.
     * Hanya dijalankan kalau subdomain belum pernah ada DI domains (lolos validasi),
     * tapi bisa saja masih ada orphan di tenants atau di MySQL.
     */
    protected function dropOrphanTenantDatabase(string $subdomain): void
    {
        // Jika tenant record masih ada, cleanup semua sisa orphan-nya
        $existingTenant = \App\Models\Tenant::find($subdomain);
        if ($existingTenant) {
            // Ini tidak seharusnya terjadi karena isSubdomainTaken sudah blok,
            // tapi sebagai safety net: jangan drop — lempar exception supaya tidak overwrite data aktif
            throw new \RuntimeException("Tenant '{$subdomain}' sudah ada. Gunakan subdomain lain.");
        }

        // Hapus sisa domain orphan jika ada (konsistensi)
        Domain::where('domain', $subdomain)->delete();

        // Drop DB orphan di MySQL
        $prefix = config('tenancy.database.prefix', 'tenant');
        $suffix = config('tenancy.database.suffix', '');
        $dbName = $prefix . $subdomain . $suffix;

        if (!preg_match('/^[a-zA-Z0-9_\-]+$/', $dbName)) {
            return;
        }

        try {
            \Illuminate\Support\Facades\DB::statement("DROP DATABASE IF EXISTS `{$dbName}`");
            // Purge cached tenant connection agar stancl tidak pakai koneksi lama
            \Illuminate\Support\Facades\DB::purge('tenant');
            \Illuminate\Support\Facades\Log::info("Dropped orphan tenant database: {$dbName}");
        } catch (\Throwable $e) {
            // Jika drop gagal, lempar supaya proses berhenti — jangan lanjut ke Tenant::create()
            // karena pasti gagal lagi dengan error "table already exists"
            throw new \RuntimeException(
                "Gagal membersihkan database lama untuk subdomain '{$subdomain}'. " .
                "Silakan hubungi administrator. Detail: " . $e->getMessage()
            );
        }
    }
}