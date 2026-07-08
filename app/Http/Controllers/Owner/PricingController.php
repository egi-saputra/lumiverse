<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PricingController extends Controller
{
    // ─────────────────────────────────────────────────────────────────────────
    // OWNER — halaman pricing (read-only, hanya plan aktif)
    // ─────────────────────────────────────────────────────────────────────────
    public function index(Request $request): Response
    {
        $owner  = auth('owner')->user();
        $tenant = $owner->tenant;

        // Tentukan tipe produk tenant. Null dianggap 'school' (default lama),
        // konsisten dengan Tenant::isSchoolProduct().
        $productType = $tenant->isWorkspace() ? 'workspace' : 'school';

        $plans = Plan::where('is_active', true)
            ->where('key', '!=', 'trial')
            ->where('product_type', $productType)
            ->orderBy('sort_order')
            ->get()
            ->map(fn(Plan $p) => [
                'key'         => $p->key,
                'name'        => $p->name,
                'desc'        => $p->description,
                'price'       => [
                    'monthly' => $p->price_monthly,
                    'yearly'  => $p->price_yearly,
                ],
                'sortOrder'   => $p->sort_order,        // untuk bandingkan level upgrade/downgrade
                'maxUsers'    => $p->max_users,
                'highlight'   => (bool) $p->is_highlighted,
                'badge'       => $p->badge,
                'accent'      => $p->accent_color ?? '#00d4ff',
                'features'    => $p->features ?? [],
                'unavailable' => $p->unavailable_features ?? [],
                'cta'         => $p->price_monthly === 0 ? 'Mulai Gratis' : 'Pilih ' . $p->name,
            ]);

        // currentPlan: key dari plan aktif tenant
        $currentPlanKey   = null;
        $currentSortOrder = null;
        if (!empty($tenant->plan_id)) {
            $cp               = Plan::find($tenant->plan_id);
            $currentPlanKey   = $cp?->key;
            $currentSortOrder = $cp?->sort_order;
        } elseif (!empty($tenant->plan)) {
            $currentPlanKey = $tenant->plan;
        }

        // Pending downgrade
        $pendingPlanKey = null;
        if (!empty($tenant->pending_plan_id)) {
            $pendingPlanKey = optional(Plan::find($tenant->pending_plan_id))->key;
        }

        return Inertia::render('Owner/Pricing', [
            'owner'            => $owner,
            'tenant'           => $tenant,
            'productType'      => $productType,
            'currentPlan'      => $currentPlanKey,
            'currentSortOrder' => $currentSortOrder,
            'expiresAt'        => $tenant->expires_at?->toDateString(),
            'pendingPlan'      => $pendingPlanKey,
            'trialUsed'        => !is_null($tenant->trial_used_at ?? null),
            'plans'            => $plans,
        ]);
    }
}