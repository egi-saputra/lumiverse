<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Journal;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Support\JournalLocation;
use App\Support\JournalWindow;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class JournalController extends Controller
{
    /**
     * Jumlah jam yang otomatis dicatat setiap kali guru mengisi jurnal.
     * Ini nilai default di level APLIKASI (bukan database) — kolom
     * `jumlah_jam` di database defaultnya tetap 1 sebagai fallback.
     */
    private const JUMLAH_JAM_DEFAULT = 2;

    /**
     * Ambil data guru yang sedang login.
     */
    private function currentGuru()
    {
        $guru = Auth::user()->guru;

        abort_if(!$guru, 403, 'Akun ini tidak terhubung dengan data guru.');

        return $guru;
    }

    /**
     * Pastikan jurnal yang diakses memang milik guru yang login.
     */
    private function authorizeJournal(Journal $journal): void
    {
        abort_unless($journal->guru_id === $this->currentGuru()->id, 403);
    }

    /**
     * Cari jurnal guru hari ini yang sesi-nya masih berlangsung
     * (jam sekarang belum melewati jam_selesai jurnal tsb).
     */
    private function sesiMasihBerlangsung($guru, Carbon $now): ?Journal
    {
        return Journal::where('guru_id', $guru->id)
            ->whereDate('tanggal', $now->toDateString())
            ->where('jam_selesai', '>', $now->format('H:i:s'))
            ->orderByDesc('jam_mulai')
            ->first();
    }

    /**
     * Validasi lokasi yang dikirim guru: hitung ulang di server (tidak
     * pernah percaya hasil valid/tidak dari client), lalu cek juga
     * kewajaran kecepatan pindah dari entri jurnal terakhir guru ini
     * untuk mendeteksi lompatan lokasi yang mustahil.
     *
     * @return string|null Pesan error kalau lokasi ditolak, null kalau valid.
     */
    private function validasiLokasi($guru, Request $request, Carbon $now): ?string
    {
        $lat = (float) $request->input('latitude');
        $lng = (float) $request->input('longitude');
        $akurasi = (float) $request->input('akurasi_meter');

        $hasil = JournalLocation::validate($lat, $lng, $akurasi);

        if (!$hasil['akurasi_ok']) {
            Log::warning('Jurnal ditolak: akurasi GPS terlalu rendah', [
                'guru_id' => $guru->id,
                'akurasi_meter' => $akurasi,
                'jarak_meter' => $hasil['jarak_meter'],
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return 'Sinyal GPS kurang akurat. Pastikan GPS aktif dan coba lagi di tempat terbuka.';
        }

        if (!$hasil['dalam_radius']) {
            Log::warning('Jurnal ditolak: di luar radius lokasi', [
                'guru_id' => $guru->id,
                'jarak_meter' => $hasil['jarak_meter'],
                'akurasi_meter' => $akurasi,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return 'Anda berada di luar radius lokasi sekolah (jarak saat ini sekitar ' . round($hasil['jarak_meter']) . ' meter). Jurnal hanya bisa diisi dari lokasi sekolah.';
        }

        // Cek kewajaran kecepatan pindah dari entri jurnal terakhir guru ini.
        $entriTerakhir = Journal::where('guru_id', $guru->id)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->orderByDesc('tanggal')
            ->orderByDesc('jam_mulai')
            ->first();

        if ($entriTerakhir) {
            $waktuTerakhir = Carbon::parse($entriTerakhir->tanggal->toDateString() . ' ' . $entriTerakhir->jam_mulai, JournalWindow::TIMEZONE);

            $wajar = JournalLocation::kecepatanWajar(
                (float) $entriTerakhir->latitude,
                (float) $entriTerakhir->longitude,
                $waktuTerakhir,
                $lat,
                $lng,
                $now
            );

            if (!$wajar) {
                Log::warning('Jurnal ditolak: lompatan lokasi tidak wajar dibanding entri sebelumnya', [
                    'guru_id' => $guru->id,
                    'entri_sebelumnya_id' => $entriTerakhir->id,
                    'jarak_meter' => $hasil['jarak_meter'],
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);

                return 'Lokasi tidak dapat diverifikasi. Silakan coba lagi, atau hubungi admin jika masalah berlanjut.';
            }
        }

        return null;
    }

    public function index(Request $request)
    {
        $guru = $this->currentGuru();

        $journals = Journal::with(['kelas:id,kelas', 'mapel:id,mapel'])
            ->where('guru_id', $guru->id)
            ->when($request->search, function ($query) use ($request) {
                $query->where('materi', 'like', "%{$request->search}%");
            })
            ->when($request->tanggal, function ($query) use ($request) {
                $query->whereDate('tanggal', $request->tanggal);
            })
            ->orderByDesc('tanggal')
            ->orderByDesc('jam_mulai')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Guru/Journal/Index', [
            'journals' => $journals,
            'filters' => $request->only(['search', 'tanggal']),
        ]);
    }

    public function create()
    {
        $guru = $this->currentGuru();
        $now = JournalWindow::now();

        // Tutup akses halaman isi jurnal di luar jendela 06:00 - 14:00
        if (!JournalWindow::isOpen($now)) {
            return redirect()
                ->route('guru.journal.index')
                ->with('error', JournalWindow::pesanDiLuarJendela($now));
        }

        // Cegah spam: guru belum bisa isi jurnal baru selama sesi sebelumnya masih berjalan
        $sesiAktif = $this->sesiMasihBerlangsung($guru, $now);
        if ($sesiAktif) {
            return redirect()
                ->route('guru.journal.index')
                ->with('error', 'Anda baru bisa mengisi jurnal baru setelah sesi mengajar sebelumnya selesai pukul ' . substr($sesiAktif->jam_selesai, 0, 5) . '.');
        }

        return Inertia::render('Guru/Journal/Create', [
            'kelasList' => Kelas::orderBy('kelas')->get(['id', 'kelas']),
            // Hanya mapel yang benar-benar diajar oleh guru ini
            'mapelList' => Mapel::where('guru_id', $guru->id)->orderBy('mapel')->get(['id', 'mapel']),
            // Waktu ditentukan oleh server, front-end hanya menampilkan (read-only)
            'serverTime' => [
                'tanggal'     => $now->toDateString(),
                'jam_mulai'   => $now->format('H:i'),
                'jam_selesai' => $now->copy()->addMinutes(JournalWindow::durasiSesiMenit())->format('H:i'),
            ],
            // Lokasi target & threshold — front-end pakai ini cuma untuk
            // pratinjau/UX (misal tampilkan jarak perkiraan). Validasi yang
            // sebenarnya selalu dihitung ulang di server saat submit.
            'targetLocation' => JournalLocation::toArray(),
        ]);
    }

    public function store(Request $request)
    {
        $guru = $this->currentGuru();
        $now = JournalWindow::now();

        // Validasi ulang jendela waktu & sesi aktif di server (anti race-condition / manipulasi request)
        if (!JournalWindow::isOpen($now)) {
            return redirect()
                ->route('guru.journal.index')
                ->with('error', JournalWindow::pesanDiLuarJendela($now));
        }

        $sesiAktif = $this->sesiMasihBerlangsung($guru, $now);
        if ($sesiAktif) {
            return redirect()
                ->route('guru.journal.index')
                ->with('error', 'Anda baru bisa mengisi jurnal baru setelah sesi mengajar sebelumnya selesai pukul ' . substr($sesiAktif->jam_selesai, 0, 5) . '.');
        }

        $validated = $request->validate([
            'kelas_id' => ['required', 'exists:kelas,id'],
            'mapel_id' => [
                'required',
                Rule::exists('mapel', 'id')->where('guru_id', $guru->id),
            ],
            'materi' => ['required', 'string', 'max:2000'],
            // Lokasi wajib dikirim mentah oleh client (hasil Geolocation API).
            // Server yang menentukan valid/tidak, bukan client.
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'akurasi_meter' => ['required', 'numeric', 'min:0'],
        ]);

        $pesanErrorLokasi = $this->validasiLokasi($guru, $request, $now);
        if ($pesanErrorLokasi) {
            return redirect()
                ->route('guru.journal.create')
                ->with('error', $pesanErrorLokasi);
        }

        $hasilLokasi = JournalLocation::validate(
            (float) $validated['latitude'],
            (float) $validated['longitude'],
            (float) $validated['akurasi_meter']
        );

        // Tanggal & jam TIDAK diambil dari input client, tapi dari waktu server saat submit
        Journal::create([
            'guru_id'     => $guru->id,
            'kelas_id'    => $validated['kelas_id'],
            'mapel_id'    => $validated['mapel_id'],
            'materi'      => $validated['materi'],
            'tanggal'     => $now->toDateString(),
            'jam_mulai'   => $now->format('H:i:s'),
            'jam_selesai' => $now->copy()->addMinutes(JournalWindow::durasiSesiMenit())->format('H:i:s'),
            'jumlah_jam'  => self::JUMLAH_JAM_DEFAULT,
            'latitude'      => $validated['latitude'],
            'longitude'     => $validated['longitude'],
            'akurasi_meter' => $validated['akurasi_meter'],
            'jarak_meter'   => $hasilLokasi['jarak_meter'],
        ]);

        return redirect()
            ->route('guru.journal.index')
            ->with('success', 'Jurnal mengajar berhasil disimpan.');
    }

    public function edit(Journal $journal)
    {
        $this->authorizeJournal($journal);
        $guru = $this->currentGuru();

        return Inertia::render('Guru/Journal/Edit', [
            'journal' => $journal->only([
                'id', 'kelas_id', 'mapel_id', 'tanggal', 'jam_mulai', 'jam_selesai', 'materi',
            ]),
            'kelasList' => Kelas::orderBy('kelas')->get(['id', 'kelas']),
            'mapelList' => Mapel::where('guru_id', $guru->id)->orderBy('mapel')->get(['id', 'mapel']),
        ]);
    }

    public function update(Request $request, Journal $journal)
    {
        $this->authorizeJournal($journal);
        $guru = $this->currentGuru();

        $validated = $request->validate([
            'kelas_id' => ['required', 'exists:kelas,id'],
            'mapel_id' => [
                'required',
                Rule::exists('mapel', 'id')->where('guru_id', $guru->id),
            ],
            'materi' => ['required', 'string', 'max:2000'],
        ]);

        // Waktu sesi (tanggal/jam) dan lokasi tetap tidak bisa diubah lewat
        // form, hanya kelas/mapel/materi. Lokasi memang hanya divalidasi
        // sekali saat submit awal (store), bukan saat edit.
        $journal->update($validated);

        return redirect()
            ->route('guru.journal.index')
            ->with('success', 'Jurnal mengajar berhasil diperbarui.');
    }

    // public function destroy(Journal $journal)
    // {
    //     $this->authorizeJournal($journal);

    //     $journal->delete();

    //     return back()->with('success', 'Jurnal mengajar berhasil dihapus.');
    // }
}