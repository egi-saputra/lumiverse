<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use App\Models\Guru;

class UserController extends Controller
{
    public function index()
    {
        return inertia('Admin/Users/Index', [
            'users' => User::where(function ($q) {
                    $q->where('role', '!=', 'admin')
                    ->orWhereNull('role');
                })
                ->orderBy('name', 'asc')
                ->get(),
        ]);
    }

    public function create()
    {
        $tenant = tenant();
        $remainingSlots = null;

        if ($tenant) {
            $max = $tenant->effectiveMaxUsers();
            if ($max !== null) {
                $usedSlots = User::count();
                $remainingSlots = max(0, $max - $usedSlots);
            }
        }

        return Inertia::render('Admin/Users/Create', [
            'roles'          => ['proktor', 'guru', 'siswa', 'user'],
            'remainingSlots' => $remainingSlots, // null berarti tanpa batas
        ]);
    }

    // Simpan user baru (bulk, satu role untuk semua baris)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'role'           => ['required', 'string', Rule::notIn(['admin'])],
            'items'          => ['required', 'array', 'min:1'],
            'items.*.name'   => ['required', 'string', 'max:255'],
            'items.*.email'  => ['required', 'email', 'distinct', 'unique:users,email'],
            'items.*.password' => ['required', 'string', 'min:6'],
        ], [
            'items.*.email.distinct' => 'Terdapat email yang sama di dalam input.',
        ]);

        $items = $validated['items'];
        $role  = $validated['role'];

        // ─── Cek kuota berdasarkan max_users di tabel tenants ───────────────
        $tenant = tenant();
        if ($tenant && $tenant->max_users) {
            $usedSlots      = User::count();
            $remainingSlots = max(0, $tenant->max_users - $usedSlots);

            if (count($items) > $remainingSlots) {
                throw ValidationException::withMessages([
                    'items' => "Kuota pengguna tidak mencukupi. Sisa kuota: {$remainingSlots} akun, sedangkan Anda mencoba menambahkan " . count($items) . ' akun. Hubungi administrator untuk upgrade paket.',
                ]);
            }
        }

        DB::transaction(function () use ($items, $role) {
            foreach ($items as $item) {
                $user = User::create([
                    'name'     => $item['name'],
                    'email'    => $item['email'],
                    'password' => bcrypt($item['password']),
                    'role'     => $role,
                ]);

                if ($user->role === 'guru') {
                    Guru::firstOrCreate(
                        ['user_id' => $user->id],
                        ['nama_lengkap' => $user->name]
                    );
                }
            }
        });

        return redirect()
            ->route('admin.users.index')
            ->with('success', count($items) . ' user berhasil dibuat!');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user'  => $user,
            'roles' => ['proktor', 'guru', 'siswa', 'user'],
        ]);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => 'nullable|min:6',
            'role'     => [
                'required',
                'string',
                Rule::notIn(['admin']),
            ],
        ]);

        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        if ($user->role === 'guru') {
            Guru::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'nama_lengkap' => $user->name,
                ]
            );
        } else {
            Guru::where('user_id', $user->id)->delete();
        }

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User has been updated!');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'User has been deleted');
    }
}