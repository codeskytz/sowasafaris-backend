<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSafariRequest;
use App\Http\Requests\UpdateSafariRequest;
use App\Models\Safari;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class SafariController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => trim($request->string('search')->toString()),
            'availability' => $request->string('availability')->toString(),
            'publication' => $request->string('publication')->toString(),
        ];

        return Inertia::render('admin/safaris/index', [
            'availabilityOptions' => $this->optionsFromAssociativeArray(Safari::availabilityOptions()),
            'difficultyGroupOptions' => $this->optionsFromAssociativeArray(Safari::difficultyGroupOptions()),
            'filters' => $filters,
            'publicationOptions' => collect([
                'all' => 'All safaris',
                'published' => 'Published only',
                'draft' => 'Drafts only',
            ])->map(
                fn (string $label, string $value): array => [
                    'value' => $value,
                    'label' => $label,
                ],
            )->values(),
            'safaris' => Safari::query()
                ->withCount('bookings')
                ->when($filters['search'] !== '', function ($query) use ($filters): void {
                    $query->where(function ($searchQuery) use ($filters): void {
                        $searchQuery
                            ->where('name', 'like', '%'.$filters['search'].'%')
                            ->orWhere('slug', 'like', '%'.$filters['search'].'%')
                            ->orWhere('summary', 'like', '%'.$filters['search'].'%');
                    });
                })
                ->when($filters['availability'] !== '', function ($query) use ($filters): void {
                    $query->where('availability', $filters['availability']);
                })
                ->when($filters['publication'] === 'published', function ($query): void {
                    $query->where('is_published', true);
                })
                ->when($filters['publication'] === 'draft', function ($query): void {
                    $query->where('is_published', false);
                })
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(fn (Safari $safari): array => [
                    'id' => $safari->id,
                    'name' => $safari->name,
                    'slug' => $safari->slug,
                    'summary' => $safari->summary,
                    'description' => $safari->description,
                    'difficulty' => $safari->difficulty,
                    'difficulty_group' => $safari->difficulty_group,
                    'duration_days' => $safari->duration_days,
                    'elevation_meters' => $safari->elevation_meters,
                    'base_price' => $safari->base_price,
                    'availability' => $safari->availability,
                    'next_departure_at' => $safari->next_departure_at?->toDateString(),
                    'spots_left' => $safari->spots_left,
                    'best_for' => $safari->best_for,
                    'image_url' => $safari->image_url,
                    'image_alt' => $safari->image_alt,
                    'is_featured' => $safari->is_featured,
                    'is_published' => $safari->is_published,
                    'sort_order' => $safari->sort_order,
                    'bookings_count' => $safari->bookings_count,
                    'created_at' => $safari->created_at?->toIso8601String(),
                    'updated_at' => $safari->updated_at?->toIso8601String(),
                ])
                ->values(),
        ]);
    }

    public function store(StoreSafariRequest $request): RedirectResponse
    {
        Safari::query()->create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Safari created.'),
        ]);

        return to_route('admin.safaris.index');
    }

    public function update(UpdateSafariRequest $request, Safari $safari): RedirectResponse
    {
        $safari->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Safari updated.'),
        ]);

        return to_route('admin.safaris.index');
    }

    public function destroy(Safari $safari): RedirectResponse
    {
        if ($safari->bookings()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('This safari already has bookings and cannot be deleted.'),
            ]);

            return to_route('admin.safaris.index');
        }

        $safari->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Safari deleted.'),
        ]);

        return to_route('admin.safaris.index');
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
