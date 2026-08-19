<?php

namespace App\Http\Controllers\Ai;

use App\Http\Controllers\Controller;
use App\Services\Ai\AiGenerationQuotaService;
use Illuminate\Support\Facades\Auth;
use App\Models\AiInvoice;
use Inertia\Inertia;

class AiAgentController extends Controller
{
    protected AiGenerationQuotaService $quotaService;

    public function __construct(AiGenerationQuotaService $quotaService)
    {
        $this->quotaService = $quotaService;
    }

    public function dashboard()
    {
        $user = Auth::user();

        $currentUsage = $this->quotaService->usageForCurrentMonth($user->id);
        $currentLimit = $this->quotaService->resolveLimitForPlan($user->ai_plan ?? 'free');
        $remaining = $this->quotaService->remainingForCurrentMonth(null, $user->id);
        $nextResetAt = $this->quotaService->nextResetAt($user);
        $planKey = $user->aiPlanKey();
        $resetFrequency = $this->quotaService->resetFrequency($planKey);

        $planInfo = [
            'current_plan' => $user->ai_plan ?? 'free',
            'status' => $user->ai_plan_status ?? 'inactive',
            'started_at' => $user->ai_plan_started_at,
            'expires_at' => $user->ai_plan_expires_at,
            'limit' => $currentLimit,
            'used' => $currentUsage,
            'remaining' => $remaining,
            'percentage_used' => $currentLimit > 0 ? min(100, round(($currentUsage / $currentLimit) * 100)) : 0,
            'reset_at' => $nextResetAt->toIso8601String(),
            'reset_frequency' => $resetFrequency,
        ];

        // Get all pricing plans for upgrade section
        $allPlans = [];
        foreach (['free', 'pro', 'max'] as $key) {
            $allPlans[] = [
                'key' => $key,
                'label' => config('ai.plans.' . $key . '.label', ucfirst($key)),
                'limit' => config('ai.plans.' . $key . '.limit', 10),
                'monthly_price' => config('ai.plans.' . $key . '.monthly_price', 0),
                'yearly_price' => config('ai.plans.' . $key . '.yearly_price', 0),
            ];
        }

        // Get payment history (will be from webhook records in the future)
        // For now, we'll show a simple payment history based on user's plan changes
        // $paymentHistory = [];
        // if ($user->ai_plan_started_at) {
        //     $paymentHistory[] = [
        //         'id' => $user->ai_external_id,
        //         'plan' => $user->ai_plan,
        //         'amount' => $user->ai_plan === 'pro' ? 49999 : ($user->ai_plan === 'max' ? 139999 : 0),
        //         'status' => $user->ai_last_invoice_status ?? 'pending',
        //         'created_at' => $user->ai_plan_started_at,
        //         'invoice_id' => $user->ai_invoice_id,
        //     ];
        // }
        $paymentHistory = AiInvoice::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Guru/AiAgent/Dashboard', [
            'planInfo' => $planInfo,
            'allPlans' => $allPlans,
            'paymentHistory' => $paymentHistory,
        ]);
    }

    public function invoice($externalId)
    {
        $user = Auth::user();

        $invoice = AiInvoice::where('external_id', $externalId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $invoiceData = [
            'invoice_number' => 'INV-' . $invoice->created_at->format('dmY') . '-' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
            'external_id' => $invoice->external_id,
            'user_name' => $user->name,
            'user_email' => $user->email,
            'user_phone' => $user->phone,
            'plan' => $invoice->plan_key,
            'plan_label' => config('ai.plans.' . $invoice->plan_key . '.label', ucfirst($invoice->plan_key)),
            'billing_cycle' => $invoice->meta['billing_cycle'] ?? 'monthly',
            'amount' => $invoice->amount,
            'status' => $invoice->status,
            'created_at' => $invoice->created_at,
            'paid_at' => $invoice->paid_at,
            'expires_at' => $invoice->expired_at,
            'description' => 'AI Agent Add-on Subscription',
        ];

        return Inertia::render('Guru/AiAgent/Invoice', [
            'invoice' => $invoiceData,
        ]);
    }

    public function paymentSuccess($external_id)
    {
        $user = Auth::user();

        $invoice = AiInvoice::where('external_id', $external_id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        sleep(1); // nunggu webhook

        return redirect()->route('guru.ai-agent.invoice', ['externalId' => $external_id]);
    }

    public function paymentFailed($external_id)
    {
        $user = Auth::user();

        $invoice = AiInvoice::where('external_id', $external_id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        return redirect()
            ->route('guru.ai-billing.pricing')
            ->with('error', 'Pembayaran gagal. Silakan coba lagi atau hubungi support.');
    }
}
