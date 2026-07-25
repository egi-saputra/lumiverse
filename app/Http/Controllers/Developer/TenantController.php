<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class TenantController extends Controller
{
    public function index()
    {
        $tenants = Tenant::query()
            ->with(['domains', 'planData'])
            ->latest()
            ->get()
            ->map(fn(Tenant $t) => [
                'id'         => $t->id,
                'name'       => $t->name ?? '—',
                'domains'    => $t->domains->pluck('domain'),
                'plan'       => $t->planData?->name ?? 'Trial',
                'max_users'  => $t->max_users ?? $t->planData?->max_users,
                'user_count' => $t->run(fn() => \App\Models\User::count()),
                'expires_at' => $t->expires_at,
                'days_left'  => $t->daysLeft(),
                'status'     => $t->statusLabel(),
                'is_active'  => (bool) $t->is_active,
                'created_at' => $t->created_at->format('d M Y'),
            ]);

        return Inertia::render('Developer/Tenants/Index', [
            'tenants'      => $tenants,
            'totalTenants' => $tenants->count(),
        ]);
    }

    // public function show(String $domain, Tenant $tenant)
    public function show(Tenant $tenant)
    {
        $tenant->load(['domains', 'planData']);

        return Inertia::render('Developer/Tenants/Show', [
            'tenant' => [
                'id'                     => $tenant->id,
                'name'                   => $tenant->name,
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
                'logo_path'              => $tenant->logo_path
                    ? Storage::disk('central_public')->url($tenant->logo_path)
                    : null,
                'plan'                   => $tenant->planData?->name ?? 'Trial',
                'plan_id'                => $tenant->plan_id,
                'expires_at'             => $tenant->expires_at,
                'days_left'              => $tenant->daysLeft(),
                'status'                 => $tenant->statusLabel(),
                'is_active'              => (bool) $tenant->is_active,
                'created_at'             => $tenant->created_at->format('d M Y H:i'),
                'domains'                => $tenant->domains->pluck('domain'),
                'user_count'             => $tenant->run(fn() => \App\Models\User::count()),
                'max_users'              => $tenant->max_users ?? $tenant->planData?->max_users,
                'plan_max_users'         => $tenant->planData?->max_users,
            ],
        ]);
    }

    public function edit(Tenant $tenant)
    {
        $tenant->load(['domains', 'planData']);
        $plans = Plan::where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'key', 'max_users']);

        return Inertia::render('Developer/Tenants/Edit', [
            'tenant' => [
                'id'                     => $tenant->id,
                'name'                   => $tenant->name,
                'institution_type'       => $tenant->institution_type,
                'school_level'           => $tenant->school_level,
                'npsn'                   => $tenant->npsn,
                'nss'                    => $tenant->nss,
                'registration_number'    => $tenant->registration_number,
                'contact_phone'          => $tenant->contact_phone,
                'institution_email'      => $tenant->institution_email,
                'institution_website'    => $tenant->institution_website,
                'address'                => $tenant->address,
                'logo_path'              => $tenant->logo_path
                    ? Storage::disk('central_public')->url($tenant->logo_path)
                    : null,
                'plan_id'                => $tenant->plan_id,
                'max_users'              => $tenant->max_users,
                'plan_max_users'         => $tenant->planData?->max_users,
                'expires_at'             => $tenant->expires_at
                    ? \Carbon\Carbon::parse($tenant->expires_at)->format('Y-m-d')
                    : null,
                'is_active'              => (bool) $tenant->is_active,
                'domains'                => $tenant->domains->map(fn ($d) => [
                    'id'     => $d->id,
                    'domain' => $d->domain,
                ]),
            ],
            'plans' => $plans,
        ]);
    }

    public function update(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'name'                => ['required', 'string', 'max:255'],
            'contact_phone'       => ['nullable', 'string', 'max:20'],
            'institution_email'   => ['nullable', 'email', 'max:255'],
            'institution_website' => ['nullable', 'url', 'max:255'],
            'address'             => ['nullable', 'string', 'max:500'],
            'plan_id'             => ['nullable', 'exists:plans,id'],
            'max_users'           => ['nullable', 'integer', 'min:1'],
            'expires_days'        => ['nullable', 'integer', 'min:0'],
            'is_active'           => ['boolean'],
            'logo'                => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:15360'],
        ]);

        // Konversi expires_days → expires_at
        $days = (int) ($validated['expires_days'] ?? 0);
        $validated['expires_at'] = ($days > 0)
            ? \Carbon\Carbon::now()->addDays($days)->toDateString()
            : null;
        unset($validated['expires_days']);

        if ($request->hasFile('logo')) {
            if ($tenant->logo_path) {
                Storage::disk('central_public')->delete($tenant->logo_path);
            }
            $validated['logo_path'] = $request->file('logo')->store('tenant-logos', 'central_public');
        }
        unset($validated['logo']);

        $tenant->update($validated);

        return redirect()->route('developer.tenants.show', $tenant->id)
            ->with('success', 'Data tenant berhasil diperbarui.');
    }

    public function toggle(Tenant $tenant)
    {
        $tenant->is_active = !$tenant->is_active;
        $tenant->save();
        return back()->with('success', 'Status tenant diperbarui.');
    }

    public function destroy(Tenant $tenant)
    {
        // 1. Hapus logo fisik di storage central_public
        if ($tenant->logo_path) {
            try {
                Storage::disk('central_public')->delete($tenant->logo_path);
            } catch (\Throwable $e) {
                Log::warning('Gagal hapus logo tenant', [
                    'tenant_id' => $tenant->id,
                    'logo_path' => $tenant->logo_path,
                    'error'     => $e->getMessage(),
                ]);
            }
        }

        // 2. Hapus TenantOwner dari central DB
        try {
            \App\Models\TenantOwner::where('tenant_id', $tenant->id)->delete();
        } catch (\Throwable $e) {
            Log::warning('Gagal hapus TenantOwner', [
                'tenant_id' => $tenant->id,
                'error'     => $e->getMessage(),
            ]);
        }

        // 3. Hapus tenant — stancl otomatis trigger DeleteDatabase (drop DB tenant)
        //    dan cascade hapus domains lewat foreign key
        try {
            $tenant->delete();
        } catch (\Throwable $e) {
            Log::error('Gagal hapus tenant', [
                'tenant_id' => $tenant->id,
                'error'     => $e->getMessage(),
            ]);

            return redirect()->back()
                ->with('error', 'Gagal menghapus tenant: ' . $e->getMessage());
        }

        return redirect()->route('developer.tenants.index')
            ->with('success', 'Tenant beserta seluruh data, database, dan owner berhasil dihapus.');
    }

    public function storeDomain(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'domain' => [
                'required', 'string', 'max:255',
                'regex:/^([a-z0-9]([a-z0-9\-]*[a-z0-9])?\.)+[a-z]{2,}$/i',
                Rule::unique('domains', 'domain'),
            ],
        ], [
            'domain.required' => 'Domain wajib diisi.',
            'domain.regex'    => 'Format domain tidak valid, contoh: smpislamnusantara.id',
            'domain.unique'   => 'Domain ini sudah digunakan tenant lain.',
        ]);

        $tenant->domains()->create([
            'domain' => Str::lower($validated['domain']),
        ]);

        return back()->with('success', 'Domain berhasil ditambahkan.');
    }

    public function destroyDomain(Tenant $tenant, int $domain)
    {
        $tenant->domains()->where('id', $domain)->delete();

        return back()->with('success', 'Domain berhasil dihapus.');
    }
}