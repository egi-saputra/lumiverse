<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRegistrationRequest extends FormRequest
{
    /**
     * Semua pengunjung boleh submit form (guest).
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Aturan validasi.
     */
    public function rules(): array
    {
        return [
            // ── Data siswa ──────────────────────────────────────────
            'name' => [
                'required',
                'string',
                'min:3',
                'max:150',
                // Tidak boleh hanya angka / simbol
                'regex:/^[\p{L}\s.\'-]+$/u',
            ],

            'phone' => [
                'required',
                'string',
                'min:9',
                'max:20',
                // Format nomor Indonesia
                'regex:/^(\+62|62|0)[\s\-]?8[0-9]{7,12}$/',
                // Unik: cek setelah normalisasi dilakukan di Controller
                // (validasi DB unique dilakukan manual di Controller)
            ],

            'program' => [
                'required',
                'string',
                Rule::in([
                    'MPLB — Manajemen Perkantoran & Lembaga Bisnis',
                    'BR — Bisnis Retail & Pemasaran',
                ]),
            ],

            'message' => [
                'nullable',
                'string',
                'max:1000',
            ],

            // ── Device fingerprint (dikirim dari frontend) ──────────
            'device_fingerprint' => [
                'nullable',
                'string',
                'max:128',
                // Hanya karakter hex yang valid
                'regex:/^[a-f0-9]+$/',
            ],

            'device_info' => [
                'nullable',
                'array',
            ],

            'device_info.screen_width'  => ['nullable', 'integer', 'min:0', 'max:9999'],
            'device_info.screen_height' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'device_info.timezone'      => ['nullable', 'string', 'max:100'],
            'device_info.language'      => ['nullable', 'string', 'max:50'],
            'device_info.platform'      => ['nullable', 'string', 'max:100'],
        ];
    }

    /**
     * Pesan error dalam Bahasa Indonesia.
     */
    public function messages(): array
    {
        return [
            'name.required'    => 'Nama lengkap wajib diisi.',
            'name.min'         => 'Nama minimal 3 karakter.',
            'name.max'         => 'Nama terlalu panjang (maks. 150 karakter).',
            'name.regex'       => 'Nama hanya boleh berisi huruf, spasi, dan tanda baca umum.',

            'phone.required'   => 'Nomor WhatsApp wajib diisi.',
            'phone.regex'      => 'Format nomor tidak valid. Gunakan format Indonesia (08xx...).',
            'phone.min'        => 'Nomor terlalu pendek.',
            'phone.max'        => 'Nomor terlalu panjang.',

            'program.required' => 'Silakan pilih jurusan yang diminati.',
            'program.in'       => 'Jurusan yang dipilih tidak tersedia.',

            'message.max'      => 'Pesan tidak boleh lebih dari 1000 karakter.',

            'device_fingerprint.regex' => 'Format device fingerprint tidak valid.',
        ];
    }

    /**
     * Transformasi input sebelum validasi (sanitasi).
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'name'    => $this->name ? trim(strip_tags($this->name)) : $this->name,
            'phone'   => $this->phone ? preg_replace('/[\s\-()]/', '', $this->phone) : $this->phone,
            'message' => $this->message ? trim(strip_tags($this->message)) : $this->message,
        ]);
    }
}