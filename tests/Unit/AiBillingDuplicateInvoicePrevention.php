<?php

namespace Tests\Unit;

use App\Models\AiInvoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiBillingDuplicateInvoicePrevention extends TestCase
{
    use RefreshDatabase;

    public function test_checkout_returns_existing_pending_invoice_instead_of_creating_duplicate()
    {
        $user = User::factory()->create([
            'ai_plan' => 'free',
            'ai_plan_status' => 'inactive',
        ]);

        // Simulate first checkout - invoice already exists
        $existingInvoice = AiInvoice::create([
            'tenant_id' => 1,
            'user_id' => $user->id,
            'external_id' => 'AI-1-' . $user->id . '-1234567890',
            'invoice_id' => 'xendit_id_123',
            'invoice_url' => 'https://checkout.xendit.co/invoice_url',
            'plan_key' => 'pro',
            'amount' => 19499,
            'status' => 'pending',
            'expired_at' => now()->addHours(23),
            'meta' => [
                'billing_cycle' => 'monthly',
                'tenant_id' => 1,
            ],
        ]);

        $this->actingAs($user);

        // User tries checkout again (same plan or different)
        $response = $this->postJson(route('guru.ai-billing.checkout'), [
            'plan_key' => 'pro',
            'billing_cycle' => 'monthly',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'action' => 'pay',
            'invoice_url' => 'https://checkout.xendit.co/invoice_url',
            'is_existing' => true,
        ]);

        // Verify no new invoice created
        $this->assertCount(1, AiInvoice::where('user_id', $user->id)->get());
        $this->assertEquals($existingInvoice->id, AiInvoice::where('user_id', $user->id)->first()->id);
    }

    public function test_checkout_creates_new_invoice_if_no_pending_exists()
    {
        $user = User::factory()->create([
            'ai_plan' => 'free',
            'ai_plan_status' => 'inactive',
        ]);

        $this->actingAs($user);

        // Mock the Xendit API response
        $this->mockXenditInvoice();

        // First checkout - should create new invoice
        $response = $this->postJson(route('guru.ai-billing.checkout'), [
            'plan_key' => 'pro',
            'billing_cycle' => 'monthly',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'action' => 'pay',
        ]);

        // Verify invoice created
        $this->assertCount(1, AiInvoice::where('user_id', $user->id)->get());
    }

    public function test_checkout_blocks_if_active_pending_invoice_exists()
    {
        $user = User::factory()->create([
            'ai_plan' => 'free',
            'ai_plan_status' => 'inactive',
        ]);

        // Existing pending invoice
        AiInvoice::create([
            'tenant_id' => 1,
            'user_id' => $user->id,
            'external_id' => 'AI-1-' . $user->id . '-1234567890',
            'invoice_id' => 'xendit_id_123',
            'invoice_url' => 'https://checkout.xendit.co/invoice_url',
            'plan_key' => 'pro',
            'amount' => 19499,
            'status' => 'pending',
            'expired_at' => now()->addHours(23),
            'meta' => [
                'billing_cycle' => 'monthly',
                'tenant_id' => 1,
            ],
        ]);

        $this->actingAs($user);

        // Second checkout attempt - should return existing invoice
        $response = $this->postJson(route('guru.ai-billing.checkout'), [
            'plan_key' => 'pro',
            'billing_cycle' => 'monthly',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'action' => 'pay',
            'is_existing' => true,
        ]);

        // Still only 1 invoice
        $this->assertCount(1, AiInvoice::where('user_id', $user->id)->get());
    }

    public function test_expired_invoice_does_not_prevent_new_checkout()
    {
        $user = User::factory()->create([
            'ai_plan' => 'free',
            'ai_plan_status' => 'inactive',
        ]);

        // Old expired invoice
        AiInvoice::create([
            'tenant_id' => 1,
            'user_id' => $user->id,
            'external_id' => 'AI-1-' . $user->id . '-1234567890',
            'invoice_id' => 'xendit_id_123',
            'invoice_url' => 'https://checkout.xendit.co/invoice_url',
            'plan_key' => 'pro',
            'amount' => 19499,
            'status' => 'pending',
            'expired_at' => now()->subMinutes(5), // Already expired
            'meta' => [
                'billing_cycle' => 'monthly',
                'tenant_id' => 1,
            ],
        ]);

        $this->actingAs($user);

        $this->mockXenditInvoice();

        // New checkout - should create new invoice (old one expired)
        $response = $this->postJson(route('guru.ai-billing.checkout'), [
            'plan_key' => 'pro',
            'billing_cycle' => 'monthly',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'action' => 'pay',
        ]);

        // Expired invoice deleted, new one created
        $invoices = AiInvoice::where('user_id', $user->id)->get();
        $this->assertCount(1, $invoices);
        $this->assertGreaterThan(now()->subMinutes(1), $invoices->first()->expired_at);
    }

    private function mockXenditInvoice()
    {
        // This would mock the Xendit API
        // Implementation depends on your testing setup
        // For now, just placeholder
    }
}
