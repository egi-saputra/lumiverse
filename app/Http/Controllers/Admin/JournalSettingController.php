<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JournalSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JournalSettingController extends Controller
{
    public function edit()
    {
        // first() atau null kalau belum pernah disimpan sama sekali —
        // front-end akan fallback ke nilai .env lewat prop "default".
        $setting = JournalSetting::first();

        return Inertia::render('Admin/Journal/Setting', [
            'setting' => $setting,
            'default' => [
                'latitude'                => (float) config('journal.location.latitude'),
                'longitude'               => (float) config('journal.location.longitude'),
                'radius_meter'            => (int) config('journal.location.radius_meter'),
                'toleransi_meter'         => (int) config('journal.location.toleransi_meter', 15),
                'max_akurasi_meter'       => (int) config('journal.location.max_accuracy_meter', 50),
                'kecepatan_maksimum_kmh'  => (int) config('journal.location.kecepatan_maksimum_kmh', 120),
                'jam_buka'                => config('journal.window.jam_buka', '07:00'),
                'jam_tutup'               => config('journal.window.jam_tutup', '14:00'),
                'durasi_sesi_menit'       => (int) config('journal.window.durasi_sesi_menit', 90),
                'timezone'                => config('journal.window.timezone', 'Asia/Jakarta'),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'latitude'               => ['required', 'numeric', 'between:-90,90'],
            'longitude'              => ['required', 'numeric', 'between:-180,180'],
            'radius_meter'           => ['required', 'integer', 'min:1', 'max:5000'],
            'toleransi_meter'        => ['required', 'integer', 'min:0', 'max:1000'],
            'max_akurasi_meter'      => ['required', 'integer', 'min:1', 'max:1000'],
            'kecepatan_maksimum_kmh' => ['required', 'integer', 'min:1', 'max:1000'],
            'jam_buka'               => ['required', 'date_format:H:i'],
            'jam_tutup'              => ['required', 'date_format:H:i', 'after:jam_buka'],
            'durasi_sesi_menit'      => ['required', 'integer', 'min:5', 'max:480'],
            'timezone'               => ['required', 'string', 'in:Asia/Jakarta,Asia/Makassar,Asia/Jayapura'],
        ]);

        $setting = JournalSetting::first();

        if ($setting) {
            $setting->update($validated);
        } else {
            JournalSetting::create($validated);
        }

        JournalSetting::clearCache();

        return redirect()
            ->route('admin.journal-setting.edit')
            ->with('success', 'Pengaturan jurnal berhasil disimpan.');
    }
}