<?php

// app/Console/Commands/BackfillInvoiceUrls.php
namespace App\Console\Commands;

use App\Models\AiInvoice;
use Illuminate\Console\Command;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;

class BackfillInvoiceUrls extends Command
{
    protected $signature = 'ai-invoices:backfill-urls';
    protected $description = 'Isi invoice_url yang masih kosong untuk invoice pending lama';

    public function handle(): void
    {
        Configuration::setXenditKey(config('xendit.secret_key'));
        $api = new InvoiceApi();

        $invoices = AiInvoice::where('status', 'pending')
            ->whereNull('invoice_url')
            ->whereNotNull('invoice_id')
            ->get();

        $this->info("Ditemukan {$invoices->count()} invoice untuk di-backfill.");

        foreach ($invoices as $inv) {
            try {
                $xenditInvoice = $api->getInvoiceById($inv->invoice_id);

                $inv->update([
                    'invoice_url' => $xenditInvoice->getInvoiceUrl(),
                    'expired_at' => $inv->expired_at ?? $xenditInvoice->getExpiryDate(),
                ]);

                $this->line("✓ {$inv->external_id} → {$xenditInvoice->getInvoiceUrl()}");
            } catch (\Throwable $e) {
                $this->error("✗ Gagal {$inv->external_id}: {$e->getMessage()}");
            }
        }
    }
}