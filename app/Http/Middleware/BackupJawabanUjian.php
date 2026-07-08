<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use App\Models\RiwayatUjian;
use App\Models\BankSoal;

class BackupJawabanUjian
{
    public function handle($request, Closure $next)
    {
        if (!Auth::check()) return $next($request);

        $userId = Auth::id();
        $soalId = $request->route('soal_id');

        if (!$soalId) return $next($request);

        $redisKey = "ujian:{$soalId}:user:{$userId}:jawaban";
        $data = Cache::get($redisKey);

        if ($data) {
            foreach ($data as $questId => $jawaban) {
                RiwayatUjian::updateOrCreate(
                    [
                        'user_id' => $userId,
                        'soal_id' => $soalId,
                        'quest_id' => $questId,
                    ],
                    [
                        'jawaban' => $jawaban,
                        'status' => 'Sedang Dikerjakan',
                    ]
                );
            }
        }

        return $next($request);
    }
}
