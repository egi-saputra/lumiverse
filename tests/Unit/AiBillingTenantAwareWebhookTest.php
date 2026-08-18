<?php

namespace Tests\Unit;

use App\Http\Controllers\Ai\AiBillingController;
use Tests\TestCase;

class AiBillingTenantAwareWebhookTest extends TestCase
{
    public function test_it_extracts_tenant_id_from_webhook_metadata(): void
    {
        $payload = [
            'external_id' => 'AI-42-7-1716200000',
            'metadata' => [
                'tenant_id' => '42',
                'user_id' => 7,
            ],
        ];

        $this->assertSame('42', AiBillingController::resolveTenantIdFromPayload($payload));
    }

    public function test_it_extracts_tenant_id_from_external_id_format(): void
    {
        $payload = [
            'external_id' => 'AI-42-7-1716200000',
            'status' => 'PAID',
        ];

        $this->assertSame('42', AiBillingController::resolveTenantIdFromPayload($payload));
    }
}
