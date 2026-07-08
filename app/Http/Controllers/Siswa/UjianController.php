<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Soal;
use App\Models\Mapel;
use App\Models\BankSoal;
use App\Models\RiwayatUjian;
use App\Models\UjianSiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UjianController extends Controller
{
    // ─── Cache key helpers ────────────────────────────────────────────────────

    private function ttl(int $menitUjian): \Carbon\Carbon
    {
        return now()->addMinutes($menitUjian + 15);
    }

    private function keyTimer(int $soalId, int $userId): string
    {
        return "ujian:{$soalId}:u:{$userId}:end";
    }

    private function keyUrutan(int $soalId, int $userId): string
    {
        return "ujian:{$soalId}:u:{$userId}:urutan";
    }

    private function keyJawaban(int $soalId, int $userId): string
    {
        return "ujian:{$soalId}:u:{$userId}:jawaban";
    }

    private function keyAnswered(int $soalId, int $userId): string
    {
        return "ujian:{$soalId}:u:{$userId}:answered";
    }

    /** Atomic lock key — mencegah double submit */
    private function keySubmitLock(int $soalId, int $userId): string
    {
        return "ujian:{$soalId}:u:{$userId}:submitting";
    }

    // ─── Token page ───────────────────────────────────────────────────────────

    public function tokenPage()
    {
        return Inertia::render('Siswa/Ujian/Token', ['title' => 'Exam Entrance']);
    }

    // ─── Validasi token ───────────────────────────────────────────────────────

    public function validateToken(Request $request)
    {
        $request->validate(['token' => 'required|string']);

        $userId     = Auth::id();
        $inputToken = $request->token;

        // ── Cek token pribadi siswa (dari tabel ujian_siswa) ───────────────
        // Path ini aktif saat siswa re-entry setelah keluar/terkunci.
        $ujianSiswa = UjianSiswa::where('user_id', $userId)
            ->where('token', $inputToken)
            ->first();

        if ($ujianSiswa) {
            session(['token_validated' => $inputToken]);

            if ($ujianSiswa->status === 'Selesai') {
                return back()->with('error', 'Ujian sudah pernah diselesaikan.');
            }

            if (in_array($ujianSiswa->status, ['Sedang Dikerjakan', 'Terkunci'])) {
                return redirect()->route('siswa.ujian.kerjakan', $ujianSiswa->soal_id);
            }

            return redirect()->route('siswa.ujian.preview', $ujianSiswa->soal_id);
        }

        // ── Cek token soal (dari tabel soal) ──────────────────────────────
        // Path ini hanya boleh digunakan sekali — saat siswa pertama kali masuk.
        $soal = Cache::remember("soal:token:{$inputToken}", 30, function () use ($inputToken) {
            return Soal::where('token', $inputToken)->first();
        });

        if (!$soal) return back()->with('error', 'Token tidak valid');
        if ($soal->status !== 'Aktif') return back()->with('error', 'Ujian belum dimulai!');

        try {
            $ujianSiswa = DB::transaction(function () use ($userId, $soal) {
                $existing = UjianSiswa::where('soal_id', $soal->id)
                    ->where('user_id', $userId)
                    ->lockForUpdate()
                    ->first();

                if ($existing) return $existing;

                return UjianSiswa::create([
                    'user_id'     => $userId,
                    'soal_id'     => $soal->id,
                    'waktu_mulai' => now(),
                    'status'      => 'Sedang Dikerjakan',
                    'token'       => str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT),
                ]);
            });
        } catch (\Exception $e) {
            Log::error('validateToken error', ['error' => $e->getMessage()]);
            return back()->with('error', 'Terjadi kesalahan, silakan coba lagi.');
        }

        // ── PENJAGAAN RE-ENTRY ─────────────────────────────────────────────
        // Jika record sudah ada sebelumnya (wasRecentlyCreated = false),
        // berarti siswa mencoba masuk kembali menggunakan token soal —
        // padahal setelah pernah keluar/terkunci wajib memakai token pribadi.
        if (!$ujianSiswa->wasRecentlyCreated) {
            if ($ujianSiswa->status === 'Selesai') {
                return back()->with('error', 'Anda sudah mengikuti ujian ini.');
            }
            return back()->with('error', 'Ujian sudah pernah dimulai. Gunakan token pribadi Anda untuk melanjutkan.');
        }

        if ($ujianSiswa->status === 'Selesai') {
            return back()->with('error', 'Anda sudah mengikuti ujian ini.');
        }

        session(['token_validated' => $ujianSiswa->token]);

        return redirect()->route('siswa.ujian.preview', $soal->id);
    }

    // ─── Preview ──────────────────────────────────────────────────────────────

    public function preview($soal_id)
    {
        $soal = Cache::remember("soal:{$soal_id}:detail", 60, function () use ($soal_id) {
            return Soal::with('mapel')->findOrFail($soal_id);
        });

        $jumlahSoal = Cache::remember("soal:{$soal_id}:jumlah", 60, function () use ($soal_id) {
            return BankSoal::where('soal_id', $soal_id)->count();
        });

        return Inertia::render('Siswa/Ujian/Preview', [
            'soal'       => $soal,
            'jumlahSoal' => $jumlahSoal,
            'mapel'      => Mapel::select('id', 'mapel')->orderBy('mapel')->get(),
        ]);
    }

    // ─── Kerjakan ─────────────────────────────────────────────────────────────

    public function kerjakan(Request $request, $soal_id)
    {
        $userId = Auth::id();

        $tokenValidated = session('token_validated');
        if (!$tokenValidated) {
            return redirect()->route('siswa.ujian.token')
                ->withErrors('Token belum valid, silahkan masukkan token.');
        }

        $soal = Cache::remember("soal:{$soal_id}:base", 60, function () use ($soal_id) {
            return Soal::findOrFail($soal_id);
        });

        $ujianSiswa = UjianSiswa::where('user_id', $userId)
            ->where('soal_id', $soal_id)
            ->first();

        if (!$ujianSiswa) {
            $ujianSiswa = UjianSiswa::create([
                'user_id'     => $userId,
                'soal_id'     => $soal_id,
                'waktu_mulai' => now(),
                'status'      => 'Sedang Dikerjakan',
                'token'       => $tokenValidated,
            ]);
        }

        if ($ujianSiswa->status === 'Selesai') {
            return redirect()->route('siswa.ujian.token')->withErrors('Ujian sudah selesai.');
        }

        // ── Urutan soal (generate sekali, cache + DB) ──────────────────────
        $urutanKey = $this->keyUrutan((int) $soal_id, $userId);

        $urutan = Cache::remember($urutanKey, $this->ttl($soal->waktu), function () use ($ujianSiswa, $soal_id, $soal) {
            $fresh    = UjianSiswa::find($ujianSiswa->id);
            $existing = $fresh->soal_ids;
            if (is_string($existing)) $existing = json_decode($existing, true);
            if (!empty($existing) && is_array($existing)) return $existing;

            return DB::transaction(function () use ($fresh, $soal_id, $soal) {
                $locked   = UjianSiswa::where('id', $fresh->id)->lockForUpdate()->first();
                $existing = $locked->soal_ids;
                if (is_string($existing)) $existing = json_decode($existing, true);
                if (!empty($existing) && is_array($existing)) return $existing;

                $questIds = BankSoal::where('soal_id', $soal_id)->pluck('id')->toArray();
                if (empty($questIds)) throw new \RuntimeException("Tidak ada soal untuk soal_id={$soal_id}");
                if ($soal->tipe_soal === 'Acak') shuffle($questIds);

                $locked->update(['soal_ids' => $questIds]);
                return $questIds;
            });
        });

        if (empty($urutan) || !is_array($urutan)) {
            Log::error('Urutan soal kosong', ['soal_id' => $soal_id, 'user_id' => $userId]);
            abort(500, 'Urutan soal tidak valid. Hubungi administrator.');
        }

        if ($ujianSiswa->status !== 'Sedang Dikerjakan') {
            $ujianSiswa->update(['status' => 'Sedang Dikerjakan']);
            $ujianSiswa->status = 'Sedang Dikerjakan';
        }

        try {
            $ujianSiswa->loadMissing('user.siswa.kelas');
        } catch (\Exception $e) {
            Log::warning('loadMissing gagal', ['error' => $e->getMessage()]);
        }

        // ── Timer ──────────────────────────────────────────────────────────
        $timerKey = $this->keyTimer($soal_id, $userId);
        if (!Cache::has($timerKey)) {
            Cache::put($timerKey, now()->addMinutes($soal->waktu), $this->ttl($soal->waktu));
        }

        $sisaDetik = max(0, now()->diffInSeconds(Cache::get($timerKey), false));
        if ($sisaDetik <= 0) {
            $ujianSiswa->update(['status' => 'Selesai']);
            return redirect()->route('siswa.ujian.finish');
        }

        // ── Soal aktif ────────────────────────────────────────────────────
        $total   = count($urutan);
        $no      = max(1, min((int) ($request->no ?? 1), $total));
        $quest   = BankSoal::findOrFail($urutan[$no - 1]);
        $riwayat = RiwayatUjian::where([
            'user_id'  => $userId,
            'soal_id'  => $soal_id,
            'quest_id' => $quest->id,
        ])->first();

        $answeredKey = $this->keyAnswered($soal_id, $userId);
        $answered    = Cache::remember($answeredKey, 30, function () use ($userId, $soal_id) {
            return RiwayatUjian::where('user_id', $userId)
                ->where('soal_id', $soal_id)
                ->whereNotNull('jawaban')
                ->pluck('quest_id')
                ->toArray();
        });

        return Inertia::render('Siswa/Ujian/Kerjakan', [
            'soal'       => $soal,
            'totalSoal'  => $total,
            'no'         => $no,
            'quest'      => $quest,
            'riwayat'    => $riwayat,
            'ujianSiswa' => $ujianSiswa,
            'durasi'     => $soal->waktu,
            'nomorList'  => $urutan,
            'sisaDetik'  => $sisaDetik,
            'answered'   => $answered,
        ]);
    }

    // ─── Autosave ─────────────────────────────────────────────────────────────

    public function autosave(Request $request)
    {
        $request->validate([
            'soal_id'  => 'required|integer',
            'quest_id' => 'required|integer',
            'jawaban'  => 'nullable|string',
            'tipe_soal' => 'nullable|string', // ← tambah ini
        ]);

        $userId  = Auth::id();
        $soalId  = (int) $request->soal_id;
        $questId = (int) $request->quest_id;
        $jawaban = $request->jawaban;
        $isEssay = $request->tipe_soal === 'Essay'; // ← baca dari request, tidak perlu query

        if (!Cache::has($this->keyTimer($soalId, $userId))) {
            return response()->json(['expired' => true], 419);
        }

        $ujianSiswa = UjianSiswa::where('user_id', $userId)
            ->where('soal_id', $soalId)
            ->value('id');

        $jawabanKey  = $this->keyJawaban($soalId, $userId);
        $jawabanData = Cache::get($jawabanKey, []);
        $isChanged   = !array_key_exists($questId, $jawabanData) || $jawabanData[$questId] !== $jawaban;

        $jawabanData[$questId] = $jawaban;
        Cache::put($jawabanKey, $jawabanData, now()->addMinutes(180));

        if ($isChanged) {
            $nowStr = now()->toDateTimeString();
            RiwayatUjian::upsert(
                [[
                    'user_id'        => $userId,
                    'soal_id'        => $soalId,
                    'ujian_siswa_id' => $ujianSiswa,
                    'quest_id'       => $questId,
                    'jawaban'        => $jawaban,
                    'benar'          => $isEssay ? null : 0,
                    'nilai'          => $isEssay ? null : 0,
                    'status'         => 'Sedang Dikerjakan',
                    'created_at'     => $nowStr,
                    'updated_at'     => $nowStr,
                ]],
                ['user_id', 'soal_id', 'quest_id'],
                ['ujian_siswa_id', 'jawaban', 'benar', 'nilai', 'status', 'updated_at']
            );

            Cache::forget($this->keyAnswered($soalId, $userId));
        }

        return response()->noContent();
    }

    // ─── Submit Ujian ─────────────────────────────────────────────────────────

    public function submitUjian(Request $request, $soal_id)
    {
        $userId  = Auth::id();
        $soalId  = (int) $soal_id;
        $lockKey = $this->keySubmitLock($soalId, $userId);

        // ── Atomic double-submit guard ─────────────────────────────────────
        // Jika submit datang dua kali (timer habis + klik manual / double click),
        // yang kedua langsung return 409 tanpa proses apapun.
        if (Cache::has($lockKey)) {
            return response()->json(['message' => 'Sedang diproses'], 409);
        }
        Cache::put($lockKey, true, 30); // lock 30 detik

        try {
            $ujian = UjianSiswa::where(['user_id' => $userId, 'soal_id' => $soalId])->first();

            if (!$ujian) {
                return response()->json(['message' => 'Data ujian tidak ditemukan'], 404);
            }

            // Idempotent: jika sudah selesai, return sukses tanpa proses ulang
            if ($ujian->status === 'Selesai') {
                return response()->noContent();
            }

            // Ambil jawaban dari cache, fallback ke DB
            $jawabanKey  = $this->keyJawaban($soalId, $userId);
            $jawabanData = Cache::get($jawabanKey, []);

            if (empty($jawabanData)) {
                $jawabanData = RiwayatUjian::where('user_id', $userId)
                    ->where('soal_id', $soalId)
                    ->whereNotNull('jawaban')
                    ->pluck('jawaban', 'quest_id')
                    ->toArray();
            }

            // Ambil semua soal sekaligus — 1 query
            $questMap = BankSoal::whereIn('id', array_keys($jawabanData))
                ->get()
                ->keyBy('id');

            $map  = ['A' => 'opsi_a', 'B' => 'opsi_b', 'C' => 'opsi_c', 'D' => 'opsi_d', 'E' => 'opsi_e'];
            $rows = [];
            $now  = now()->toDateTimeString();

            foreach ($jawabanData as $questId => $jawaban) {
                $quest = $questMap[$questId] ?? null;
                if (!$quest) continue;

                $row = [
                    'user_id'        => $userId,
                    'soal_id'        => $soalId,
                    'ujian_siswa_id' => $ujian->id,
                    'quest_id'       => (int) $questId,
                    'jawaban'        => $jawaban,
                    'status'         => 'Selesai',
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ];

                if ($quest->tipe_soal === 'Essay') {
                    $row['benar'] = null;
                    $row['nilai'] = null;
                } else {
                    $benar        = (($map[$jawaban] ?? null) === $quest->jawaban_benar);
                    $row['benar'] = $benar ? 1 : 0;
                    $row['nilai'] = $benar ? $quest->nilai : 0;
                }

                $rows[] = $row;
            }

            // Bulk upsert — 1 query untuk semua jawaban
            if (!empty($rows)) {
                RiwayatUjian::upsert(
                    $rows,
                    ['user_id', 'soal_id', 'quest_id'],
                    ['ujian_siswa_id', 'jawaban', 'benar', 'nilai', 'status', 'updated_at']
                );
            }

            $ujian->update(['status' => 'Selesai', 'waktu_selesai' => now()]);
            $this->forgetUserCache($soalId, $userId);

        } finally {
            Cache::forget($lockKey);
        }

        return response()->noContent();
    }

    // ─── Refresh Token ────────────────────────────────────────────────────────

    public function refreshToken(Request $request, $soal_id)
    {
        UjianSiswa::where(['user_id' => Auth::id(), 'soal_id' => $soal_id])
            ->update(['token' => str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT)]);

        return response()->json(['success' => true]);
    }

    // ─── Finish ───────────────────────────────────────────────────────────────

    public function finish()
    {
        $ujianSelesai = UjianSiswa::where('user_id', Auth::id())
            ->where('status', 'Selesai')
            ->latest('waktu_selesai')
            ->first();

        return Inertia::render('Siswa/Ujian/Finish', ['ujianSiswa' => $ujianSelesai]);
    }

    // ─── Force Exit ───────────────────────────────────────────────────────────

    public function forceExit(Request $request, $soal_id)
    {
        UjianSiswa::where(['user_id' => Auth::id(), 'soal_id' => $soal_id])
            ->update(['status' => 'Terkunci']);

        session()->forget('token_validated');

        return response()->json(['status' => 'locked']);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private function forgetUserCache(int $soalId, int $userId): void
    {
        Cache::forget($this->keyJawaban($soalId, $userId));
        Cache::forget($this->keyUrutan($soalId, $userId));
        Cache::forget($this->keyTimer($soalId, $userId));
        Cache::forget($this->keyAnswered($soalId, $userId));
        Cache::forget($this->keySubmitLock($soalId, $userId));
    }
}