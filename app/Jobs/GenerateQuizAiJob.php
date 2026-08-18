<?php

namespace App\Jobs;

use App\Models\AiGeneration;
use App\Models\Materi; // ASUMSI: sesuaikan namespace kalau nama model materi berbeda
use App\Models\Soal;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\Ai\MateriAdequacyChecker;

class GenerateQuizAiJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // Bisa banyak batch kalau user minta soal dalam jumlah besar (mis. 40 soal).
    public int $timeout = 600;
    public int $tries = 1;

    private const RESEARCH_MODEL = 'groq/compound';
    private const STRUCTURE_MODEL = 'openai/gpt-oss-120b';
    private const END_MARKER = '===SELESAI===';

    // Jumlah soal per 1x panggilan API, supaya prompt_tokens + max_tokens gak
    // nabrak TPM limit Groq walau user minta soal dalam jumlah besar.
    private const BATCH_SIZE = 8;

    private const MAX_SOURCE_CHARS = 6000;
    private const RESEARCH_MAX_TOKENS = 3000;
    private const MAX_SOURCE_CHARS_SUPPLEMENT = 9000;

    public function __construct(
        public string $generationId,
        public int $userId,
        public int $soalId,
        public array $materiIds,
        public string $topik,
        public int $jumlahPg,
        public int $jumlahEssay,
        public float $nilaiPerSoal,
        public int $aiGenerationId,
        public int $cost,
        public int $jumlahOpsiPg = 4,
    ) {}

    protected function cacheKey(): string
    {
        return "ai_gen:{$this->generationId}";
    }

    protected function updateStage(string $stage, string $message, array $extra = []): void
    {
        Cache::put($this->cacheKey(), array_merge([
            'stage' => $stage,
            'message' => $message,
            'user_id' => $this->userId,
            'updated_at' => now()->toIso8601String(),
        ], $extra), now()->addMinutes(15));
    }

    public function handle(): void
    {
        $this->updateStage('analyzing', 'Menyiapkan konteks soal...');

        $soal = Soal::find($this->soalId);
        if (! $soal) {
            $this->fail_('Quiz tidak ditemukan.');
            return;
        }

        $apiKeys = $this->groqApiKeys();
        if (empty($apiKeys)) {
            $this->fail_('API key belum dikonfigurasi di server.');
            return;
        }

        $materis = ! empty($this->materiIds) ? Materi::whereIn('id', $this->materiIds)->get() : collect();
        $totalSoal = $this->jumlahPg + $this->jumlahEssay;

        // ================= Sumber konten: materi referensi, riset AI, atau gabungan keduanya =================
        if ($materis->isNotEmpty()) {
            $this->updateStage('contacting_ai', 'Membaca materi referensi...');

            // Bagi rata budget karakter per materi supaya total gabungan tetap
            // di bawah MAX_SOURCE_CHARS walau user pilih banyak materi sekaligus.
            $budgetPerMateri = (int) floor(self::MAX_SOURCE_CHARS / max(1, $materis->count()));

            $materiContent = $materis->map(function ($m) use ($budgetPerMateri) {
                $isi = $this->truncateForBudget((string) $m->deskripsi, $budgetPerMateri);
                return "--- Materi: \"{$m->judul}\" ---\n{$isi}";
            })->implode("\n\n");

            $materiContent = trim($materiContent);
            $judulList = $materis->pluck('judul')->implode('", "');

            if (! $materiContent) {
                $this->fail_('Materi referensi yang dipilih kosong/tidak punya konten.');
                return;
            }

            $materiCukup = MateriAdequacyChecker::cukup($materis, $totalSoal);

            if ($materiCukup) {
                // Konten materi dianggap cukup untuk jumlah soal yang diminta.
                $sourceContent = $materiContent;
                $sourceLabel = "MATERI REFERENSI ({$materis->count()} materi: \"{$judulList}\")";
            } else {
                // Materi ada tapi kontennya terlalu sedikit untuk $totalSoal soal -
                // tetap lakukan riset tambahan dari web supaya AI punya cukup bahan.
                $this->updateStage('contacting_ai', 'Materi referensi terbatas, mencari sumber tambahan dari web...');

                $researchSystemPrompt = $this->buildResearchPrompt($soal, $judulList);
                $researchUserPrompt = "Topik/permintaan guru: " . ($this->topik ?: '(tidak ada, ikuti topik materi referensi)') . "\n\n"
                    . "Materi referensi yang sudah dipilih guru: \"{$judulList}\". Kontennya masih terlalu sedikit "
                    . "untuk dijadikan dasar {$totalSoal} soal ujian yang variatif dan tidak repetitif. "
                    . "Lakukan riset untuk mencari informasi TAMBAHAN yang relevan dan melengkapi topik materi tersebut.";

                [$researchRaw, $researchErr] = $this->callGroq(
                    $apiKeys,
                    self::RESEARCH_MODEL,
                    $researchSystemPrompt,
                    $researchUserPrompt,
                    self::RESEARCH_MAX_TOKENS,
                    self::END_MARKER
                );

                $riset = $researchRaw ? $this->parseResearch($researchRaw) : '';

                if (! $riset) {
                    // Riset tambahan gagal - jangan gagalkan seluruh generation, lanjut
                    // pakai materi yang ada saja (soal yang dihasilkan mungkin kurang dari
                    // yang diminta/shortfall, tapi itu lebih baik daripada gagal total).
                    Log::warning('GenerateQuizAiJob: riset tambahan gagal, lanjut hanya dengan materi referensi', [
                        'generation_id' => $this->generationId,
                        'error' => $researchErr instanceof \Illuminate\Http\Client\Response
                            ? $researchErr->body()
                            : (string) $researchErr,
                    ]);

                    $sourceContent = $materiContent;
                    $sourceLabel = "MATERI REFERENSI ({$materis->count()} materi: \"{$judulList}\")";
                } else {
                    $sourceContent = $this->truncateForBudget(
                        $materiContent . "\n\n--- Riset Tambahan (dari web, melengkapi materi referensi) ---\n{$riset}",
                        self::MAX_SOURCE_CHARS_SUPPLEMENT
                    );
                    $sourceLabel = "MATERI REFERENSI + RISET TAMBAHAN AI ({$materis->count()} materi: \"{$judulList}\", "
                        . "dilengkapi riset web karena kontennya terbatas untuk {$totalSoal} soal)";
                }
            }
        } else {
            $this->updateStage('contacting_ai', 'Mencari sumber & mengumpulkan riset dari web...');

            $researchSystemPrompt = $this->buildResearchPrompt($soal);
            $researchUserPrompt = "Topik/permintaan guru: {$this->topik}\n\nLakukan riset sesuai format yang diminta.";

            [$researchRaw, $researchErr] = $this->callGroq(
                $apiKeys,
                self::RESEARCH_MODEL,
                $researchSystemPrompt,
                $researchUserPrompt,
                self::RESEARCH_MAX_TOKENS,
                self::END_MARKER
            );

            if (! $researchRaw) {
                $this->failFromError($researchErr, 'riset');
                return;
            }

            $riset = $this->parseResearch($researchRaw);

            if (! $riset) {
                $this->fail_('AI gagal mengumpulkan riset untuk topik ini. Coba ubah topik/prompt.');
                return;
            }

            $sourceContent = $this->truncateForBudget($riset, self::MAX_SOURCE_CHARS);
            $sourceLabel = 'HASIL RISET AI (dari pencarian web)';
        }

        // ================= Generate soal per-batch =================
        $batches = $this->splitIntoBatches($this->jumlahPg, $this->jumlahEssay, self::BATCH_SIZE);

        $allQuestions = [];

        foreach ($batches as $i => $batch) {
            $doneCount = count($allQuestions);
            // $this->updateStage('parsing', "Menyusun soal ({$doneCount}/{$totalSoal})...");
            $this->updateStage('parsing', "Mulai menyusun soal...");

            $systemPrompt = $this->buildQuestionPrompt($soal, $sourceLabel);
            $userPrompt = "Topik/instruksi tambahan dari guru: " . ($this->topik ?: '(tidak ada, ikuti isi konten sumber di bawah)') . "\n\n"
                . "=== {$sourceLabel} ===\n{$sourceContent}\n\n"
                . "Buatkan TEPAT {$batch['pg']} soal Pilihan Ganda dan {$batch['essay']} soal Essay "
                . "berdasarkan konten sumber di atas. Total {$batch['total']} soal untuk batch ini saja "
                . "(soal lain akan diminta di panggilan terpisah, jadi jangan buat soal yang mirip/duplikat "
                . "dengan asumsi soal sebelumnya kalau ada).";

            [$raw, $err] = $this->callGroq(
                $apiKeys,
                self::STRUCTURE_MODEL,
                $systemPrompt,
                $userPrompt,
                $this->estimateMaxTokens($batch['total']),
                self::END_MARKER
            );

            if (! $raw) {
                // Kalau batch sebelumnya sudah menghasilkan sebagian soal, simpan itu saja
                // daripada membuang semua progres karena 1 batch terakhir gagal.
                if (! empty($allQuestions)) {
                    Log::warning('GenerateQuizAiJob: batch gagal di tengah, lanjut dengan soal yang sudah terkumpul', [
                        'generation_id' => $this->generationId,
                        'batch_index' => $i,
                    ]);
                    break;
                }

                $this->failFromError($err, 'generate soal');
                return;
            }

            $questions = $this->parseQuestions($raw);

            if (empty($questions)) {
                Log::warning('GenerateQuizAiJob: batch tidak menghasilkan soal valid, dilewati', [
                    'generation_id' => $this->generationId,
                    'batch_index' => $i,
                    'raw_preview' => mb_substr($raw, 0, 1500),
                ]);
                continue;
            }

            $allQuestions = array_merge($allQuestions, $questions);
        }

        if (empty($allQuestions)) {
            AiGeneration::where('id', $this->aiGenerationId)->update(['status' => 'failed']);
            $this->updateStage('failed', 'AI tidak berhasil menghasilkan soal yang valid. Coba ubah topik/prompt atau materi referensinya.', ['failed' => true]);
            return;
        }

        // ================= Simpan ke bank_soal =================
        $this->updateStage('parsing', 'Menyimpan soal ke database...');

        $now = now();
        $rows = array_map(function ($q) use ($now) {
            return [
                'soal_id' => $this->soalId,
                'soal' => $q['soal'],
                'tipe_soal' => $q['tipe_soal'],
                'jenis_lampiran' => 'Tanpa Lampiran',
                'link_lampiran' => null,
                'jawaban_benar' => $q['jawaban_benar'] ?? null,
                'opsi_a' => $q['opsi_a'] ?? null,
                'opsi_b' => $q['opsi_b'] ?? null,
                'opsi_c' => $q['opsi_c'] ?? null,
                'opsi_d' => $q['opsi_d'] ?? null,
                'opsi_e' => $q['opsi_e'] ?? null,
                'nilai' => $this->nilaiPerSoal,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }, $allQuestions);

        DB::table('bank_soal')->insert($rows);

        $this->flushSoalCache($this->soalId);

        AiGeneration::where('id', $this->aiGenerationId)->update(['status' => 'generated']);

        $shortfall = $totalSoal - count($allQuestions);

        $this->updateStage('done', 'Selesai!', [
            'result' => [
                'total_generated' => count($allQuestions),
                'total_requested' => $totalSoal,
                'shortfall' => max(0, $shortfall),
                'soal_id' => $this->soalId,
            ],
        ]);
    }

    /**
     * Bagi total soal PG & Essay jadi beberapa batch (maks $batchSize soal/batch),
     * supaya request ke Groq tidak nabrak limit token walau totalnya besar.
     */
    private function splitIntoBatches(int $pg, int $essay, int $batchSize): array
    {
        $batches = [];

        while ($pg > 0 || $essay > 0) {
            $capacity = $batchSize;

            $takePg = min($pg, $capacity);
            $capacity -= $takePg;
            $takeEssay = min($essay, $capacity);

            $pg -= $takePg;
            $essay -= $takeEssay;

            if ($takePg === 0 && $takeEssay === 0) {
                break; // safety, seharusnya tidak pernah kejadian
            }

            $batches[] = ['pg' => $takePg, 'essay' => $takeEssay, 'total' => $takePg + $takeEssay];
        }

        return $batches;
    }

    /**
     * Perkiraan kasar max_tokens per batch: soal PG butuh lebih banyak token
     * (opsi jawaban A-E) dibanding essay. Dibatasi supaya gak nabrak TPM limit.
     */
    private function estimateMaxTokens(int $questionCount): int
    {
        return min(7000, 800 + ($questionCount * 220));
    }

    /**
     * @return array{0: ?string, 1: mixed} [$content, $lastError]
     */
    private function callGroq(array $apiKeys, string $model, string $systemPrompt, string $userPrompt, int $maxTokens, string $endMarker): array
    {
        $lastError = null;

        foreach ($apiKeys as $index => $apiKey) {
            try {
                $response = Http::withToken($apiKey)
                    ->timeout(90)
                    ->post('https://api.groq.com/openai/v1/chat/completions', [
                        'model' => $model,
                        'messages' => [
                            ['role' => 'system', 'content' => $systemPrompt],
                            ['role' => 'user', 'content' => $userPrompt],
                        ],
                        'temperature' => 0.3,
                        'max_tokens' => $maxTokens,
                    ]);

                if (in_array($response->status(), [401, 429, 413], true)) {
                    Log::warning("Groq key #{$index} model {$model} gagal", [
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);
                    $lastError = $response;
                    continue;
                }

                if ($response->failed()) {
                    Log::error('Groq API error', ['status' => $response->status(), 'body' => $response->body()]);
                    $lastError = $response;
                    continue;
                }

                $content = $response->json('choices.0.message.content');
                $finishReason = $response->json('choices.0.finish_reason');

                if (! $content || ! str_contains($content, $endMarker)) {
                    Log::warning("Groq key #{$index} model {$model} output tidak lengkap/tanpa marker", [
                        'finish_reason' => $finishReason,
                    ]);
                    $lastError = $response;
                    continue;
                }

                return [$content, null];
            } catch (\Throwable $e) {
                Log::error('Groq API exception', ['key_index' => $index, 'model' => $model, 'error' => $e->getMessage()]);
                $lastError = $e;
            }
        }

        return [null, $lastError];
    }

    private function failFromError($lastError, string $tahap): void
    {
        $lastStatus = $lastError instanceof \Illuminate\Http\Client\Response ? $lastError->status() : null;
        $message = match ($lastStatus) {
            429 => "Batas penggunaan AI daerah/menit sudah tercapai saat tahap {$tahap}. Coba lagi nanti.",
            413 => "Traffic permintaan terlalu tinggi untuk diproses AI saat tahap {$tahap}. Coba lagi nanti.",
            default => "Terjadi kesalahan pada AI Models saat tahap {$tahap}. Silakan coba lagi nanti.",
        };
        AiGeneration::where('id', $this->aiGenerationId)->update(['status' => 'failed']);
        $this->updateStage('failed', $message, ['failed' => true]);
    }

    private function fail_(string $message): void
    {
        AiGeneration::where('id', $this->aiGenerationId)->update(['status' => 'failed']);
        $this->updateStage('failed', $message, ['failed' => true]);
    }

    /**
     * Parsing tahap riset (mirip GenerateMaterialAiJob, tapi tanpa SUMBER
     * karena quiz tidak butuh footnote sumber seperti materi pembelajaran).
     */
    private function parseResearch(string $rawContent): string
    {
        $clean = $this->stripCodeFence($rawContent);

        if (preg_match('/===RISET===(.*?)===SELESAI===/s', $clean, $m)) {
            $riset = trim($m[1]);
        } else {
            // Fallback: kalau compound tidak taat marker, anggap seluruh
            // konten (minus marker SELESAI) sebagai riset mentah.
            $riset = trim(str_replace(self::END_MARKER, '', $clean));
        }

        return $riset;
    }

    /**
     * Parsing hasil generate soal (format JSON di dalam marker ===SOAL===...===SELESAI===).
     * Item yang tidak valid (mis. PG tanpa opsi lengkap) di-skip, bukan bikin seluruh batch gagal.
     *
     * @return array<int, array<string, mixed>>
     */
    private function parseQuestions(string $rawContent): array
    {
        $clean = $this->stripCodeFence($rawContent);

        if (preg_match('/===SOAL===(.*?)===SELESAI===/s', $clean, $m)) {
            $jsonStr = trim($m[1]);
        } else {
            $jsonStr = trim(str_replace(self::END_MARKER, '', $clean));
        }

        $decoded = json_decode($jsonStr, true);

        if (! is_array($decoded)) {
            return [];
        }

        $opsiKeys = ['opsi_a', 'opsi_b', 'opsi_c', 'opsi_d', 'opsi_e'];
        $valid = [];

        foreach ($decoded as $item) {
            if (! is_array($item)) {
                continue;
            }

            $tipe = $item['tipe_soal'] ?? null;
            $soalText = trim((string) ($item['soal'] ?? ''));

            if (! in_array($tipe, ['PG', 'Essay'], true) || $soalText === '') {
                continue;
            }

            if ($tipe === 'PG') {
                $row = ['tipe_soal' => 'PG', 'soal' => $soalText];

                $opsiWajib = $this->opsiKeysAktif(); // mis. ['opsi_a','opsi_b','opsi_c'] untuk 3 opsi

                $semuaOpsiTerisi = true;

                foreach ($opsiKeys as $k) {
                    $val = isset($item[$k]) ? trim((string) $item[$k]) : '';
                    // Paksa opsi di luar jumlah yang diminta user jadi null,
                    // walaupun AI ngasih isi (misalnya user pilih 3 opsi tapi AI tetap isi opsi_d/opsi_e).
                    $row[$k] = (in_array($k, $opsiWajib, true) && $val !== '') ? $val : null;

                    if (in_array($k, $opsiWajib, true) && $val === '') {
                        $semuaOpsiTerisi = false;
                    }
                }

                $jawaban = $item['jawaban_benar'] ?? null;

                if (! $semuaOpsiTerisi || ! in_array($jawaban, $opsiWajib, true) || empty($row[$jawaban])) {
                    continue;
                }

                $row['jawaban_benar'] = $jawaban;
                $valid[] = $row;
            } else {
                $valid[] = [
                    'tipe_soal' => 'Essay',
                    'soal' => $soalText,
                    'jawaban_benar' => trim((string) ($item['jawaban_benar'] ?? '')) ?: null,
                ];
            }
        }

        return $valid;
    }

    private function stripCodeFence(string $rawContent): string
    {
        $clean = trim($rawContent);
        $clean = preg_replace('/^```[a-zA-Z]*\s*/', '', $clean);
        $clean = preg_replace('/```\s*$/', '', $clean);

        return trim($clean);
    }

    private function truncateForBudget(string $text, int $maxChars): string
    {
        $text = trim($text);
        if (mb_strlen($text) <= $maxChars) {
            return $text;
        }

        return mb_substr($text, 0, $maxChars) . "\n\n[...konten dipotong karena terlalu panjang...]";
    }

    /**
     * Samakan dengan QuestController::flushSoalCache() supaya cache jumlah soal
     * & urutan soal ikut ter-invalidate setelah bulk insert dari AI.
     */
    private function flushSoalCache(int $soalId): void
    {
        Cache::forget("soal:{$soalId}:jumlah");
        Cache::forget("soal:{$soalId}:base");
        Cache::forget("soal:{$soalId}:detail");
    }

    public function failed(\Throwable $e): void
    {
        AiGeneration::where('id', $this->aiGenerationId)->update(['status' => 'failed']);
        Log::error('GenerateQuizAiJob gagal total', ['error' => $e->getMessage()]);
        $this->updateStage('failed', 'Terjadi kesalahan tak terduga saat generate. Silakan coba lagi.', ['failed' => true]);
    }

    private function groqApiKeys(): array
    {
        $raw = (string) config('services.groq.api_key');

        return collect(explode(',', $raw))
            ->map(fn ($key) => trim($key))
            ->filter()
            ->values()
            ->all();
    }

    private function buildResearchPrompt(Soal $soal, ?string $konteksMateriTambahan = null): string
    {
        $kelasNama = $soal->kelas ?? '-';
        $mapelNama = $soal->mapel?->mapel ?? '-';

        $catatanTambahan = $konteksMateriTambahan
            ? "\n\nCatatan: guru sudah punya materi referensi berjudul \"{$konteksMateriTambahan}\", tapi "
                . "kontennya terlalu sedikit untuk jumlah soal yang diminta. Tugasmu mencari informasi "
                . "TAMBAHAN yang relevan dengan topik materi tersebut untuk MELENGKAPI (bukan mengulang) "
                . "apa yang sudah ada, supaya totalnya cukup untuk menyusun soal ujian yang variatif."
            : '';

        return <<<PROMPT
        Kamu adalah asisten riset dengan akses browsing web nyata. Tugasmu HANYA mencari &
        mengumpulkan informasi akurat tentang topik yang diminta guru, untuk dipakai menyusun
        SOAL UJIAN siswa kelas "{$kelasNama}" pada mata pelajaran "{$mapelNama}". Kamu TIDAK
        perlu menyusun soal - itu dikerjakan tahap berikutnya. Fokusmu murni riset.{$catatanTambahan}

        Aturan riset (SANGAT PENTING):
        - WAJIB gunakan browsing untuk mencari referensi tepercaya yang relevan dengan tingkat
        kelas "{$kelasNama}". JANGAN menulis dari ingatan/tebakan saja.
        - Kumpulkan konsep, definisi, contoh, langkah-langkah, dan rumus/angka (jika relevan)
        selengkap dan seakurat mungkin, tapi RINGKAS - fokus pada poin inti yang bisa dijadikan
        dasar pertanyaan ujian. Jangan mengarang fakta, angka, atau rumus.

        WAJIB jawab PERSIS dengan format di bawah ini, mulai LANGSUNG dari baris "===RISET==="
        tanpa teks pembuka apa pun, dan JANGAN bungkus jawabanmu dalam code fence (```):

        ===RISET===
        (catatan riset ringkas dan padat - konsep, definisi, contoh, langkah, rumus/angka jika
        ada, yang bisa dijadikan dasar pertanyaan ujian.)
        ===SELESAI===
        PROMPT;
    }

    private function buildQuestionPrompt(Soal $soal, string $sourceLabel): string
    {
        $kelasNama = $soal->kelas ?? '-';
        $mapelNama = $soal->mapel?->mapel ?? '-';

        $opsiAktif = $this->opsiKeysAktif(); // mis. ['opsi_a','opsi_b','opsi_c']
        $hurufAktif = array_map(fn ($k) => strtoupper(substr($k, -1)), $opsiAktif);
        $jumlahOpsi = count($opsiAktif);

        $opsiTidakDipakai = array_diff(['opsi_a', 'opsi_b', 'opsi_c', 'opsi_d', 'opsi_e'], $opsiAktif);
        $opsiKosongNote = $opsiTidakDipakai
            ? ', ' . implode(' dan ', $opsiTidakDipakai) . ' HARUS null/dikosongkan (jangan diisi)'
            : '';

        $jawabanKeyList = implode(', ', array_map(fn ($k) => "\"{$k}\"", $opsiAktif));

        // Contoh JSON opsi, hanya opsi aktif yang diisi teks - sisanya null
        $contohOpsiLines = collect(['a', 'b', 'c', 'd', 'e'])->map(function ($huruf) use ($opsiAktif) {
            $key = "opsi_{$huruf}";
            $value = in_array($key, $opsiAktif, true) ? '"teks opsi ' . strtoupper($huruf) . '"' : 'null';
            return "        \"{$key}\": {$value}";
        })->implode(",\n");

        return <<<PROMPT
        Kamu adalah penulis soal ujian untuk siswa Indonesia. Kamu akan diberi konten sumber
        ({$sourceLabel}) dan diminta membuat soal PILIHAN GANDA (PG) dan/atau ESSAY berdasarkan
        konten itu SAJA - jangan menambah fakta atau konsep yang tidak ada di konten sumber.

        Buat soal untuk siswa kelas "{$kelasNama}" pada mata pelajaran "{$mapelNama}".

        Aturan soal (SANGAT PENTING):
        - Setiap soal PG harus punya PERSIS {$jumlahOpsi} opsi jawaban ({$hurufAktif[0]} sampai {$hurufAktif[array_key_last($hurufAktif)]}):
        semua dari {$jawabanKeyList} WAJIB diisi{$opsiKosongNote}, dan HANYA SATU jawaban benar.
        - Jawaban benar untuk PG ditulis sebagai key opsi: {$jawabanKeyList} - BUKAN teks jawabannya.
        - Untuk Essay, "jawaban_benar" diisi kunci jawaban singkat/rubrik jawaban yang benar.
        - Variasikan tingkat kesulitan & jenis pertanyaan (jangan semua soal template yang sama).
        - Jangan membuat soal yang jawabannya bisa ditebak tanpa membaca konten (mis. opsi lain
        jelas tidak masuk akal).
        - Tulis soal langsung ke bahasa yang dipakai konten sumber (default Bahasa Indonesia,
        kecuali sumbernya jelas berbahasa asing seperti pelajaran Bahasa Inggris).
        - JANGAN gunakan sintaks LaTeX atau markdown (**bold**, # heading, dll) di teks soal -
        tulis sebagai teks/HTML sederhana biasa, karena tampilan soal tidak merender markdown.
        Kalau ada rumus matematika, tulis dengan notasi teks biasa (mis. x^2, akar(x), 1/2).

        WAJIB jawab PERSIS dengan format di bawah ini - JSON array valid di antara marker,
        mulai LANGSUNG dari baris "===SOAL===" tanpa teks pembuka apa pun, dan JANGAN bungkus
        jawabanmu dalam code fence (```):

        ===SOAL===
        [
        {
            "tipe_soal": "PG",
            "soal": "teks pertanyaan di sini",
        {$contohOpsiLines},
            "jawaban_benar": "{$opsiAktif[1]}"
        },
        {
            "tipe_soal": "Essay",
            "soal": "teks pertanyaan essay di sini",
            "jawaban_benar": "kunci jawaban/rubrik singkat"
        }
        ]
        ===SELESAI===
        PROMPT;
    }

    private function opsiEJawabanNote(): string
    {
        return $this->jumlahOpsiPg === 5 ? ', atau "opsi_e"' : '';
    }

    private function opsiEContohJson(): string
    {
        return $this->jumlahOpsiPg === 5 ? '"teks opsi E"' : 'null';
    }

    private function jumlahOpsiPg(): int
    {
        return in_array($this->jumlahOpsiPg, [3, 4, 5], true) ? $this->jumlahOpsiPg : 4;
    }

    /** @return string[] mis. ['opsi_a','opsi_b','opsi_c'] untuk 3 opsi */
    private function opsiKeysAktif(): array
    {
        $semua = ['opsi_a', 'opsi_b', 'opsi_c', 'opsi_d', 'opsi_e'];

        return array_slice($semua, 0, $this->jumlahOpsiPg());
    }
}