<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class HeroSlideController extends Controller
{
    // ── Helpers ──────────────────────────────────────────────────────────────

    private function storeImage(Request $request, string $field = 'image'): string
    {
        $file     = $request->file($field);
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path     = $file->storeAs('hero-slides', $filename, 'public');

        return $path; // e.g. "hero-slides/uuid.jpg"
    }

    /**
     * Normalise heading input menjadi array string non-kosong.
     * Menerima: JSON string, array PHP, atau string CSV.
     */
    private function headingArray(Request $request): array
    {
        $raw = $request->input('heading');

        if (is_array($raw)) {
            $result = array_values($raw);
        } elseif (is_string($raw) && Str::startsWith(ltrim($raw), '[')) {
            $result = json_decode($raw, true) ?? [];
        } else {
            $result = array_map('trim', explode(',', (string) $raw));
        }

        // BUG FIX: filter string kosong agar tidak tersimpan sebagai ['']
        return array_values(array_filter($result, fn($v) => trim($v) !== ''));
    }

    /**
     * Helper: bentuk array data slide untuk response (tanpa image_url dari DB).
     */
    private function slideResponse(HeroSlide $slide): array
    {
        return array_merge(
            $slide->fresh()->toArray(),
            ['image_url' => $slide->fresh()->public_image_url]
        );
    }

    // ── API Endpoints ─────────────────────────────────────────────────────────

    /**
     * GET /api/v1/hero-slides
     * Public endpoint dikonsumsi Vue HeroSection.
     */
    public function publicIndex()
    {
        $slides = HeroSlide::active()->get()->map(fn (HeroSlide $slide) => [
            'id'        => $slide->id,
            'label'     => $slide->label,
            'heading'   => $slide->heading,
            'accent'    => $slide->accent,
            'sub'       => $slide->sub,
            'img'       => $slide->public_image_url,
            'tag'       => $slide->tag,
            'cta'       => $slide->cta,
            'ctaTarget' => $slide->cta_target,
        ]);

        return response()->json($slides);
    }

    // ── Admin CRUD ────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/admin/hero-slides
     */
    public function index()
    {
        $slides = HeroSlide::orderBy('order')->get()
            ->map(fn (HeroSlide $slide) => array_merge(
                $slide->toArray(),
                ['image_url' => $slide->public_image_url]
            ));

        return response()->json($slides);
    }

    /**
     * POST /api/v1/admin/hero-slides
     */
    public function store(Request $request)
    {
        $request->validate([
            'label'      => 'required|string|max:100',
            'heading'    => 'required',
            'accent'     => 'required|integer|min:0',
            'sub'        => 'required|string',
            'image'      => 'required|image|mimes:jpg,jpeg,png,webp|max:15360',
            'tag'        => 'nullable|string|max:100',
            'cta'        => 'nullable|string|max:60',
            'cta_target' => 'nullable|string|max:60',
            'order'      => 'nullable|integer|min:0',
            'is_active'  => 'nullable|boolean',
        ]);

        $imagePath = $this->storeImage($request);

        $slide = HeroSlide::create([
            'label'      => $request->label,
            'heading'    => $this->headingArray($request),
            'accent'     => (int) $request->accent,
            'sub'        => $request->sub,
            'image_path' => $imagePath,
            // BUG FIX: image_url TIDAK disimpan ke DB
            'tag'        => $request->tag,
            'cta'        => $request->input('cta', 'Lihat Program'),
            'cta_target' => $request->input('cta_target', 'programs'),
            'order'      => $request->input('order', HeroSlide::max('order') + 1),
            'is_active'  => $request->boolean('is_active', true),
        ]);

        return response()->json([
            'message' => 'Slide berhasil ditambahkan.',
            'slide'   => $this->slideResponse($slide),
        ], 201);
    }

    /**
     * GET /api/v1/admin/hero-slides/{id}
     */
    public function show(HeroSlide $heroSlide)
    {
        return response()->json(array_merge(
            $heroSlide->toArray(),
            ['image_url' => $heroSlide->public_image_url]
        ));
    }

    /**
     * POST /api/v1/admin/hero-slides/{id}  (multipart, kirim _method=PUT)
     */
    public function update(Request $request, HeroSlide $heroSlide)
    {
        $request->validate([
            'label'      => 'sometimes|string|max:100',
            'heading'    => 'sometimes',
            'accent'     => 'sometimes|integer|min:0',
            'sub'        => 'sometimes|string',
            'image'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:15360',
            'tag'        => 'nullable|string|max:100',
            'cta'        => 'nullable|string|max:60',
            'cta_target' => 'nullable|string|max:60',
            'order'      => 'nullable|integer|min:0',
            'is_active'  => 'nullable|boolean',
        ]);

        // Hanya ambil field yang dikirim (partial update)
        $data = array_filter(
            $request->only(['label', 'accent', 'sub', 'tag', 'cta', 'cta_target', 'order']),
            fn ($v) => $v !== null
        );

        if ($request->has('heading')) {
            $data['heading'] = $this->headingArray($request);
        }

        if ($request->hasFile('image')) {
            $heroSlide->deleteImage();
            $imagePath          = $this->storeImage($request);
            $data['image_path'] = $imagePath;
            // BUG FIX: image_url TIDAK disimpan ke DB
        }

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        $heroSlide->update($data);

        return response()->json([
            'message' => 'Slide berhasil diperbarui.',
            'slide'   => $this->slideResponse($heroSlide),
        ]);
    }

    /**
     * DELETE /api/v1/admin/hero-slides/{id}
     */
    public function destroy(HeroSlide $heroSlide)
    {
        $heroSlide->deleteImage();
        $heroSlide->delete();

        return response()->json(['message' => 'Slide berhasil dihapus.']);
    }

    /**
     * POST /api/v1/admin/hero-slides-reorder
     * Body: { order: [{ id: 1, order: 0 }, { id: 2, order: 1 }, ...] }
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'order'           => 'required|array|min:1',
            'order.*.id'      => 'required|exists:hero_slides,id',
            'order.*.order'   => 'required|integer|min:0',
        ]);

        foreach ($request->order as $item) {
            HeroSlide::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'Urutan slide diperbarui.']);
    }
}