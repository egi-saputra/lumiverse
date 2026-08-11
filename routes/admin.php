<?php

// Tambahkan use Inertia\Inertia; di bagian atas web.php jika belum ada
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\JournalController as AdminJournalController;
use App\Http\Controllers\Admin\{
    JournalSettingController,
    UserController,
    KelasController,
    KejuruanController,
    MapelController,
    SiswaController,
    GuruController,
    // DataSekolahController,
    // AdminRegistrationController,
};
// Hapus HeroSlideController dari use di web.php —
// controller ini hanya dipanggil dari api.php, bukan web.php

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Route::get('profil-sekolah', [DataSekolahController::class, 'index'])
        //     ->name('profil_sekolah.index');

        // Route::post('profil-sekolah', [DataSekolahController::class, 'storeOrUpdate'])
        //     ->name('profil_sekolah.storeOrUpdate');

        // ===== USER Management =====
        Route::resource('users', UserController::class)->except(['show']);

        // ===== KELAS =====
        Route::get('kelas', [KelasController::class, 'index'])->name('kelas.index');
        Route::get('kelas/create', [KelasController::class, 'create'])->name('kelas.create');
        Route::post('kelas', [KelasController::class, 'store'])->name('kelas.store');
        Route::get('kelas/{kelas}/edit', [KelasController::class, 'edit'])->name('kelas.edit');
        Route::put('kelas/{kelas}', [KelasController::class, 'update'])->name('kelas.update');
        Route::delete('kelas/{kelas}', [KelasController::class, 'destroy'])->name('kelas.destroy');

        // ===== KEJURUAN =====
        Route::resource('kejuruan', KejuruanController::class)->except(['show', 'edit']);

        // ===== MAPEL =====
        Route::resource('mapel', MapelController::class)->except(['show', 'edit']);

        // ===== SISWA =====
        Route::delete('siswa/kelas', [SiswaController::class, 'destroyByKelas'])->name('siswa.destroyByKelas');
        Route::resource('siswa', SiswaController::class)->except(['show']);

        // ===== GURU =====
        Route::resource('guru', GuruController::class)->except(['show', 'edit']);

        // ===== REGISTRATIONS =====
        // Route::redirect('/', '/admin/registrations');

        // Route::get('/registrations', [AdminRegistrationController::class, 'index'])
        //     ->name('registrations.index');

        // Route::delete('/registrations', [AdminRegistrationController::class, 'bulkDestroy'])
        //     ->name('registrations.bulk-destroy');

        // Route::patch('/registrations/{registration}/status', [AdminRegistrationController::class, 'updateStatus'])
        //     ->name('registrations.update-status');

        // Route::delete('/registrations/{registration}', [AdminRegistrationController::class, 'destroy'])
        //     ->name('registrations.destroy');

        // ===== HERO SLIDES =====
        // Hanya render halaman Inertia — CRUD ditangani oleh api.php
        // Route::get('/hero-slides', function () {
        //     return Inertia::render('Admin/HeroSlideAdmin');
        // })->name('hero-slides');

        // Akses: http://localhost:8000/admin/hero-slides
        // Named route: route('admin.hero-slides')

        // ===== PENGATURAN LOKASI JURNAL (harus sebelum jurnal-guru/{guru}) =====
        Route::get('jurnal-guru/pengaturan-lokasi', [JournalSettingController::class, 'edit'])
            ->name('journal-setting.edit');
        Route::put('jurnal-guru/pengaturan-lokasi', [JournalSettingController::class, 'update'])
            ->name('journal-setting.update');

        // ===== JURNAL GURU (rekap & detail) =====
        Route::get('jurnal-guru', [AdminJournalController::class, 'index'])->name('journal.index');

        // Export & destroyByGuru pakai segment literal, HARUS didaftarkan
        // sebelum route wildcard {guru} di bawahnya, biar 'export' & 'guru'
        // gak ketelen jadi nilai {guru}.
        Route::get('jurnal-guru/export', [AdminJournalController::class, 'export'])
            ->name('journal.export');
        Route::delete('jurnal-guru/guru/{guru}', [AdminJournalController::class, 'destroyByGuru'])
            ->name('journal.destroyByGuru');

        Route::get('jurnal-guru/{guru}', [AdminJournalController::class, 'show'])->name('journal.show');
        Route::delete('jurnal-guru/{journal}', [AdminJournalController::class, 'destroy'])
            ->name('journal.destroy');
    });