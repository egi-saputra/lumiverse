<?php

namespace App\Services\Xendit;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class XenditClient
{
    private string $secretKey;
    private string $baseUrl = 'https://api.xendit.co';

    private const CHANNEL_CODE_MAP = [
        'BCA'      => 'ID_BCA',
        'BNI'      => 'ID_BNI',
        'BRI'      => 'ID_BRI',
        'MANDIRI'  => 'ID_MANDIRI',
        'PERMATA'  => 'ID_PERMATA',
        'CIMB'     => 'ID_CIMB',
        'BSI'      => 'ID_BSI',
        'BTN'      => 'ID_BTN',
    ];

    public function __construct()
    {
        $this->secretKey = config('services.xendit.secret_key');

        if (! $this->secretKey) {
            throw new RuntimeException('XENDIT_SECRET_KEY belum diset di .env');
        }
    }

    private function http()
    {
        return Http::withBasicAuth($this->secretKey, '')
            ->baseUrl($this->baseUrl)
            ->acceptJson();
    }

    public function channelCodeFor(string $bankCode): string
    {
        return self::CHANNEL_CODE_MAP[$bankCode] ?? throw new RuntimeException(
            "Bank code [{$bankCode}] belum ada mapping channel_code Xendit."
        );
    }

    public function validateBankAccount(string $bankCode, string $accountNumber, string $accountHolderName): array
    {
        $response = $this->http()->post('/bank_account_data_requests', [
            'bank_account' => [
                'bank_code'      => $bankCode,
                'account_number' => $accountNumber,
            ],
            'external_id' => 'bav-' . Str::uuid(),
        ]);

        if ($response->failed()) {
            throw new RuntimeException(
                'Gagal memverifikasi rekening ke Xendit: ' . $response->body()
            );
        }

        $data = $response->json();
        $registeredName = $data['bank_account_holder_name'] ?? null;

        return [
            'is_matched'   => $registeredName && $this->namesRoughlyMatch($registeredName, $accountHolderName),
            'matched_name' => $registeredName,
            'raw'          => $data,
        ];
    }

    private function namesRoughlyMatch(string $a, string $b): bool
    {
        $normalize = fn (string $s) => Str::of($s)->lower()->squish()->toString();
        return $normalize($a) === $normalize($b);
    }

    public function createPayout(string $externalId, string $bankCode, string $accountNumber, string $accountHolderName, int $amount, string $description): array
    {
        $response = $this->http()
            ->withHeaders(['idempotency-key' => $externalId])
            ->post('/v2/payouts', [
                'reference_id'   => $externalId,
                'channel_code'   => $this->channelCodeFor($bankCode),
                'channel_properties' => [
                    'account_number'      => $accountNumber,
                    'account_holder_name' => $accountHolderName,
                ],
                'amount'      => $amount,
                'currency'    => 'IDR',
                'description' => $description,
            ]);

        if ($response->failed()) {
            throw new RuntimeException(
                'Gagal membuat payout ke Xendit: ' . $response->body()
            );
        }

        return $response->json();
    }
}