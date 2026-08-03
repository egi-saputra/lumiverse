<?php

namespace App\Console\Commands;

use App\Http\Controllers\Owner\SubscriptionController;
use App\Models\Plan;
use App\Models\SubscriptionOrder;
use App\Models\Tenant;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\XenditSdkException;

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
            ->whereNull('pending_plan_id')
            ->get();

        if ($tenants->isEmpty()) {
            $this->info('Tidak ada tenant yang perlu dibuatkan invoice renewal.');
            return;
        }

        Configuration::setXenditKey(config('xendit.secret_key'));
        $invoiceApi = new InvoiceApi();

        foreach ($tenants as $tenant) {
            $plan = Plan::find($tenant->plan_id);

            if (!$plan || $plan->price_monthly === 0) {
                continue;
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

            // Referral: renewal auto tidak punya input kode manual, tapi
            // kalau tenant sudah PERMANEN ter-link (tenant_referrals),
            // resolveReferrer() otomatis mengembalikan partner itu tanpa
            // butuh kode. Reward partner tetap recurring tiap siklus renewal,
            // tapi DISKON tenant cuma berlaku sampai batas pemakaian
            // (REFERRAL_DISCOUNT_MAX_USES) — setelah itu renewal harga normal.
            $referrer  = $subscriptionController->resolveReferrer($tenant, null);
            $applyReferralDiscount = $referrer !== null
                && $subscriptionController->referralDiscountUsageCount($tenant) < SubscriptionController::REFERRAL_DISCOUNT_MAX_USES;

            $calc = $subscriptionController->calculateRenewal(
                $plan,
                $cycle,
                Carbon::parse($tenant->expires_at),
                $applyReferralDiscount
            );

            $orderId = 'INV-' . $tenant->id . '-' . time();
            $amount  = $calc['amount_to_pay_after_tax'];

            $order = SubscriptionOrder::create([
                'tenant_id'                => $tenant->id,
                'plan_id'                  => $plan->id,
                'billing_cycle'            => $cycle,
                'order_id'                 => $orderId,
                'action'                   => 'renewal',
                'subtotal'                 => $calc['subtotal'],
                'yearly_discount'          => $calc['yearly_discount'],
                'discount_percent'         => $calc['discount_percent'],
                'discount_amount'          => $calc['discount_amount'],
                'referral_discount_amount' => $calc['referral_discount_amount'] ?? 0,
                'referrer_partner_id'      => $referrer?->id,
                'credit_amount'            => 0,
                'bonus_days'               => 0,
                'tax_amount'               => $calc['tax_amount'],
                'amount'                   => $amount,
                'status'                   => 'pending',
                'expires_at'               => $calc['new_expires_at'],
            ]);

            // Total 0 (mis. diskon referral/plan menutup semua biaya) → aktivasi
            // langsung tanpa Xendit, konsisten dengan alur charge().
            if ($amount === 0) {
                $subscriptionController->handlePaymentSuccess($order);
                $this->info("Tenant {$tenant->id}: renewal senilai Rp0, langsung diaktifkan.");
                continue;
            }

            try {
                $createInvoiceRequest = new CreateInvoiceRequest([
                    'external_id'         => $orderId,
                    'amount'              => $amount,
                    'payer_email'         => $owner->email,
                    'description'         => "Perpanjangan Paket {$plan->name} ({$cycle})",
                    'invoice_duration'    => config('xendit.invoice_duration'),
                    'currency'            => 'IDR',
                    'success_redirect_url' => route('owner.subscription.finish', ['order_id' => $orderId]),
                    'failure_redirect_url' => route('owner.subscription.finish', ['order_id' => $orderId]),
                    'customer' => array_filter([
                        'given_names'   => $owner->name,
                        'email'         => $owner->email,
                        'mobile_number' => $owner->phone ?: null,
                    ]),
                    'items' => [[
                        'name'     => "Perpanjangan Paket {$plan->name} ({$cycle})",
                        'quantity' => 1,
                        'price'    => $amount,
                        'category' => 'Subscription',
                    ]],
                ]);

                $invoice = $invoiceApi->createInvoice($createInvoiceRequest);
                $order->update(['xendit_invoice_id' => $invoice->getId()]);

                $this->info("Invoice renewal dibuat untuk tenant {$tenant->id}: {$orderId}");
            } catch (XenditSdkException $e) {
                Log::error('Gagal membuat Xendit Invoice untuk renewal', [
                    'tenant_id' => $tenant->id,
                    'order_id'  => $orderId,
                    'message'   => $e->getMessage(),
                    'error'     => $e->getFullError(),
                ]);

                $order->update(['status' => 'failed']);
                $this->error("Tenant {$tenant->id}: gagal membuat invoice Xendit, order ditandai failed.");
            }
        }
    }
}