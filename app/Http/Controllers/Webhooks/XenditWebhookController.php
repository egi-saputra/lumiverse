<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\AiInvoice;
use App\Models\SubscriptionOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Throwable;

class XenditWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $receivedToken = $request->header('x-callback-token', '');
        $expectedToken = config('xendit.callback_token', '');

        if (! $expectedToken || ! hash_equals((string) $expectedToken, (string) $receivedToken)) {
            Log::warning('Xendit webhook: invalid callback token', ['ip' => $request->ip()]);
            return response()->json(['message' => 'Invalid callback token'], 403);
        }

        $payload = $request->all();

        $orderId = $payload['external_id'] ?? null;
        $orderId = $payload['external_id'] ?? null;
        if ($orderId) {
            if (is_string($orderId) && str_starts_with($orderId, 'SMKN-AI-')) {
                $this->recordSmknusantaraAiInvoice($payload, $orderId);
                return $this->forwardToSmknusantara($payload);
            }

            if (is_string($orderId) && str_starts_with($orderId, 'AI-')) {
                $controller = app(\App\Http\Controllers\Ai\AiBillingController::class);
                return $controller->handleWebhook($payload);
            }

            $order = SubscriptionOrder::where('order_id', $orderId)->first();
            if ($order) {
                $order->update(['xendit_payload' => $payload]);

                $status = $payload['status'] ?? '';
                if (in_array($status, ['PAID', 'SETTLED'])) {
                    $subscriptionController = app(\App\Http\Controllers\Owner\SubscriptionController::class);
                    $subscriptionController->handlePaymentSuccess($order);
                } elseif ($status === 'EXPIRED') {
                    $order->update(['status' => 'failed']);
                }

                return response()->json(['message' => 'OK']);
            }
        }

        $data = $payload['data'] ?? [];
        $nextExternalId = $data['external_id'] ?? null;
        if (is_string($nextExternalId) && str_starts_with($nextExternalId, 'SMKN-AI-')) {
            $this->recordSmknusantaraAiInvoice($payload, $nextExternalId);
            return $this->forwardToSmknusantara($payload);
        }
        if (is_string($nextExternalId) && str_starts_with($nextExternalId, 'AI-')) {
            $controller = app(\App\Http\Controllers\Ai\AiBillingController::class);
            return $controller->handleWebhook($payload);
        }
        
        $referenceId = $data['reference_id'] ?? null;
        $xenditId = $data['id'] ?? null;

        if ($referenceId || $xenditId) {
            $payout = \App\Models\PayoutRequest::query()
                ->where('xendit_payout_id', $xenditId)
                ->orWhere('xendit_payout_id', $referenceId)
                ->first();

            if ($payout) {
                $controller = app(\App\Http\Controllers\Webhooks\XenditPayoutWebhookController::class);
                return $controller->handle($request);
            }
        }

        Log::info('Xendit webhook: event ignored', ['payload' => $payload]);

        return response()->json(['message' => 'OK']);
    }

    /**
     * Simpan salinan monitoring saja. Pemrosesan pembayaran tetap dilakukan
     * oleh aplikasi smknusantara melalui forwarding yang sudah berjalan.
     */
    protected function recordSmknusantaraAiInvoice(array $payload, string $externalId): void
    {
        try {
            if (! Schema::connection('central')->hasTable('ai_invoices')) {
                Log::warning('SMKN AI monitoring skipped: central ai_invoices table is missing', [
                    'external_id' => $externalId,
                ]);
                return;
            }

            $data = is_array($payload['data'] ?? null) ? $payload['data'] : $payload;
            $metadata = is_array($data['metadata'] ?? $payload['metadata'] ?? null)
                ? ($data['metadata'] ?? $payload['metadata'])
                : [];
            $status = strtolower((string) ($data['status'] ?? $payload['status'] ?? 'pending'));
            $status = in_array($status, ['pending', 'paid', 'settled', 'expired', 'failed'], true)
                ? ($status === 'settled' ? 'paid' : $status)
                : 'pending';
            $tenantId = $metadata['tenant_id'] ?? $data['tenant_id'] ?? 'smknusantara';
            $userId = $metadata['user_id'] ?? $data['user_id'] ?? null;
            $amount = $data['amount'] ?? $payload['amount'] ?? 0;
            $invoiceId = $data['id'] ?? $data['invoice_id'] ?? $payload['invoice_id'] ?? null;
            $invoiceUrl = $data['invoice_url'] ?? $payload['invoice_url'] ?? null;

            AiInvoice::on('central')->updateOrCreate(
                ['external_id' => $externalId],
                [
                    'tenant_id' => is_scalar($tenantId) ? (string) $tenantId : 'smknusantara',
                    'user_id' => is_numeric($userId) ? (int) $userId : null,
                    'invoice_id' => $invoiceId,
                    'invoice_url' => $invoiceUrl,
                    'plan_key' => (string) ($metadata['plan_key'] ?? $data['plan_key'] ?? 'unknown'),
                    'amount' => (int) $amount,
                    'status' => $status,
                    'paid_at' => $status === 'paid' ? now() : null,
                    'expired_at' => $status === 'expired' ? now() : null,
                    'meta' => [
                        'source' => 'smknusantara_webhook_forward',
                        'billing_cycle' => $metadata['billing_cycle'] ?? $data['billing_cycle'] ?? null,
                        'tenant_id' => $tenantId,
                        'user_id' => $userId,
                        'payload' => $payload,
                    ],
                ]
            );
        } catch (Throwable $e) {
            // Monitoring must never prevent the existing forwarding flow.
            Log::error('SMKN AI monitoring failed', [
                'external_id' => $externalId,
                'message' => $e->getMessage(),
            ]);
        }
    }

    protected function forwardToSmknusantara(array $payload)
    {
        $secret = config('services.xendit_forward.secret', '');

        try {
            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'x-internal-forward-secret' => $secret,
            ])->timeout(10)->post('https://smknusantara.id/api/internal/xendit-webhook-forward', $payload);

            Log::info('Xendit webhook: forwarded to smknusantara', [
                'status' => $response->status(),
                'external_id' => $payload['external_id'] ?? null,
            ]);

            return response()->json(['message' => 'Forwarded']);
        } catch (\Throwable $e) {
            Log::error('Xendit webhook: failed forwarding to smknusantara', [
                'message' => $e->getMessage(),
                'external_id' => $payload['external_id'] ?? null,
            ]);

            return response()->json(['message' => 'Forward failed but acknowledged'], 200);
            // tetap return 200 ke Xendit supaya tidak retry terus-menerus;
            // failure sudah tercatat di log untuk investigasi manual
        }
    }
}
