<?php

namespace App\Imports;

use App\Models\DataSiswa;
use App\Models\User;
use App\Models\DataKelas;
use App\Models\DataKejuruan;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\Importable;

class SiswaImport implements ToModel, WithHeadingRow
{
    use Importable;

    protected ?int $maxUsers;
    protected int $currentCount;
    public $failedRows = [];

    public function __construct()
    {
        $tenant = tenant();
        $this->maxUsers = $tenant?->effectiveMaxUsers();
        $this->currentCount = User::count();
    }

    public function model(array $row)
    {
        $normalized = [];
        foreach ($row as $key => $value) {
            $key = strtolower(trim($key));
            $normalized[$key] = is_string($value) ? trim($value) : $value;
        }
        $row = $normalized;

        if (
            empty($row['nama_lengkap']) ||
            empty($row['email']) ||
            empty($row['kelas']) ||
            empty($row['kejuruan'])
        ) {
            $this->failedRows[] = [
                'nama_lengkap' => $row['nama_lengkap'] ?? null,
                'email'        => $row['email'] ?? null,
                'nis'          => $row['nis'] ?? null,
                'nisn'         => $row['nisn'] ?? null,
                'kelas'        => $row['kelas'] ?? null,
                'kejuruan'     => $row['kejuruan'] ?? null,
                'reason'       => 'Kolom wajib kosong',
            ];
            return null;
        }

        if (
            User::where('email', $row['email'])->exists() ||
            (!empty($row['nis']) && DataSiswa::where('nis', $row['nis'])->exists()) ||
            (!empty($row['nisn']) && DataSiswa::where('nisn', $row['nisn'])->exists())
        ) {
            $this->failedRows[] = [
                'nama_lengkap' => $row['nama_lengkap'],
                'email'        => $row['email'],
                'nis'          => $row['nis'] ?? null,
                'nisn'         => $row['nisn'] ?? null,
                'kelas'        => $row['kelas'],
                'kejuruan'     => $row['kejuruan'],
                'reason'       => 'Email, NIS, atau NISN sudah ada',
            ];
            return null;
        }

        $kelas = DataKelas::where('kelas', $row['kelas'])
            ->orWhere('kode', $row['kelas'])
            ->first();
        if (!$kelas) {
            $this->failedRows[] = [
                'nama_lengkap' => $row['nama_lengkap'],
                'email'        => $row['email'],
                'nis'          => $row['nis'] ?? null,
                'nisn'         => $row['nisn'] ?? null,
                'kelas'        => $row['kelas'],
                'kejuruan'     => $row['kejuruan'],
                'reason'       => 'Kelas tidak ditemukan',
            ];
            return null;
        }

        $kejuruan = DataKejuruan::where('nama_kejuruan', $row['kejuruan'])
            ->orWhere('kode', $row['kejuruan'])
            ->first();
        if (!$kejuruan) {
            $this->failedRows[] = [
                'nama_lengkap' => $row['nama_lengkap'],
                'email'        => $row['email'],
                'nis'          => $row['nis'] ?? null,
                'nisn'         => $row['nisn'] ?? null,
                'kelas'        => $row['kelas'],
                'kejuruan'     => $row['kejuruan'],
                'reason'       => 'Kejuruan tidak ditemukan',
            ];
            return null;
        }

        // Cek kuota sebelum bikin user baru
        if ($this->maxUsers !== null && $this->currentCount >= $this->maxUsers) {
            $this->failedRows[] = [
                'nama_lengkap' => $row['nama_lengkap'],
                'email'        => $row['email'],
                'nis'          => $row['nis'] ?? null,
                'nisn'         => $row['nisn'] ?? null,
                'kelas'        => $row['kelas'],
                'kejuruan'     => $row['kejuruan'],
                'reason'       => "Kuota pengguna penuh (maks {$this->maxUsers} akun)",
            ];
            return null;
        }

        $user = User::create([
            'name'     => $row['nama_lengkap'],
            'email'    => $row['email'],
            'password' => Hash::make(env('DEFAULT_SISWA_PASSWORD', 'password')),
            'role'     => 'siswa',
        ]);

        $this->currentCount++;

        return new DataSiswa([
            'user_id'       => $user->id,
            'nama_lengkap'  => $row['nama_lengkap'],
            'nis'           => $row['nis'] ?? null,
            'nisn'          => $row['nisn'] ?? null,
            'kelas_id'      => $kelas->id,
            'kejuruan_id'   => $kejuruan->id,
            'jabatan_siswa' => null,
            'jenis_kelamin' => $row['jenis_kelamin'] ?? 'Laki-laki',
            'agama'         => $row['agama'] ?? 'Islam',
            'status'        => 'Aktif',
        ]);
    }
}