<?php

namespace App\Http\Controllers\Ai;

use App\Http\Controllers\Controller;
use App\Models\AiInvoice;
use App\Models\Tenant;
use App\Models\User;
use App\Services\Ai\AiGenerationQuotaService;
use App\Services\Ai\AiPlanPricingService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Throwable;
use Inertia\Inertia;
use Xendit\Configuration;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\Invoice\InvoiceApi;
use Xendit\XenditSdkException;

class AiBillingController extends Controller
{
    public static function resolveTenantIdFromPayload(array $payload): ?string
    {
        $data = $payload['data'] ?? $payload;

        $tenantId = $data['tenant_id'] ?? $payload['tenant_id'] ?? null;
        if (is_scalar($tenantId) && trim((string) $tenantId) !== '') {
            return (string) $tenantId;
        }

        $metadata = $data['metadata'] ?? $payload['metadata'] ?? [];
        if (is_array($metadata)) {
            $tenantId = $metadata['tenant_id'] ?? null;
            if (is_scalar($tenantId) && trim((string) $tenantId) !== '') {
                return (string) $tenantId;
            }
        }

        $externalId = $payload['external_id'] ?? $data['external_id'] ?? null;
        if (is_string($externalId) && preg_match('/^AI-(\d+)-\d+/', $externalId, $matches)) {
            return $matches[1];
        }

        return null;
    }

    protected function aiInvoiceTableExists(): bool
    {
        $tableExists = Schema::hasTable('ai_invoices');

        if (! $tableExists) {
            Log::warning('AI billing: ai_invoices table missing on current connection', [
                'connection' => config('database.default'),
            ]);
        }

        return $tableExists;
    }

    protected function centralAiInvoiceTableExists(): bool
    {
        return Schema::connection('central')->hasTable('ai_invoices');
    }

    protected function createCentralInvoiceCopy(array $attributes): void
    {
        if (! $this->centralAiInvoiceTableExists()) {
            return;
        }

        try {
            AiInvoice::on('central')->updateOrCreate(
                ['external_id' => $attributes['external_id']],
                $attributes
            );
        } catch (Throwable $e) {
            Log::error('AI billing: failed to create central invoice copy', [
                'external_id' => $attributes['external_id'] ?? null,
                'message' => $e->getMessage(),
            ]);
        }
    }

