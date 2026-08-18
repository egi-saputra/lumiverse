<?php

namespace Tests\Unit;

use App\Services\Ai\AiGenerationQuotaService;
use PHPUnit\Framework\Attributes\Test;

class AiGenerationQuotaServiceTest extends \Tests\TestCase
{
    #[Test]
    public function it_returns_expected_monthly_generation_limits_for_each_plan(): void
    {
        $service = new AiGenerationQuotaService();

        $this->assertSame(10, $service->resolveLimitForPlan('trial'));
        $this->assertSame(10, $service->resolveLimitForPlan('free'));
        $this->assertSame(75, $service->resolveLimitForPlan('pro'));
        $this->assertSame(200, $service->resolveLimitForPlan('max'));
    }

    #[Test]
    public function it_only_carries_tokens_when_the_user_is_upgrading_to_a_higher_plan(): void
    {
        $service = new AiGenerationQuotaService();

        $this->assertTrue($service->shouldCarryOverTokens('pro', 'max'));
        $this->assertFalse($service->shouldCarryOverTokens('max', 'pro'));
        $this->assertFalse($service->shouldCarryOverTokens('free', 'pro'));
        $this->assertFalse($service->shouldCarryOverTokens('pro', 'pro'));
    }
}
