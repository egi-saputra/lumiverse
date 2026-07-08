<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfilController extends Controller
{
    protected array $schoolInstitutionTypes    = ['sekolah', 'kursus', 'privat', 'yayasan', 'lainnya'];
    protected array $workspaceInstitutionTypes = ['pt', 'cv', 'startup', 'yayasan', 'lainnya'];
    protected array $schoolLevels              = ['sd', 'smp', 'smk'];

    /**
     * Daftar jenis lembaga/organisasi yang valid — kondisional sesuai product_type tenant.
     */
    protected function institutionTypesFor(Tenant $tenant): array
    {
        return $tenant->isWorkspace() ? $this->workspaceInstitutionTypes : $this->schoolInstitutionTypes;
    }

    // ─── Halaman Profil Lembaga & Akun PIC ─────────────────────────────────────
    public function edit(): Response
    {
        $owner  = Auth::guard('owner')->user();
        $tenant = Tenant::find($owner->tenant_id);

        return Inertia::render('Owner/Profil', [
            'owner' => [
                'name'  => $owner->name,
                'email' => $owner->email,
                'phone' => $owner->phone,
            ],
            'tenant' => [
                'name'                   => $tenant->name,
                'product_type'           => $tenant->product_type,
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
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UPDATE: Profil lembaga lengkap (termasuk nama — tidak ada edit di card status)
    // ─────────────────────────────────────────────────────────────────────────
    public function updateProfile(Request $request)
    {
        $owner  = Auth::guard('owner')->user();
        $tenant = Tenant::find($owner->tenant_id);

        $isWorkspace      = $tenant->isWorkspace();
        $institutionTypes = $this->institutionTypesFor($tenant);

        $validated = $request->validate([
            'school_name'            => ['required', 'string', 'max:255'],
            'institution_type'       => ['required', Rule::in($institutionTypes)],
            'institution_type_other' => [
                Rule::requiredIf(fn() => $request->input('institution_type') === 'lainnya'),
                'nullable', 'string', 'max:100',
            ],
            'school_level' => [
                Rule::requiredIf(fn() => !$isWorkspace && $request->input('institution_type') === 'sekolah'),
                'nullable', Rule::in($this->schoolLevels),
            ],
            'npsn' => [
                Rule::requiredIf(fn() => !$isWorkspace && $request->input('institution_type') === 'sekolah'),
                'nullable', 'string', 'digits:8',
                Rule::unique('tenants', 'npsn')->ignore($tenant->id),
                function ($attribute, $value, $fail) {
                    if ($value !== null && $value !== '' && $this->isPatternedNumber($value)) {
                        $fail('NPSN tidak valid — hindari angka berurutan atau berpola seperti 12345678 atau 11111111.');
                    }
                },
            ],
            'nss' => [
                'nullable', 'string', 'digits:12',
                Rule::unique('tenants', 'nss')->ignore($tenant->id),
                function ($attribute, $value, $fail) {
                    if ($value !== null && $value !== '' && $this->isPatternedNumber($value)) {
                        $fail('NSS tidak valid — hindari angka berurutan atau berpola seperti 123456789012 atau 111111111111.');
                    }
                },
            ],
            'registration_number' => [
                Rule::requiredIf(fn() => $isWorkspace || $request->input('institution_type') !== 'sekolah'),
                'nullable', 'string', 'max:50',
            ],
            'registration_number_school' => [
                'nullable', 'string', 'max:50',
            ],
            'contact_phone'       => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s]+$/'],
            'institution_email'   => ['nullable', 'string', 'email', 'max:255'],
            'institution_website' => ['nullable', 'string', 'url', 'max:255'],
            'address'             => ['required', 'string', 'max:500'],
            'logo'                => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:15360'],
        ], [
            'school_name.required'         => 'Nama lembaga wajib diisi.',
            'institution_type.required'    => 'Jenis lembaga wajib dipilih.',
            'institution_type.in'          => 'Jenis lembaga yang dipilih tidak valid.',
            'school_level.required'        => 'Jenjang sekolah wajib dipilih.',
            'npsn.required'                => 'NPSN wajib diisi untuk sekolah.',
            'npsn.digits'                  => 'NPSN harus 8 digit angka.',
            'npsn.unique'                  => 'NPSN ini sudah terdaftar oleh lembaga lain.',
            'nss.digits'                   => 'NSS harus 12 digit angka.',
            'nss.unique'                   => 'NSS ini sudah terdaftar oleh lembaga lain.',
            'registration_number.required' => 'Nomor legalitas wajib diisi.',
            'contact_phone.regex'          => 'Format nomor telepon tidak valid.',
            'institution_email.email'      => 'Format email tidak valid.',
            'institution_website.url'      => 'Format website tidak valid (contoh: https://sekolah.id).',
            'address.required'             => 'Alamat wajib diisi.',
            'logo.image'                   => 'File harus berupa gambar.',
            'logo.mimes'                   => 'Format logo harus JPG, PNG, atau WebP.',
            'logo.max'                     => 'Ukuran logo maksimal 15MB.',
        ]);

        $logoPath = $tenant->logo_path;

        if ($request->hasFile('logo')) {
            if ($logoPath) {
                Storage::disk('central_public')->delete($logoPath);
            }
            $logoPath = $request->file('logo')->store('tenant-logos', 'central_public');
            if (!$logoPath) {
                return back()->withErrors(['logo' => 'Gagal menyimpan file logo.']);
            }
        }

        $tenant->update([
            'name'                   => Str::upper($validated['school_name']),
            'institution_type'       => $validated['institution_type'],
            'institution_type_other' => $validated['institution_type_other'] ?? null,
            'school_level'           => !$isWorkspace ? ($validated['school_level'] ?? null) : null,
            'npsn'                   => !$isWorkspace ? ($validated['npsn'] ?? null) : null,
            'nss'                    => !$isWorkspace ? ($validated['nss'] ?? null) : null,
            'registration_number'    => (!$isWorkspace && $validated['institution_type'] === 'sekolah')
                                        ? ($validated['registration_number_school'] ?? null)
                                        : ($validated['registration_number'] ?? null),
            'contact_phone'          => $validated['contact_phone'] ?? null,
            'institution_email'      => $validated['institution_email'] ?? null,
            'institution_website'    => $validated['institution_website'] ?? null,
            'address'                => $validated['address'],
            'logo_path'              => $logoPath,
        ]);

        return back()->with('success', 'Profil lembaga berhasil diperbarui.');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UPDATE: Data akun admin — sync ke tenant_owners (central) DAN users (tenant DB)
    // ─────────────────────────────────────────────────────────────────────────
    public function updateAccount(Request $request)
    {
        $owner  = Auth::guard('owner')->user();
        $tenant = Tenant::find($owner->tenant_id);

        $validated = $request->validate([
            'name'                  => ['required', 'string', 'max:255'],
            'email'                 => ['required', 'email', 'max:255', Rule::unique('tenant_owners', 'email')->ignore($owner->id)],
            'phone'                 => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s]+$/'],
            'password'              => ['nullable', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['nullable', 'string'],
        ], [
            'name.required'          => 'Nama wajib diisi.',
            'email.required'         => 'Email wajib diisi.',
            'email.email'            => 'Format email tidak valid.',
            'email.unique'           => 'Email ini sudah dipakai oleh admin lembaga lain.',
            'phone.regex'            => 'Format nomor WhatsApp tidak valid.',
            'password.min'           => 'Password minimal 8 karakter.',
            'password.confirmed'     => 'Konfirmasi password tidak cocok.',
        ]);

        // Simpan email lama SEBELUM update — dipakai untuk lookup user di tenant DB
        $emailLama = $owner->email;

        // 1. Update tenant_owners di DB central
        $ownerData = [
            'name'  => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
        ];
        if (!empty($validated['password'])) {
            $ownerData['password'] = Hash::make($validated['password']);
        }
        $owner->update($ownerData);

        // 2. Sync ke tabel users di DB tenant (pakai email lama untuk find)
        $tenant->run(function () use ($validated, $emailLama) {
            $user = \App\Models\User::where('email', $emailLama)->first();
            if ($user) {
                $userData = [
                    'name'  => $validated['name'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'] ?? null,
                ];
                if (!empty($validated['password'])) {
                    $userData['password'] = Hash::make($validated['password']);
                }
                $user->update($userData);
            }
        });

        return back()->with('success', 'Data akun berhasil diperbarui.');
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
}