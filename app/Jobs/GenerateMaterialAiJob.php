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

    public int $timeout = 180; // 2 kali call AI berurutan (riset + strukturisasi)
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

    // Budget token supaya gak nabrak TPM limit Groq (perkiraan kasar: 1 token ≈ 4 karakter).
    // TPM dihitung dari prompt_tokens + max_tokens yang diminta, jadi dua-duanya harus dijaga.
    private const MAX_RESEARCH_CHARS = 6000;   // cap hasil riset sebelum dikirim ke tahap 2
    private const RESEARCH_MAX_TOKENS = 3000;
    private const STRUCTURE_MAX_TOKENS = 4000;

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
            self::RESEARCH_MAX_TOKENS,
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
        $riset = $this->truncateForBudget($riset, self::MAX_RESEARCH_CHARS);
        $sumber = $this->truncateForBudget($sumber, 1500);

        // ================= STAGE 2: STRUKTURISASI (llama-3.3-70b-versatile) =================
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
            self::STRUCTURE_MAX_TOKENS,
            self::STRUCTURE_END_MARKER
        );

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
        - Kumpulkan konsep, definisi, contoh, langkah-langkah, dan rumus/angka (jika relevan)
        selengkap dan seakurat mungkin, tapi RINGKAS - fokus pada poin inti, jangan bertele-tele,
        karena hasil ini akan diringkas ulang di tahap berikutnya dengan budget token terbatas.
        Jangan mengarang fakta, angka, rumus, atau sumber. Kalau ragu terhadap suatu detail,
        catat konsep umum yang pasti benar saja.
        - Catat SEMUA sumber yang benar-benar kamu gunakan: nama sumber dan URL asli hasil
        browsing (bukan URL karangan). Maksimal 5 sumber paling relevan saja.

        WAJIB jawab PERSIS dengan format di bawah ini, mulai LANGSUNG dari baris "===RISET==="
        tanpa teks pembuka apa pun, dan JANGAN bungkus jawabanmu dalam code fence (```):

        ===RISET===
        (catatan riset ringkas dan padat - konsep, definisi, contoh, langkah, rumus/angka jika
        ada. Boleh belum rapi/terformat, karena akan dirapikan di tahap berikutnya.)
        ===SUMBER===
        [1] Nama sumber - URL
        [2] Nama sumber - URL
        (dan seterusnya, hanya sumber yang benar-benar kamu pakai, maksimal 5)
        ===SELESAI===
        PROMPT;
    }

    /**
     * STAGE 2 - prompt strukturisasi untuk llama-3.3-70b-versatile. Model ini
     * tidak browsing - ia HANYA mengolah hasil riset dari tahap 1 (dikirim
     * lewat user prompt di handle()) menjadi materi siap baca siswa,
     * menentukan judul final, dan menyusun footnote.
     */
    private function buildStructurePrompt(string $kelasNama, string $mapelNama): string
    {
        $template = <<<'PROMPT'
            Kamu adalah penulis materi pembelajaran untuk siswa di Indonesia. Kamu TIDAK punya
            akses browsing - kamu akan diberi HASIL RISET mentah (sudah dicari & dikonfirmasi
            akurat oleh proses sebelumnya) beserta daftar sumbernya. Tugasmu MENGOLAH riset itu
            menjadi materi yang rapi, terstruktur, dan siap dibaca siswa - BUKAN mencari info baru
            atau menambah fakta yang tidak ada di riset.

            Tulis materi untuk tingkat kelas "__KELAS__" pada mata pelajaran "__MAPEL__".

            Aturan sudut pandang & audiens (SANGAT PENTING):
            - Materi yang kamu tulis adalah KONTEN YANG LANGSUNG DIBACA SISWA - bukan penjelasan
            atau saran untuk guru tentang apa yang perlu diajarkan.
            - Tulis seolah kamu sedang mengajar siswa secara langsung: jelaskan konsepnya,
            definisinya, contohnya, langkah-langkahnya, langsung ke siswa.
            - JANGAN PERNAH menulis dalam bentuk instruksi/saran ke guru, misalnya: "Guru dapat
            menjelaskan kepada siswa bahwa...", "Berikut materi yang bisa Bapak/Ibu berikan ke
            siswa...", "Ajarkan siswa tentang...".
            - Boleh menyapa siswa langsung (mis. "Kalian akan mempelajari...") atau menulis dengan
            gaya buku pelajaran/ensiklopedia yang netral.

            Aturan penggunaan hasil riset (SANGAT PENTING):
            - Dasarkan SELURUH isi materi HANYA pada HASIL RISET yang diberikan. Jangan menambah
            fakta, angka, atau rumus yang tidak ada di riset tersebut.
            - Jika hasil riset terasa kurang lengkap atau terpotong untuk sebagian topik, jelaskan
            bagian itu secara umum/konseptual saja, jangan mengarang detail spesifik.
            - Rapikan, susun ulang, dan tulis ulang dengan bahasamu sendiri (jangan copy-paste
            mentah) agar enak dibaca siswa sesuai tingkat kelasnya.

            Aturan sumber & footnote (WAJIB):
            - Ambil daftar SUMBER yang diberikan, rapikan penomorannya, dan taruh sebagai catatan
            kaki bernomor di BAGIAN PALING AKHIR deskripsi (format: [1] Nama sumber - URL/keterangan),
            terpisah dari isi materi untuk siswa di atasnya. Ini ditujukan agar guru bisa mengecek
            keakuratan materi.
            - Jangan mengarang sumber baru yang tidak ada di daftar yang diberikan.

            Aturan judul (SANGAT PENTING):
            - Judul HARUS mencerminkan topik spesifik yang benar-benar dibahas di isi materi -
            baca dulu hasil riset & materi yang kamu susun, baru simpulkan judul paling relevan
            dan spesifik untuknya.
            - JANGAN PERNAH memakai judul generik seperti "Materi Pembelajaran", "Materi Ajar".
            Judul harus title case, singkat, jelas, dan menyebut topik konkretnya.
            - Judul referensi dari guru (jika ada) boleh dipakai sebagai starting point, tapi
            sempurnakan atau ganti kalau ada judul yang lebih akurat mencerminkan isi materi.

            Aturan bahasa:
            - Default: gunakan Bahasa Indonesia.
            - KECUALI mata pelajaran "__MAPEL__" adalah pelajaran bahasa asing (mis.
            English/Bahasa Inggris, Bahasa Arab, Mandarin, dll) - dalam kasus ini tulis materi
            dalam bahasa yang diajarkan tersebut.
            - ATAU jika guru secara eksplisit meminta bahasa tertentu di topik/prompting - ikuti
            permintaan guru itu, prioritaskan di atas aturan default manapun.

            Aturan format deskripsi (WAJIB, output Markdown):
            - Gunakan heading (## atau ###) hanya untuk bagian besar.
            - Boleh pakai tabel Markdown (|) untuk langkah-langkah, dengan header jelas. Di dalam
            sel tabel hanya teks biasa, boleh <br> untuk baris baru, JANGAN taruh list/heading/HTML
            lain di sel tabel.
            - Di luar tabel, gunakan list bernomor (1. 2. 3.) atau list poin (-).
            - Gunakan **bold** secukupnya untuk istilah penting saja.

            Aturan rumus & notasi matematika (WAJIB, gunakan LaTeX):
            - Untuk rumus matematika, GUNAKAN sintaks LaTeX, bukan karakter Unicode manual.
            - Rumus inline (di tengah kalimat): bungkus dengan tanda dolar tunggal, contoh: $x^2 + y^2 = z^2$
            - Rumus blok (berdiri sendiri, biasanya rumus penting/panjang): bungkus dengan dolar ganda,
            contoh:
            $$\int_{0}^{1} x^2 \, dx = \frac{1}{3}$$
            - Gunakan sintaks LaTeX standar: \frac{a}{b} untuk pecahan, \sqrt{x} untuk akar, ^{...} untuk
            pangkat, _{...} untuk subscript, \sum \int \lim \times \div \leq \geq \neq \pi \infty dst.
            - JANGAN campur LaTeX dengan karakter Unicode pada rumus yang sama.
            - Untuk mata pelajaran non-matematika/sains yang kadang butuh notasi (mis. Kimia, Fisika),
            tetap gunakan LaTeX yang sama.

            Aturan kode program (kalau topik terkait pemrograman/koding):
            - Gunakan fenced code block Markdown dengan penanda bahasa, contoh:
        ```python
            print("halo dunia")
        ```
            - Jangan gunakan code block untuk teks biasa yang bukan kode — hanya untuk kode program,
            perintah terminal, atau syntax teknis yang memang perlu tampil monospace.

            WAJIB jawab PERSIS dengan format di bawah ini, termasuk baris penanda "===...===" apa
            adanya. JANGAN tulis kalimat pembuka, basa-basi, atau penjelasan apa pun di luar format
            ini - mulai LANGSUNG dari baris "===JUDUL===" tanpa teks apa pun sebelumnya, dan JANGAN
            bungkus jawabanmu dalam code fence (```):

            ===JUDUL===
            (judul singkat, spesifik, dan relevan dengan isi materi, title case)
            ===DESKRIPSI===
            (isi deskripsi materi Markdown di sini, ditujukan langsung untuk dibaca siswa, dengan
            catatan kaki sumber di paling akhir)
            ===SELESAI===
        PROMPT;

        return str_replace(['__KELAS__', '__MAPEL__'], [$kelasNama, $mapelNama], $template);
    }
}