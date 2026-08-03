<?php

namespace App\Console\Commands;

use App\Models\SubscriptionOrder;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;
use Xendit\XenditSdkException;

class ExpireStalePendingOrders extends Command
{
    protected $signature = 'subscriptions:expire-pending';
    protected $description = 'Tandai order pending yang sudah lewat masa berlaku invoice Xendit sebagai failed';

    public function handle(\App\Http\Controllers\Owner\SubscriptionController $subscriptionController): void
    {
        $staleOrders = SubscriptionOrder::where('status', 'pending')
            ->where('created_at', '<=', Carbon::now()->subHours(24))
            ->get();

        if ($staleOrders->isEmpty()) {
            $this->info('Tidak ada order pending yang kedaluwarsa.');
            return;
        }

        Configuration::setXenditKey(config('xendit.secret_key'));
        $invoiceApi = new InvoiceApi();

        foreach ($staleOrders as $order) {
            // Order tanpa xendit_invoice_id sama sekali (mis. gagal dibuat di awal,
            // sudah ditandai 'failed' oleh command generate) — aman langsung expire.
            if (!$order->xendit_invoice_id) {
                $order->update(['status' => 'failed']);
                $this->info("Order {$order->order_id} (tanpa invoice) ditandai failed.");
                continue;
            }

            try {
                $invoice = $invoiceApi->getInvoiceById($order->xendit_invoice_id);
                $status  = $invoice->getStatus();

                if (in_array($status, ['PAID', 'SETTLED'])) {
                    // Jaga-jaga webhook belum sempat masuk — aktifkan lewat jalur yang sama.
                    $subscriptionController->handlePaymentSuccess($order);
                    $this->info("Order {$order->order_id} ternyata sudah paid, diaktifkan.");
                    continue;
                }

                if ($status === 'EXPIRED') {
                    $order->update(['status' => 'failed']);
                    $this->info("Order {$order->order_id} sudah expired di Xendit, ditandai failed.");
                    continue;
                }

                // Masih PENDING di Xendit tapi sudah lewat 24 jam di sisi kita →
                // expire paksa supaya konsisten dengan invoice_duration kita.
                $invoiceApi->expireInvoice($order->xendit_invoice_id);
                $order->update(['status' => 'failed']);
                $this->info("Order {$order->order_id} dipaksa expire (masih pending > 24 jam).");
            } catch (XenditSdkException $e) {
                Log::warning('Xendit expire-pending: gagal cek/expire invoice', [
                    'order_id' => $order->order_id,
                    'message'  => $e->getMessage(),
                ]);
                // Tidak langsung ditandai failed kalau API-nya sendiri error —
                // biar dicoba lagi di run berikutnya, daripada salah tandai
                // order yang sebenarnya masih valid.
            }
        }
    }
}