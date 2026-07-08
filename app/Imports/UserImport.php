<?php

namespace App\Imports;

use App\Models\User;
use App\Models\DataSiswa;
use App\Models\DataGuru;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;

class UserImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use SkipsFailures;

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
        // Cek kuota sebelum bikin user baru
        if ($this->maxUsers !== null && $this->currentCount >= $this->maxUsers) {
            $this->failedRows[] = [
                'name'   => $row['name'] ?? null,
                'email'  => $row['email'] ?? null,
                'role'   => $row['role'] ?? null,
                'reason' => "Kuota pengguna penuh (maks {$this->maxUsers} akun)",
            ];
            return null;
        }

        $user = new User([
            'name'     => $row['name'],
            'email'    => $row['email'],
            'password' => Hash::make($row['password']),
            'role'     => $row['role'] === 'admin' ? 'user' : strtolower($row['role']),
        ]);

        $user->save();

        $this->currentCount++;

        if ($user->role === 'siswa') {
            DataSiswa::create([
                'users_id'     => $user->id,
                'nama_lengkap' => $user->name,
                'status'       => 'Aktif',
            ]);
        }

        if ($user->role === 'guru') {
            DataGuru::create([
                'user_id' => $user->id,
                'nama'    => $user->name,
                'kode'    => 'G' . str_pad($user->id, 3, '0', STR_PAD_LEFT),
            ]);
        }

        return $user;
    }

    public function rules(): array
    {
        return [
            '*.name'     => ['required', 'string', 'max:255'],
            '*.email'    => ['required', 'email', 'unique:users,email'],
            '*.password' => ['required', 'string', 'min:6'],
            '*.role'     => ['required', 'in:user,siswa,guru,staff'],
        ];
    }

    public function customValidationMessages()
    {
        return [
            '*.role.in' => 'Role tidak valid. Hanya diperbolehkan: user, siswa, guru, staff.',
        ];
    }
}