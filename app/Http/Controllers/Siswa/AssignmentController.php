<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Assignment;
use App\Models\AssignmentRevision;
use App\Models\Guru;
use App\Models\Mapel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AssignmentController extends Controller
{
    /**
     * List all assignments submitted by the authenticated student.
     */
    public function index()
    {
        $assignments = Assignment::with(['guru', 'mapel'])
            ->where('user_id', Auth::id())
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Siswa/Assignment/Index', [
            'assignments' => $assignments,
            'title'       => 'My Assignments',
        ]);
    }

    /**
     * Show the assignment creation form.
     * Passes all teachers and ALL subjects (with guru_id).
     * Filtering is done client-side via Vue computed.
     */
    public function create()
    {
        $teachers = Guru::select('id', 'nama_lengkap')
            ->orderBy('nama_lengkap')
            ->get();

        // Include guru_id so the frontend can filter per teacher
        $subjects = Mapel::select('id', 'mapel', 'guru_id')
            ->orderBy('mapel')
            ->get();

        return Inertia::render('Siswa/Assignment/Create', [
            'teachers' => $teachers,
            'subjects' => $subjects,
            'title'    => 'Submit Assignment',
        ]);
    }

    /**
     * Store a new assignment submission.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'guru_id'   => ['required', 'exists:guru,id'],
            'mapel_id'  => ['required', 'exists:mapel,id'],
            'judul'     => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string', 'max:5000'],
            'file'      => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf,xls,xlsx,doc,docx,zip', 'max:10240'],
            'link'      => ['nullable', 'url', 'max:2048'],
        ]);

        // ── Cek limit untuk plan Free tier ──────────────────────
        if (tenant()->hasReachedFreeLimitForUser(Assignment::class, 2)) {
            return back()->with('error', 'Plan Free hanya dapat submit maksimal 2 tugas per akun. Silakan upgrade plan untuk menambah kuota.');
        }

        // Extra: verify mapel belongs to the selected guru
        $mapelBelongsToGuru = Mapel::where('id', $validated['mapel_id'])
            ->where('guru_id', $validated['guru_id'])
            ->exists();

        if (!$mapelBelongsToGuru) {
            return back()->withErrors(['mapel_id' => 'The selected subject does not belong to the chosen teacher.']);
        }

        // Normalize line endings (\r\n or \r → \n)
        $deskripsi = isset($validated['deskripsi'])
            ? str_replace(["\r\n", "\r"], "\n", $validated['deskripsi'])
            : null;

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('assignments', 'r2');   // ← ganti dari 'public'
        } elseif (!empty($validated['link'])) {
            $filePath = $validated['link'];
        }

        Assignment::create([
            'user_id'   => Auth::id(),
            'guru_id'   => $validated['guru_id'],
            'mapel_id'  => $validated['mapel_id'],
            'judul'     => $validated['judul'],
            'deskripsi' => $deskripsi,
            'file_path' => $filePath,
        ]);

        return redirect()
            ->route('siswa.assignment.index')
            ->with('success', 'Assignment submitted successfully!');
    }

    /**
     * Show the edit form for an existing assignment.
     */
    public function edit(Assignment $assignment)
    {
        // Authorization: only owner can edit
        if ($assignment->user_id !== Auth::id()) {
            abort(403, 'You are not authorized to edit this assignment.');
        }

        $teachers = Guru::select('id', 'nama_lengkap')
            ->orderBy('nama_lengkap')
            ->get();

        $subjects = Mapel::select('id', 'mapel', 'guru_id')
            ->orderBy('mapel')
            ->get();

        return Inertia::render('Siswa/Assignment/Edit', [
            'assignment' => $assignment,
            'teachers'   => $teachers,
            'subjects'   => $subjects,
            'title'      => 'Edit Assignment',
        ]);
    }

    /**
     * Update an existing assignment.
     */
    public function update(Request $request, Assignment $assignment)
    {
        // Authorization: only owner can update
        if ($assignment->user_id !== Auth::id()) {
            abort(403, 'You are not authorized to update this assignment.');
        }

        $validated = $request->validate([
            'guru_id'         => ['required', 'exists:guru,id'],
            'mapel_id'        => ['required', 'exists:mapel,id'],
            'judul'           => ['required', 'string', 'max:255'],
            'deskripsi'       => ['nullable', 'string', 'max:5000'],
            'file'            => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf,xls,xlsx,doc,docx,zip', 'max:10240'],
            'link'            => ['nullable', 'url', 'max:2048'],
            'attachment_type' => ['required', 'in:none,file,link'],
            'catatan_revisi' => ['nullable', 'string', 'max:1000'],
        ]);

        // Extra: verify mapel belongs to the selected guru
        $mapelBelongsToGuru = Mapel::where('id', $validated['mapel_id'])
            ->where('guru_id', $validated['guru_id'])
            ->exists();

        if (!$mapelBelongsToGuru) {
            return back()->withErrors(['mapel_id' => 'The selected subject does not belong to the chosen teacher.']);
        }

        // Normalize line endings
        $deskripsi = isset($validated['deskripsi'])
            ? str_replace(["\r\n", "\r"], "\n", $validated['deskripsi'])
            : null;

        $filePath = $assignment->file_path; // default: keep existing

        if ($validated['attachment_type'] === 'none') {
            $this->deleteLocalFile($assignment->file_path);
            $filePath = null;
        } elseif ($validated['attachment_type'] === 'file' && $request->hasFile('file')) {
            $this->deleteLocalFile($assignment->file_path);
            $filePath = $request->file('file')->store('assignments', 'r2');
        } elseif ($validated['attachment_type'] === 'link' && !empty($validated['link'])) {
            $this->deleteLocalFile($assignment->file_path);
            $filePath = $validated['link'];
        }
        // If attachment_type === 'file' but no new file uploaded → keep existing $filePath

        // Simpan snapshot SEBELUM diubah sebagai riwayat
        $newRevisionNumber = $assignment->revision_count + 1;

        AssignmentRevision::create([
            'tugas_id'       => $assignment->id,
            'judul'          => $assignment->judul,
            'deskripsi'      => $assignment->deskripsi,
            'catatan_revisi' => $validated['catatan_revisi'] ?? null,
            'revision_number' => $newRevisionNumber,
        ]);

        $assignment->update([
            'guru_id'        => $validated['guru_id'],
            'mapel_id'       => $validated['mapel_id'],
            'judul'          => $validated['judul'],
            'deskripsi'      => $deskripsi,
            'file_path'      => $filePath,
            'is_read'        => false,
            'is_updated'     => true,
            'revision_count' => $newRevisionNumber,
        ]);

        return redirect()
            ->route('siswa.assignment.index')
            ->with('success', 'Assignment revised successfully!');
    }

    /**
     * Delete a student's own assignment.
     */
    public function destroy(Assignment $assignment)
    {
        // Authorization: only owner can delete
        if ($assignment->user_id !== Auth::id()) {
            abort(403, 'You are not authorized to delete this assignment.');
        }

        $this->deleteLocalFile($assignment->file_path);
        $assignment->delete();

        return redirect()->back()->with('success', 'Assignment deleted successfully.');
    }

    /**
     * Helper: safely delete a locally stored file (skip external URLs).
     */
    private function deleteLocalFile(?string $filePath): void
    {
        if (
            $filePath &&
            !str_starts_with($filePath, 'http') &&
            Storage::disk('r2')->exists($filePath)   // ← ganti dari 'public'
        ) {
            Storage::disk('r2')->delete($filePath);   // ← ganti dari 'public'
        }
    }
}