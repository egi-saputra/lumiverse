<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Kelas;
use App\Models\Kejuruan;

class ProfileController extends Controller
{
    /**
     * Cek apakah tenant saat ini berjenjang SMK.
     */
    protected function isSmk(): bool
    {
        $tenant = tenant();

        if (! $tenant) {
            return false;
        }

        return strtolower((string) $tenant->school_level) === 'smk';
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $siswaData    = null;
        $kelasList    = null;
        $kejuruanList = null;
        $isSmk        = $this->isSmk();

        if ($user->role === 'siswa' && $user->siswa) {
            $siswaData    = $user->siswa->load(['kelas', 'kejuruan']);
            $kelasList    = Kelas::select('id', 'kelas')->get();
            $kejuruanList = $isSmk
                ? Kejuruan::select('id', 'kejuruan')->get()
                : [];
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status'          => session('status'),
            'hasPassword'     => !is_null($user->password),
            'title'           => 'Profile Settings',
            'siswa'           => $siswaData,
            'kelas'           => $kelasList,
            'kejuruan'        => $kejuruanList,
            'isSmk'           => $isSmk,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Update data siswa milik user yang sedang login.
     * Route: PATCH /profile/siswa  →  profile.siswa.update
     */
    public function updateSiswa(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Guard: hanya role siswa yang boleh akses
        abort_unless($user->role === 'siswa' && $user->siswa, 403);

        $siswa = $user->siswa;
        $isSmk = $this->isSmk();

        $validated = $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'nis'          => ['nullable', 'min:7', 'unique:siswa,nis,' . $siswa->id],
            'nisn'         => ['nullable', 'digits:10', 'unique:siswa,nisn,' . $siswa->id],
            'kelas_id'     => ['required', 'exists:kelas,id'],
            'kejuruan_id'  => [
                $isSmk ? 'required' : 'nullable',
                Rule::exists('kejuruan', 'id'),
            ],
        ]);

        // Override kejuruan_id jadi null kalau bukan SMK
        $validated['kejuruan_id'] = $isSmk ? ($validated['kejuruan_id'] ?? null) : null;

        $siswa->update($validated);

        return Redirect::route('profile.edit')->with('status', 'student-data-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}