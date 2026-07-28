<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TenantAssetController extends Controller
{
    public function show(string $path): StreamedResponse
    {
        // Cegah path traversal
        abort_if(str_contains($path, '..'), 400);

        abort_unless(Storage::disk('r2')->exists($path), 404);

        return Storage::disk('r2')->response($path, null, [
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }
}