<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ProfilSekolahRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Sesuaikan dengan policy/gate jika diperlukan
    }

    public function rules(): array
    {
        return [
            'nama_sekolah'    => ['required', 'string', 'max:255'],
            'kepala_yayasan'  => ['nullable', 'string', 'max:255'],
            'kepala_sekolah'  => ['nullable', 'string', 'max:255'],
            'akreditasi'      => ['nullable', 'string', 'max:50'],
            'npsn'            => ['nullable', 'string', 'max:50'],
            'no_izin'         => ['nullable', 'string', 'max:50'],
            'nss'             => ['nullable', 'string', 'max:50'],
            'alamat'          => ['nullable', 'string'],
            'rt'              => ['nullable', 'string', 'max:5'],
            'rw'              => ['nullable', 'string', 'max:5'],
            'kelurahan'       => ['nullable', 'string', 'max:100'],
            'kecamatan'       => ['nullable', 'string', 'max:100'],
            'kabupaten_kota'  => ['nullable', 'string', 'max:100'],
            'provinsi'        => ['nullable', 'string', 'max:100'],
            'kode_pos'        => ['nullable', 'string', 'max:10'],
            'telepon'         => ['nullable', 'string', 'max:20'],
            'email'           => ['nullable', 'email', 'max:255'],
            'website'         => ['nullable', 'string', 'max:255'],
            'visi'            => ['nullable', 'string'],
            'misi'            => ['nullable', 'string'],
            'logo'            => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
        ];
    }

    public function attributes(): array
    {
        return [
            'nama_sekolah'   => 'Nama Sekolah',
            'kepala_yayasan' => 'Nama Kepala Yayasan',
            'kepala_sekolah' => 'Nama Kepala Sekolah',
            'email'          => 'Email',
            'logo'           => 'Logo Sekolah',
        ];
    }
}