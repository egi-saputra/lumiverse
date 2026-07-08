<?php

namespace App\Concerns;

trait HasTenantFileUrl
{
    protected function tenantFileUrl(?string $path): ?string
    {
        if (!$path) return null;

        // Link eksternal (YouTube, Drive, dll) — pass-through apa adanya
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return route('tenant.storage', ['path' => $path]);
    }
}