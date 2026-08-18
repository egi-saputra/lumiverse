<?php

namespace Tests\Unit;

use App\Services\Ai\AiPlanPricingService;
use PHPUnit\Framework\Attributes\Test;

class AiPlanPricingServiceTest extends \Tests\TestCase
{
    #[Test]
    public function it_returns_expected_pricing_for_each_ai_plan_and_cycle(): void
    {
        $service = new AiPlanPricingService();

        $this->assertSame(49999, $service->forPlan('pro', 'monthly')['amount']);
        $this->assertSame(479999, $service->forPlan('pro', 'yearly')['amount']);
        $this->assertSame(139999, $service->forPlan('max', 'monthly')['amount']);
        $this->assertSame(1399999, $service->forPlan('max', 'yearly')['amount']);
        $this->assertSame(10, $service->forPlan('free', 'monthly')['limit']);
    }
}
