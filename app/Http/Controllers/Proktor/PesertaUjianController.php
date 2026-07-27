<?php

namespace App\Http\Controllers\Proktor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Exports\PesertaExport;
use App\Imports\PesertaImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Validation\ValidationException;

class PesertaUjianController extends Controller
{
    // Password default untuk pendaftaran bulk manual — siswa isi form sendiri nanti untuk ganti.
    protected const DEFAULT_PASSWORD = 'password';

    private function tenantIsSmk(): bool
    {
        $tenant = tenant();
        return strtolower((string) ($tenant->school_level ?? '')) === 'smk';
    }

    private function remainingSlots(): ?int
    {
        $tenant = tenant();
        if (!$tenant) return null;

        $max = $tenant->effectiveMaxUsers();
        if ($max === null) return null;

        return max(0, $max - User::count());
    }

    public function index()
    {
        // 🔹 Ambil semua peserta (untuk frontend pagination)
        $pesertaAll = Siswa::with(['kelas', 'user'])
            ->orderBy('nama_lengkap')
            ->get()
            ->map(function ($s) {
                return [
                    'id'        => $s->id_siswa,
                    'nama'      => $s->nama_lengkap,
                    'kelas'     => $s->kelas->kelas ?? '-',
                    'kelas_id'  => $s->kelas_id,
                    'status'    => $s->status,
                    'email'     => $s->user->email ?? '',
                ];
            });

        $kelasList = DB::table('kelas')
            ->orderBy('kelas')
            ->get(['id', 'kelas']);

        return inertia('Proktor/Peserta/Index', [
            'pesertaAll' => $pesertaAll,
            'kelasList'  => $kelasList,
            'title'      => 'Users Directory',
        ]);
    }

    public function showForm()
    {
        return inertia('Proktor/Peserta/Register', [
            'kelasList'      => DB::table('kelas')->orderBy('kelas')->get(['id', 'kelas']),
            'kejuruanList'   => DB::table('kejuruan')->orderBy('kejuruan')->get(['id', 'kejuruan']),
            'isSmk'          => $this->tenantIsSmk(),
            'remainingSlots' => $this->remainingSlots(),
            'title'          => 'Register User',
            'flash'          => session()->get('success'),
        ]);
    }