    protected function syncCentralInvoice(?string $externalId, array $attributes): void
    {
        if (! $externalId || ! $this->centralAiInvoiceTableExists()) {
            return;
        }

        try {
            AiInvoice::on('central')
                ->where('external_id', $externalId)
                ->update($attributes);
        } catch (Throwable $e) {
            Log::error('AI billing: failed to sync central invoice copy', [
                'external_id' => $externalId,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function pricing()
    {
        $user = Auth::user();
        $plans = [];
        foreach (['free', 'pro', 'max'] as $key) {
            $plans[] = [
                'key' => $key,
                'label' => config('ai.plans.' . $key . '.label', ucfirst($key)),
                'limit' => config('ai.plans.' . $key . '.limit', 10),
                'monthly_price' => config('ai.plans.' . $key . '.monthly_price', 0),
                'yearly_price' => config('ai.plans.' . $key . '.yearly_price', 0),
            ];
        }

        return Inertia::render('Guru/AiAgent/AiPricing', [
            'plans' => $plans,
            'current_plan' => $user->ai_plan ?? 'free',
            'current_plan_status' => $user->ai_plan_status ?? 'inactive',
            'current_plan_expires_at' => $user->ai_plan_expires_at,
        ]);
    }

    public function checkout(Request $request)
    {
        if (! $this->aiInvoiceTableExists()) {
            return response()->json([
                'message' => 'AI billing is not configured on this server yet. Please contact support.',
            ], 503);
        }

        $request->validate([
            'plan_key' => ['required', 'in:pro,max'],
            'billing_cycle' => ['required', 'in:monthly,yearly'],
        ]);

        $user = Auth::user();

        if (! $user) {
            return response()->json(['message' => 'Sesi login habis. Silakan login kembali.'], 401);
        }

        $planKey = strtolower($request->plan_key);

        // PREVENT DUPLICATE: Check if user already has UNPAID (pending) invoice for the SAME plan
        // Only return existing invoice if it's for the same plan and still pending
        // If user wants to upgrade (different plan), allow new invoice
        $existingPendingInvoice = AiInvoice::where('user_id', $user->id)
            ->where('status', 'pending') // Only PENDING, not PAID
            ->where('plan_key', $planKey) // Only for the SAME plan
            ->where('expired_at', '>', now())
            ->latest('created_at')
            ->first();

        if ($existingPendingInvoice && ! is_null($existingPendingInvoice->invoice_url)) {
            Log::info('AI checkout: returning existing pending invoice for same plan', [
                'user_id' => $user->id,
                'invoice_id' => $existingPendingInvoice->id,
                'external_id' => $existingPendingInvoice->external_id,
                'plan_key' => $planKey,
            ]);

            return response()->json([
                'action' => 'pay',
                'invoice_url' => $existingPendingInvoice->invoice_url,
                'external_id' => $existingPendingInvoice->external_id,
                'amount' => $existingPendingInvoice->amount,
                'plan_key' => $existingPendingInvoice->plan_key,
                'billing_cycle' => $existingPendingInvoice->meta['billing_cycle'] ?? 'monthly',
                'is_existing' => true,
            ]);
        }

        // Check if user is trying to upgrade/renew same plan they already have active
        if ($user->ai_plan === $planKey && $user->ai_plan_status === 'active' && $user->ai_plan_expires_at && $user->ai_plan_expires_at > now()) {
            Log::info('AI checkout: user already has active plan', [
                'user_id' => $user->id,
                'plan_key' => $planKey,
                'expires_at' => $user->ai_plan_expires_at,
            ]);

            return response()->json([
                'message' => 'Anda sudah memiliki paket ' . ucfirst($planKey) . ' yang masih aktif hingga ' . $user->ai_plan_expires_at->format('d M Y') . '. Silakan tunggu sampai masa berakhir untuk upgrade ulang.',
            ], 409);
        }

        $pricing = app(AiPlanPricingService::class)->forPlan($planKey, $request->billing_cycle);
        $amount = (int) $pricing['amount'];

        if ($amount <= 0) {
        $oldPlan = $user->ai_plan ?? 'free';
        
        Log::warning('AI checkout: amount is 0 for paid plan, activating without payment', [
            'tenant_id' => tenant()?->id,
            'user_id' => $user->id,
            'plan_key' => $planKey,
            'from_plan' => $oldPlan,
            'billing_cycle' => $request->billing_cycle,
        ]);

        $user->update([
            'ai_plan' => $planKey,
            'ai_plan_status' => 'active',
            'ai_plan_started_at' => now(),
            'ai_plan_expires_at' => Carbon::now()->addMonth(),
            'ai_pending_plan' => null,
            'ai_last_invoice_status' => 'active',
        ]);

        // Handle token carryover only for true upgrades to a higher plan.
        // Downgrades and free-to-paid transitions start fresh.
        $quotaService = app(AiGenerationQuotaService::class);
        if ($quotaService->shouldCarryOverTokens($oldPlan, $planKey)) {
            $quotaService->handlePlanUpgrade($user, $oldPlan, $planKey);
        } else {
            $user->update([
                'ai_token_balance' => 0,
                'ai_token_last_reset_at' => now(),
            ]);
        }

        // Catat juga di ai_invoices supaya muncul di riwayat pembayaran & bisa diaudit
        $externalId = 'AI-' . (tenant()?->id ?? 'central') . '-' . $user->id . '-' . time();
        AiInvoice::create([
            'tenant_id' => tenant()?->id,
            'user_id' => $user->id,
            'external_id' => $externalId,
            'plan_key' => $planKey,
            'amount' => 0,
            'status' => 'paid',
            'paid_at' => now(),
            'meta' => [
                'billing_cycle' => $request->billing_cycle,
                'note' => 'zero_amount_activation',
                'tenant_id' => tenant()?->id,
            ],
        ]);

        $this->createCentralInvoiceCopy([
            'tenant_id' => tenant()?->id,
            'user_id' => $user->id,
            'external_id' => $externalId,
            'invoice_id' => null,
            'invoice_url' => null,
            'plan_key' => $planKey,
            'amount' => 0,
            'status' => 'paid',
            'paid_at' => now(),
            'meta' => [
                'billing_cycle' => $request->billing_cycle,
                'tenant_id' => tenant()?->id,
                'user_id' => $user->id,
                'source' => 'tenant_checkout',
            ],
        ]);

        return response()->json([
            'action' => 'activated',
            'plan_key' => $planKey,
            'billing_cycle' => $request->billing_cycle,
        ]);
    }

        return $this->createXenditInvoice($user, $planKey, $request->billing_cycle, $amount);
    }

    /**
     * Dipanggil dari checkout() (invoice baru) maupun retryCheckout() (bikin ulang invoice yang expired).
     */
    protected function createXenditInvoice(User $user, string $planKey, string $billingCycle, int $amount)
    {
        // Lock user row to prevent race condition (double checkout)
        $user = User::lockForUpdate()->find($user->id);

        $tenantId = tenant()?->id ?? (isset($user->tenant_id) ? $user->tenant_id : null);
        $externalId = 'AI-' . ($tenantId ?? 'central') . '-' . $user->id . '-' . time();
        $invoiceDuration = (int) config('xendit.invoice_duration', 86400);

        // Clean up any old pending invoices for this user before creating new one
        AiInvoice::where('user_id', $user->id)
            ->where('status', 'pending')
            ->where('expired_at', '<', now())
            ->delete();

        // Only block if there's a pending invoice for the SAME plan
        // If user wants to upgrade (different plan), allow it
        $existingPendingSamePlan = AiInvoice::where('user_id', $user->id)
            ->where('status', 'pending')
            ->where('plan_key', $planKey)
            ->where('expired_at', '>', now())
            ->count();

        if ($existingPendingSamePlan > 0) {
            Log::warning('AI createXenditInvoice: found existing pending invoice for same plan, aborting', [
                'user_id' => $user->id,
                'plan_key' => $planKey,
            ]);

            return response()->json([
                'message' => 'Anda masih memiliki invoice yang belum dibayar untuk paket ini. Harap selesaikan pembayaran terlebih dahulu.',
            ], 409);
        }

        $aiInvoice = AiInvoice::create([
            'tenant_id' => $tenantId,
            'user_id' => $user->id,
            'external_id' => $externalId,
            'invoice_id' => null,
            'plan_key' => $planKey,
            'amount' => $amount,
            'status' => 'pending',
            'expired_at' => now()->addSeconds($invoiceDuration),
            'meta' => [
                'billing_cycle' => $billingCycle,
                'tenant_id' => $tenantId,
                'user_id' => $user->id,
            ],
        ]);

        $this->createCentralInvoiceCopy([
            'tenant_id' => $tenantId,
            'user_id' => $user->id,
            'external_id' => $externalId,
            'invoice_id' => null,
            'invoice_url' => null,
            'plan_key' => $planKey,
            'amount' => $amount,
            'status' => 'pending',
            'expired_at' => now()->addSeconds($invoiceDuration),
            'meta' => [
                'billing_cycle' => $billingCycle,
                'tenant_id' => $tenantId,
                'user_id' => $user->id,
                'source' => 'tenant_checkout',
            ],
        ]);

        $user->update([
            'ai_pending_plan' => $planKey,
            'ai_external_id' => $externalId,
            'ai_invoice_id' => null,
            'ai_last_invoice_status' => 'pending',
        ]);

        try {
            Configuration::setXenditKey(config('xendit.secret_key'));

            $invoice = (new InvoiceApi())->createInvoice(new CreateInvoiceRequest([
                'external_id' => $externalId,
                'amount' => $amount,
                'payer_email' => $user->email,
                'description' => 'AI add-on ' . ucfirst($planKey) . ' (' . $billingCycle . ')',
                'invoice_duration' => $invoiceDuration,
                'currency' => 'IDR',
                'metadata' => [
                    'tenant_id' => $tenantId,
                    'user_id' => $user->id,
                    'plan_key' => $planKey,
                    'billing_cycle' => $billingCycle,
                    'type' => 'ai_addon',
                ],
                'success_redirect_url' => route('guru.ai-agent.payment-success', ['external_id' => $externalId]),
                'failure_redirect_url' => route('guru.ai-agent.payment-failed', ['external_id' => $externalId]),
                'customer' => array_filter([
                    'given_names' => $user->name,
                    'email' => $user->email,
                    'mobile_number' => $user->phone ?: null,
                ]),
                'items' => [[
                    'name' => 'AI add-on ' . ucfirst($planKey) . ' (' . $billingCycle . ')',
                    'quantity' => 1,
                    'price' => $amount,
                    'category' => 'AI Add-on',
                ]],
            ]));

            $aiInvoice->update([
                'invoice_id' => $invoice->getId(),
                'invoice_url' => $invoice->getInvoiceUrl(),
            ]);

            $this->syncCentralInvoice($externalId, [
                'invoice_id' => $invoice->getId(),
                'invoice_url' => $invoice->getInvoiceUrl(),
            ]);

            $user->update([
                'ai_invoice_id' => $invoice->getId(),
                'ai_last_invoice_status' => 'pending',
            ]);

            return response()->json([
                'action' => 'pay',
                'invoice_url' => $invoice->getInvoiceUrl(),
                'external_id' => $externalId,
                'amount' => $amount,
                'plan_key' => $planKey,
                'billing_cycle' => $billingCycle,
            ]);
        } catch (XenditSdkException $e) {
            Log::error('Gagal membuat Xendit Invoice AI add-on', [
                'user_id' => $user->id,
                'plan_key' => $planKey,
                'billing_cycle' => $billingCycle,
                'message' => $e->getMessage(),
            ]);

            $aiInvoice->update(['status' => 'failed']);
            $this->syncCentralInvoice($externalId, ['status' => 'failed']);

            $user->update([
                'ai_pending_plan' => null,
                'ai_last_invoice_status' => 'failed',
            ]);

            return response()->json([
                'message' => 'Gagal membuat invoice AI. Silakan coba lagi.',
            ], 502);
        }
    }

    /**
     * Dipanggil user dari dashboard saat invoice lama sudah expired/pending basi.
     */
    public function retryCheckout(Request $request, AiInvoice $aiInvoice)
    {
        $user = Auth::user();

        abort_if($aiInvoice->user_id !== $user->id, 403);
        abort_unless(in_array($aiInvoice->status, ['pending', 'expired']), 422, 'Invoice ini tidak bisa dibuat ulang.');

        $billingCycle = $aiInvoice->meta['billing_cycle'] ?? 'monthly';
        $pricing = app(AiPlanPricingService::class)->forPlan($aiInvoice->plan_key, $billingCycle);

        return $this->createXenditInvoice($user, $aiInvoice->plan_key, $billingCycle, (int) $pricing['amount']);
    }

    public function handleWebhook(array $payload): \Illuminate\Http\JsonResponse
    {
        if (! $this->aiInvoiceTableExists()) {
            Log::warning('AI webhook ignored: ai_invoices table is not available', ['external_id' => $payload['external_id'] ?? null]);

            return response()->json(['message' => 'AI billing table missing'], 200);
        }

        $data = $payload['data'] ?? $payload;
        $externalId = $payload['external_id'] ?? $data['external_id'] ?? null;
        $status = $payload['status'] ?? $data['status'] ?? null;

        Log::info('AI Webhook received', [
            'external_id' => $externalId,
            'status' => $status,
            'payload_keys' => array_keys($payload),
        ]);

        if (! is_string($externalId) || ! str_starts_with($externalId, 'AI-')) {
            Log::info('AI Webhook: external_id not AI-prefixed, ignoring', ['external_id' => $externalId]);
            return response()->json(['message' => 'Ignored'], 200);
        }

        // Strategy 1: Try to find invoice directly (if tenant context already active or invoice in current DB)
        $aiInvoice = AiInvoice::where('external_id', $externalId)->first();

        if ($aiInvoice) {
            Log::info('AI Webhook: invoice found directly', [
                'external_id' => $externalId,
                'tenant_id' => $aiInvoice->tenant_id,
                'user_id' => $aiInvoice->user_id,
            ]);

            if ($aiInvoice->tenant_id) {
                $tenant = Tenant::find($aiInvoice->tenant_id);
                if ($tenant) {
                    return $tenant->run(function () use ($payload, $data, $externalId, $status, $aiInvoice) {
                        return $this->processTenantWebhook($payload, $data, $externalId, $status, $aiInvoice->tenant_id, $aiInvoice);
                    });
                }
            }

            return $this->processTenantWebhook($payload, $data, $externalId, $status, $aiInvoice->tenant_id, $aiInvoice);
        }

        // Strategy 2: Try to resolve tenant from payload
        $tenantId = self::resolveTenantIdFromPayload($payload);
        if ($tenantId) {
            Log::info('AI Webhook: trying to find invoice in tenant context', [
                'external_id' => $externalId,
                'tenant_id' => $tenantId,
            ]);

            $tenant = Tenant::find($tenantId);
            if ($tenant) {
                return $tenant->run(function () use ($payload, $data, $externalId, $status, $tenantId) {
                    $aiInvoice = AiInvoice::where('external_id', $externalId)->first();

                    if (! $aiInvoice) {
                        Log::warning('AI Webhook: invoice not found in tenant DB', [
                            'external_id' => $externalId,
                            'tenant_id' => $tenantId,
                        ]);

                        return response()->json(['message' => 'Invoice not found in tenant'], 200);
                    }

                    return $this->processTenantWebhook($payload, $data, $externalId, $status, $tenantId, $aiInvoice);
                });
            }
        }

        // Strategy 3: Fallback — try all tenants (brute force, last resort)
        Log::warning('AI Webhook: invoice not found, trying all tenant contexts', [
            'external_id' => $externalId,
        ]);

        $tenants = Tenant::query()->limit(50)->get();
        foreach ($tenants as $tenant) {
            $result = $tenant->run(function () use ($externalId, $payload, $data, $status) {
                $aiInvoice = AiInvoice::where('external_id', $externalId)->first();

                if ($aiInvoice) {
                    Log::info('AI Webhook: invoice found in tenant', [
                        'external_id' => $externalId,
                        'tenant_id' => $aiInvoice->tenant_id ?? 'unknown',
                    ]);

                    return $this->processTenantWebhook($payload, $data, $externalId, $status, $aiInvoice->tenant_id, $aiInvoice);
                }

                return null;
            });

            if ($result !== null) {
                return $result;
            }
        }

        // Invoice truly not found anywhere
        Log::error('AI Webhook: invoice not found in any tenant or central DB', [
            'external_id' => $externalId,
            'status' => $status,
            'payload' => $payload,
        ]);

        return response()->json(['message' => 'Invoice not found'], 200);
    }

    protected function processTenantWebhook(array $payload, array $data, ?string $externalId, mixed $status, ?string $tenantId, ?AiInvoice $aiInvoice = null): \Illuminate\Http\JsonResponse
    {
        if ($aiInvoice && $aiInvoice->getConnectionName() === 'central' && $externalId) {
            $tenantInvoice = AiInvoice::where('external_id', $externalId)->first();
            if ($tenantInvoice) {
                $aiInvoice = $tenantInvoice;
            }
        }

        // If invoice not passed, try to fetch it
        if (! $aiInvoice && $externalId) {
            $aiInvoice = AiInvoice::where('external_id', $externalId)->first();
        }

        if (! $aiInvoice) {
            Log::error('Xendit AI webhook: ai_invoice not found in tenant context', [
                'external_id' => $externalId,
                'tenant_id' => $tenantId,
                'tables_info' => [
                    'ai_invoices_exists' => Schema::hasTable('ai_invoices'),
                ],
            ]);

            return response()->json(['message' => 'Invoice not found'], 200);
        }

        // A central monitoring copy has no tenant-side User relation.
        // Always resolve the user on the active tenant connection.
        $user = User::find($aiInvoice->user_id);

        if (! $user) {
            Log::warning('Xendit AI webhook: user not found', ['external_id' => $externalId, 'tenant_id' => $tenantId]);
            return response()->json(['message' => 'User not found'], 200);
        }

        Log::info('AI Webhook: invoice found', ['user_id' => $user->id, 'external_id' => $externalId, 'tenant_id' => $tenantId]);

        $metadata = $data['metadata'] ?? $payload['metadata'] ?? [];
        $planKey = (string) ($metadata['plan_key'] ?? $aiInvoice->plan_key);
        $billingCycle = (string) ($metadata['billing_cycle'] ?? ($aiInvoice->meta['billing_cycle'] ?? 'monthly'));
        $statusUpper = strtoupper((string) $status);

        if (in_array($statusUpper, ['PAID', 'SETTLED'], true)) {
            if ($aiInvoice->status === 'paid') {
                Log::info('AI Webhook: invoice already paid, skipping duplicate processing', [
                    'external_id' => $externalId,
                    'user_id' => $user->id,
                ]);

                return response()->json(['message' => 'Invoice already processed']);
            }

            $expiresAt = $billingCycle === 'yearly' ? now()->addYear() : now()->addMonth();
            $oldPlan = $user->ai_plan ?? 'free';

            Log::info('AI Webhook: activating plan', [
                'user_id' => $user->id,
                'tenant_id' => $tenantId,
                'plan' => $planKey,
                'from_plan' => $oldPlan,
                'expires_at' => $expiresAt,
            ]);

            $aiInvoice->update([
                'status' => 'paid',
                'paid_at' => now(),
            ]);
            $this->syncCentralInvoice($externalId, [
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            $user->update([
                'ai_plan' => $planKey,
                'ai_plan_status' => 'active',
                'ai_plan_started_at' => now(),
                'ai_plan_expires_at' => $expiresAt,
                'ai_pending_plan' => null,
                'ai_last_invoice_status' => 'paid',
            ]);

            // Handle token carryover only for true upgrades to a higher plan.
            // Downgrades and free-to-paid transitions start fresh.
            $quotaService = app(AiGenerationQuotaService::class);
            if ($quotaService->shouldCarryOverTokens($oldPlan, $planKey)) {
                $quotaService->handlePlanUpgrade($user, $oldPlan, $planKey);
            } else {
                $user->update([
                    'ai_token_balance' => 0,
                    'ai_token_last_reset_at' => now(),
                ]);
            }

            Log::info('AI Webhook: plan activated successfully', ['user_id' => $user->id, 'tenant_id' => $tenantId]);

            return response()->json(['message' => 'AI plan activated']);
        }

        Log::info('AI Webhook: payment not successful', ['status' => $status, 'user_id' => $user->id, 'tenant_id' => $tenantId]);

        if ($statusUpper === 'EXPIRED') {
            Log::info('AI Webhook: invoice expired', ['external_id' => $externalId, 'user_id' => $user->id, 'tenant_id' => $tenantId]);

            $aiInvoice->update(['status' => 'expired']);
            $this->syncCentralInvoice($externalId, [
                'status' => 'expired',
                'expired_at' => now(),
            ]);

            $user->update([
                'ai_pending_plan' => null,
                'ai_last_invoice_status' => 'expired',
            ]);

            return response()->json(['message' => 'AI invoice marked expired']);
        }

        $newStatus = strtolower((string) $status ?: 'failed');

        $aiInvoice->update(['status' => $newStatus]);
        $this->syncCentralInvoice($externalId, ['status' => $newStatus]);

        $user->update([
            'ai_pending_plan' => null,
            'ai_last_invoice_status' => $newStatus,
        ]);

        return response()->json(['message' => 'AI webhook processed']);
    }
}