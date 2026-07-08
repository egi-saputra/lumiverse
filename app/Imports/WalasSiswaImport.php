<?php

namespace App\Imports;

use App\Models\User;
use App\Models\DataSiswa;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class WalasSiswaImport implements ToModel, WithHeadingRow
{
    protected $kelas_id;
    protected ?int $maxUsers;
    protected int $currentCount;
    public $failedRows = [];

    public function __construct($kelas_id)
    {
        $this->kelas_id = $kelas_id;

        $tenant = tenant();
        $this->maxUsers = $tenant?->effectiveMaxUsers();
        $this->currentCount = User::count();
    }

    public function model(array $row)
    {
        if (empty($row['nama_lengkap']) && empty($row['email']) && empty($row['nisn'])) {
            return null;
        }

        try {
            if (empty($row['nama_lengkap']) || empty($row['email'])) {
                throw new \Exception('Kolom wajib kosong');
            }

            if (User::where('email', $row['email'])->exists()) {
                throw new \Exception('Email sudah digunakan');
            }

            if (!empty($row['nis']) && DataSiswa::where('nis', $row['nis'])->exists()) {
                throw new \Exception('NIS sudah digunakan');
            }

            if (!empty($row['nisn']) && DataSiswa::where('nisn', $row['nisn'])->exists()) {
                throw new \Exception('NISN sudah digunakan');
            }

            // Cek kuota sebelum bikin user baru
            if ($this->maxUsers !== null && $this->currentCount >= $this->maxUsers) {
                throw new \Exception("Kuota pengguna penuh (maks {$this->maxUsers} akun)");
            }

            $jabatan = $row['jabatan_siswa'] ?? 'Tidak Ada';
            if (!in_array($jabatan, ['Tidak Ada','Sekretaris','Bendahara'])) {
                $jabatan = 'Tidak Ada';
            }

            $user = User::create([
                'name'     => $row['nama_lengkap'],
                'email'    => $row['email'],
                'password' => Hash::make('password'),
                'role'     => 'siswa',
            ]);

            $this->currentCount++;

            return new DataSiswa([
                'user_id'      => $user->id,
                'nama_lengkap' => $row['nama_lengkap'],
                'nis'          => $row['nis'] ?? null,
                'nisn'         => $row['nisn'] ?? null,
                'kelas_id'     => $this->kelas_id,
                'jabatan_siswa'=> $jabatan,
            ]);

        } catch (\Exception $e) {
            $this->failedRows[] = [
                'nama_lengkap' => $row['nama_lengkap'] ?? '',
                'email'        => $row['email'] ?? '',
                'nis'          => $row['nis'] ?? '',
                'nisn'         => $row['nisn'] ?? '',
                'kelas'        => '-',
                'reason'       => $e->getMessage()
            ];
            return null;
        }
    }
}