    // Pendaftaran bulk manual — satu kelas (dan kejuruan jika SMK) untuk semua baris.
    public function store(Request $request)
    {
        $isSmk = $this->tenantIsSmk();

        $rules = [
            'kelas_id'             => 'required|exists:kelas,id',
            'items'                => 'required|array|min:1',
            'items.*.nama_lengkap' => 'required|string|max:255',
            'items.*.email'        => 'required|email|max:255|distinct|unique:users,email',
        ];

        if ($isSmk) {
            $rules['kejuruan_id'] = 'required|exists:kejuruan,id';
        } else {
            $rules['kejuruan_id'] = 'nullable|exists:kejuruan,id';
        }

        $validated = $request->validate($rules, [
            'items.*.email.distinct' => 'Terdapat email yang sama di dalam input.',
        ]);

        $items      = $validated['items'];
        $kelasId    = $validated['kelas_id'];
        $kejuruanId = $validated['kejuruan_id'] ?? null;

        // Cek kuota sebelum insert massal
        $tenant = tenant();
        if ($tenant) {
            $max = $tenant->effectiveMaxUsers();
            if ($max !== null) {
                $remaining = max(0, $max - User::count());
                if (count($items) > $remaining) {
                    throw ValidationException::withMessages([
                        'items' => "Kuota pengguna tidak mencukupi. Sisa kuota: {$remaining} akun, sedangkan Anda mencoba menambahkan " . count($items) . ' akun. Hubungi administrator untuk upgrade paket.',
                    ]);
                }
            }
        }

        DB::transaction(function () use ($items, $kelasId, $kejuruanId) {
            foreach ($items as $item) {
                do {
                    $id_siswa = str_pad(rand(0, 9999999), 7, '0', STR_PAD_LEFT);
                } while (Siswa::where('id_siswa', $id_siswa)->exists());

                $user = User::create([
                    'name'     => $item['nama_lengkap'],
                    'email'    => $item['email'],
                    'password' => bcrypt(self::DEFAULT_PASSWORD),
                    'role'     => 'siswa',
                ]);

                Siswa::create([
                    'id_siswa'     => $id_siswa,
                    'nama_lengkap' => $item['nama_lengkap'],
                    'kelas_id'     => $kelasId,
                    'kejuruan_id'  => $kejuruanId,
                    'status'       => 'Activated',
                    'user_id'      => $user->id,
                ]);
            }
        });

        return redirect()
            ->route('proktor.peserta.index')
            ->with('success', count($items) . ' peserta berhasil didaftarkan. Password default: "' . self::DEFAULT_PASSWORD . '".');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'kelas_id'     => 'required|exists:kelas,id',
            'status'       => 'required|in:Activated,Deactivated',
            'email'        => 'required|email|max:255',
            'password'     => 'nullable|string|min:6',
        ]);

        $peserta = Siswa::where('id_siswa', $id)->firstOrFail();

        $peserta->update([
            'nama_lengkap' => $request->nama_lengkap,
            'kelas_id'     => $request->kelas_id,
            'status'       => $request->status,
        ]);

        if ($peserta->user) {
            $peserta->user->update([
                'email'    => $request->email,
                'password' => $request->password
                    ? bcrypt($request->password)
                    : $peserta->user->password,
            ]);
        }

        return response()->json([
            'success' => 'Peserta berhasil diupdate.',
        ]);
    }

    public function destroy($id)
    {
        $peserta = Siswa::where('id_siswa', $id)->firstOrFail();
        $peserta->delete();   // ← ini baru memicu event deleting()

        return response()->json([
            'success' => 'Peserta berhasil dihapus.',
        ]);
    }

    public function destroyAll(Request $request)
    {
        $query = Siswa::query();

        if ($request->kelas_id) {
            $query->where('kelas_id', $request->kelas_id);
        }

        $query->get()->each(function (Siswa $siswa) {
            $siswa->delete();   // ← trigger event satu-satu
        });

        return response()->json([
            'success' => $request->kelas_id
                ? 'Peserta sesuai kelas berhasil dihapus.'
                : 'Semua peserta berhasil dihapus.',
        ]);
    }

    public function downloadTemplate()
    {
        return Excel::download(new PesertaExport($this->tenantIsSmk()), 'template_peserta.xlsx');
    }

    public function importExcel(Request $request)
    {
        $request->validate([
            'excel' => 'required|mimes:xlsx,xls',
        ]);

        $tenant = tenant();
        $isSmk = $this->tenantIsSmk();

        if ($tenant) {
            $max = $tenant->effectiveMaxUsers();

            if ($max !== null) {
                $rows = Excel::toArray([], $request->file('excel'));
                $dataRows = $rows[0] ?? [];

                $rowCount = collect($dataRows)
                    ->slice(1)
                    ->filter(function ($row) {
                        return collect($row)->filter(function ($cell) {
                            return $cell !== null && trim((string) $cell) !== '';
                        })->isNotEmpty();
                    })
                    ->count();

                $currentCount = User::count();

                if (($currentCount + $rowCount) > $max) {
                    $sisaSlot = max(0, $max - $currentCount);
                    return redirect()
                        ->route('proktor.peserta.register')
                        ->with('error', "Import dibatalkan. Kuota pengguna tersisa {$sisaSlot} slot, tapi file berisi {$rowCount} data. Batas paket Anda: {$max} akun.");
                }
            }
        }

        $import = new PesertaImport($isSmk);
        Excel::import($import, $request->file('excel'));

        // Tidak ada satu pun baris tersimpan — jangan bilang "berhasil"
        if ($import->importedCount === 0) {
            $reasons = collect($import->skippedRows)
                ->merge($import->failedRows)
                ->map(fn ($r) => "Baris {$r['baris']} ({$r['email']}): {$r['reason']}")
                ->implode(' | ');

            return redirect()
                ->route('proktor.peserta.register')
                ->with('error', $reasons !== ''
                    ? "Import gagal, tidak ada data tersimpan. Detail: {$reasons}"
                    : 'Import gagal, tidak ada data valid ditemukan di file.');
        }

        // Berhasil sebagian atau semua — tetap kasih tahu kalau ada yang di-skip
        $message = "Berhasil mengimport {$import->importedCount} peserta.";
        if (!empty($import->skippedRows) || !empty($import->failedRows)) {
            $skippedCount = count($import->skippedRows) + count($import->failedRows);
            $message .= " {$skippedCount} baris dilewati karena data tidak valid/lengkap atau kuota penuh.";
        }

        return redirect()
            ->route('proktor.peserta.index')
            ->with('success', $message);
    }
}