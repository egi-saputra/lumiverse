<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\TenantOwner;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    // ─── Helpers ────────────────────────────────────────────────────────────
    private function tenant(): Tenant
    {
        $owner = Auth::guard('owner')->user();
        return $owner->tenant ?? Tenant::findOrFail($owner->tenant_id);
    }

    /**
     * Label role bergantung pada product_type tenant.
     * Key (value yang disimpan di DB) selalu sama; hanya label tampilannya
     * yang berbeda untuk tenant "workspace" (korporat) vs "school".
     */
    private function roleLabels(Tenant $tenant): array
    {
        if ($tenant->isWorkspace()) {
            return [
                'admin'   => 'Admin',
                'guru'    => 'Manajer',
                'proktor' => 'Supervisor',
                'siswa'   => 'Karyawan',
                'user'    => 'Pengguna Umum',
            ];
        }

        return [
            'admin'   => 'Admin',
            'guru'    => 'Guru',
            'proktor' => 'Proktor',
            'siswa'   => 'Siswa',
            'user'    => 'Pengguna Umum',
        ];
    }

    private function roleOptions(array $labels): array
    {
        return collect($labels)
            ->map(fn ($label, $value) => ['value' => $value, 'label' => $label])
            ->values()
            ->all();
    }

    private function roleLabel(?string $role, array $labels): string
    {
        return $labels[$role] ?? ($role ?? '-');
    }

    // ─── Index ──────────────────────────────────────────────────────────────
    public function index(Request $request): Response
    {
        $tenant     = $this->tenant();
        $labels     = $this->roleLabels($tenant);
        $ownerEmail = Auth::guard('owner')->user()->email;

        $search = trim((string) $request->get('search', ''));
        $role   = $request->get('role');

        $data = $tenant->run(function () use ($search, $role, $ownerEmail) {
            $query = User::query()
                ->when($search !== '', function ($q) use ($search) {
                    $q->where(function ($qq) use ($search) {
                        $qq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                    });
                })
                ->when($role, fn ($q) => $q->where('role', $role))
                ->orderBy('name');

            return [
                'users' => $query->paginate(15)->withQueryString()
                    ->through(fn ($u) => [
                        'id'         => $u->id,
                        'name'       => $u->name,
                        'email'      => $u->email,
                        'phone'      => $u->phone,
                        'role'       => $u->role,
                        'created_at' => $u->created_at?->toDateString(),
                        'isSelf'     => $u->email === $ownerEmail,
                    ]),
                'total' => User::count(),
            ];
        });

        return Inertia::render('Owner/Users/Index', [
            'users'       => $data['users'],
            'filters'     => ['search' => $search, 'role' => $role],
            'roleOptions' => $this->roleOptions($labels),
            'roleLabels'  => $labels,
            'userCount'   => $data['total'],
            'maxUsers'    => $tenant->effectiveMaxUsers(),
        ]);
    }

    public function create(): Response
    {
        $tenant    = $this->tenant();
        $labels    = $this->roleLabels($tenant);
        $userCount = $tenant->run(fn () => User::count());

        return Inertia::render('Owner/Users/Create', [
            'roleOptions' => $this->roleOptions($labels),
            'userCount'   => $userCount,
            'maxUsers'    => $tenant->effectiveMaxUsers(),
        ]);
    }

    public function store(Request $request)
    {
        $tenant = $this->tenant();
        $labels = $this->roleLabels($tenant);

        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255'],
            'phone'    => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s]+$/'],
            'role'     => ['required', Rule::in(array_keys($labels))],
            'password' => [
                'required', 'string', 'min:8', 'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/',
            ],
        ], [
            'phone.regex'        => 'Format nomor telepon tidak valid.',
            'password.min'       => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'password.regex'     => 'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol.',
        ]);

        return $tenant->run(function () use ($validated, $tenant) {
            if (User::where('email', $validated['email'])->exists()) {
                return back()->withErrors([
                    'email' => 'Email ini sudah dipakai oleh pengguna lain di lembaga Anda.',
                ])->withInput();
            }

            if ($tenant->hasReachedUserLimitInContext()) {
                $max = $tenant->effectiveMaxUsers();
                return back()->withErrors([
                    'limit' => "Batas jumlah pengguna ({$max}) untuk paket Anda sudah tercapai. Silakan upgrade paket untuk menambah pengguna baru.",
                ])->withInput();
            }

            User::create([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
                'phone'    => $validated['phone'] ?? null,
                'role'     => $validated['role'],
                'password' => Hash::make($validated['password']),
            ]);

            return redirect()->route('owner.users.index')
                ->with('success', 'Pengguna baru berhasil ditambahkan.');
        });
    }

    // ─── Show ───────────────────────────────────────────────────────────────
    public function show(int $id): Response
    {
        $tenant     = $this->tenant();
        $labels     = $this->roleLabels($tenant);
        $ownerEmail = Auth::guard('owner')->user()->email;

        $data = $tenant->run(function () use ($id, $ownerEmail) {
            $user = User::findOrFail($id);

            return [
                'user' => [
                    'id'         => $user->id,
                    'name'       => $user->name,
                    'email'      => $user->email,
                    'phone'      => $user->phone,
                    'role'       => $user->role,
                    'created_at' => $user->created_at?->toDateString(),
                    'updated_at' => $user->updated_at?->toDateString(),
                ],
                'isSelf' => $user->email === $ownerEmail,
            ];
        });

        $data['roleLabel'] = $this->roleLabel($data['user']['role'], $labels);

        return Inertia::render('Owner/Users/Show', $data);
    }

    // ─── Edit ───────────────────────────────────────────────────────────────
    public function edit(int $id): Response
    {
        $tenant     = $this->tenant();
        $labels     = $this->roleLabels($tenant);
        $ownerEmail = Auth::guard('owner')->user()->email;

        $data = $tenant->run(function () use ($id, $ownerEmail) {
            $user = User::findOrFail($id);

            return [
                'user' => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role'  => $user->role,
                ],
                'isSelf' => $user->email === $ownerEmail,
            ];
        });

        return Inertia::render('Owner/Users/Edit', array_merge($data, [
            'roleOptions' => $this->roleOptions($labels),
        ]));
    }

    // ─── Update ─────────────────────────────────────────────────────────────
    public function update(Request $request, int $id)
    {
        $tenant = $this->tenant();
        $labels = $this->roleLabels($tenant);

        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255'],
            'phone'    => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s]+$/'],
            'role'     => ['required', Rule::in(array_keys($labels))],
            'password' => [
                'nullable', 'string', 'min:8', 'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/',
            ],
        ], [
            'phone.regex'        => 'Format nomor telepon tidak valid.',
            'password.min'       => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'password.regex'     => 'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol.',
        ]);

        $owner = Auth::guard('owner')->user();

        // ── 1. Cek dulu apakah target = akun sendiri, TANPA update apapun ──
        $check = $tenant->run(function () use ($id, $owner) {
            $user = User::findOrFail($id);
            return ['isSelf' => $user->email === $owner->email];
        });

        // ── 2. Kalau ini akun sendiri, cek keunikan email di tenant_owners (koneksi CENTRAL) ──
        if ($check['isSelf']) {
            $emailTaken = TenantOwner::where('email', $validated['email'])
                ->where('id', '!=', $owner->id)
                ->exists();

            if ($emailTaken) {
                return back()->withErrors([
                    'email' => 'Email ini sudah dipakai oleh admin lembaga lain.',
                ])->withInput();
            }
        }

        // ── 3. Update tabel users di tenant ──
        $result = $tenant->run(function () use ($validated, $id, $owner) {
            $user   = User::findOrFail($id);
            $isSelf = $user->email === $owner->email;

            if (User::where('email', $validated['email'])->where('id', '!=', $id)->exists()) {
                return ['error' => ['email' => 'Email ini sudah dipakai oleh pengguna lain di lembaga Anda.']];
            }

            if ($isSelf && $validated['role'] !== 'admin') {
                return ['error' => ['role' => 'Anda tidak dapat mengubah peran akun Anda sendiri.']];
            }

            $data = [
                'name'  => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'role'  => $validated['role'],
            ];
            if (!empty($validated['password'])) {
                $data['password'] = Hash::make($validated['password']);
            }

            $user->update($data);

            return ['isSelf' => $isSelf];
        });

        if (isset($result['error'])) {
            return back()->withErrors($result['error'])->withInput();
        }

        // ── 4. Sync ke tenant_owners (koneksi CENTRAL) kalau ini akun sendiri ──
        if ($result['isSelf']) {
            $ownerData = [
                'name'  => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
            ];
            if (!empty($validated['password'])) {
                $ownerData['password'] = Hash::make($validated['password']);
            }
            $owner->update($ownerData);
        }

        return redirect()->route('owner.users.index')
            ->with('success', 'Data pengguna berhasil diperbarui.');
    }

    // ─── Destroy ────────────────────────────────────────────────────────────
    public function destroy(int $id)
    {
        $ownerEmail = Auth::guard('owner')->user()->email;
        $tenant     = $this->tenant();

        return $tenant->run(function () use ($id, $ownerEmail) {
            $user = User::findOrFail($id);

            if ($user->email === $ownerEmail) {
                return back()->withErrors([
                    'delete' => 'Anda tidak dapat menghapus akun Anda sendiri.',
                ]);
            }

            if ($user->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
                return back()->withErrors([
                    'delete' => 'Tidak dapat menghapus admin terakhir di lembaga ini.',
                ]);
            }

            $user->delete();

            return redirect()->route('owner.users.index')
                ->with('success', 'Pengguna berhasil dihapus.');
        });
    }
}