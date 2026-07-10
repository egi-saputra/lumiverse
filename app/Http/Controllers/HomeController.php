<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Landing page Lumiverse School (LMS) — dipakai di semua central domain
     * kecuali subdomain workspace.
     */
    public function school(): Response
    {
        return Inertia::render('Home/School', [
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'logos' => $this->trustedLogos(),
        ]);
    }

    /**
     * Landing page Lumiverse Workspace.
     */
    public function workspace(): Response
    {
        return Inertia::render('Landing/Workspace', [
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'logos' => $this->trustedLogos('workspace'),
        ]);
    }

    /**
     * Daftar logo tenant aktif untuk ditampilkan di marquee "Dipercaya oleh".
     * Query jalan di central DB (Tenant model tidak butuh tenant context).
     */
    private function trustedLogos(?string $productType = null): array
    {
        return Tenant::query()
            ->where('is_active', true)
            ->whereNotNull('logo_path')
            ->when($productType, fn ($q) => $q->where('product_type', $productType))
            ->when(! $productType, fn ($q) => $q->where(function ($q) {
                $q->where('product_type', 'school')->orWhereNull('product_type');
            }))
            ->latest('id')
            ->limit(20)
            ->get(['id', 'name', 'logo_path'])
            ->map(fn (Tenant $tenant) => [
                'name' => $tenant->name,
                'logo_url' => $tenant->logo_url,
            ])
            ->values()
            ->all();
    }
}