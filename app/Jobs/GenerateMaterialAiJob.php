<?php

namespace App\Jobs;

use App\Models\AiGeneration;
use App\Models\Kelas;
use App\Models\Mapel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GenerateMaterialAiJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // public int $timeout = 180; 
    public int $timeout = 240;  // 2 kali call AI berurutan (riset + strukturisasi)
    public int $tries = 1;

    // STAGE 1 (riset): compound punya browsing beneran -> dipakai untuk cari
    // & kumpulkan fakta/sumber akurat. Outputnya sengaja "mentah", tidak perlu
    // rapi, karena tujuannya kelengkapan & akurasi, bukan gaya penulisan.
    //
    // STAGE 2 (strukturisasi): versatile (non-agentic, lebih taat instruksi
    // format) dipakai untuk merapikan hasil riset compound jadi materi siap
    // baca siswa, sekaligus menentukan JUDUL final & menyusun footnote sumber.
    private const RESEARCH_MODEL = 'groq/compound';
    private const STRUCTURE_MODEL = 'openai/gpt-oss-120b';

    private const RESEARCH_END_MARKER = '===SELESAI===';
    private const STRUCTURE_END_MARKER = '===SELESAI===';

    public function __construct(
        public string $generationId,
        public int $userId,
        public string $planKey,
        public int $kelasId,
        public int $mapelId,
        public ?string $judulHint,
        public string $topik,
        public int $aiGenerationId,
    ) {}

    /**
     * Budget token/karakter per tahap, dinaikkan untuk plan Pro/Max supaya
     * materi yang dihasilkan lebih detail & lengkap. Nilai dijaga tetap jauh
     * di bawah TPM limit Groq tier on_demand (~12000/request) supaya request
     * tetap cepat & stabil, tidak mepet limit walau untuk plan tertinggi.
     */
    private function researchMaxTokens(): int
    {
        return match ($this->planKey) {
            'max' => 5000,
            'pro' => 4000,
            default => 3000, // free
        };
    }

    private function structureMaxTokens(): int
    {
        return match ($this->planKey) {
            'max' => 6000,   // ⬅ UBAH dari 7000
            'pro' => 4800,   // ⬅ UBAH dari 5500
            default => 3500, // ⬅ UBAH dari 4000
        };
    }

    private function maxResearchChars(): int
    {
        return match ($this->planKey) {
            'max' => 7000,   // ⬅ UBAH dari 9000
            'pro' => 6000,   // ⬅ UBAH dari 7500
            default => 5000, // ⬅ UBAH dari 6000
        };
    }

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
        ], $extra), now()->addMinutes(10));
    }

    public function handle(): void
    {
        $this->updateStage('analyzing', 'Menganalisis topik & kelas...');

        $kelasNama = Kelas::find($this->kelasId)?->kelas ?? '-';
        $mapelNama = Mapel::find($this->mapelId)?->mapel ?? '-';

        $apiKeys = $this->groqApiKeys();
        if (empty($apiKeys)) {
            $this->fail_('Groq API key belum dikonfigurasi di server.');
            return;
        }

        // ================= STAGE 1: RISET (groq/compound, browsing) =================
        $this->updateStage('contacting_ai', 'Mencari sumber & mengumpulkan riset...');

        $researchSystemPrompt = $this->buildResearchPrompt($kelasNama, $mapelNama);
        $researchUserPrompt = "Topik/permintaan guru: {$this->topik}\n\n"
            . "Judul referensi dari guru (opsional): " . ($this->judulHint ?: '(tidak ada)') . "\n\n"
            . "Lakukan riset sesuai format yang diminta.";

        [$researchRaw, $researchErr] = $this->callGroq(
            $apiKeys,
            self::RESEARCH_MODEL,
            $researchSystemPrompt,
            $researchUserPrompt,
            $this->researchMaxTokens(),
            self::RESEARCH_END_MARKER
        );

        if (! $researchRaw) {
            $this->failFromError($researchErr, 'riset');
            return;
        }

        [$riset, $sumber] = $this->parseResearch($researchRaw);

        if (! $riset) {
            AiGeneration::where('id', $this->aiGenerationId)->update(['status' => 'failed']);
            $this->updateStage('failed', 'AI gagal mengumpulkan riset untuk topik ini. Coba ubah topik/prompt.', ['failed' => true]);
            return;
        }

        // Potong riset & sumber SEBELUM dipakai di prompt tahap 2, supaya
        // prompt_tokens + max_tokens gak nabrak TPM limit Groq.
        $riset = $this->truncateForBudget($riset, $this->maxResearchChars());
        $sumber = $this->truncateForBudget($sumber, 1500);

        // ================= STAGE 2: STRUKTURISASI =================
        $this->updateStage('parsing', 'Menyusun materi terstruktur & judul...');

        $structureSystemPrompt = $this->buildStructurePrompt($kelasNama, $mapelNama);
        $structureUserPrompt = "Judul referensi dari guru (opsional, boleh diabaikan/disempurnakan jika kurang relevan): "
            . ($this->judulHint ?: '(tidak ada, buatkan sendiri berdasarkan isi riset)') . "\n\n"
            . "Topik/permintaan guru: {$this->topik}\n\n"
            . "=== HASIL RISET (mentah, dari tahap pencarian) ===\n{$riset}\n\n"
            . "=== SUMBER YANG DITEMUKAN (mentah) ===\n" . ($sumber ?: '(tidak ada sumber eksplisit ditemukan)') . "\n\n"
            . "Susun materi final sesuai format yang diminta, berdasarkan hasil riset di atas.";

        [$structureRaw, $structureErr] = $this->callGroq(
            $apiKeys,
            self::STRUCTURE_MODEL,
            $structureSystemPrompt,
            $structureUserPrompt,
            $this->structureMaxTokens(),
            self::STRUCTURE_END_MARKER
        );

        // Kalau kena 413 (prompt+max_tokens kelewat limit TPM Groq), retry sekali
        // dengan riset dipangkas lebih agresif + max_tokens diturunkan, sebelum
        // benar-benar gagal. Riset Bahasa Indonesia sering butuh lebih banyak token
        // per karakter dibanding estimasi kasar, jadi kadang budget default masih
        // bisa kelewat walau sudah diberi margin.
        if (! $structureRaw && $structureErr instanceof \Illuminate\Http\Client\Response && $structureErr->status() === 413) {
            Log::warning('GenerateMaterialAiJob: 413 di strukturisasi, retry dengan budget lebih kecil', [
                'generation_id' => $this->generationId,
            ]);

            $risetDipangkas = $this->truncateForBudget($riset, (int) ($this->maxResearchChars() * 0.6));
            $sumberDipangkas = $this->truncateForBudget($sumber, 800);

            $structureUserPromptRetry = "Judul referensi dari guru (opsional, boleh diabaikan/disempurnakan jika kurang relevan): "
                . ($this->judulHint ?: '(tidak ada, buatkan sendiri berdasarkan isi riset)') . "\n\n"
                . "Topik/permintaan guru: {$this->topik}\n\n"
                . "=== HASIL RISET (mentah, dari tahap pencarian) ===\n{$risetDipangkas}\n\n"
                . "=== SUMBER YANG DITEMUKAN (mentah) ===\n" . ($sumberDipangkas ?: '(tidak ada sumber eksplisit ditemukan)') . "\n\n"
                . "Susun materi final sesuai format yang diminta, berdasarkan hasil riset di atas.";

            [$structureRaw, $structureErr] = $this->callGroq(
                $apiKeys,
                self::STRUCTURE_MODEL,
                $structureSystemPrompt,
                $structureUserPromptRetry,
                (int) ($this->structureMaxTokens() * 0.7),
                self::STRUCTURE_END_MARKER
            );
        }

        if (! $structureRaw) {
            $this->failFromError($structureErr, 'strukturisasi');
            return;
        }

        [$judul, $deskripsi] = $this->parseStructured($structureRaw);

        if (! $deskripsi) {
            AiGeneration::where('id', $this->aiGenerationId)->update(['status' => 'failed']);
            $this->updateStage('failed', 'AI tidak mengembalikan hasil sesuai format. Coba ubah topik/prompt.', ['failed' => true]);
            return;
        }

        AiGeneration::where('id', $this->aiGenerationId)->update(['status' => 'generated']);

        $this->updateStage('done', 'Selesai!', [
            'result' => [
                'judul' => $judul,
                'deskripsi' => trim($deskripsi),
            ],
        ]);
    }

    /**
     * Panggil Groq dengan 1 model spesifik, loop antar API key kalau kena
     * rate limit/invalid key. Tidak loop antar model (beda dari versi lama)
     * karena tiap tahap sekarang punya peran model yang spesifik & disengaja.
     *
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
     * Parsing tahap riset. Tetap toleran (buang code fence) karena compound
     * (model agentic/browsing) kadang tidak 100% taat marker.
     *
     * @return array{0: string, 1: string} [$riset, $sumber]
     */
    private function parseResearch(string $rawContent): array
    {
        $clean = $this->stripCodeFence($rawContent);

        preg_match('/===RISET===(.*?)===SUMBER===/s', $clean, $mRiset);
        preg_match('/===SUMBER===(.*?)===SELESAI===/s', $clean, $mSumber);

        $riset = trim($mRiset[1] ?? '');
        $sumber = trim($mSumber[1] ?? '');

        // Fallback: kalau compound tidak taat marker sama sekali, anggap
        // seluruh konten (minus marker SELESAI) sebagai riset mentah, supaya
        // tahap strukturisasi tetap punya bahan untuk diolah.
        if (! $riset) {
            $riset = trim(str_replace(self::RESEARCH_END_MARKER, '', $clean));
        }

        return [$riset, $sumber];
    }

    /**
     * Parsing tahap strukturisasi (JUDUL/DESKRIPSI final).
     *
     * @return array{0: string, 1: string} [$judul, $deskripsi]
     */
    private function parseStructured(string $rawContent): array
    {
        $clean = $this->stripCodeFence($rawContent);

        preg_match('/===\s*JUDUL\s*===(.*?)===\s*DESKRIPSI\s*===/is', $clean, $mJudul);
        preg_match('/===\s*DESKRIPSI\s*===(.*?)===\s*SELESAI\s*===/is', $clean, $mDeskripsi);

        $judul = trim($mJudul[1] ?? '');
        $deskripsi = trim($mDeskripsi[1] ?? '');

        // FALLBACK: kalau marker ===DESKRIPSI=== gak ketemu sama sekali (model
        // menyimpang dari format persis), coba anggap SEMUA konten setelah
        // ===JUDUL=== (atau seluruh konten kalau JUDUL juga gak ketemu), minus
        // marker SELESAI, sebagai deskripsi mentah. Lebih baik siswa dapat
        // materi apa adanya daripada guru harus generate ulang dari nol.
        if (! $deskripsi) {
            Log::warning('GenerateMaterialAiJob: marker DESKRIPSI tidak ditemukan, pakai fallback konten mentah', [
                'generation_id' => $this->generationId,
                'raw_content_preview' => mb_substr($clean, 0, 2000), // potong biar log gak membengkak
            ]);

            $fallbackSource = $judul
                ? preg_replace('/^.*?===\s*JUDUL\s*===.*?(?=\n)/is', '', $clean, 1)
                : $clean;

            $deskripsi = trim(str_replace(['===SELESAI===', '=== SELESAI ==='], '', $fallbackSource));
        }

        if (! $judul && $deskripsi) {
            if (preg_match('/^#{1,3}\s*(.+)$/m', $deskripsi, $mHeading)) {
                $judul = trim($mHeading[1]);
            }
        }

        if (! $judul) {
            $judul = $this->judulHint ?: 'Materi Pembelajaran';

            Log::warning('GenerateMaterialAiJob: judul tidak berhasil di-parse dari output AI, pakai fallback', [
                'generation_id' => $this->generationId,
                'fallback_judul' => $judul,
            ]);
        }

        return [$judul, $deskripsi];
    }

    private function stripCodeFence(string $rawContent): string
    {
        $clean = trim($rawContent);
        $clean = preg_replace('/^```[a-zA-Z]*\s*/', '', $clean);
        $clean = preg_replace('/```\s*$/', '', $clean);

        return trim($clean);
    }

    /**
     * Potong teks supaya prompt + max_tokens gak nabrak TPM limit Groq
     * (mis. 12000 di tier on_demand). Dipakai untuk memotong hasil riset
     * sebelum dikirim ke prompt tahap 2.
     */
    private function truncateForBudget(string $text, int $maxChars): string
    {
        $text = trim($text);
        if (mb_strlen($text) <= $maxChars) {
            return $text;
        }

        return mb_substr($text, 0, $maxChars) . "\n\n[...riset dipotong karena terlalu panjang, lanjutkan analisis dari bagian yang tersedia di atas...]";
    }

    public function failed(\Throwable $e): void
    {
        AiGeneration::where('id', $this->aiGenerationId)->update(['status' => 'failed']);
        Log::error('GenerateMaterialAiJob gagal total', ['error' => $e->getMessage()]);
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

    /**
     * STAGE 1 - prompt riset untuk groq/compound. Fokus KELENGKAPAN & AKURASI,
     * bukan gaya tulisan (itu urusan tahap 2). Output boleh "kasar".
     */
    private function buildResearchPrompt(string $kelasNama, string $mapelNama): string
    {
        $depthNote = match ($this->planKey) {
            'max', 'pro' => "Karena guru menggunakan paket premium, kamu boleh menggali riset lebih "
                . "MENDALAM dan LENGKAP dari biasanya — sertakan lebih banyak contoh, detail konsep, "
                . "dan variasi kasus, selama tetap akurat dan berdasarkan sumber nyata.",
            default => "Kumpulkan konsep, definisi, contoh, langkah-langkah, dan rumus/angka (jika relevan) "
                . "selengkap dan seakurat mungkin, tapi RINGKAS — fokus pada poin inti, jangan bertele-tele.",
        };

        return <<<PROMPT
        Kamu adalah asisten riset dengan akses browsing web nyata. Tugasmu HANYA mencari &
        mengumpulkan informasi yang akurat dan tepercaya tentang topik yang diminta guru,
        untuk dipakai menyusun materi pembelajaran siswa kelas "{$kelasNama}" pada mata
        pelajaran "{$mapelNama}". Kamu TIDAK perlu menulis materi yang rapi/siap baca siswa -
        itu akan dikerjakan di tahap berikutnya oleh penulis lain. Fokusmu murni riset.

        Aturan riset (SANGAT PENTING):
        - WAJIB gunakan browsing untuk mencari referensi (buku ajar, situs pendidikan resmi,
        jurnal, dokumentasi resmi sesuai mata pelajaran) yang relevan dengan tingkat kelas
        "{$kelasNama}". JANGAN menulis dari ingatan/tebakan saja.
        - Jika guru menyebutkan referensi spesifik di topik/prompting (mis. nama buku, penulis,
        kurikulum, modul tertentu), JADIKAN itu basis utama pencarianmu - konfirmasi isi/konsep
        dari referensi tersebut lewat browsing, jangan mengarang isinya.
        - {$depthNote}
        Jangan mengarang fakta, angka, rumus, atau sumber. Kalau ragu terhadap suatu detail,
        catat konsep umum yang pasti benar saja.
        - Catat SEMUA sumber yang benar-benar kamu gunakan: nama sumber dan URL asli hasil
        browsing (bukan URL karangan). Maksimal 5 sumber paling relevan saja.

        WAJIB jawab PERSIS dengan format di bawah ini, mulai LANGSUNG dari baris "===RISET==="
        tanpa teks pembuka apa pun, dan JANGAN bungkus jawabanmu dalam code fence (```):

        ===RISET===
        (catatan riset - konsep, definisi, contoh, langkah, rumus/angka jika ada. Boleh belum
        rapi/terformat, karena akan dirapikan di tahap berikutnya.)
        ===SUMBER===
        [1] Nama sumber - URL
        [2] Nama sumber - URL
        (dan seterusnya, hanya sumber yang benar-benar kamu pakai, maksimal 5)
        ===SELESAI===
        PROMPT;
    }

    /**
     * STAGE 2 - prompt strukturisasi. Model ini
     * tidak browsing - ia HANYA mengolah hasil riset dari tahap 1 (dikirim
     * lewat user prompt di handle()) menjadi materi siap baca siswa,
     * menentukan judul final, dan menyusun footnote.
     */
    private function buildStructurePrompt(string $kelasNama, string $mapelNama): string
    {
        $depthNote = match ($this->planKey) {
            'max', 'pro' => "Guru menggunakan paket premium — tulis materi dengan LEBIH DETAIL dan "
                . "LENGKAP dari biasanya: lebih banyak contoh konkret, penjelasan tiap langkah, dan "
                . "elaborasi konsep, selama tetap berdasarkan hasil riset yang diberikan (jangan mengarang).",
            default => "Tulis materi secara jelas dan cukup ringkas — fokus pada inti konsep tanpa bertele-tele.",
        };

        $template = <<<'PROMPT'
            Kamu adalah penulis materi pembelajaran untuk siswa di Indonesia. ...

            __DEPTH_NOTE__

            Tulis materi untuk tingkat kelas "__KELAS__" pada mata pelajaran "__MAPEL__".
            ...
        PROMPT;

        return str_replace(
            ['__KELAS__', '__MAPEL__', '__DEPTH_NOTE__'],
            [$kelasNama, $mapelNama, $depthNote],
            $template
        );
    }
}