<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Guru;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AssignController extends Controller
{
    /**
     * List all assignments sent to the authenticated teacher.
     */
    public function index()
    {
        $guru = Guru::where('user_id', Auth::id())->first();

        if (!$guru) {
            return Inertia::render('Guru/Assignment/Index', [
                'assignments' => [],
                'title'       => 'Assignments',
            ]);
        }

        $assignments = $guru->assignments()
            ->with(['mapel', 'guru', 'siswa.kelas'])
            ->orderByRaw('is_read ASC')
            ->orderByRaw('is_updated DESC')
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('Guru/Assignment/Index', [
            'assignments' => $assignments,
            'title'       => 'Assignments',
        ]);
    }

    /**
     * Show a single assignment submitted to this teacher.
     */
    public function show(Assignment $assignment)
    {
        $guru = Guru::where('user_id', Auth::id())->first();

        if (!$guru) {
            return redirect()->route('guru.assignment.index')
                ->with('error', 'Teacher data not found.');
        }

        if ($assignment->guru_id !== $guru->id) {
            abort(403);
        }

        if (!$assignment->is_read) {
            $assignment->update([
                'is_read'    => true,
                'is_updated' => false,
            ]);
        }

        return Inertia::render('Guru/Assignment/Show', [
            'assignment' => $assignment->load([
                'siswa.kelas',
                'mapel',
                'guru',
                'revisions'
            ]),
            'title' => 'Assignment Detail',
        ]);
    }

    public function markAllRead()
    {
        $guru = Guru::where('user_id', Auth::id())->first();
        if (!$guru) return response()->json(['ok' => false], 403);

        Assignment::where('guru_id', $guru->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return back();
    }
}