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
            'kelasList' => DB::table('kelas')->orderBy('kelas')->get(['id', 'kelas']),
            'kejuruanList' => DB::table('kejuruan')->orderBy('kejuruan')->get(['id', 'kejuruan']),
            'title' => 'Register User',
            'flash' => session()->get('success'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email'        => 'required|email|max:255',
            'password'     => 'nullable|string|min:6',
            'kelas_id'     => 'required|exists:kelas,id',
            'kejuruan_id'  => 'nullable|exists:kejuruan,id',
        ]);

        // Cek kuota user sebelum bikin siswa baru
        $tenant = tenant();
        if ($tenant && $tenant->hasReachedUserLimitInContext()) {
            $max = $tenant->effectiveMaxUsers();
            return response()->json([
                'error' => "Batas jumlah pengguna ({$max}) untuk paket Anda sudah tercapai. Silakan upgrade paket untuk menambah peserta baru.",
            ], 422);
        }

        // Generate id_siswa unik
        do {
            $id_siswa = str_pad(rand(0, 9999999), 7, '0', STR_PAD_LEFT);
        } while (Siswa::where('id_siswa', $id_siswa)->exists());

        $user = User::create([
            'name'     => $request->nama_lengkap,
            'email'    => $request->email,
            'password' => bcrypt($request->password ?? 'password'),
        ]);

        Siswa::create([
            'id_siswa'     => $id_siswa,
            'nama_lengkap' => $request->nama_lengkap,
            'kelas_id'     => $request->kelas_id,
            'kejuruan_id'  => $request->kejuruan_id,
            'status'       => 'Activated',
            'user_id'      => $user->id,
        ]);

        return response()->json([
            'success' => 'Peserta berhasil didaftarkan. ID Siswa: ' . $id_siswa,
        ]);
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
        Siswa::where('id_siswa', $id)->delete();

        return response()->json([
            'success' => 'Peserta berhasil dihapus.',
        ]);
    }

    public function destroyAll(Request $request)
    {
        $query = Siswa::query();

        // hapus berdasarkan kelas jika ada filter
        if ($request->kelas_id) {
            $query->where('kelas_id', $request->kelas_id);
        }

        $query->delete();

        return response()->json([
            'success' => $request->kelas_id
                ? 'Peserta sesuai kelas berhasil dihapus.'
                : 'Semua peserta berhasil dihapus.',
        ]);
    }

    public function downloadTemplate()
    {
        return Excel::download(new PesertaExport, 'template_peserta.xlsx');
    }

    public function importExcel(Request $request)
    {
        $request->validate([
            'excel' => 'required|mimes:xlsx,xls',
        ]);

        $tenant = tenant();

        if ($tenant) {
            $max = $tenant->effectiveMaxUsers();

            if ($max !== null) {
                // Hitung jumlah baris data di file (tanpa header)
                $rows = Excel::toArray([], $request->file('excel'));
                $rowCount = isset($rows[0]) ? max(0, count($rows[0]) - 1) : 0;

                $currentCount = User::count();

                if (($currentCount + $rowCount) > $max) {
                    $sisaSlot = max(0, $max - $currentCount);
                    return redirect()
                        ->route('proktor.peserta.index')
                        ->with('error', "Import dibatalkan. Kuota pengguna tersisa {$sisaSlot} slot, tapi file berisi {$rowCount} data. Batas paket Anda: {$max} akun.");
                }
            }
        }

        Excel::import(new PesertaImport(), $request->file('excel'));

        return redirect()
            ->route('proktor.peserta.index')
            ->with('success', 'Data peserta berhasil diimport!');
    }
}
