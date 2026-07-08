<?php

namespace App\Console\Commands;

use App\Http\Controllers\Owner\SubscriptionController;
use App\Models\Plan;
use App\Models\SubscriptionOrder;
use App\Models\Tenant;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GenerateRenewalInvoices extends Command
{
    protected $signature = 'subscriptions:generate-renewal-invoices {--days=5 : H-berapa sebelum expired invoice dibuat}';
    protected $description = 'Buat invoice pending otomatis untuk tenant yang masa aktifnya akan segera habis';

    public function handle(SubscriptionController $subscriptionController): void
    {
        $windowDays = (int) $this->option('days');
        $now        = Carbon::now();
        $threshold  = $now->copy()->addDays($windowDays);

        $tenants = Tenant::query()
            ->whereNotNull('plan_id')
            ->whereNotNull('expires_at')
            ->whereBetween('expires_at', [$now, $threshold])
            ->whereNull('pending_plan_id') // sudah dijadwalkan downgrade → jangan ditagih renewal
            ->get();

        if ($tenants->isEmpty()) {
            $this->info('Tidak ada tenant yang perlu dibuatkan invoice renewal.');
            return;
        }

        foreach ($tenants as $tenant) {
            $plan = Plan::find($tenant->plan_id);

            if (!$plan || $plan->price_monthly === 0) {
                continue; // plan gratis, tidak perlu tagihan
            }

            $existing = SubscriptionOrder::where('tenant_id', $tenant->id)
                ->where('status', 'pending')
                ->where('action', 'renewal')
                ->exists();

            if ($existing) {
                $this->info("Tenant {$tenant->id} sudah punya invoice renewal pending, dilewati.");
                continue;
            }

            $owner = $tenant->owner;
            if (!$owner) {
                $this->warn("Tenant {$tenant->id} tidak punya data owner, dilewati.");
                continue;
            }

            $lastPaidOrder = SubscriptionOrder::where('tenant_id', $tenant->id)
                ->where('status', 'paid')
                ->latest('paid_at')
                ->first();

            $cycle = $lastPaidOrder?->billing_cycle ?? 'monthly';

            $calc = $subscriptionController->calculateRenewal($plan, $cycle, Carbon::parse($tenant->expires_at));

            $orderId = 'INV-' . $tenant->id . '-' . time();

            $order = SubscriptionOrder::create([
                'tenant_id'       => $tenant->id,
                'plan_id'         => $plan->id,
                'billing_cycle'   => $cycle,
                'order_id'        => $orderId,
                'action'          => 'renewal',
                'subtotal'         => $calc['subtotal'],
                'yearly_discount'  => $calc['yearly_discount'],
                'discount_percent' => $calc['discount_percent'],
                'discount_amount'  => $calc['discount_amount'],
                'credit_amount'    => 0,
                'bonus_days'       => 0,
                'tax_amount'       => $calc['tax_amount'],
                'amount'           => $calc['amount_to_pay_after_tax'],
                'status'          => 'pending',
                'expires_at'      => $calc['new_expires_at'],
            ]);

            try {
                \Midtrans\Config::$serverKey    = config('midtrans.server_key');
                \Midtrans\Config::$isProduction = config('midtrans.is_production');
                \Midtrans\Config::$isSanitized  = config('midtrans.is_sanitized');
                \Midtrans\Config::$is3ds        = config('midtrans.is_3ds');

                $snapToken = \Midtrans\Snap::getSnapToken([
                    'transaction_details' => [
                        'order_id'     => $orderId,
                        'gross_amount' => $calc['amount_to_pay_after_tax'],
                    ],
                    'customer_details' => [
                        'first_name' => $owner->name,
                        'email'      => $owner->email,
                        'phone'      => $owner->phone ?? '',
                    ],
                    'item_details' => [[
                        'id'       => $plan->key,
                        'price'    => $calc['amount_to_pay_after_tax'],
                        'quantity' => 1,
                        'name'     => "Perpanjangan Paket {$plan->name} ({$cycle})",
                    ]],
                ]);

                $order->update(['snap_token' => $snapToken]);

                $this->info("Invoice renewal dibuat untuk tenant {$tenant->id}: {$orderId}");
            } catch (\Exception $e) {
                Log::error('Gagal generate snap token renewal', [
                    'tenant_id' => $tenant->id,
                    'order_id'  => $orderId,
                    'message'   => $e->getMessage(),
                ]);
            }
        }
    }
}