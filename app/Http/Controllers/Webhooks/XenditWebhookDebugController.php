<?php

namespace App\Http\Controllers\Webhooks;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class XenditWebhookDebugController
{
    /**
     * Capture raw Xendit webhook payload untuk debugging.
     * Jangan gunakan route ini di production — hanya untuk troubleshooting.
     */
    public function captureRawWebhook(Request $request)
    {
        Log::info('=== XENDIT RAW WEBHOOK CAPTURE ===', [
            'method' => $request->method(),
            'url' => $request->url(),
            'headers' => $request->headers->all(),
            'body' => $request->all(),
            'callback_token' => $request->header('x-callback-token', ''),
        ]);

        return response()->json([
            'message' => 'Payload captured',
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
