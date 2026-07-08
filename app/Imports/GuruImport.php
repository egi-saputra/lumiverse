<?php

namespace App\Imports;

use App\Models\DataGuru;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class GuruImport implements ToModel, WithHeadingRow
{
    protected ?int $maxUsers;
    protected int $currentCount;
    public array $failedRows = [];

    public function __construct()
    {
        $tenant = tenant();
        $this->maxUsers = $tenant?->effectiveMaxUsers();
        $this->currentCount = User::count();
    }

    public function model(array $row)
    {
        // Jika kode kosong, skip
        if (empty($row['kode'])) {
            return null;
        }

        // Cek apakah kode sudah ada di tabel data_guru
        if (DataGuru::where('kode', $row['kode'])->exists()) {
            return null;
        }

        // Cek apakah email ada
        if (empty($row['email'])) {
            return null;
        }

        // Jika email sudah ada, skip
        if (User::where('email', $row['email'])->exists()) {
            return null;
        }

        // Cek kuota sebelum bikin user baru
        if ($this->maxUsers !== null && $this->currentCount >= $this->maxUsers) {
            $this->failedRows[] = [
                'kode'   => $row['kode'],
                'nama'   => $row['nama'] ?? null,
                'email'  => $row['email'],
                'reason' => "Kuota pengguna penuh (maks {$this->maxUsers} akun)",
            ];
            return null;
        }

        // Buat user baru
        $user = User::create([
            'name'     => $row['nama'] ?? '-',
            'email'    => $row['email'],
            'password' => Hash::make(env('DEFAULT_GURU_PASSWORD', 'password')),
            'role'     => 'guru',
        ]);

        $this->currentCount++;

        return new DataGuru([
            'kode'    => $row['kode'],
            'user_id' => $user->id,
        ]);
    }
}