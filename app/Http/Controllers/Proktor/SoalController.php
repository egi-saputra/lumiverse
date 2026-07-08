<?php

namespace App\Http\Controllers\Proktor;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Soal;
use App\Models\BankSoal;
use App\Models\Mapel;
use App\Models\Kelas;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class SoalController extends Controller
{
    // Generate token 6 digit unik
    private function generateToken()
    {
        do {
            $token = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (Soal::where('token', $token)->exists());

        return $token;
    }

    // Tampilkan daftar soal
    public function index(Request $request)
    {
        $search = $request->input('search');

        // Jika AJAX request minta semua data (untuk client-side filtering)
        if ($request->wantsJson() && $request->input('per_page') === 'all') {
            $soal = Soal::with(['bank_soal', 'mapel'])
                ->latest()
                ->get();
            return response()->json(['data' => $soal]);
        }

        $soal = Soal::with(['bank_soal', 'mapel'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kelas', 'like', "%{$search}%")
                    ->orWhere('token', 'like', "%{$search}%")
                    ->orWhereHas('mapel', fn($mq) =>
                        $mq->where('mapel', 'like', "%{$search}%")
                    );
                });
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Proktor/Soal/Index', [
            'soal'    => $soal,
            'mapel'   => Mapel::select('id', 'mapel')->orderBy('mapel')->get(),
            'filters' => ['search' => $search],
            'title'   => 'Quiz List',
        ]);
    }

    // Halaman create
    public function create()
    {
        return Inertia::render('Proktor/Soal/Create', [
            'mapel' => Mapel::select('id', 'mapel')
                            ->orderBy('mapel')
                            ->get(),
            'title' => 'Create / Add Quiz'
        ]);
    }

    // Simpan data ke database
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'mapel_id' => 'required|exists:mapel,id',
            'kelas' => 'required|string',
            'status' => 'required|in:Aktif,Tidak Aktif',
            'tipe_soal' => 'required|in:Acak,Berurutan',
            'waktu' => 'required|integer|min:1',
        ]);

        // ── Cek limit untuk plan Free tier ──────────────────────
        if (tenant()->hasReachedFreeLimit(Soal::class, 3)) {
            return back()->with('error', 'Plan Free hanya dapat membuat maksimal 3 quiz. Silakan upgrade plan untuk menambah kuis.');
        }

        Soal::create([
            'user_id'   => Auth::id(),
            'title'     => $request->title,
            'mapel_id'     => $request->mapel_id,
            'kelas'     => $request->kelas,
            'status'    => $request->status,
            'tipe_soal' => $request->tipe_soal,
            'waktu'     => $request->waktu,
            'token'     => $this->generateToken(),
        ]);

        return redirect()->route('proktor.soal.index')
                        ->with('success', 'Soal berhasil dibuat!');
    }

    public function edit(Soal $soal)
    {
        // Load relasi bank_soal agar frontend dapat mengecek panjangnya
        $soal->load('bank_soal');

        // Ambil salah satu nilai per butir soal
        $nilaiPerSoal = $soal->bank_soal()->first()?->nilai ?? 0;

        // Ambil daftar mapel untuk select option
        $mapel = Mapel::select('id', 'mapel')
                    ->orderBy('mapel')
                    ->get();

        return Inertia::render('Proktor/Soal/Edit', [
            'soal' => $soal,
            'nilai_per_soal' => $nilaiPerSoal,
            'mapel' => $mapel,
        ]);
    }

    // Update data quiz (mapel_id, kelas, dll)
    public function update(Request $request, Soal $soal)
    {
        $request->validate([
            'title' => 'required|string',
            'mapel_id' => 'required|exists:mapel,id',
            'kelas' => 'required|string',
            'status' => 'required|in:Aktif,Tidak Aktif',
            'tipe_soal' => 'required|in:Berurutan,Acak',
            'waktu' => 'required|integer|min:1',
            // 'token' => 'required|numeric|digits:6',
            'token' => 'required|string|size:6',
        ]);

        $soal->update([
            'title'     => $request->title,
            'mapel_id'  => $request->mapel_id,
            'kelas'     => $request->kelas,
            'status'    => $request->status,
            'tipe_soal' => $request->tipe_soal,
            'waktu'     => $request->waktu,
            'token'     => $request->token,
        ]);

        return redirect()->route('proktor.soal.index')
                        ->with('success', 'Data Quiz berhasil diperbarui!');
    }

    public function destroy(Soal $soal)
    {
        foreach ($soal->bank_soal as $bankSoal) {
            // Hapus lampiran soal utama
            if ($bankSoal->link_lampiran) {
                $path = str_replace('storage/', 'public/', $bankSoal->link_lampiran);
                if (Storage::exists($path)) Storage::delete($path);
            }

            // Hapus lampiran gambar opsi jawaban
            foreach (['a', 'b', 'c', 'd', 'e'] as $key) {
                $opsiLampiran = $bankSoal->{"opsi_{$key}_lampiran"};
                if ($opsiLampiran) {
                    $path = str_replace('storage/', 'public/', $opsiLampiran);
                    if (Storage::exists($path)) Storage::delete($path);
                }
            }
        }

        $soal->delete();

        return response()->json([
            'success' => 'Quiz has been successfully deleted!',
        ]);
    }

    public function show(Soal $soal)
    {
        $soal->load('bank_soal', 'mapel');

        // Set default jawaban jika null
        $soal->bank_soal->transform(function($item) {
            if ($item->jawaban_benar === null || $item->jawaban_benar === '') {
                $item->jawaban_benar = 'No correct answer defined.';
            }
            return $item;
        });

        return Inertia::render('Proktor/Soal/Show', [
            'soal' => $soal,
            'mapel' => Mapel::select('id', 'mapel')->orderBy('mapel')->get(),
            'title' => 'Detail Quiz',
        ]);
    }

    public function updateNilai(Request $request, Soal $soal)
    {
        $request->validate([
            'nilai' => 'required|numeric|min:0',
        ]);

        if (!$soal->bank_soal()->exists()) {
            return response()->json(['error' => 'Tidak ada soal'], 404);
        }

        DB::beginTransaction();

        try {
            // 1. Update nilai di bank_soal
            BankSoal::where('soal_id', $soal->id)
                ->update(['nilai' => $request->nilai]);

            // 2. Re-evaluate benar + nilai sekaligus
            //    Pakai JOIN ke bank_soal untuk ambil jawaban_benar per quest_id
            DB::statement("
                UPDATE riwayat_ujian ru
                JOIN bank_soal bs ON bs.id = ru.quest_id
                SET
                    ru.benar = CASE
                        WHEN CONCAT('opsi_', LOWER(ru.jawaban)) = bs.jawaban_benar THEN 1
                        ELSE 0
                    END,
                    ru.nilai = CASE
                        WHEN CONCAT('opsi_', LOWER(ru.jawaban)) = bs.jawaban_benar THEN ?
                        ELSE 0
                    END
                WHERE ru.soal_id = ?
                AND ru.jawaban IS NOT NULL
            ", [$request->nilai, $soal->id]);

            DB::commit();

            return response()->json([
                'success' => 'Nilai berhasil diperbarui dan riwayat ujian telah direcalculate!'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal memperbarui nilai: ' . $e->getMessage()], 500);
        }
    }
}
