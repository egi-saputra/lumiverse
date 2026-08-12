<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

// Models
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\Kejuruan;

class FormController extends Controller
{
    /**
     * Cek apakah tenant saat ini level SMK.
     * SESUAIKAN dengan cara kamu menyimpan school_level di tenant kamu.
     * Contoh lain: tenancy()->tenant->school_level
     */
    /**
     * Cek apakah tenant saat ini berjenjang SMK.
     * `school_level` adalah kolom asli di tabel tenants (lihat App\Models\Tenant),
     * jadi bisa diakses langsung sebagai property lewat helper tenant().
     */
    protected function isSmk(): bool
    {
        $tenant = tenant();

        if (! $tenant) {
            return false;
        }

        return strtolower((string) $tenant->school_level) === 'smk';
    }

    /**
     * Halaman form data siswa.
     * Guard: jika user sudah punya data siswa, redirect ke dashboard.
     */
    public function create(Request $request)
    {
        if ($request->user()->siswa) {
            return redirect()->route('siswa.dashboard')
                ->with('info', 'Data kamu sudah tersimpan.');
        }

        $isSmk = $this->isSmk();

        return Inertia::render('Siswa/Form/Create', [
            'kelas'    => Kelas::select('id', 'kelas')->orderBy('kelas')->get(),
            'kejuruan' => $isSmk
                ? Kejuruan::select('id', 'kejuruan')->orderBy('kejuruan')->get()
                : [],
            'isSmk'    => $isSmk,
        ]);
    }

    /**
     * Simpan data siswa.
     */
    public function store(Request $request)
    {
        // Guard: satu user hanya boleh punya satu data siswa
        if ($request->user()->siswa) {
            return redirect()->route('siswa.dashboard')
                ->with('info', 'Data kamu sudah tersimpan sebelumnya.');
        }

        $isSmk = $this->isSmk();

        $validated = $request->validate([
            // Identitas
            'nama_lengkap'  => ['required', 'string', 'max:255'],
            'nis'           => ['nullable', 'string', 'min:7', 'max:20', 'unique:siswa,nis'],
            'nisn'          => ['required', 'digits:10', 'unique:siswa,nisn'],
            'kelas_id'      => ['required', 'exists:kelas,id'],
            'kejuruan_id'   => [
                $isSmk ? 'required' : 'nullable',
                Rule::exists('kejuruan', 'id'),
            ],

            // Data pribadi — wajib semua kecuali no_hp_ortu
            'tempat_lahir'  => ['required', 'string', 'max:100'],
            'tanggal_lahir' => ['required', 'date', 'before:today'],
            'jenis_kelamin' => ['required', Rule::in(['L', 'P'])],
            'agama'         => ['required', Rule::in(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'])],
            'no_hp'         => ['required', 'string', 'regex:/^[0-9+\-\s]{8,15}$/'],
            'no_hp_ortu'    => ['nullable', 'string', 'regex:/^[0-9+\-\s]{8,15}$/'],

            // Alamat — wajib semua kecuali kode_pos
            'alamat'        => ['required', 'string'],
            'kelurahan'     => ['required', 'string', 'max:100'],
            'kecamatan'     => ['required', 'string', 'max:100'],
            'kota'          => ['required', 'string', 'max:100'],
            'kode_pos'      => ['nullable', 'digits:5'],
        ], [
            'nama_lengkap.required' => 'Nama lengkap wajib diisi.',
            'nama_lengkap.max'      => 'Nama lengkap terlalu panjang (maksimal 255 karakter).',
            'nis.min'                => 'NIS minimal 7 karakter.',
            'nis.unique'             => 'NIS ini sudah terdaftar, hubungi admin jika ada kesalahan.',
            'nisn.required'          => 'NISN wajib diisi.',
            'nisn.digits'            => 'NISN harus tepat 10 digit angka.',
            'nisn.unique'            => 'NISN ini sudah terdaftar, hubungi admin jika ada kesalahan.',
            'kelas_id.required'      => 'Silakan pilih kelas terlebih dahulu.',
            'kelas_id.exists'        => 'Kelas yang dipilih tidak valid.',
            'kejuruan_id.required'   => 'Silakan pilih program kejuruan.',
            'kejuruan_id.exists'     => 'Program kejuruan yang dipilih tidak valid.',

            'tempat_lahir.required'  => 'Tempat lahir wajib diisi.',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggal_lahir.date'     => 'Format tanggal lahir tidak valid.',
            'tanggal_lahir.before'   => 'Tanggal lahir tidak boleh hari ini atau masa depan.',
            'jenis_kelamin.required' => 'Silakan pilih jenis kelamin.',
            'jenis_kelamin.in'       => 'Jenis kelamin tidak valid.',
            'agama.required'         => 'Silakan pilih agama.',
            'agama.in'                => 'Agama yang dipilih tidak valid.',
            'no_hp.required'          => 'No. HP siswa wajib diisi.',
            'no_hp.regex'             => 'Format nomor HP tidak valid.',
            'no_hp_ortu.regex'        => 'Format nomor HP orang tua tidak valid.',

            'alamat.required'         => 'Alamat lengkap wajib diisi.',
            'kelurahan.required'      => 'Kelurahan/Desa wajib diisi.',
            'kecamatan.required'      => 'Kecamatan wajib diisi.',
            'kota.required'           => 'Kota/Kabupaten wajib diisi.',
            'kode_pos.digits'         => 'Kode pos harus 5 digit angka.',
        ]);

        try {
            Siswa::create([
                'user_id'       => auth()->id(),
                'nama_lengkap'  => trim($validated['nama_lengkap']),
                'nis'           => $validated['nis'] ? trim($validated['nis']) : null,
                'nisn'          => trim($validated['nisn']),
                'kelas_id'      => $validated['kelas_id'],
                'kejuruan_id'   => $isSmk ? ($validated['kejuruan_id'] ?? null) : null,

                'tempat_lahir'  => $validated['tempat_lahir'] ?? null,
                'tanggal_lahir' => $validated['tanggal_lahir'] ?? null,
                'jenis_kelamin' => $validated['jenis_kelamin'] ?? null,
                'agama'         => $validated['agama'] ?? null,
                'no_hp'         => $validated['no_hp'] ?? null,
                'no_hp_ortu'    => $validated['no_hp_ortu'] ?? null,

                'alamat'        => $validated['alamat'] ?? null,
                'kelurahan'     => $validated['kelurahan'] ?? null,
                'kecamatan'     => $validated['kecamatan'] ?? null,
                'kota'          => $validated['kota'] ?? null,
                'kode_pos'      => $validated['kode_pos'] ?? null,

                // id_siswa otomatis di-generate di Siswa::boot()
                'status'        => 'Activated',
            ]);

            // Role baru dikunci jadi 'siswa' setelah data siswa benar-benar tersimpan.
            $request->user()->update(['role' => 'siswa']);
        } catch (\Exception $e) {
            \Log::error('FormController@store failed: ' . $e->getMessage());

            return back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
        }

        return redirect()
            ->route('siswa.dashboard')
            ->with('success', 'Data berhasil disimpan! Selamat datang 🎉');
    }
}