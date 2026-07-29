<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'key'                  => 'trial',
                'name'                 => 'Free Trial',
                'description'          => 'Paket uji coba gratis.',
                'price_monthly'        => 0,
                'price_yearly'         => 0,
                'max_users'            => 50,
                'duration_days'        => 0,
                'features'             => [
                    'Akses semua fitur dasar',
                    'Hingga 50 pengguna',
                    'Subdomain LMS (.lumiverse.co.id)',
                    'Dukungan via email',
                ],
                'unavailable_features' => [
                    'Ujian online & bank soal',
                    'Raport digital',
                    'Notifikasi WhatsApp',
                    'Custom domain',
                ],
                'badge'                => 'Gratis',
                'accent_color'         => '#34d399',
                'is_highlighted'       => false,
                'is_active'            => true,
                'sort_order'           => 0,
            ],
            [
                'key'                  => 'starter',
                'name'                 => 'Starter Kit',
                'description'          => 'Untuk mencoba dan eksplorasi fitur dasar platform.',
                'price_monthly'        => 399000,
                'price_yearly'         => 279000,
                'max_users'            => 150,
                'duration_days'        => null,
                'features'             => [
                    '10 pengguna (guru + siswa)',
                    'Manajemen kelas & jadwal',
                    'Materi & tugas dasar',
                    'Subdomain LMS (.lumiverse.id)',
                    'Laporan kehadiran',
                ],
                'unavailable_features' => [
                    'Ujian online & bank soal',
                    'Raport digital',
                    'Notifikasi WhatsApp',
                    'Custom domain',
                    'Prioritas dukungan',
                ],
                'badge'                => null,
                'accent_color'         => '#60a5fa',
                'is_highlighted'       => false,
                'is_active'            => true,
                'sort_order'           => 1,
            ],
            [
                'key'                  => 'basic',
                'name'                 => 'Basic',
                'description'          => 'Ideal untuk sekolah kecil atau lembaga kursus yang baru mulai digital.',
                'price_monthly'        => 799000,
                'price_yearly'         => 569000,
                'max_users'            => 300,
                'duration_days'        => null,
                'features'             => [
                    '100 pengguna (guru + siswa)',
                    'Semua fitur Starter',
                    'Ujian online & bank soal',
                    'Raport digital',
                    'Notifikasi WhatsApp (100 pesan/bln)',
                    'Laporan & analitik lengkap',
                ],
                'unavailable_features' => [
                    'Custom domain',
                    'Prioritas dukungan',
                    'Akses API & integrasi',
                ],
                'badge'                => 'Paling Populer',
                'accent_color'         => '#00d4ff',
                'is_highlighted'       => true,
                'is_active'            => true,
                'sort_order'           => 2,
            ],
            [
                'key'                  => 'enterprise',
                'name'                 => 'Enterprise',
                'description'          => 'Solusi penuh untuk yayasan, jaringan sekolah, atau institusi besar.',
                'price_monthly'        => 1199000,
                'price_yearly'         => 899000,
                'max_users'            => 500,
                'duration_days'        => null,
                'features'             => [
                    '500 pengguna (guru + siswa)',
                    'Semua fitur Basic',
                    'Multi-cabang / multi-tenant',
                    'White-label (logo & domain sendiri)',
                    'Dedicated server & SLA 99.9%',
                    'Manajer akun khusus',
                    'Pelatihan staf on-site',
                ],
                'unavailable_features' => [],
                'badge'                => null,
                'accent_color'         => '#f59e0b',
                'is_highlighted'       => false,
                'is_active'            => true,
                'sort_order'           => 3,
            ],
            [
                'key'                  => 'expertise',
                'name'                 => 'Expertise',
                'description'          => 'Untuk sekolah berkembang yang butuh fitur penuh dan dukungan prioritas.',
                'price_monthly'        => 2299000,
                'price_yearly'         => 1699000,
                'max_users'            => null,
                'duration_days'        => null,
                'features'             => [
                    'Pengguna tidak terbatas',
                    'Semua fitur Enterprise',
                    'Custom domain',
                    'Notifikasi WhatsApp (unlimited)',
                    'Akses API & integrasi pihak ketiga',
                    'Prioritas dukungan (respon < 4 jam)',
                    'Onboarding & migrasi data',
                ],
                'unavailable_features' => [],
                'badge'                => null,
                'accent_color'         => '#f97316',
                'is_highlighted'       => false,
                'is_active'            => true,
                'sort_order'           => 4,
            ],
        ];

        foreach ($plans as $data) {
            Plan::updateOrCreate(['key' => $data['key']], $data);
        }
    }
}