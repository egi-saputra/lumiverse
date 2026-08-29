<?php

namespace App\Services;

use App\Models\PushToken;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ExpoPushService
{
    public function sendAnnouncementPush(string $title, string $body): void
    {
        $tokens = PushToken::pluck('token');
        if ($tokens->isEmpty()) {
            return;
        }

        // Strip HTML/quill markup biar body notif rapi
        $plainBody = trim(preg_replace('/\s+/', ' ', strip_tags($body)));
        $plainBody = Str::limit($plainBody, 120);

        $messages = $tokens->map(fn (string $token) => [
            'to'        => $token,
            'sound'     => 'default', // nada dering bawaan HP penerima
            'title'     => $title ?: 'Pengumuman baru',
            'body'      => $plainBody,
            'priority'  => 'high',
            'channelId' => 'default',
        ])->values()->all();

        // Expo API max 100 pesan per request
        foreach (array_chunk($messages, 100) as $chunk) {
            Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept'       => 'application/json',
            ])->post('https://exp.host/--/api/v2/push/send', $chunk);
        }
    }
}