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
            'users' => User::where('role', '!=', 'admin')
                ->orderBy('name', 'asc')
                ->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => ['proktor', 'guru', 'siswa', 'user'],
        ]);
    }

    public function store(Request $request)
    {
        // Cek kuota user berdasarkan max_users di tabel tenants
        $tenant = tenant();
        if ($tenant && $tenant->hasReachedUserLimit()) {
            throw ValidationException::withMessages([
                'name' => "Kuota pengguna sudah penuh ({$tenant->max_users} akun). Hubungi administrator untuk upgrade paket.",
            ]);
        }

        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => [
                'required',
                'email',
                'unique:users,email',
            ],
            'password' => 'required|min:6',
            'role'     => [
                'required',
                'string',
                Rule::notIn(['admin']),
            ],
        ]);

        $data['password'] = bcrypt($data['password']);

        $user = User::create($data);

        if ($user->role === 'guru') {
            Guru::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'nama_lengkap' => $user->name,
                ]
            );
        }

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User has been created!');
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