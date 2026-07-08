<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\SubscriptionOrder;
use App\Models\Tenant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    // ─────────────────────────────────────────────────────────────────────────
    // Buat Snap token → return ke frontend untuk popup Midtrans
    // ─────────────────────────────────────────────────────────────────────────
    public function charge(Request $request)
    {
        $request->validate([
            'plan_key'      => ['required', 'string', 'exists:plans,key'],
            'billing_cycle' => ['required', 'in:monthly,yearly'],
        ]);

        $owner  = Auth::guard('owner')->user();
        $tenant = $owner->tenant;

        $newPlan = Plan::where('key', $request->plan_key)
            ->where('is_active', true)
            ->where('product_type', $tenant->product_type ?? 'school')
            ->firstOrFail();

        $currentPlan = $tenant->plan_id ? Plan::find($tenant->plan_id) : null;
        $calc        = $this->calculate($tenant, $currentPlan, $newPlan, $request->billing_cycle);

        // Downgrade — TERMASUK downgrade ke plan gratis — tidak ada pembayaran,
        // dijadwalkan lewat pending_plan_id. Ini penting: tenant yang masih
        // punya sisa masa aktif plan berbayar tidak langsung kehilangan sisa
        // harinya begitu pindah ke Free; plan lama tetap jalan sampai expired,
        // baru setelah itu pindah ke Free (lihat job/command yang menerapkan
        // pending_plan_id saat tenant expired).
        if ($calc['action'] === 'downgrade') {
            $tenant->pending_plan_id       = $newPlan->id;
            $tenant->pending_billing_cycle = $request->billing_cycle;
            $tenant->save();
            return response()->json(['action' => 'downgrade']);
        }

        // Supersede pending order lama sebelum bikin yang baru — cegah invoice
        // ganda menumpuk kalau owner klik tombol bayar berkali-kali.
        $this->supersedePendingOrders($tenant);

        // Kalau tenant sebelumnya sudah menjadwalkan downgrade tapi sekarang
        // pilih upgrade/subscribe baru, batalkan jadwal downgrade lama —
        // mencegah downgrade basi menimpa plan yang baru saja dibayar.
        if ($tenant->pending_plan_id) {
            $tenant->pending_plan_id       = null;
            $tenant->pending_billing_cycle = null;
            $tenant->save();
        }

        // Gunakan amount_to_pay_after_tax (sudah include PPN)
        $amount  = $calc['amount_to_pay_after_tax'];
        $orderId = 'INV-' . $tenant->id . '-' . time();

        // Total 0 → bisa karena (a) subscribe baru ke plan gratis, atau
        // (b) kredit prorata menutupi seluruh harga → langsung aktivasi tanpa Midtrans
        if ($amount === 0) {
            $order = SubscriptionOrder::create([
                'tenant_id'         => $tenant->id,
                'plan_id'           => $newPlan->id,
                'billing_cycle'     => $request->billing_cycle,
                'order_id'          => $orderId,
                'action'            => $calc['action'],
                'subtotal'          => $calc['subtotal'],
                'yearly_discount'   => $calc['yearly_discount'],
                'credit_amount'     => $calc['credit_amount'],
                'bonus_days'        => $calc['bonus_days'],
                'tax_amount'        => $calc['tax_amount'],
                'discount_percent'  => $calc['discount_percent'],
                'discount_amount'   => $calc['discount_amount'],
                'amount'            => 0,
                'status'            => 'pending',
                'expires_at'        => $calc['new_expires_at'],
            ]);
            $this->handlePaymentSuccess($order);
            return response()->json(['action' => 'activated']);
        }

        // Buat order record — amount diisi langsung, order_id konsisten dengan yang dikirim ke Midtrans
        $order = SubscriptionOrder::create([
            'tenant_id'         => $tenant->id,
            'plan_id'           => $newPlan->id,
            'billing_cycle'     => $request->billing_cycle,
            'order_id'          => $orderId,
            'action'            => $calc['action'],
            'subtotal'          => $calc['subtotal'],
            'yearly_discount'   => $calc['yearly_discount'],
            'credit_amount'     => $calc['credit_amount'],
            'bonus_days'        => $calc['bonus_days'],
            'tax_amount'        => $calc['tax_amount'],
            'discount_percent'  => $calc['discount_percent'],
            'discount_amount'   => $calc['discount_amount'],
            'amount'            => $amount,
            'status'            => 'pending',
            'expires_at'        => $calc['new_expires_at'],
        ]);

        // Setup Midtrans
        try {
            \Midtrans\Config::$serverKey    = config('midtrans.server_key');
            \Midtrans\Config::$isProduction = config('midtrans.is_production');
            \Midtrans\Config::$isSanitized  = config('midtrans.is_sanitized');
            \Midtrans\Config::$is3ds        = config('midtrans.is_3ds');

            $params = [
                'transaction_details' => [
                    'order_id'     => $orderId,
                    'gross_amount' => $amount,
                ],
                'customer_details' => [
                    'first_name' => $owner->name,
                    'email'      => $owner->email,
                    'phone'      => $owner->phone ?? '',
                ],
                'item_details' => [[
                    'id'       => $newPlan->key,
                    'price'    => $amount,
                    'quantity' => 1,
                    'name'     => "Paket {$newPlan->name} ({$request->billing_cycle})",
                ]],
            ];

            $snapToken = \Midtrans\Snap::getSnapToken($params);
            $order->update(['snap_token' => $snapToken]);

            return response()->json([
                'action'     => 'pay',
                'snap_token' => $snapToken,
                'order_id'   => $orderId,
                'amount'     => $amount,
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal membuat Snap token', [
                'order_id' => $orderId,
                'message'  => $e->getMessage(),
            ]);

            $order->update(['status' => 'failed']);

            return response()->json([
                'message' => 'Gagal menghubungkan ke payment gateway. Silakan coba lagi.',
            ], 502);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper: batalkan pending order lama tenant sebelum bikin order baru.
    // Mencegah invoice ganda kalau owner klik tombol bayar berkali-kali,
    // atau ganti pilihan plan sebelum menyelesaikan pembayaran sebelumnya.
    // ─────────────────────────────────────────────────────────────────────────
    protected function supersedePendingOrders(Tenant $tenant): void
    {
        $pendingOrders = SubscriptionOrder::where('tenant_id', $tenant->id)
            ->where('status', 'pending')
            ->get();

        if ($pendingOrders->isEmpty()) {
            return;
        }

        \Midtrans\Config::$serverKey    = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production');

        foreach ($pendingOrders as $old) {
            try {
                \Midtrans\Transaction::cancel($old->order_id);
            } catch (\Exception $e) {
                // Order lama mungkin belum pernah dibuatkan transaksi di Midtrans
                // (snap_token belum sempat dipakai) — tidak masalah, lanjut update status lokal.
                Log::info('Midtrans cancel (supersede) skipped/failed', [
                    'order_id' => $old->order_id,
                    'message'  => $e->getMessage(),
                ]);
            }
            $old->update(['status' => 'failed']);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper: aktifkan plan gratis langsung tanpa pembayaran.
    // CATATAN: tidak lagi dipanggil dari charge() — subscribe ke Free sekarang
    // lewat alur normal calculate()/handlePaymentSuccess() (amount = 0).
    // Method ini disimpan untuk kemungkinan dipakai di alur lain, misal
    // bootstrap tenant baru saat registrasi. Hapus kalau memang tidak dipakai
    // di tempat lain.
    // ─────────────────────────────────────────────────────────────────────────
    protected function activatePlan(Tenant $tenant, Plan $plan, string $cycle)
    {
        $newExpiresAt = $this->addCyclePeriod(Carbon::now(), $cycle);

        $tenant->plan_id       = $plan->id;
        $tenant->expires_at    = $newExpiresAt;
        $tenant->trial_used_at = $tenant->trial_used_at ?? now();
        $tenant->save();

        return response()->json(['action' => 'activated']);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Finish redirect dari Snap popup setelah bayar
    // ─────────────────────────────────────────────────────────────────────────
    public function finish(Request $request)
    {
        $orderId = $request->order_id;
        $tenant  = Auth::guard('owner')->user()->tenant;

        if (!$orderId) {
            return redirect()->route('owner.subscription.history');
        }

        // Wajib scoping ke tenant login — cegah orang lain intip/trigger order tenant lain
        $order = SubscriptionOrder::where('order_id', $orderId)
            ->where('tenant_id', $tenant->id)
            ->first();

        if (!$order) {
            return redirect()->route('owner.subscription.history')
                ->with('info', 'Transaksi tidak ditemukan atau sudah diproses sebelumnya.');
        }

        if ($order->status === 'pending') {
            \Midtrans\Config::$serverKey    = config('midtrans.server_key');
            \Midtrans\Config::$isProduction = config('midtrans.is_production');
            \Midtrans\Config::$isSanitized  = config('midtrans.is_sanitized');
            \Midtrans\Config::$is3ds        = config('midtrans.is_3ds');

            try {
                $status = \Midtrans\Transaction::status($orderId);

                if (in_array($status->transaction_status, ['capture', 'settlement'])) {
                    $this->handlePaymentSuccess($order);
                } elseif (in_array($status->transaction_status, ['cancel', 'deny', 'expire'])) {
                    $order->update(['status' => 'failed']);
                }
            } catch (\Exception $e) {
                Log::error('Midtrans finish error', [
                    'order_id' => $orderId,
                    'message'  => $e->getMessage(),
                ]);
            }

            $order->refresh();
        }

        if ($order->status === 'paid') {
            return redirect()->route('owner.subscription.invoice', $order->order_id)
                ->with('success', 'Pembayaran berhasil! Paket kamu sudah aktif.');
        }

        return redirect()->route('owner.subscription.history')
            ->with('warning', 'Pembayaran belum terkonfirmasi. Silakan cek status transaksi di sini.');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Webhook dari Midtrans (server-to-server, tanpa auth)
    // ─────────────────────────────────────────────────────────────────────────
    public function webhook(Request $request)
    {
        \Midtrans\Config::$serverKey    = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production');

        $payload      = $request->all();
        $orderId      = $payload['order_id'] ?? null;
        $statusCode   = $payload['status_code'] ?? null;
        $grossAmount  = $payload['gross_amount'] ?? null;
        $signatureKey = hash('sha512', $orderId . $statusCode . $grossAmount . config('midtrans.server_key'));

        if ($signatureKey !== ($payload['signature_key'] ?? '')) {
            Log::warning('Midtrans webhook: invalid signature', ['order_id' => $orderId]);
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $order = SubscriptionOrder::where('order_id', $orderId)->first();
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->update(['midtrans_payload' => $payload]);

        $transactionStatus = $payload['transaction_status'] ?? '';
        $fraudStatus       = $payload['fraud_status'] ?? '';

        if (($transactionStatus === 'capture' && $fraudStatus === 'accept') || $transactionStatus === 'settlement') {
            $this->handlePaymentSuccess($order);
        } elseif (in_array($transactionStatus, ['cancel', 'deny', 'expire'])) {
            $order->update(['status' => 'failed']);
        }

        return response()->json(['message' => 'OK']);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Preview kalkulasi harga sebelum konfirmasi
    // ─────────────────────────────────────────────────────────────────────────
    public function preview(Request $request)
    {
        $request->validate([
            'plan_key'      => ['required', 'string', 'exists:plans,key'],
            'billing_cycle' => ['required', 'in:monthly,yearly'],
        ]);

        $owner  = Auth::guard('owner')->user();
        $tenant = $owner->tenant;

        $newPlan = Plan::where('key', $request->plan_key)
            ->where('is_active', true)
            ->where('product_type', $tenant->product_type ?? 'school')
            ->firstOrFail();

        $currentPlan = $tenant->plan_id ? Plan::find($tenant->plan_id) : null;
        $calc        = $this->calculate($tenant, $currentPlan, $newPlan, $request->billing_cycle);

        return response()->json($calc);
    }

    public function orderPreview(string $order_id)
    {
        $tenant = Auth::guard('owner')->user()->tenant;

        $order = SubscriptionOrder::with('plan')
            ->where('order_id', $order_id)
            ->where('tenant_id', $tenant->id)
            ->where('status', 'pending')
            ->firstOrFail();

        $subtotalAfterDiscount = $order->subtotal - $order->discount_amount;

        return response()->json([
            'order_id'                => $order->order_id,
            'action'                  => $order->action,
            'billing_cycle'           => $order->billing_cycle,
            'plan_name'               => $order->plan?->name,
            'plan_accent'             => $order->plan?->accent_color,
            'price_per_month'         => $order->billing_cycle === 'yearly'
                                            ? $order->plan?->price_yearly
                                            : $order->plan?->price_monthly,
            'subtotal'                => $order->subtotal,
            'yearly_discount'         => $order->yearly_discount,
            'discount_percent'        => $order->discount_percent,
            'discount_amount'         => $order->discount_amount,
            'credit_amount'           => $order->credit_amount,
            'bonus_days'              => $order->bonus_days,
            'tax_percent'             => $order->plan?->tax ?? 0,
            'tax_amount'              => $order->tax_amount,
            'amount_to_pay'           => $order->amount - $order->tax_amount,
            'amount_to_pay_after_tax' => $order->amount,
            'new_expires_at'          => $order->expires_at?->toDateString(),
            'downgrade_note'          => null,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Batalkan downgrade yang sudah dijadwalkan
    // ─────────────────────────────────────────────────────────────────────────
    public function cancelDowngrade(Request $request)
    {
        $tenant = Auth::guard('owner')->user()->tenant;

        $tenant->pending_plan_id       = null;
        $tenant->pending_billing_cycle = null;
        $tenant->save();

        return back()->with('success', 'Downgrade yang dijadwalkan berhasil dibatalkan.');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper: aktifkan plan setelah pembayaran sukses (idempotent)
    // ─────────────────────────────────────────────────────────────────────────
    protected function handlePaymentSuccess(SubscriptionOrder $order): void
    {
        if ($order->status === 'paid') return;

        DB::transaction(function () use ($order) {
            $order->update([
                'status'  => 'paid',
                'paid_at' => now(),
            ]);

            $tenant  = $order->tenant;
            $newPlan = $order->plan;

            // Pakai expires_at yang sudah dihitung saat order dibuat
            // Tidak perlu calculate() ulang — hindari race condition
            $newExpiresAt = $order->expires_at
                ? Carbon::parse($order->expires_at)
                : $this->addCyclePeriod(Carbon::now(), $order->billing_cycle); // fallback

            $tenant->plan_id               = $newPlan->id;
            $tenant->expires_at            = $newExpiresAt;
            $tenant->max_users             = $newPlan->max_users; // ← sinkronkan kuota, jangan biarkan nilai plan lama nyangkut
            $tenant->pending_plan_id       = null;
            $tenant->pending_billing_cycle = null;
            $tenant->trial_used_at         = $tenant->trial_used_at ?? now();
            // Tenant bayar/upgrade lagi sebelum masa tenggang habis → batalkan
            // jadwal cleanup user berlebih (kalau ada), karena kuotanya sudah naik lagi.
            $tenant->quota_grace_until     = null;
            $tenant->save();
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper: tentukan action subscribe | upgrade | downgrade
    // ─────────────────────────────────────────────────────────────────────────
    protected function resolveAction(Tenant $tenant, ?Plan $currentPlan, Plan $newPlan): string
    {
        if (!$currentPlan || !$tenant->plan_id) {
            return 'subscribe';
        }

        return $newPlan->price_monthly >= $currentPlan->price_monthly
            ? 'upgrade'
            : 'downgrade';
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper: tanggal akhir periode berdasarkan kalender asli — bukan estimasi.
    // monthly → +1 bulan kalender (otomatis 28/29/30/31 hari sesuai bulan berjalan)
    // yearly  → +1 tahun kalender (otomatis 365/366 hari sesuai tahun kabisat)
    // ─────────────────────────────────────────────────────────────────────────
    public function addCyclePeriod(Carbon $from, string $cycle): Carbon
    {
        return match ($cycle) {
            'yearly'    => $from->copy()->addYearNoOverflow(),
            'quarterly' => $from->copy()->addMonthsNoOverflow(3),
            'semester'  => $from->copy()->addMonthsNoOverflow(6),
            default     => $from->copy()->addMonthNoOverflow(), // monthly
        };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper: jumlah hari riil dalam satu periode billing saat ini (untuk prorata)
    // ─────────────────────────────────────────────────────────────────────────
    protected function cyclePeriodDays(string $cycle): int
    {
        $now = Carbon::now();
        return $now->diffInDays($this->addCyclePeriod($now, $cycle));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper: kalkulasi prorata untuk preview & eksekusi upgrade
    // ─────────────────────────────────────────────────────────────────────────
    protected function calculate(Tenant $tenant, ?Plan $currentPlan, Plan $newPlan, string $cycle): array
    {
        $action   = $this->resolveAction($tenant, $currentPlan, $newPlan);
        $isYearly = $cycle === 'yearly';

        // ── Harga dasar ──────────────────────────────────────────────────────
        $pricePerMonth = $isYearly ? $newPlan->price_yearly : $newPlan->price_monthly;
        $subtotal      = $isYearly ? $pricePerMonth * 12 : $pricePerMonth;

        $yearlyDiscount = 0;
        if ($isYearly && $newPlan->price_monthly > 0) {
            $yearlyDiscount = ($newPlan->price_monthly * 12) - $subtotal;
        }

        // ── Diskon plan (kolom plans.discount, persentase 0-100) ────────────
        $discountPercent = $newPlan->discount ?? 0;
        $discountAmount  = $discountPercent > 0
            ? (int) round($subtotal * $discountPercent / 100)
            : 0;
        $subtotalAfterDiscount = max(0, $subtotal - $discountAmount);

        // ── Pajak plan (kolom plans.tax, persentase 0-100) ──────────────────
        $taxPercent = $newPlan->tax ?? 0;
        $taxRate    = $taxPercent / 100;

        // ── Subscribe / tidak ada plan sebelumnya ────────────────────────────
        if ($action === 'subscribe' || !$currentPlan || !$tenant->expires_at) {
            $taxAmount  = (int) round($subtotalAfterDiscount * $taxRate);
            $grandTotal = $subtotalAfterDiscount + $taxAmount;

            return [
                'action'                  => $action,
                'billing_cycle'           => $cycle,
                'price_per_month'         => $pricePerMonth,
                'months'                  => $isYearly ? 12 : 1,
                'subtotal'                => $subtotal,
                'yearly_discount'         => $yearlyDiscount,
                'discount_percent'        => $discountPercent,
                'discount_amount'         => $discountAmount,
                'credit_amount'           => 0,
                'credit_days'             => 0,
                'bonus_days'              => 0,
                'tax_rate'                => $taxRate,
                'tax_percent'             => $taxPercent,
                'tax_amount'              => $taxAmount,
                'amount_to_pay'           => $subtotalAfterDiscount,
                'amount_to_pay_after_tax' => $grandTotal,
                'new_expires_at'          => $this->addCyclePeriod(Carbon::now(), $cycle)->toDateString(),
                'downgrade_note'          => null,
            ];
        }

        // ── Downgrade ────────────────────────────────────────────────────────
        if ($action === 'downgrade') {
            $currentUserCount = $tenant->run(fn() => \App\Models\User::count());
            $newMaxUsers      = $newPlan->max_users;

            $userCountWarning = null;
            if ($newMaxUsers !== null && $currentUserCount > $newMaxUsers) {
                $userCountWarning = "Kamu saat ini memiliki {$currentUserCount} akun pengguna, melebihi batas {$newMaxUsers} akun di paket " . $newPlan->name . ". Setelah downgrade, kamu tidak bisa menambah akun baru sampai jumlah akun dikurangi di bawah {$newMaxUsers}.";
            }

            $taxAmount  = (int) round($subtotalAfterDiscount * $taxRate);
            $grandTotal = $subtotalAfterDiscount + $taxAmount;

            return [
                'action'                  => 'downgrade',
                'billing_cycle'           => $cycle,
                'price_per_month'         => $pricePerMonth,
                'months'                  => $isYearly ? 12 : 1,
                'subtotal'                => $subtotal,
                'yearly_discount'         => $yearlyDiscount,
                'discount_percent'        => $discountPercent,
                'discount_amount'         => $discountAmount,
                'credit_amount'           => 0,
                'credit_days'             => 0,
                'bonus_days'              => 0,
                'tax_rate'                => $taxRate,
                'tax_percent'             => $taxPercent,
                'tax_amount'              => $taxAmount,
                'amount_to_pay'           => $subtotalAfterDiscount,
                'amount_to_pay_after_tax' => $grandTotal,
                'new_expires_at'          => $tenant->expires_at->toDateString(),
                'downgrade_note'          => 'Downgrade akan aktif pada ' . $tenant->expires_at->format('d M Y') . '. Paket saat ini tetap berjalan hingga tanggal tersebut.',
                'user_count_warning'      => $userCountWarning,
                'current_user_count'      => $currentUserCount,
                'new_max_users'           => $newMaxUsers,
            ];
        }

        // ── Upgrade: hitung prorata ──────────────────────────────────────────
        $today     = Carbon::now();
        $expiresAt = Carbon::parse($tenant->expires_at);
        $daysLeft  = max(0, (int) $today->diffInDays($expiresAt, false));

        $lastPaidOrder = SubscriptionOrder::where('tenant_id', $tenant->id)
            ->where('status', 'paid')
            ->latest('paid_at')
            ->first();

        if (!$lastPaidOrder) {
            Log::warning('Prorata upgrade: tidak ada SubscriptionOrder paid, fallback billing_cycle monthly', [
                'tenant_id'       => $tenant->id,
                'current_plan_id' => $currentPlan->id,
            ]);
        }

        $oldCycle    = $lastPaidOrder?->billing_cycle ?? 'monthly';
        $oldDuration = $this->cyclePeriodDays($oldCycle);

        $oldPriceTotal  = ($oldCycle === 'yearly')
            ? $currentPlan->price_yearly * 12
            : $currentPlan->price_monthly;
        $oldPricePerDay = $oldDuration > 0 ? $oldPriceTotal / $oldDuration : 0;
        $creditAmount   = (int) round($daysLeft * $oldPricePerDay);

        // Diskon dulu, baru kredit — supaya kredit yang "terpakai" dihitung
        // dari harga yang sudah didiskon, bukan harga penuh.
        $amountAfterCredit = max(0, $subtotalAfterDiscount - $creditAmount);
        $taxAmount          = (int) round($amountAfterCredit * $taxRate);
        $grandTotal          = $amountAfterCredit + $taxAmount;

        $creditUsed      = min($creditAmount, $subtotalAfterDiscount);
        $creditLeftover  = max(0, $creditAmount - $subtotalAfterDiscount);
        $newPricePerDay  = $this->cyclePeriodDays($cycle) > 0
            ? $subtotal / $this->cyclePeriodDays($cycle)
            : 0;
        $bonusDays       = $newPricePerDay > 0 ? (int) floor($creditLeftover / $newPricePerDay) : 0;

        $newExpiresAt = $this->addCyclePeriod(Carbon::now(), $cycle)->addDays($bonusDays);

        return [
            'action'                  => 'upgrade',
            'billing_cycle'           => $cycle,
            'price_per_month'         => $pricePerMonth,
            'months'                  => $isYearly ? 12 : 1,
            'subtotal'                => $subtotal,
            'yearly_discount'         => $yearlyDiscount,
            'discount_percent'        => $discountPercent,
            'discount_amount'         => $discountAmount,
            'credit_amount'           => $creditUsed,
            'credit_days'             => $daysLeft,
            'bonus_days'              => $bonusDays,
            'tax_rate'                => $taxRate,
            'tax_percent'             => $taxPercent,
            'tax_amount'              => $taxAmount,
            'amount_to_pay'           => $amountAfterCredit,
            'amount_to_pay_after_tax' => $grandTotal,
            'new_expires_at'          => $newExpiresAt->toDateString(),
            'downgrade_note'          => null,
        ];
    }

    public function history()
    {
        $tenant = Auth::guard('owner')->user()->tenant;

        $orders = SubscriptionOrder::with('plan')
            ->where('tenant_id', $tenant->id)
            ->latest()
            ->paginate(10)
            ->through(fn ($order) => [
                'order_id'      => $order->order_id,
                'plan_name'     => $order->plan?->name,
                'billing_cycle' => $order->billing_cycle,
                'amount'        => $order->amount,
                'status'        => $order->status,
                'paid_at'       => $order->paid_at?->toDateTimeString(),
                'created_at'    => $order->created_at->toDateTimeString(),
            ]);

        return Inertia::render('Owner/SubscriptionHistory', [
            'orders' => $orders,
        ]);
    }

    public function invoice(string $order_id)
    {
        $owner  = Auth::guard('owner')->user();
        $tenant = $owner->tenant;

        $order = SubscriptionOrder::with(['plan', 'tenant'])
            ->where('order_id', $order_id)
            ->where('tenant_id', $tenant->id)
            ->firstOrFail();

        return Inertia::render('Owner/Invoice', [
            'order' => [
                'order_id'         => $order->order_id,
                'plan_name'        => $order->plan?->name,
                'billing_cycle'    => $order->billing_cycle,
                'action'           => $order->action,
                'subtotal'         => $order->subtotal,
                'yearly_discount'  => $order->yearly_discount,
                'discount_amount'  => $order->discount_amount,
                'discount_percent' => $order->discount_percent,
                'credit_amount'    => $order->credit_amount,
                'bonus_days'       => $order->bonus_days,
                'tax_amount'       => $order->tax_amount,
                'tax_percent'      => $order->plan?->tax ?? 0,
                'amount'           => $order->amount,
                'status'           => $order->status,
                'paid_at'          => $order->paid_at?->toDateTimeString(),
                'created_at'       => $order->created_at->toDateTimeString(),
                'expires_at'       => $order->expires_at?->toDateString(),
            ],
            'tenant' => [
                'name'    => $order->tenant->name,
                'address' => $order->tenant->address,
            ],
            'owner' => [
                'name'  => $owner->name,
                'email' => $owner->email,
                'phone' => $owner->phone,
            ],
        ]);
    }

    public function retryPayment(string $order_id)
    {
        $owner  = Auth::guard('owner')->user();
        $tenant = $owner->tenant;

        $order = SubscriptionOrder::with('plan')
            ->where('order_id', $order_id)
            ->where('tenant_id', $tenant->id)
            ->where('status', 'pending')
            ->firstOrFail();

        \Midtrans\Config::$serverKey    = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production');
        \Midtrans\Config::$isSanitized  = config('midtrans.is_sanitized');
        \Midtrans\Config::$is3ds        = config('midtrans.is_3ds');

        // Cek dulu status terbaru ke Midtrans — bisa jadi sudah settlement/expire di sisi mereka
        // tapi webhook belum sempat masuk ke kita
        try {
            $status = \Midtrans\Transaction::status($order_id);

            if (in_array($status->transaction_status, ['capture', 'settlement'])) {
                $this->handlePaymentSuccess($order);
                return response()->json(['action' => 'already_paid']);
            }

            if (in_array($status->transaction_status, ['cancel', 'deny', 'expire'])) {
                $order->update(['status' => 'failed']);
                return response()->json(['action' => 'failed'], 422);
            }
        } catch (\Exception $e) {
            Log::warning('Midtrans status check on retry gagal', [
                'order_id' => $order_id,
                'message'  => $e->getMessage(),
            ]);
            // lanjut generate token baru — anggap transaksi lama belum pernah settle
        }

        // Masih pending beneran → generate Snap token baru
        // (token lama defaultnya expired setelah 24 jam)
        $params = [
            'transaction_details' => [
                'order_id'     => $order->order_id,
                'gross_amount' => $order->amount,
            ],
            'customer_details' => [
                'first_name' => $owner->name,
                'email'      => $owner->email,
                'phone'      => $owner->phone ?? '',
            ],
            'item_details' => [[
                'id'       => $order->plan->key,
                'price'    => $order->amount,
                'quantity' => 1,
                'name'     => "Paket {$order->plan->name} ({$order->billing_cycle})",
            ]],
        ];

        try {
            $snapToken = \Midtrans\Snap::getSnapToken($params);
            $order->update(['snap_token' => $snapToken]);

            return response()->json([
                'action'     => 'pay',
                'snap_token' => $snapToken,
                'order_id'   => $order->order_id,
                'amount'     => $order->amount,
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal membuat Snap token saat retry', [
                'order_id' => $order_id,
                'message'  => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Gagal menghubungkan ke payment gateway. Silakan coba lagi.',
            ], 502);
        }
    }

    public function cancelOrder(string $order_id)
    {
        $tenant = Auth::guard('owner')->user()->tenant;

        $order = SubscriptionOrder::where('order_id', $order_id)
            ->where('tenant_id', $tenant->id)
            ->where('status', 'pending')
            ->firstOrFail();

        // Best-effort cancel ke Midtrans juga, supaya link pembayaran lama tidak bisa dipakai lagi
        \Midtrans\Config::$serverKey    = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production');

        try {
            \Midtrans\Transaction::cancel($order_id);
        } catch (\Exception $e) {
            // Order mungkin belum pernah ada transaksi di Midtrans (baru dibuat, belum bayar sama sekali)
            // — tidak masalah, tetap lanjut update status lokal
            Log::info('Midtrans cancel skipped/failed', [
                'order_id' => $order_id,
                'message'  => $e->getMessage(),
            ]);
        }

        $order->update(['status' => 'failed']);

        return back()->with('success', 'Pesanan berhasil dibatalkan.');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper: kalkulasi harga penuh untuk invoice renewal (bukan upgrade/downgrade)
    // Anchor tanggal baru dari expires_at LAMA, bukan dari hari ini — supaya
    // tidak ada hari yang "hilang" walau invoice dibuat beberapa hari sebelum expired.
    // ─────────────────────────────────────────────────────────────────────────
    public function calculateRenewal(Plan $plan, string $cycle, Carbon $anchorExpiresAt): array
    {
        $isYearly      = $cycle === 'yearly';
        $pricePerMonth = $isYearly ? $plan->price_yearly : $plan->price_monthly;
        $subtotal      = $isYearly ? $pricePerMonth * 12 : $pricePerMonth;

        $yearlyDiscount = 0;
        if ($isYearly && $plan->price_monthly > 0) {
            $yearlyDiscount = ($plan->price_monthly * 12) - $subtotal;
        }

        $discountPercent = $plan->discount ?? 0;
        $discountAmount  = $discountPercent > 0
            ? (int) round($subtotal * $discountPercent / 100)
            : 0;
        $subtotalAfterDiscount = max(0, $subtotal - $discountAmount);

        $taxPercent = $plan->tax ?? 0;
        $taxRate    = $taxPercent / 100;
        $taxAmount  = (int) round($subtotalAfterDiscount * $taxRate);
        $grandTotal = $subtotalAfterDiscount + $taxAmount;

        return [
            'action'                  => 'renewal',
            'billing_cycle'           => $cycle,
            'subtotal'                => $subtotal,
            'yearly_discount'         => $yearlyDiscount,
            'discount_percent'        => $discountPercent,
            'discount_amount'         => $discountAmount,
            'tax_percent'             => $taxPercent,
            'tax_amount'              => $taxAmount,
            'bonus_days'              => 0,
            'amount_to_pay_after_tax' => $grandTotal,
            'new_expires_at'          => $this->addCyclePeriod($anchorExpiresAt->copy(), $cycle)->toDateString(),
        ];
    }
}