<?php

declare(strict_types=1);

use Stancl\Tenancy\Middleware\InitializeTenancyBySubdomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;
use App\Http\Middleware\EnsureTenantIsActive;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\CentralController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\MadingController;
use App\Http\Controllers\PesanController;
use App\Http\Controllers\PublicAbsensiAnalyticsController;
use App\Http\Controllers\TenantAssetController;
use App\Models\Siswa;
use App\Models\User;
use App\Models\Pengumuman;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;
use Carbon\Carbon;
use Inertia\Inertia;

Route::middleware([
    'web',
    InitializeTenancyBySubdomain::class,
    PreventAccessFromCentralDomains::class,
    EnsureTenantIsActive::class,
    \App\Http\Middleware\ShareTenantRouteDefaults::class,
])->group(function () {
    Route::get('/robots.txt', function () {
        return response("User-agent: *\nDisallow: /")
            ->header('Content-Type', 'text/plain');
    })->name('robots.tenant');

    Route::get('/tenant-storage/{path}', [TenantAssetController::class, 'show'])
    ->where('path', '.*')
    ->name('tenant.storage');

    Route::get('/', function () {
    // return Inertia::render('HomePage', [
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// ====================================================================================

// Route::get('/', function () {
//     return Inertia::render('BlockPage', [
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::redirect('/login', '/');

// ====================================================================================

Route::get('/mading', [MadingController::class, 'index'])->name('mading.index');
Route::get('/mading/{pengumuman}', [MadingController::class, 'show'])->name('mading.show');

Route::middleware(['auth'])->group(function () {
    Route::patch('/profile/siswa', [ProfileController::class, 'updateSiswa'])
    ->name('profile.siswa.update');
    
});

// Verifikasi Email
// Route::get('/email/verify', function () {
//     return view('auth.verify-email');
// })->middleware(['auth'])->name('verification.notice');

Route::get('/auth/google/token', [GoogleController::class, 'loginWithToken'])->name('google.token');
Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

// ── Dashboard User / Default ──────────────────────────────────────
Route::get('/dashboard', function () {
    $user = Auth::user();

    return match ($user->role) {
        'admin'   => redirect()->route('admin.dashboard'),
        'guru'    => redirect()->route('guru.dashboard'),
        'proktor' => redirect()->route('proktor.dashboard'),
        'siswa'   => redirect()->route('siswa.dashboard'),
        'user'    => redirect()->route('user.dashboard'),
        default   => abort(403),
    };
})->middleware(['auth', 'verified'])->name('user.dashboard');

// ── Dashboard Role Auth ──────────────────────────────────────
Route::middleware('auth', 'verified')->group(function () {
    Route::get('/admin/dashboard', function () {
        $user = Auth::user();

        $usersCount = [
            'proktor' => User::where('role', 'proktor')->count(),
            'guru'    => User::where('role', 'guru')->count(),
            'siswa'   => User::where('role', 'siswa')->count(),
            'user'   => User::where('role', 'user')->count(),
            'total'   => User::count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'auth' => [
                'user' => $user,
                'role' => $user->role,
            ],
            'usersCount' => $usersCount,
        ]);
    })->name('admin.dashboard')->middleware(['auth']);

    Route::get('/guru/dashboard', function () {
        $user = Auth::user();

        $usersCount = [
            'proktor' => User::where('role', 'proktor')->count(),
            'guru'    => User::where('role', 'guru')->count(),
            'siswa'   => User::where('role', 'siswa')->count(),
            'total'   => User::count(),
        ];

        return Inertia::render('Guru/Dashboard', [
            'auth' => [
                'user' => $user,
                'role' => $user->role,
            ],
            'usersCount' => $usersCount,
        ]);
    })->name('guru.dashboard')->middleware(['auth']);

    Route::get('/proktor/dashboard', function () {
        $user = Auth::user();

        $usersCount = [
            'admin'   => User::where('role', 'admin')->count(),
            'proktor' => User::where('role', 'proktor')->count(),
            'guru'    => User::where('role', 'guru')->count(),
            'siswa'   => User::where('role', 'siswa')->count(),
            'total'   => User::count(),
        ];

        return Inertia::render('Proktor/Dashboard', [
            'auth' => [
                'user' => $user,
                'role' => $user->role,
            ],
            'usersCount' => $usersCount,
        ]);
    })->name('proktor.dashboard')->middleware(['auth']);

    Route::get('/siswa/dashboard', function () {
        $user = Auth::user();

        // cek apakah siswa sudah punya data
        $siswaExists = Siswa::where('user_id', $user->id)->exists();

        if (!$siswaExists) {
            return redirect()->route('siswa.form.create');
        }

        // Ambil data siswa (misal semua siswa)
        $siswa = Siswa::with(['kelas', 'kejuruan'])
            ->where('user_id', $user->id)
            ->first();

        if (!$siswa) {
            return redirect()->route('siswa.form.create');
        }

        return Inertia::render('Siswa/Dashboard', [
            'siswa' => $siswa,
            'auth' => [
                'user' => $user,
                'role' => $user->role,
            ],
        ]);
    })->middleware(['auth'])->name('siswa.dashboard');

    Route::get('/user/dashboard', fn() =>
        Inertia::render('User/Dashboard')
    )->name('user.dashboard');
});

// ── Profile ──────────────────────────────────────
    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    // ── Messages ──────────────────────────────────────
Route::middleware(['auth', 'verified'])->prefix('pesan')->name('pesan.')->group(function () {
    // Inbox — semua role bisa baca
    Route::get('/pesan/{pesan}', [PesanController::class, 'show'])->name('show');
    Route::get('/', [PesanController::class, 'index'])->name('index');
 
    // Compose — hanya admin & guru (dijaga di controller)
    Route::get('/compose',   [PesanController::class, 'create'])->name('create');
    Route::post('/',         [PesanController::class, 'store'])->name('store');
 
    // Delete — hanya pengirim sendiri (dijaga di controller)
    Route::delete('/delete-all', [PesanController::class, 'deleteAll'])->name('deleteAll');
    Route::delete('/{pesan}',    [PesanController::class, 'destroy'])->name('destroy');
});

// ── Announcements ──────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/pengumuman',                    [PengumumanController::class, 'index'])->name('pengumuman.index');
    Route::get('/pengumuman/create',             [PengumumanController::class, 'create'])->name('pengumuman.create');
    Route::post('/pengumuman',                   [PengumumanController::class, 'store'])->name('pengumuman.store');
    Route::get('/pengumuman/{pengumuman}',        [PengumumanController::class, 'show'])->name('pengumuman.show');
    Route::get('/pengumuman/{pengumuman}/edit',   [PengumumanController::class, 'edit'])->name('pengumuman.edit');
    Route::post('/pengumuman/{pengumuman}',       [PengumumanController::class, 'update'])->name('pengumuman.update');
    Route::delete('/pengumuman/{pengumuman}',     [PengumumanController::class, 'destroy'])->name('pengumuman.destroy');
});

// ── Attendance Analytics ──────────────────────────────────────
// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('/analytics', [AbsensiAnalyticsController::class, 'index'])
//             ->name('analytics');
// });

Route::middleware(['auth', 'verified','throttle:30,1'])
    ->group(function () {
 
        Route::get('/public/absensi/analytics', [PublicAbsensiAnalyticsController::class, 'index'])
            ->name('public.absensi.analytics');
 
    });

// Analytics Public Acces
// Route::middleware(['throttle:30,1']) // 30 request per menit per IP
//     ->group(function () {
 
//         Route::get('/absensi/analytics', [PublicAbsensiAnalyticsController::class, 'index'])
//             ->name('public.absensi.analytics');
 
//     });

// Auth Default
require __DIR__.'/auth.php';

// Route::get('/login', function () {
//     return redirect('/');
// })->name('login');

// import route terpisah
require __DIR__.'/admin.php';
require __DIR__.'/proktor.php';
require __DIR__.'/guru.php';
require __DIR__.'/siswa.php';
require __DIR__.'/user.php';

require __DIR__.'/tenant-api.php';
});
