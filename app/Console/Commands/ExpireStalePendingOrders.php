<?php

namespace App\Console\Commands;

use App\Models\SubscriptionOrder;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ExpireStalePendingOrders extends Command
{
    protected $signature = 'subscriptions:expire-pending';
    protected $description = 'Tandai order pending yang sudah lewat masa berlaku Snap token (24 jam) sebagai failed';

    public function handle(): void
    {
        $staleOrders = SubscriptionOrder::where('status', 'pending')
            ->where('created_at', '<=', Carbon::now()->subHours(24))
            ->get();

        if ($staleOrders->isEmpty()) {
            $this->info('Tidak ada order pending yang kedaluwarsa.');
            return;
        }

        \Midtrans\Config::$serverKey    = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production');

        foreach ($staleOrders as $order) {
            // Cek dulu ke Midtrans — jaga-jaga kalau ternyata baru saja dibayar
            // tapi webhook belum masuk, supaya tidak salah tandai failed
            try {
                $status = \Midtrans\Transaction::status($order->order_id);

                if (in_array($status->transaction_status, ['capture', 'settlement'])) {
                    $this->info("Order {$order->order_id} ternyata sudah paid, dilewati.");
                    continue;
                }
            } catch (\Exception $e) {
                // Order_id tidak ditemukan di Midtrans (transaksi tidak pernah dimulai) → aman untuk expire
            }

            $order->update(['status' => 'failed']);
            $this->info("Order {$order->order_id} ditandai expired/failed.");
        }
    }
}