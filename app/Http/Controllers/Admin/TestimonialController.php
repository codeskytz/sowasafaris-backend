<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTestimonialRequest;
use App\Http\Requests\UpdateTestimonialRequest;
use App\Models\Safari;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/testimonials/index', [
            'safariOptions' => Safari::query()
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Safari $safari): array => [
                    'value' => (string) $safari->id,
                    'label' => $safari->name,
                ])
                ->values(),
            'testimonials' => Testimonial::query()
                ->with('safari:id,name')
                ->orderBy('sort_order')
                ->orderBy('author_name')
                ->get()
                ->map(fn (Testimonial $testimonial): array => [
                    'id' => $testimonial->id,
                    'safari_id' => $testimonial->safari_id,
                    'author_name' => $testimonial->author_name,
                    'author_image_url' => $testimonial->author_image_url,
                    'author_image_alt' => $testimonial->author_image_alt,
                    'route_label' => $testimonial->route_label,
                    'trip_date_label' => $testimonial->trip_date_label,
                    'quote' => $testimonial->quote,
                    'is_published' => $testimonial->is_published,
                    'sort_order' => $testimonial->sort_order,
                    'safari' => $testimonial->safari === null ? null : [
                        'id' => $testimonial->safari->id,
                        'name' => $testimonial->safari->name,
                    ],
                    'updated_at' => $testimonial->updated_at?->toIso8601String(),
                ])
                ->values(),
        ]);
    }

    public function store(StoreTestimonialRequest $request): RedirectResponse
    {
        Testimonial::query()->create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Testimonial created.'),
        ]);

        return to_route('admin.testimonials.index');
    }

    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Testimonial updated.'),
        ]);

        return to_route('admin.testimonials.index');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Testimonial deleted.'),
        ]);

        return to_route('admin.testimonials.index');
    }
}
