<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Journal;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Support\JournalLocation;
use App\Support\JournalWindow;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class GuruJournalController extends Controller
{
    private const JUMLAH_JAM_DEFAULT = 2;

    public function index(Request $request): JsonResponse
    {
        $guru = $this->currentGuru($request);
        $now = JournalWindow::now();

        // Endpoint ini cuma untuk "jurnal hari ini" di layar utama guru.
        // Riwayat periode lain (minggu/bulan) ada di endpoint history().
        $journals = Journal::with(['kelas:id,kelas', 'mapel:id,mapel'])
            ->where('guru_id', $guru->id)
            ->whereDate('tanggal', $now->toDateString())
            ->orderByDesc('jam_mulai')
            ->paginate(10);

        $window = JournalWindow::toArray($now);

        $payload = [
            'journals' => $journals,
            'window' => $window,
        ];

        // Kelas & mapel selalu disertakan selama window terbuka, supaya guru
        // tetap melihat datanya walau sedang menunggu sesi sebelumnya selesai —
        // hanya dropdown & tombol simpan yang di-disable oleh frontend lewat
        // flag formDisabled.
        if ($window['isOpen'] ?? false) {
            $active = $this->activeSession($guru, $now);

            $payload['form'] = [
                'kelasList' => Kelas::where('guru_id', $guru->id)->orderBy('kelas')->get(['id', 'kelas']),
                'mapelList' => Mapel::where('guru_id', $guru->id)->orderBy('mapel')->get(['id', 'mapel']),
                'serverTime' => [
                    'tanggal' => $now->toDateString(),
                    'jam_mulai' => $active ? '' : $now->format('H:i'),
                    'jam_selesai' => $active ? '' : $now->copy()->addMinutes(JournalWindow::durasiSesiMenit())->format('H:i'),
                    'timezone' => JournalWindow::timezone(),
                    'durasi_menit' => JournalWindow::durasiSesiMenit(),
                ],
                'targetLocation' => JournalLocation::toArray(),
            ];

            if ($active) {
                $nextSessionAt = substr($active->jam_selesai, 0, 5);
                $payload['formDisabled'] = true;
                $payload['nextSessionAt'] = $nextSessionAt;
                $payload['formBlockedMessage'] = 'Anda baru bisa mengisi jurnal baru setelah sesi sebelumnya selesai pukul ' . $nextSessionAt . '.';
            } else {
                $payload['formDisabled'] = false;
            }
        } else {
            $payload['form'] = null;
            $payload['formDisabled'] = false;
        }

        return response()->json($payload);
    }

    public function create(Request $request): JsonResponse
    {
        // dibiarkan seperti semula — bisa dipakai kalau ada pemanggilan terpisah,
        // tapi endpoint /guru/journal utama sekarang sudah tidak butuh ini.
        $guru = $this->currentGuru($request);
        $now = JournalWindow::now();
        $this->ensureCanStart($guru, $now);

        return response()->json([
            'kelasList' => Kelas::where('guru_id', $guru->id)->orderBy('kelas')->get(['id', 'kelas']),
            'mapelList' => Mapel::where('guru_id', $guru->id)->orderBy('mapel')->get(['id', 'mapel']),
            'serverTime' => [
                'tanggal' => $now->toDateString(),
                'jam_mulai' => $now->format('H:i'),
                'jam_selesai' => $now->copy()->addMinutes(JournalWindow::durasiSesiMenit())->format('H:i'),
                'timezone' => JournalWindow::timezone(),
                'durasi_menit' => JournalWindow::durasiSesiMenit(),
            ],
            'targetLocation' => JournalLocation::toArray(),
            'window' => JournalWindow::toArray($now),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $guru = $this->currentGuru($request);
        $now = JournalWindow::now();
        $this->ensureCanStart($guru, $now);

        $validated = $request->validate([
            'kelas_id' => ['required', 'exists:kelas,id'],
            'mapel_id' => ['required', Rule::exists('mapel', 'id')->where('guru_id', $guru->id)],
            'materi' => ['required', 'string', 'max:2000'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'akurasi_meter' => ['required', 'numeric', 'min:0'],
        ]);

        $location = JournalLocation::validate(
            (float) $validated['latitude'],
            (float) $validated['longitude'],
            (float) $validated['akurasi_meter']
        );

        if (! $location['akurasi_ok']) {
            return response()->json(['message' => 'Sinyal GPS kurang akurat. Pastikan GPS aktif dan coba lagi di tempat terbuka.'], 422);
        }

        if (! $location['dalam_radius']) {
            return response()->json([
                'message' => 'Anda berada di luar radius lokasi sekolah (jarak saat ini sekitar ' . round($location['jarak_meter']) . ' meter). Jurnal hanya bisa diisi dari lokasi sekolah.',
                'jarak_meter' => $location['jarak_meter'],
            ], 422);
        }

        $lastJournal = Journal::where('guru_id', $guru->id)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->orderByDesc('tanggal')
            ->orderByDesc('jam_mulai')
            ->first();

        if ($lastJournal) {
            $lastTime = Carbon::parse(
                $lastJournal->tanggal->toDateString() . ' ' . $lastJournal->jam_mulai,
                JournalWindow::timezone()
            );

            if (! JournalLocation::kecepatanWajar(
                (float) $lastJournal->latitude,
                (float) $lastJournal->longitude,
                $lastTime,
                (float) $validated['latitude'],
                (float) $validated['longitude'],
                $now
            )) {
                Log::warning('Mobile journal rejected: implausible location jump', [
                    'guru_id' => $guru->id,
                    'previous_journal_id' => $lastJournal->id,
                ]);

                return response()->json(['message' => 'Lokasi tidak dapat diverifikasi. Silakan coba lagi.'], 422);
            }
        }

        $journal = Journal::create([
            'guru_id' => $guru->id,
            'kelas_id' => $validated['kelas_id'],
            'mapel_id' => $validated['mapel_id'],
            'materi' => $validated['materi'],
            'tanggal' => $now->toDateString(),
            'jam_mulai' => $now->format('H:i:s'),
            'jam_selesai' => $now->copy()->addMinutes(JournalWindow::durasiSesiMenit())->format('H:i:s'),
            'jumlah_jam' => self::JUMLAH_JAM_DEFAULT,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'akurasi_meter' => $validated['akurasi_meter'],
            'jarak_meter' => $location['jarak_meter'],
        ]);

        return response()->json(['message' => 'Jurnal mengajar berhasil disimpan.', 'journal' => $journal->load(['kelas:id,kelas', 'mapel:id,mapel'])], 201);
    }

    private function currentGuru(Request $request)
    {
        $user = $request->user();
        $guru = $user?->guru()->first() ?? \App\Models\Guru::where('user_id', $user?->id)->first();

        abort_if(! $guru, 403, 'Akun ini tidak terhubung dengan data guru.');

        return $guru;
    }

    /**
     * Riwayat jurnal per periode (minggu/bulan berjalan), dipaginasi supaya
     * ringan walau data sudah banyak — dipakai oleh layar riwayat terpisah
     * di aplikasi mobile, bukan oleh layar isi-jurnal utama.
     */
    public function history(Request $request): JsonResponse
    {
        $guru = $this->currentGuru($request);
        $now = JournalWindow::now();

        $period = $request->input('period') === 'month' ? 'month' : 'week';

        [$start, $end] = $period === 'month'
            ? [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()]
            : [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()];

        $journals = Journal::with(['kelas:id,kelas', 'mapel:id,mapel'])
            ->where('guru_id', $guru->id)
            ->whereBetween('tanggal', [$start->toDateString(), $end->toDateString()])
            ->when($request->search, fn ($query, $search) => $query->where('materi', 'like', "%{$search}%"))
            ->orderByDesc('tanggal')
            ->orderByDesc('jam_mulai')
            ->paginate(15)
            ->withQueryString();

        // Akumulasi total jam & pertemuan periode ini, sama seperti rekap
        // guru di halaman Admin/Journal (JournalController@index versi web).
        $summary = Journal::where('guru_id', $guru->id)
            ->whereBetween('tanggal', [$start->toDateString(), $end->toDateString()])
            ->selectRaw('SUM(jumlah_jam) as total_jam, COUNT(*) as total_pertemuan')
            ->first();

        return response()->json([
            'journals' => $journals,
            'period' => $period,
            'range' => [
                'start' => $start->toDateString(),
                'end' => $end->toDateString(),
            ],
            'summary' => [
                'total_jam' => (int) ($summary->total_jam ?? 0),
                'total_pertemuan' => (int) ($summary->total_pertemuan ?? 0),
            ],
        ]);
    }


    private function ensureCanStart($guru, Carbon $now): void
    {
        abort_unless(JournalWindow::isOpen($now), 422, JournalWindow::pesanDiLuarJendela($now));

        $active = $this->activeSession($guru, $now);

        // Bangun pesan hanya kalau $active memang ada — abort_if() tetap
        // mengevaluasi semua argumennya lebih dulu, jadi kalau string pesan
        // dibangun inline di sini, $active->jam_selesai akan dipanggil pada
        // null dan melempar error walau sesi tidak sedang aktif.
        if ($active) {
            abort(422, 'Anda baru bisa mengisi jurnal baru setelah sesi sebelumnya selesai pukul ' . substr($active->jam_selesai, 0, 5) . '.');
        }
    }

    /** Sesi jurnal guru hari ini yang jam_selesai-nya belum lewat, kalau ada. */
    private function activeSession($guru, Carbon $now): ?Journal
    {
        return Journal::where('guru_id', $guru->id)
            ->whereDate('tanggal', $now->toDateString())
            ->where('jam_selesai', '>', $now->format('H:i:s'))
            ->orderByDesc('jam_mulai')
            ->first();
    }
}