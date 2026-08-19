<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Models\AiInvoice;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AiInvoiceController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'in:pending,paid,expired,failed'],
            'plan' => ['nullable', 'in:pro,max'],
            'period' => ['nullable', 'in:all,today,7d,30d'],
        ]);

        $query = AiInvoice::on('central')->newQuery()->latest('created_at');

        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($builder) use ($search) {
                $builder->where('external_id', 'ilike', "%{$search}%")
                    ->orWhere('invoice_id', 'ilike', "%{$search}%")
                    ->orWhere('tenant_id', 'ilike', "%{$search}%");
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['plan'])) {
            $query->where('plan_key', $filters['plan']);
        }

        $period = $filters['period'] ?? 'all';
        if ($period === 'today') {
            $query->where('created_at', '>=', now()->startOfDay());
        } elseif ($period === '7d') {
            $query->where('created_at', '>=', now()->subDays(7));
        } elseif ($period === '30d') {
            $query->where('created_at', '>=', now()->subDays(30));
        }

        $summaryQuery = (clone $query);
        $summary = [
            'total' => (clone $summaryQuery)->count(),
            'paid' => (clone $summaryQuery)->where('status', 'paid')->count(),
            'pending' => (clone $summaryQuery)->where('status', 'pending')->count(),
            'revenue' => (int) (clone $summaryQuery)->where('status', 'paid')->sum('amount'),
        ];

        $invoices = $query->paginate(15)->withQueryString();
        $tenantIds = collect($invoices->items())->pluck('tenant_id')->filter()->unique();
        $tenantNames = Tenant::whereIn('id', $tenantIds)->pluck('name', 'id');

        $invoices->getCollection()->transform(function (AiInvoice $invoice) use ($tenantNames) {
            return [
                'id' => $invoice->id,
                'tenant_id' => $invoice->tenant_id,
                'tenant_name' => $tenantNames[$invoice->tenant_id] ?? 'Tenant tidak ditemukan',
                'external_id' => $invoice->external_id,
                'invoice_id' => $invoice->invoice_id,
                'plan_key' => $invoice->plan_key,
                'amount' => (int) $invoice->amount,
                'status' => $invoice->status,
                'paid_at' => $invoice->paid_at?->format('d M Y, H:i'),
                'expired_at' => $invoice->expired_at?->format('d M Y, H:i'),
                'created_at' => $invoice->created_at?->format('d M Y, H:i'),
            ];
        });

        return Inertia::render('Developer/AiInvoices/Index', [
            'invoices' => $invoices,
            'summary' => $summary,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
                'plan' => $filters['plan'] ?? '',
                'period' => $period,
            ],
        ]);
    }
}