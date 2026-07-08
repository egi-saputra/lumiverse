<?php

namespace App\Imports;

use App\Models\Siswa;
use App\Models\User;
use App\Models\Kelas;
use App\Models\Kejuruan;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class PesertaImport implements ToModel, WithHeadingRow
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
        if (empty($row['nama_lengkap']) || empty($row['email']) || empty($row['kelas']) || empty($row['kejuruan'])) {
            return null;
        }

        $kelas = Kelas::where('kelas', $row['kelas'])->first();
        $kejuruan = Kejuruan::where('kejuruan', $row['kejuruan'])->first();

        if (!$kelas || !$kejuruan) return null;

        // Kalau user dengan email ini sudah ada, firstOrCreate nggak akan
        // nambah kuota — jadi kita cek dulu apakah perlu bikin baru
        $emailExists = User::where('email', $row['email'])->exists();

        if (!$emailExists && $this->maxUsers !== null && $this->currentCount >= $this->maxUsers) {
            $this->failedRows[] = [
                'nama_lengkap' => $row['nama_lengkap'],
                'email'        => $row['email'],
                'kelas'        => $row['kelas'],
                'kejuruan'     => $row['kejuruan'],
                'reason'       => "Kuota pengguna penuh (maks {$this->maxUsers} akun)",
            ];
            return null;
        }

        do {
            $id_siswa = str_pad(rand(0, 9999999), 7, '0', STR_PAD_LEFT);
        } while (Siswa::where('id_siswa', $id_siswa)->exists());

        $user = User::firstOrCreate(
            ['email' => $row['email']],
            [
                'name'     => $row['nama_lengkap'],
                'password' => Hash::make('password'),
            ]
        );

        if (!$emailExists) {
            $this->currentCount++;
        }

        return Siswa::create([
            'id_siswa'     => $id_siswa,
            'nama_lengkap' => $row['nama_lengkap'],
            'kelas_id'     => $kelas->id,
            'kejuruan_id'  => $kejuruan->id,
            'status'       => 'Activated',
            'user_id'      => $user->id,
        ])->load('user');
    }
}