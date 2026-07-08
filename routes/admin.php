<?php

// Tambahkan use Inertia\Inertia; di bagian atas web.php jika belum ada
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\{
    DataSekolahController,
    UserController,
    KelasController,
    KejuruanController,
    MapelController,
    SiswaController,
    GuruController,
    AdminRegistrationController,
};
// Hapus HeroSlideController dari use di web.php —
// controller ini hanya dipanggil dari api.php, bukan web.php

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('profil-sekolah', [DataSekolahController::class, 'index'])
            ->name('profil_sekolah.index');

        Route::post('profil-sekolah', [DataSekolahController::class, 'storeOrUpdate'])
            ->name('profil_sekolah.storeOrUpdate');

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
        Route::redirect('/', '/admin/registrations');

        Route::get('/registrations', [AdminRegistrationController::class, 'index'])
            ->name('registrations.index');

        Route::delete('/registrations', [AdminRegistrationController::class, 'bulkDestroy'])
            ->name('registrations.bulk-destroy');

        Route::patch('/registrations/{registration}/status', [AdminRegistrationController::class, 'updateStatus'])
            ->name('registrations.update-status');

        Route::delete('/registrations/{registration}', [AdminRegistrationController::class, 'destroy'])
            ->name('registrations.destroy');

        // ===== HERO SLIDES =====
        // Hanya render halaman Inertia — CRUD ditangani oleh api.php
        Route::get('/hero-slides', function () {
            return Inertia::render('Admin/HeroSlideAdmin');
        })->name('hero-slides');
        // Akses: http://localhost:8000/admin/hero-slides
        // Named route: route('admin.hero-slides')
    });