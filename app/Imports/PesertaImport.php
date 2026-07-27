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
    protected bool $isSmk;
    protected int $rowNumber = 1; // baris 1 = heading, data mulai baris 2

    public array $failedRows = [];   // gagal karena kuota penuh
    public array $skippedRows = [];  // gagal karena data tidak lengkap / tidak valid
    public int $importedCount = 0;   // berhasil disimpan

    public function __construct(bool $isSmk = false)
    {
        $tenant = tenant();
        $this->maxUsers = $tenant?->effectiveMaxUsers();
        $this->currentCount = User::count();
        $this->isSmk = $isSmk;
    }

    public function model(array $row)
    {
        $this->rowNumber++;
        $excelRow = $this->rowNumber;

        // Lewati baris yang benar-benar kosong total (bukan error, memang tidak diisi)
        $allEmpty = collect($row)->filter(fn ($v) => $v !== null && trim((string) $v) !== '')->isEmpty();
        if ($allEmpty) {
            return null;
        }

        // Kejuruan hanya wajib diisi kalau tenant berjenjang SMK
        $requiredFields = ['nama_lengkap', 'email', 'kelas'];
        if ($this->isSmk) {
            $requiredFields[] = 'kejuruan';
        }

        $missing = [];
        foreach ($requiredFields as $field) {
            if (empty($row[$field])) {
                $missing[] = $field;
            }
        }

        if (!empty($missing)) {
            $this->skippedRows[] = [
                'baris'  => $excelRow,
                'email'  => $row['email'] ?? '-',
                'reason' => 'Kolom wajib kosong: ' . implode(', ', $missing),
            ];
            return null;
        }

        $kelas = Kelas::where('kelas', $row['kelas'])->first();
        if (!$kelas) {
            $this->skippedRows[] = [
                'baris'  => $excelRow,
                'email'  => $row['email'] ?? '-',
                'reason' => "Kelas \"{$row['kelas']}\" tidak ditemukan di sistem",
            ];
            return null;
        }

        $kejuruanId = null;
        if ($this->isSmk) {
            $kejuruan = Kejuruan::where('kejuruan', $row['kejuruan'])->first();
            if (!$kejuruan) {
                $this->skippedRows[] = [
                    'baris'  => $excelRow,
                    'email'  => $row['email'] ?? '-',
                    'reason' => "Kejuruan \"{$row['kejuruan']}\" tidak ditemukan di sistem",
                ];
                return null;
            }
            $kejuruanId = $kejuruan->id;
        }

        // Kalau user dengan email ini sudah ada, firstOrCreate nggak akan
        // nambah kuota — jadi kita cek dulu apakah perlu bikin baru
        $emailExists = User::where('email', $row['email'])->exists();

        if (!$emailExists && $this->maxUsers !== null && $this->currentCount >= $this->maxUsers) {
            $this->failedRows[] = [
                'baris'    => $excelRow,
                'email'    => $row['email'],
                'reason'   => "Kuota pengguna penuh (maks {$this->maxUsers} akun)",
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

        $this->importedCount++;

        return Siswa::create([
            'id_siswa'     => $id_siswa,
            'nama_lengkap' => $row['nama_lengkap'],
            'kelas_id'     => $kelas->id,
            'kejuruan_id'  => $kejuruanId,
            'status'       => 'Activated',
            'user_id'      => $user->id,
        ])->load('user');
    }
}