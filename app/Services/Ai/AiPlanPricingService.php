<?php

namespace App\Services\Ai;

class AiPlanPricingService
{
    public function all(): array
    {
        return config('ai.plans', []);
    }

    public function forPlan(string $planKey, string $billingCycle = 'monthly'): array
    {
        $key = strtolower($planKey);
        $plan = config('ai.plans.' . $key, config('ai.plans.free'));

        $cycleKey = $billingCycle === 'yearly' ? 'yearly_price' : 'monthly_price';

        return [
            'key' => $key,
            'label' => $plan['label'] ?? ucfirst($key),
            'limit' => (int) ($plan['limit'] ?? 10),
            'amount' => (int) ($plan[$cycleKey] ?? 0),
            'billing_cycle' => $billingCycle,
        ];
    }
}
