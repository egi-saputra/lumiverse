<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Soal;
use App\Models\BankSoal;
use App\Models\Mapel;
use App\Models\Kelas;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class QuizController extends Controller
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
    public function index()
    {
        $soal = Soal::where('user_id', auth()->id())
            ->with(['bank_soal', 'mapel'])
            ->paginate(10);

        return Inertia::render('Guru/Quiz/Index', [
            'soal' => $soal,
            'mapel' => Mapel::select('id', 'mapel')->orderBy('mapel')->get(),
            'title' => 'Quiz List',
        ]);
    }

    // Halaman create
    public function create()
    {
        return Inertia::render('Guru/Quiz/Create', [
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
        if (tenant()->hasReachedFreeLimitForUser(Soal::class, 1)) {
            return back()->withErrors([
                        'title' => 'Plan Free hanya dapat membuat maksimal 1 quiz untuk satu akun. Silakan upgrade plan untuk menambah kuis.',
                    ]);
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

        return redirect()->route('guru.soal.index')
                        ->with('success', 'Questions have been successfully created!');
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

        return Inertia::render('Guru/Quiz/Edit', [
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
            // 'status' => 'required|in:Aktif,Tidak Aktif',
            // 'tipe_soal' => 'required|in:Berurutan,Acak',
            // 'waktu' => 'required|integer|min:1',
            // 'token' => 'required|numeric|digits:6',
            // 'token' => 'required|string|size:6',
        ]);

        $soal->update([
            'title'     => $request->title,
            'mapel_id'  => $request->mapel_id,
            'kelas'     => $request->kelas,
            // 'status'    => $request->status,
            // 'tipe_soal' => $request->tipe_soal,
            // 'waktu'     => $request->waktu,
            // 'token'     => $request->token,
        ]);

        return redirect()->route('guru.soal.index')
                        ->with('success', 'Data Quiz berhasil diperbarui!');
    }

    // Hapus data
    public function destroy(Soal $soal)
    {
        foreach ($soal->bank_soal as $bankSoal) {
            if ($bankSoal->link_lampiran) {
                if (Storage::disk('r2')->exists($bankSoal->link_lampiran)) {
                    Storage::disk('r2')->delete($bankSoal->link_lampiran);
                }
            }

            foreach (['a', 'b', 'c', 'd', 'e'] as $key) {
                $opsiLampiran = $bankSoal->{"opsi_{$key}_lampiran"};
                if ($opsiLampiran && Storage::disk('r2')->exists($opsiLampiran)) {
                    Storage::disk('r2')->delete($opsiLampiran);
                }
            }
        }

        $soal->delete();

        return response()->json(['success' => 'Quiz has been successfully deleted!']);
    }

    // Show detail
    public function show(Soal $soal)
    {
        $soal->load('bank_soal', 'mapel');

        return Inertia::render('Guru/Quiz/Show', [
            'soal' => $soal,
            'mapel' => Mapel::select('id', 'mapel')->orderBy('mapel')->get(),
            'title' => 'Question List',
        ]);
    }
}
