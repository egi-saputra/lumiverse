<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
