<?php

namespace App\Http\Middleware;

// use App\Models\ProfilSekolah;
// use App\Models\Pesan;
use App\Models\Pengumuman;
use App\Models\Assignment;
use App\Models\Guru;
use App\Support\JournalWindow;
use App\Models\SubscriptionOrder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Storage;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $isTenant = (bool) tenant();

        // ── User (guard 'web', hanya valid di context tenant) ────
        $user = $isTenant ? Auth::guard('web')->user() : null;

        // ── Owner (guard 'owner', hanya valid di context central) ─
        $owner = ! $isTenant ? Auth::guard('owner')->user() : null;

        $isUjianRoute = $request->routeIs('siswa.ujian.*');

        // ── Profil sekolah (tenant-only) ──────────────────────────
        // $profil = $isTenant ? cache()->remember('profil_sekolah', now()->addWeek(), fn() => ProfilSekolah::first()) : null;

        // ── Guru flags (tenant-only, skip saat ujian) ─────────────
        $guru           = null;
        $isKejuruanGuru = false;
        $isWalas        = false;

        if ($isTenant && $user && !$isUjianRoute) {
            $guru = $user->guru;

            if ($guru) {
                $isKejuruanGuru = Cache::remember(
                    "guru:{$guru->id}:is_kejuruan", 300,
                    fn () => $guru->kejuruan()->exists()
                );
                $isWalas = Cache::remember(
                    "guru:{$guru->id}:is_walas", 300,
                    fn () => $guru->kelas()->exists()
                );
            }
        }

        // ── Siswa data (tenant-only) ──────────────────────────────
        $siswaData = null;
        $userClass = null;
        $kelasId   = null;

        if ($isTenant && $user) {
            $siswaData = $user->siswa;

            if ($siswaData) {
                $userClass = Cache::remember(
                    "siswa:{$user->id}:kelas_nama", 300,
                    fn () => $siswaData->kelas?->kelas ?? null
                );

                $kelasId = $siswaData->kelas_id
                    ? (int) $siswaData->kelas_id
                    : null;
            }
        }

        // ── Pengumuman (tenant-only) ──────────────────────────────
        $announcements = function () use ($isTenant, $user, $kelasId) {
            if (!$isTenant || !$user) return collect();

            $role     = strtolower($user->role ?? 'siswa');

            return Pengumuman::latest()
                ->get()
                ->filter(function ($item) use ($role, $kelasId) {
                    if ($item->penerima === 'semua')   return true;
                    if ($item->penerima === $role)     return true;

                    if ($role === 'siswa' && $item->penerima === 'siswa') {
                        return $item->kelas_id
                            ? $item->kelas_id == $kelasId
                            : true;
                    }

                    return false;
                })
                ->values();
        };

        return [
            ...parent::share($request),

            'tenant' => $isTenant ? [
                'id'   => tenant('id'),
                'code'   => tenant('code'),
                'name' => tenant('name'),
                'logo_url' => tenant()->logo_url,
                'school_level' => tenant('school_level'),
                'plan_id' => tenant('plan_id'),
                'product_type' => tenant('product_type'),
                'max_users' => tenant('max_users'),
                'institution_website' => tenant('institution_website'),
            ] : null,

            // 'centralDomain' => env('CENTRAL_DOMAIN', 'localhost:8000'),
            'centralDomain' => config('app.central_domain'),

            'auth' => [
                'user'   => $user,
                'avatar' => $user?->avatar,
                'role'   => $user?->role,
                'owner'  => $owner,
            ],

            'pendingInvoiceCount' => function () use ($owner) {
                if (!$owner) return 0;

                return SubscriptionOrder::where('tenant_id', $owner->tenant_id)
                    ->where('status', 'pending')
                    ->count();
            },

            'csrf_token' => csrf_token(),

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],

            // 'namaSekolah' => $profil?->nama_sekolah ?? 'Lumiverse School',

            // 'profilSekolah' => [
            //     'namaSekolah' => $profil?->nama_sekolah ?? 'Lumiverse School',
            //     'alamat'      => $profil?->alamat ?? 'Jl. Raya Citayam - Parung RT. 002 / RW. 011 Desa Ragajaya, Kecamatan Bojonggede, Kabupaten Bogor, Jawa Barat 16920.',
            //     'telepon'     => $profil?->telepon ?? '+62 XXX-XXXX-XXX',
            //     'email'       => $profil?->email ?? 'info@lumiverse.co.id',
            //     'website'     => $profil?->website ?? 'www.lumiverse.co.id',
            //     'visi'        => $profil?->visi ?? 'Menjadi sekolah kejuruan berstandar nasional yang mencetak lulusan kompeten, berintegritas, dan berdaya saing global.',
            //     'misi'        => $profil?->misi ?? 'Menyelenggarakan pendidikan vokasi berkualitas dengan kurikulum berbasis industri, didukung tenaga pengajar profesional dan fasilitas modern.',
            // ],

            'unreadAssignmentCount' => function () use ($isTenant) {
                if (!$isTenant || !Auth::guard('web')->check()) return 0;

                $guru = Guru::where('user_id', Auth::guard('web')->id())->first();
                if (!$guru) return 0;

                return Assignment::where('guru_id', $guru->id)
                    ->where('is_read', false)
                    ->count();
            },

            'announcements' => $announcements,

            'userClass' => $userClass,
            'kelasId'   => $kelasId,

            'isKejuruanGuru' => $isKejuruanGuru,
            'isWalas'        => $isWalas,

            // 'pesan' => fn () => $this->loadPesanForUser($isTenant, $user, $kelasId),

            'journal' => function () use ($request) {
                $user = $request->user();
    
                // Hanya relevan untuk user yang punya data guru
                if (!$user || !$user->guru) {
                    return null;
                }
    
                return JournalWindow::toArray();
            },
        ];
    }

    // ─────────────────────────────────────────────────────────
    //  PRIVATE HELPER
    // ─────────────────────────────────────────────────────────

    // private function loadPesanForUser(bool $isTenant, $user, ?int $kelasId): array
    // {
    //     if (! $isTenant || ! $user) return [];

    //     return Pesan::with('kelas:id,kelas')
    //         ->select(['id', 'judul', 'isi', 'penerima', 'kelas_id', 'pengirim_id', 'created_at'])
    //         ->where(function ($q) use ($user, $kelasId) {
    //             $q->where('penerima', 'semua')
    //               ->orWhere(function ($q2) use ($user) {
    //                   $q2->where('penerima', $user->role)
    //                      ->whereNull('kelas_id');
    //               });

    //             if ($user->role === 'siswa' && $kelasId) {
    //                 $q->orWhere(function ($q2) use ($kelasId) {
    //                     $q2->where('penerima', 'siswa')
    //                        ->where('kelas_id', $kelasId);
    //                 });
    //             }
    //         })
    //         ->latest()
    //         ->limit(50)
    //         ->get()
    //         ->toArray();
    // }
}