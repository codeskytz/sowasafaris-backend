<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGalleryItemRequest;
use App\Http\Requests\UpdateGalleryItemRequest;
use App\Models\GalleryItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class GalleryItemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/gallery-items/index', [
            'categoryOptions' => $this->optionsFromAssociativeArray(GalleryItem::categoryOptions()),
            'layoutSizeOptions' => $this->optionsFromAssociativeArray(GalleryItem::layoutSizeOptions()),
            'galleryItems' => GalleryItem::query()
                ->orderBy('sort_order')
                ->orderBy('title')
                ->get()
                ->map(fn (GalleryItem $galleryItem): array => [
                    'id' => $galleryItem->id,
                    'title' => $galleryItem->title,
                    'slug' => $galleryItem->slug,
                    'category' => $galleryItem->category,
                    'image_url' => $galleryItem->image_url,
                    'image_alt' => $galleryItem->image_alt,
                    'layout_size' => $galleryItem->layout_size,
                    'is_published' => $galleryItem->is_published,
                    'sort_order' => $galleryItem->sort_order,
                    'updated_at' => $galleryItem->updated_at?->toIso8601String(),
                ])
                ->values(),
        ]);
    }

    public function store(StoreGalleryItemRequest $request): RedirectResponse
    {
        GalleryItem::query()->create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Gallery item created.'),
        ]);

        return to_route('admin.gallery-items.index');
    }

    public function update(UpdateGalleryItemRequest $request, GalleryItem $galleryItem): RedirectResponse
    {
        $galleryItem->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Gallery item updated.'),
        ]);

        return to_route('admin.gallery-items.index');
    }

    public function destroy(GalleryItem $galleryItem): RedirectResponse
    {
        $galleryItem->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Gallery item deleted.'),
        ]);

        return to_route('admin.gallery-items.index');
    }

    /**
     * @param  array<string, string>  $options
     * @return Collection<int, array{value: string, label: string}>
     */
    private function optionsFromAssociativeArray(array $options): Collection
    {
        return collect($options)->map(
            fn (string $label, string $value): array => [
                'value' => $value,
                'label' => $label,
            ],
        )->values();
    }
}
