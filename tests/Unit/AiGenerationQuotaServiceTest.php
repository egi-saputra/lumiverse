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
        $this->assertSame(250, $service->resolveLimitForPlan('max'));
    }
}
