<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PlanController extends Controller
{
    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN — halaman manajemen plans (CRUD)
    // ─────────────────────────────────────────────────────────────────────────

    public function index()
    {
        return Inertia::render('Developer/Plans', [
            'plans' => Plan::orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatePlan($request);

        // Auto-generate key dari nama jika kosong
        if (empty($validated['key'])) {
            $validated['key'] = $this->uniqueKey($validated['name']);
        }

        Plan::create($validated);

        return back()->with('success', 'Paket berhasil ditambahkan.');
    }

    public function update(Request $request, Plan $plan)
    {
        $validated = $this->validatePlan($request, $plan->id);

        $plan->update($validated);

        return back()->with('success', 'Paket berhasil diperbarui.');
    }

    public function destroy(Plan $plan)
    {
        // Cek apakah plan sedang dipakai oleh tenant aktif (via plan_id FK)
        $inUse = \App\Models\Tenant::where('plan_id', $plan->id)
            ->orWhere('pending_plan_id', $plan->id)
            ->exists();

        if ($inUse) {
            return back()->withErrors([
                'plan' => "Paket \"{$plan->name}\" sedang digunakan oleh tenant aktif dan tidak bisa dihapus.",
            ]);
        }

        $plan->delete();

        return back()->with('success', 'Paket berhasil dihapus.');
    }

    /**
     * Reorder — terima array [{id, sort_order}] dari drag-and-drop di UI.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'orders'              => ['required', 'array'],
            'orders.*.id'         => ['required', 'integer', 'exists:plans,id'],
            'orders.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($request->orders as $item) {
            Plan::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return back()->with('success', 'Urutan paket disimpan.');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────

    protected function validatePlan(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'key' => [
                'nullable',
                'string',
                'max:50',
                'regex:/^[a-z0-9_\-]*$/',
                Rule::unique('plans', 'key')->ignore($ignoreId),
            ],
            'name'                   => ['required', 'string', 'max:100'],
            'description'            => ['nullable', 'string', 'max:500'],
            'price_monthly'          => ['required', 'integer', 'min:0'],
            'price_yearly'           => ['required', 'integer', 'min:0'],
            'max_users'              => ['nullable', 'integer', 'min:1'],
            'duration_days'          => ['nullable', 'integer', 'min:1'],
            'features'               => ['nullable', 'array'],
            'features.*'             => ['string', 'max:200'],
            'unavailable_features'   => ['nullable', 'array'],
            'unavailable_features.*' => ['string', 'max:200'],
            'badge'                  => ['nullable', 'string', 'max:50'],
            'accent_color'           => ['nullable', 'string', 'regex:/^#[0-9a-fA-F]{3,6}$/'],
            'is_highlighted'         => ['boolean'],
            'is_active'              => ['boolean'],
            'sort_order'             => ['integer', 'min:0'],
        ], [
            'name.required'          => 'Nama paket wajib diisi.',
            'price_monthly.required' => 'Harga bulanan wajib diisi.',
            'price_yearly.required'  => 'Harga tahunan wajib diisi.',
            'key.unique'             => 'Key paket sudah digunakan, gunakan key lain.',
            'key.regex'              => 'Key hanya boleh huruf kecil, angka, dash, dan underscore.',
            'accent_color.regex'     => 'Format warna harus hex valid, contoh: #00d4ff.',
        ]);
    }

    protected function uniqueKey(string $name): string
    {
        $base = Str::slug($name, '_');
        $key  = $base;
        $i    = 1;

        while (Plan::where('key', $key)->exists()) {
            $key = $base . '_' . $i++;
        }

        return $key;
    }
}