<?php

namespace App\Console\Commands;

use App\Models\AiInvoice;
use Illuminate\Console\Command;

class ExpireStaleAiInvoices extends Command
{
    protected $signature = 'ai-invoices:expire-stale';
    protected $description = 'Tandai ai_invoices pending yang sudah lewat expired_at sebagai expired';

    public function handle(): void
    {
        $count = AiInvoice::where('status', 'pending')
            ->whereNotNull('expired_at')
            ->where('expired_at', '<', now())
            ->update(['status' => 'expired']);

        $this->info("Marked {$count} invoice(s) as expired.");
    }
}