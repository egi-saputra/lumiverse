<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\GuruInsights;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GuruDashboardController extends Controller
{
    /**
     * Sama persis dengan data "Insight Pembelajaran" di dashboard Vue guru
     * (lihat App\Support\GuruInsights) — dipakai oleh dashboard Expo.
     */
    public function insights(Request $request): JsonResponse
    {
        return response()->json([
            'insights' => GuruInsights::build(),
        ]);
    }
}
