<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePricingTierRequest;
use App\Http\Requests\UpdatePricingTierRequest;
use App\Models\PricingTier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PricingTierController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/pricing-tiers/index', [
            'pricingTiers' => PricingTier::query()
                ->withCount('bookings')
                ->orderByDesc('is_recommended')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(fn (PricingTier $pricingTier): array => [
                    'id' => $pricingTier->id,
                    'name' => $pricingTier->name,
                    'slug' => $pricingTier->slug,
                    'description' => $pricingTier->description,
                    'inclusions' => $pricingTier->inclusions,
                    'price_adjustment' => $pricingTier->price_adjustment,
                    'is_recommended' => $pricingTier->is_recommended,
                    'is_published' => $pricingTier->is_published,
                    'sort_order' => $pricingTier->sort_order,
                    'bookings_count' => $pricingTier->bookings_count,
                    'updated_at' => $pricingTier->updated_at?->toIso8601String(),
                ])
                ->values(),
        ]);
    }

    public function store(StorePricingTierRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated): void {
            if ($validated['is_recommended']) {
                PricingTier::query()->update(['is_recommended' => false]);
            }

            PricingTier::query()->create($validated);
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Pricing tier created.'),
        ]);

        return to_route('admin.pricing-tiers.index');
    }

    public function update(UpdatePricingTierRequest $request, PricingTier $pricingTier): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($pricingTier, $validated): void {
            if ($validated['is_recommended']) {
                PricingTier::query()
                    ->whereKeyNot($pricingTier->id)
                    ->update(['is_recommended' => false]);
            }

            $pricingTier->update($validated);
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Pricing tier updated.'),
        ]);

        return to_route('admin.pricing-tiers.index');
    }

    public function destroy(PricingTier $pricingTier): RedirectResponse
    {
        if ($pricingTier->bookings()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('This pricing tier already has bookings and cannot be deleted.'),
            ]);

            return to_route('admin.pricing-tiers.index');
        }

        $pricingTier->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Pricing tier deleted.'),
        ]);

        return to_route('admin.pricing-tiers.index');
    }
}
