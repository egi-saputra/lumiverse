<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\Plan;
use App\Models\ReferralReward;
use App\Models\SubscriptionOrder;
use App\Models\Tenant;
use App\Models\TenantReferral;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\XenditSdkException;

class SubscriptionController extends Controller
{
    /**
     * Diskon referral (referral.php config) cuma berlaku untuk N kali
     * checkout pertama tenant yang terkait kode partner — setelah itu
     * harga normal, walaupun atribusi partner tetap permanen (reward
     * partner tetap jalan terus, cuma diskon tenant-nya yang berhenti).
     */
    public const REFERRAL_DISCOUNT_MAX_USES = 3;

    // ─────────────────────────────────────────────────────────────────────────
    // Buat Xendit Invoice → return invoice_url ke frontend untuk REDIRECT
    // (bukan popup token seperti Snap — frontend harus window.location = invoice_url)
    // ─────────────────────────────────────────────────────────────────────────
    public function charge(Request $request)
    {
        $request->validate([
            'plan_key'      => ['required', 'string', 'exists:plans,key'],
            'billing_cycle' => ['required', 'in:monthly,yearly'],
            'referral_code' => ['nullable', 'string', 'max:20'],
        ]);

        $owner  = Auth::guard('owner')->user();
        $tenant = $owner->tenant;

        $newPlan = Plan::where('key', $request->plan_key)
            ->where('is_active', true)
            ->firstOrFail();

        $currentPlan = $tenant->plan_id ? Plan::find($tenant->plan_id) : null;
        $referrer = $this->resolveReferrer($tenant, $request->referral_code);
        $applyReferralDiscount = $referrer !== null && $this->referralDiscountUsageCount($tenant) < self::REFERRAL_DISCOUNT_MAX_USES;
        $calc = $this->calculate($tenant, $currentPlan, $newPlan, $request->billing_cycle, $applyReferralDiscount);

        // Downgrade — sama seperti sebelumnya, tidak ada pembayaran, dijadwalkan
        // lewat pending_plan_id. Tidak ada yang berubah di jalur ini.
        if ($calc['action'] === 'downgrade') {
            $tenant->pending_plan_id       = $newPlan->id;
            $tenant->pending_billing_cycle = $request->billing_cycle;
            $tenant->save();
            return response()->json(['action' => 'downgrade']);
        }

        $existingPending = SubscriptionOrder::where('tenant_id', $tenant->id)
            ->where('status', 'pending')
            ->where('plan_id', $newPlan->id)
            ->where('billing_cycle', $request->billing_cycle)
            ->where('referrer_partner_id', $referrer?->id)
            ->latest()
            ->first();

        if ($existingPending && $existingPending->xendit_invoice_id) {
            Configuration::setXenditKey(config('xendit.secret_key'));
            try {
                $invoice = (new InvoiceApi())->getInvoiceById($existingPending->xendit_invoice_id);
                if ($invoice->getStatus() === 'PENDING') {
                    return response()->json([
                        'action'      => 'pay',
                        'invoice_url' => $invoice->getInvoiceUrl(),
                        'order_id'    => $existingPending->order_id,
                        'amount'      => $existingPending->amount,
                    ]);
                }
            } catch (XenditSdkException $e) {
                Log::info('Cek invoice pending gagal, lanjut buat baru', [
                    'order_id' => $existingPending->order_id,
                    'message'  => $e->getMessage(),
                ]);
            }
        }

        // Supersede pending order lama sebelum bikin yang baru
        $this->supersedePendingOrders($tenant);

        if ($tenant->pending_plan_id) {
            $tenant->pending_plan_id       = null;
            $tenant->pending_billing_cycle = null;
            $tenant->save();
        }

        $amount  = $calc['amount_to_pay_after_tax'];
        $orderId = 'INV-' . $tenant->id . '-' . time();

        // Total 0 → langsung aktivasi tanpa Xendit, sama seperti alur lama
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
                'referral_discount_amount' => $calc['referral_discount_amount'] ?? 0,
                'referrer_partner_id'      => $referrer?->id,
                'amount'            => 0,
                'status'            => 'pending',
                'expires_at'        => $calc['new_expires_at'],
            ]);
            $this->handlePaymentSuccess($order);
            return response()->json(['action' => 'activated']);
        }

        // Buat order record dulu — order_id konsisten dengan external_id yang dikirim ke Xendit
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
            'referral_discount_amount' => $calc['referral_discount_amount'] ?? 0,
            'referrer_partner_id'      => $referrer?->id,
            'amount'            => $amount,
            'status'            => 'pending',
            'expires_at'        => $calc['new_expires_at'],
        ]);

        // Setup Xendit & buat Invoice
        // ─── charge() ───────────────────────────────────────────────
        try {
            Configuration::setXenditKey(config('xendit.secret_key'));
            $invoiceApi = new InvoiceApi();

            $createInvoiceRequest = new CreateInvoiceRequest([
                'external_id'          => $orderId,
                'amount'                => $amount,
                'payer_email'           => $owner->email,
                'description'           => "Paket {$newPlan->name} ({$request->billing_cycle})",
                'invoice_duration'      => config('xendit.invoice_duration'),
                'currency'              => 'IDR',
                'success_redirect_url'  => route('owner.subscription.finish', ['order_id' => $orderId]),
                'failure_redirect_url'  => route('owner.subscription.finish', ['order_id' => $orderId]),
                'customer' => array_filter([
                    'given_names'   => $owner->name,
                    'email'         => $owner->email,
                    'mobile_number' => $owner->phone ?: null, // jangan kirim string kosong
                ]),
                'items' => [[
                    'name'     => "Paket {$newPlan->name} ({$request->billing_cycle})",
                    'quantity' => 1,
                    'price'    => $amount,
                    'category' => 'Subscription',
                ]],
            ]);

            $invoice = $invoiceApi->createInvoice($createInvoiceRequest);

            $order->update(['xendit_invoice_id' => $invoice->getId()]);

            return response()->json([
                'action'      => 'pay',
                'invoice_url' => $invoice->getInvoiceUrl(),
                'order_id'    => $orderId,
                'amount'      => $amount,
            ]);
        } catch (XenditSdkException $e) {
            Log::error('Gagal membuat Xendit Invoice', [
                'order_id' => $orderId,
                'message'  => $e->getMessage(),
                'error'    => $e->getFullError(),
            ]);

            $order->update(['status' => 'failed']);

            return response()->json([
                'message' => 'Gagal menghubungkan ke payment gateway. Silakan coba lagi.',
            ], 502);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper: batalkan (expire) pending order lama tenant sebelum bikin order baru.
    // ─────────────────────────────────────────────────────────────────────────
    // ─── supersedePendingOrders() ───────────────────────────────
    protected function supersedePendingOrders(Tenant $tenant): void
    {
        $pendingOrders = SubscriptionOrder::where('tenant_id', $tenant->id)
            ->where('status', 'pending')
            ->get();

        if ($pendingOrders->isEmpty()) return;

        Configuration::setXenditKey(config('xendit.secret_key'));
        $invoiceApi = new InvoiceApi();

        foreach ($pendingOrders as $old) {
            if ($old->xendit_invoice_id) {
                try {
                    $invoiceApi->expireInvoice($old->xendit_invoice_id);
                } catch (XenditSdkException $e) {
                    Log::info('Xendit expire (supersede) skipped/failed', [
                        'order_id' => $old->order_id,
                        'message'  => $e->getMessage(),
                    ]);
                }
            }
            $old->update(['status' => 'failed']);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper: aktifkan plan gratis langsung tanpa pembayaran. (tidak berubah)
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
    // Redirect balik dari halaman hosted invoice Xendit (success/failure_redirect_url)
    // Xendit TIDAK mengirim status transaksi via query string seperti Snap redirect —
    // yang dikirim cuma balik ke URL ini, order_id tetap kita append manual saat create.
    // Status final tetap ditentukan oleh webhook; ini cuma fallback kalau webhook telat.
    // ─────────────────────────────────────────────────────────────────────────
    public function finish(Request $request)
    {
        $orderId = $request->order_id;
        $tenant  = Auth::guard('owner')->user()->tenant;

        if (!$orderId) {
            return redirect()->route('owner.subscription.history');
        }

        $order = SubscriptionOrder::where('order_id', $orderId)
            ->where('tenant_id', $tenant->id)
            ->first();

        if (!$order) {
            return redirect()->route('owner.subscription.history')
                ->with('info', 'Transaksi tidak ditemukan atau sudah diproses sebelumnya.');
        }

        // ─── finish() — bagian cek status invoice ───────────────────
        if ($order->status === 'pending' && $order->xendit_invoice_id) {
            Configuration::setXenditKey(config('xendit.secret_key'));

            try {
                $invoice = (new InvoiceApi())->getInvoiceById($order->xendit_invoice_id);
                $status  = $invoice->getStatus(); // enum, biasanya bisa langsung compare string

                if (in_array($status, ['PAID', 'SETTLED'])) {
                    $this->handlePaymentSuccess($order);
                } elseif ($status === 'EXPIRED') {
                    $order->update(['status' => 'failed']);
                }
            } catch (XenditSdkException $e) {
                Log::error('Xendit finish error', [
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
    // Webhook (callback) dari Xendit — server-to-server, verifikasi via header
    // X-CALLBACK-TOKEN (statis dari dashboard), BUKAN hash seperti Midtrans.
    // ─────────────────────────────────────────────────────────────────────────
    public function webhook(Request $request)
    {
        $receivedToken = $request->header('x-callback-token', '');
        $expectedToken = config('xendit.callback_token', '');

        if (!$expectedToken || !hash_equals($expectedToken, $receivedToken)) {
            Log::warning('Xendit webhook: invalid callback token');
            return response()->json(['message' => 'Invalid callback token'], 403);
        }

        $payload = $request->all();
        $orderId = $payload['external_id'] ?? null;

        $order = SubscriptionOrder::where('order_id', $orderId)->first();
        if (!$order) {
            Log::info('Xendit webhook: order tidak ditemukan (kemungkinan notifikasi test)', ['order_id' => $orderId]);
            return response()->json(['message' => 'OK']);
        }

        $order->update(['xendit_payload' => $payload]);

        $status = $payload['status'] ?? '';

        if (in_array($status, ['PAID', 'SETTLED'])) {
            $this->handlePaymentSuccess($order);
        } elseif ($status === 'EXPIRED') {
            $order->update(['status' => 'failed']);
        }

        return response()->json(['message' => 'OK']);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Preview kalkulasi harga sebelum konfirmasi (tidak berubah — tidak menyentuh gateway)
    // ─────────────────────────────────────────────────────────────────────────
    public function preview(Request $request)
    {
        $request->validate([
            'plan_key'      => ['required', 'string', 'exists:plans,key'],
            'billing_cycle' => ['required', 'in:monthly,yearly'],
            'referral_code' => ['nullable', 'string', 'max:20'],
        ]);

        $owner  = Auth::guard('owner')->user();
        $tenant = $owner->tenant;

        $newPlan = Plan::where('key', $request->plan_key)
            ->where('is_active', true)
            ->firstOrFail();

        $currentPlan = $tenant->plan_id ? Plan::find($tenant->plan_id) : null;
        $referrer    = $this->resolveReferrer($tenant, $request->referral_code);

        $usageCount            = $this->referralDiscountUsageCount($tenant);
        $applyReferralDiscount = $referrer !== null && $usageCount < self::REFERRAL_DISCOUNT_MAX_USES;

        $calc = $this->calculate($tenant, $currentPlan, $newPlan, $request->billing_cycle, $applyReferralDiscount);

        // Beri tahu frontend apakah tenant sudah permanen ter-link (biar field
        // input disembunyikan), apakah kode yang diinput tadi valid, dan
        // sisa berapa kali lagi diskon referral bisa dipakai.
        $calc['referral_locked']             = (bool) $tenant->referral;
        $calc['referral_code_valid']         = $referrer !== null;
        $calc['referral_discount_remaining'] = max(0, self::REFERRAL_DISCOUNT_MAX_USES - $usageCount);

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
            'order_id'                 => $order->order_id,
            'action'                   => $order->action,
            'billing_cycle'            => $order->billing_cycle,
            'plan_name'                => $order->plan?->name,
            'plan_accent'              => $order->plan?->accent_color,
            'price_per_month'          => $order->billing_cycle === 'yearly'
                                            ? $order->plan?->price_yearly
                                            : $order->plan?->price_monthly,
            'subtotal'                 => $order->subtotal,
            'yearly_discount'          => $order->yearly_discount,
            'discount_percent'         => $order->discount_percent,
            'discount_amount'          => $order->discount_amount,
            'referral_discount_amount' => $order->referral_discount_amount,
            'credit_amount'            => $order->credit_amount,
            'bonus_days'               => $order->bonus_days,
            'tax_percent'              => $order->plan?->tax ?? 0,
            'tax_amount'               => $order->tax_amount,
            'amount_to_pay'            => $order->amount - $order->tax_amount,
            'amount_to_pay_after_tax'  => $order->amount,
            'new_expires_at'           => $order->expires_at?->toDateString(),
            'downgrade_note'           => null,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Batalkan downgrade yang sudah dijadwalkan (tidak berubah)
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
    // Helper: aktifkan plan setelah pembayaran sukses (idempotent) — tidak berubah,
    // sudah gateway-agnostic dari awal.
    // ─────────────────────────────────────────────────────────────────────────
    public function handlePaymentSuccess(SubscriptionOrder $order): void
    {
        DB::transaction(function () use ($order) {
            // Kunci baris ini — kalau ada request lain (webhook vs redirect finish())
            // yang masuk bersamaan, request kedua akan MENUNGGU sampai transaction
            // pertama commit, lalu baca status yang sudah 'paid' dan langsung return.
            $locked = SubscriptionOrder::whereKey($order->getKey())
                ->lockForUpdate()
                ->first();

            if (!$locked || $locked->status === 'paid') {
                return;
            }

            $locked->update([
                'status'  => 'paid',
                'paid_at' => now(),
            ]);

            // Kunci juga baris tenant — mencegah dua order (mis. upgrade cepat 2x)
            // saling timpa plan_id/expires_at kalau diproses bersamaan.
            $tenant  = Tenant::whereKey($locked->tenant_id)->lockForUpdate()->first();
            $newPlan = $locked->plan;

            $newExpiresAt = $locked->expires_at
                ? Carbon::parse($locked->expires_at)
                : $this->addCyclePeriod(Carbon::now(), $locked->billing_cycle);

            $tenant->plan_id               = $newPlan->id;
            $tenant->expires_at            = $newExpiresAt;
            $tenant->max_users             = $newPlan->max_users;
            $tenant->pending_plan_id       = null;
            $tenant->pending_billing_cycle = null;
            $tenant->trial_used_at         = $tenant->trial_used_at ?? now();
            $tenant->quota_grace_until     = null;

            $tenant->save();

            if ($locked->referrer_partner_id && $locked->amount > 0) {
                $this->processReferralReward($locked);
            }
        });
    }

    /**
     * Kunci atribusi permanen tenant -> partner (tenant_referrals), kalau
     * belum ada. Dipanggil hanya saat order BERHASIL dibayar — order yang
     * gagal/dibatalkan tidak pernah mengunci atribusi kemana pun, jadi
     * tenant yang masukin kode tapi gak jadi bayar masih bisa pakai kode
     * partner lain nanti.
     */
    protected function lockReferralAttribution(SubscriptionOrder $order): ?TenantReferral
    {
        if (!$order->referrer_partner_id) {
            return null;
        }

        return TenantReferral::firstOrCreate(
            ['tenant_id' => $order->tenant_id],
            [
                'partner_id'         => $order->referrer_partner_id,
                'referral_code_used' => $order->referrerPartner?->referral_code,
                'attributed_at'      => now(),
            ]
        );
    }

    /**
     * Kreditkan reward ke saldo Partner (referrer), dicatat di
     * referral_rewards biar ada audit trail per transaksi. Persen reward
     * ditentukan oleh Partner::rewardPercentForReferral() — tier berdasar
     * urutan tenant yang di-lock partner ini, TIDAK dari Plan.
     */
    protected function processReferralReward(SubscriptionOrder $order): void
    {
        $referral = $this->lockReferralAttribution($order);
        if (!$referral) return;

        $partner = $referral->partner;
        if (!$partner) return;

        $rewardPercent = $partner->rewardPercentForReferral($referral);
        if ($rewardPercent <= 0) return;

        // Basis reward = amount SEBELUM pajak (bukan order->amount yang
        // sudah termasuk PPN) — supaya referrer tidak ikut dapat komisi
        // dari komponen pajak yang disetor ke negara, bukan revenue kita.
        $preTaxAmount = $order->amount - $order->tax_amount;
        $rewardAmount = (int) round($preTaxAmount * $rewardPercent / 100);
        if ($rewardAmount <= 0) return;

        try {
            DB::transaction(function () use ($order, $partner, $rewardPercent, $rewardAmount) {
                // create() akan gagal dengan unique violation kalau order_id
                // sudah pernah dipakai — ini row-level guarantee terakhir,
                // independen dari lock di handlePaymentSuccess().
                ReferralReward::create([
                    'order_id'            => $order->id,
                    'referrer_partner_id' => $partner->id,
                    'reward_percent'      => $rewardPercent,
                    'reward_amount'       => $rewardAmount,
                    'credited_at'         => now(),
                ]);

                $partner->addReferralCredit($rewardAmount);
            });
        } catch (\Illuminate\Database\QueryException $e) {
            // Kode 23505 = unique_violation (Postgres), 1062 = duplicate entry (MySQL)
            if (!in_array($e->getCode(), ['23505', '23000'], true)) {
                throw $e;
            }

            Log::info('Referral reward sudah pernah dibuat untuk order ini, dilewati', [
                'order_id' => $order->order_id,
            ]);
        }
    }

    protected function resolveAction(Tenant $tenant, ?Plan $currentPlan, Plan $newPlan): string
    {
        if (!$currentPlan || !$tenant->plan_id) {
            return 'subscribe';
        }

        return $newPlan->price_monthly >= $currentPlan->price_monthly
            ? 'upgrade'
            : 'downgrade';
    }

    public function addCyclePeriod(Carbon $from, string $cycle): Carbon
    {
        return match ($cycle) {
            'yearly'    => $from->copy()->addYearNoOverflow(),
            'quarterly' => $from->copy()->addMonthsNoOverflow(3),
            'semester'  => $from->copy()->addMonthsNoOverflow(6),
            default     => $from->copy()->addMonthNoOverflow(),
        };
    }

    protected function cyclePeriodDays(string $cycle): int
    {
        $now = Carbon::now();
        return $now->diffInDays($this->addCyclePeriod($now, $cycle));
    }

    protected function calculate(Tenant $tenant, ?Plan $currentPlan, Plan $newPlan, string $cycle, bool $hasReferral = false): array
    {
        $action   = $this->resolveAction($tenant, $currentPlan, $newPlan);
        $isYearly = $cycle === 'yearly';

        $pricePerMonth = $isYearly ? $newPlan->price_yearly : $newPlan->price_monthly;
        $subtotal      = $isYearly ? $pricePerMonth * 12 : $pricePerMonth;

        $yearlyDiscount = 0;
        if ($isYearly && $newPlan->price_monthly > 0) {
            $yearlyDiscount = ($newPlan->price_monthly * 12) - $subtotal;
        }

        $discountPercent = $newPlan->discount ?? 0;
        $discountAmount  = $discountPercent > 0
            ? (int) round($subtotal * $discountPercent / 100)
            : 0;
        $subtotalAfterDiscount = max(0, $subtotal - $discountAmount);

        $taxPercent = $newPlan->tax ?? 0;
        $taxRate    = $taxPercent / 100;

        if ($action === 'subscribe' || !$currentPlan || !$tenant->expires_at) {
            // Referral dihitung dari basis SEBELUM pajak, supaya PPN yang
            // tercatat merefleksikan harga final yang benar-benar dibayar.
            $referral   = $this->calculateReferralDiscount($subtotalAfterDiscount, $hasReferral);
            $taxAmount  = (int) round($referral['base_after_referral'] * $taxRate);
            $grandTotal = $referral['base_after_referral'] + $taxAmount;

            return [
                'action'                    => $action,
                'billing_cycle'             => $cycle,
                'price_per_month'           => $pricePerMonth,
                'months'                    => $isYearly ? 12 : 1,
                'subtotal'                  => $subtotal,
                'yearly_discount'           => $yearlyDiscount,
                'discount_percent'          => $discountPercent,
                'discount_amount'           => $discountAmount,
                'referral_discount_type'    => $referral['referral_discount_type'],
                'referral_discount_percent' => $referral['referral_discount_percent'],
                'referral_discount_amount'  => $referral['referral_discount_amount'],
                'credit_amount'             => 0,
                'credit_days'               => 0,
                'bonus_days'                => 0,
                'tax_rate'                  => $taxRate,
                'tax_percent'               => $taxPercent,
                'tax_amount'                => $taxAmount,
                'amount_to_pay'             => $referral['base_after_referral'],
                'amount_to_pay_after_tax'   => $grandTotal,
                'new_expires_at'            => $this->addCyclePeriod(Carbon::now(), $cycle)->toDateString(),
                'downgrade_note'            => null,
            ];
        }

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

        $amountAfterCredit = max(0, $subtotalAfterDiscount - $creditAmount);

        // Urutan stacking diskon tetap: plan discount → kredit prorata →
        // referral. Cuma titik hitung pajaknya dipindah ke paling akhir,
        // setelah SEMUA potongan (termasuk referral) selesai.
        $referral   = $this->calculateReferralDiscount($amountAfterCredit, $hasReferral);
        $taxAmount  = (int) round($referral['base_after_referral'] * $taxRate);
        $grandTotal = $referral['base_after_referral'] + $taxAmount;

        $creditUsed      = min($creditAmount, $subtotalAfterDiscount);
        $creditLeftover  = max(0, $creditAmount - $subtotalAfterDiscount);
        $newPricePerDay  = $this->cyclePeriodDays($cycle) > 0
            ? $subtotal / $this->cyclePeriodDays($cycle)
            : 0;
        $bonusDays       = $newPricePerDay > 0 ? (int) floor($creditLeftover / $newPricePerDay) : 0;

        $newExpiresAt = $this->addCyclePeriod(Carbon::now(), $cycle)->addDays($bonusDays);

        return [
            'action'                    => 'upgrade',
            'billing_cycle'             => $cycle,
            'price_per_month'           => $pricePerMonth,
            'months'                    => $isYearly ? 12 : 1,
            'subtotal'                  => $subtotal,
            'yearly_discount'           => $yearlyDiscount,
            'discount_percent'          => $discountPercent,
            'discount_amount'           => $discountAmount,
            'referral_discount_type'    => $referral['referral_discount_type'],
            'referral_discount_percent' => $referral['referral_discount_percent'],
            'referral_discount_amount'  => $referral['referral_discount_amount'],
            'credit_amount'             => $creditUsed,
            'credit_days'               => $daysLeft,
            'bonus_days'                => $bonusDays,
            'tax_rate'                  => $taxRate,
            'tax_percent'               => $taxPercent,
            'tax_amount'                => $taxAmount,
            'amount_to_pay'             => $referral['base_after_referral'],
            'amount_to_pay_after_tax'   => $grandTotal,
            'new_expires_at'            => $newExpiresAt->toDateString(),
            'downgrade_note'            => null,
        ];
    }

    /**
     * Hitung potongan referral dari basis SEBELUM pajak. Dipanggil di dalam
     * calculate()/calculateRenewal() sebelum taxAmount dihitung — bukan di
     * akhir seperti versi lama — supaya PPN yang dicatat merefleksikan
     * harga final yang benar-benar dibayar setelah diskon referral,
     * bukan basis yang belum dipotong referral.
     */
    public function calculateReferralDiscount(int $baseAmount, bool $hasReferral): array
    {
        if (!$hasReferral) {
            return [
                'referral_discount_type'    => null,
                'referral_discount_percent' => 0,
                'referral_discount_amount'  => 0,
                'base_after_referral'       => $baseAmount,
            ];
        }

        $type = config('referral.discount_type', 'percent');

        if ($type === 'fixed') {
            $percent = null;
            // Cap supaya tidak melebihi basis — mencegah amount_to_pay jadi negatif
            // kalau suatu saat nominal fixed diset lebih besar dari harga plan murah.
            $amount = min((int) config('referral.discount_amount', 0), $baseAmount);
        } else {
            $percent = (int) config('referral.discount_percent', 10);
            $amount  = $percent > 0 ? (int) round($baseAmount * $percent / 100) : 0;
        }

        return [
            'referral_discount_type'    => $type,
            'referral_discount_percent' => $percent, // null kalau mode fixed
            'referral_discount_amount'  => $amount,
            'base_after_referral'       => max(0, $baseAmount - $amount),
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
                'order_id'                 => $order->order_id,
                'plan_name'                => $order->plan?->name,
                'billing_cycle'            => $order->billing_cycle,
                'action'                   => $order->action,
                'subtotal'                 => $order->subtotal,
                'yearly_discount'          => $order->yearly_discount,
                'discount_amount'          => $order->discount_amount,
                'discount_percent'         => $order->discount_percent,
                'referral_discount_amount' => $order->referral_discount_amount,   // ← tambahkan
                'credit_amount'            => $order->credit_amount,
                'bonus_days'               => $order->bonus_days,
                'tax_amount'               => $order->tax_amount,
                'tax_percent'              => $order->plan?->tax ?? 0,
                'amount'                   => $order->amount,
                'status'                   => $order->status,
                'paid_at'                  => $order->paid_at?->toDateTimeString(),
                'created_at'               => $order->created_at->toDateTimeString(),
                'expires_at'               => $order->expires_at?->toDateString(),
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

    // ─────────────────────────────────────────────────────────────────────────
    // Retry: cek status invoice lama; kalau masih ACTIVE, kembalikan invoice_url
    // yang sama. Kalau sudah EXPIRED, buat invoice baru (invoice Xendit tidak
    // bisa "diperpanjang" seperti Snap token — beda dari retryPayment lama).
    // ─────────────────────────────────────────────────────────────────────────
    public function retryPayment(string $order_id)
    {
        $owner  = Auth::guard('owner')->user();
        $tenant = $owner->tenant;

        $order = SubscriptionOrder::with('plan')
            ->where('order_id', $order_id)
            ->where('tenant_id', $tenant->id)
            ->where('status', 'pending')
            ->firstOrFail();

        Configuration::setXenditKey(config('xendit.secret_key'));
        $invoiceApi = new InvoiceApi();

        if ($order->xendit_invoice_id) {
            try {
                $invoice = $invoiceApi->getInvoiceById($order->xendit_invoice_id);
                $status  = $invoice->getStatus();

                if (in_array($status, ['PAID', 'SETTLED'])) {
                    $this->handlePaymentSuccess($order);
                    return response()->json(['action' => 'already_paid']);
                }

                if ($status === 'PENDING') {
                    return response()->json([
                        'action'      => 'pay',
                        'invoice_url' => $invoice->getInvoiceUrl(),
                        'order_id'    => $order->order_id,
                        'amount'      => $order->amount,
                    ]);
                }

                if ($status === 'EXPIRED') {
                    $order->update(['status' => 'failed']);
                }
            } catch (XenditSdkException $e) {
                Log::warning('Xendit status check on retry gagal', [
                    'order_id' => $order_id,
                    'message'  => $e->getMessage(),
                ]);
            }
        }

        // Invoice lama sudah expired/gagal dicek → buat invoice baru dengan order_id BARU
        // (external_id di Xendit harus unik, tidak bisa reuse yang sama)
        $newOrderId = 'INV-' . $tenant->id . '-' . time();

        try {
            $createInvoiceRequest = new CreateInvoiceRequest([
                'external_id'          => $newOrderId,
                'amount'                => $order->amount,
                'payer_email'           => $owner->email,
                'description'           => "Paket {$order->plan->name} ({$order->billing_cycle})",
                'invoice_duration'      => config('xendit.invoice_duration'),
                'currency'              => 'IDR',
                'success_redirect_url'  => route('owner.subscription.finish', ['order_id' => $newOrderId]),
                'failure_redirect_url'  => route('owner.subscription.finish', ['order_id' => $newOrderId]),
                'customer' => array_filter([
                    'given_names'   => $owner->name,
                    'email'         => $owner->email,
                    'mobile_number' => $owner->phone ?: null,
                ]),
                'items' => [[
                    'name'     => "Paket {$order->plan->name} ({$order->billing_cycle})",
                    'quantity' => 1,
                    'price'    => $order->amount,
                    'category' => 'Subscription',
                ]],
            ]);

            $invoice = $invoiceApi->createInvoice($createInvoiceRequest);

            $order->update(['status' => 'failed']); // tutup order lama

            $newOrder = $order->replicate();
            $newOrder->order_id          = $newOrderId;
            $newOrder->status            = 'pending';
            $newOrder->xendit_invoice_id = $invoice->getId();
            $newOrder->save();

            return response()->json([
                'action'      => 'pay',
                'invoice_url' => $invoice->getInvoiceUrl(),
                'order_id'    => $newOrderId,
                'amount'      => $order->amount,
            ]);
        } catch (XenditSdkException $e) {
            Log::error('Gagal membuat Invoice Xendit saat retry', [
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

        // ─── cancelOrder() ───────────────────────────────────────────
        Configuration::setXenditKey(config('xendit.secret_key'));

        if ($order->xendit_invoice_id) {
            try {
                (new InvoiceApi())->expireInvoice($order->xendit_invoice_id);
            } catch (XenditSdkException $e) {
                Log::info('Xendit expire skipped/failed', [
                    'order_id' => $order_id,
                    'message'  => $e->getMessage(),
                ]);
            }
        }

        $order->update(['status' => 'failed']);

        return back()->with('success', 'Pesanan berhasil dibatalkan.');
    }

    public function calculateRenewal(Plan $plan, string $cycle, Carbon $anchorExpiresAt, bool $hasReferral = false): array
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

        // Konsisten dengan calculate(): referral dipotong dari basis
        // sebelum pajak, supaya recurring reward & PPN sinkron dengan
        // alur subscribe/upgrade.
        $referral   = $this->calculateReferralDiscount($subtotalAfterDiscount, $hasReferral);
        $taxAmount  = (int) round($referral['base_after_referral'] * $taxRate);
        $grandTotal = $referral['base_after_referral'] + $taxAmount;

        return [
            'action'                    => 'renewal',
            'billing_cycle'             => $cycle,
            'subtotal'                  => $subtotal,
            'yearly_discount'           => $yearlyDiscount,
            'discount_percent'          => $discountPercent,
            'discount_amount'           => $discountAmount,
            'referral_discount_type'    => $referral['referral_discount_type'],
            'referral_discount_percent' => $referral['referral_discount_percent'],
            'referral_discount_amount'  => $referral['referral_discount_amount'],
            'tax_percent'               => $taxPercent,
            'tax_amount'                => $taxAmount,
            'bonus_days'                => 0,
            'amount_to_pay'             => $referral['base_after_referral'],
            'amount_to_pay_after_tax'   => $grandTotal,
            'new_expires_at'            => $this->addCyclePeriod($anchorExpiresAt->copy(), $cycle)->toDateString(),
        ];
    }

    /**
     * Cari partner referrer yang berlaku untuk order ini.
     * Kalau tenant SUDAH punya atribusi permanen (tenant_referrals), selalu
     * pakai partner itu — input kode baru diabaikan. Kalau BELUM, coba
     * resolve dari kode yang diinput saat checkout. Atribusi itu sendiri
     * baru DIKUNCI kalau order-nya berhasil dibayar (lihat
     * lockReferralAttribution()), jadi di sini cuma resolve kandidat.
     */
    public function resolveReferrer(Tenant $tenant, ?string $referralCodeInput): ?Partner
    {
        $existing = $tenant->referral; // TenantReferral, kalau sudah pernah terkunci

        if ($existing) {
            return $existing->partner;
        }

        if (empty($referralCodeInput)) {
            return null;
        }

        return Partner::where('referral_code', strtoupper(trim($referralCodeInput)))
            ->where('is_active', true)
            ->first();
    }

    /**
     * Berapa kali tenant ini SUDAH memakai diskon referral pada order yang
     * berhasil dibayar. Dipakai untuk batasi diskon checkout referral cuma
     * berlaku REFERRAL_DISCOUNT_MAX_USES kali pertama, sisanya harga normal.
     */
    public function referralDiscountUsageCount(Tenant $tenant): int
    {
        return SubscriptionOrder::where('tenant_id', $tenant->id)
            ->where('status', 'paid')
            ->where('referral_discount_amount', '>', 0)
            ->count();
    }
}