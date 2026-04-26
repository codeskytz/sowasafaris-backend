<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GalleryItemResource;
use App\Http\Resources\PricingTierResource;
use App\Http\Resources\TestimonialResource;
use App\Models\GalleryItem;
use App\Models\PricingTier;
use App\Models\Safari;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;

class SiteContentController extends Controller
{
    public function index(): JsonResponse
    {
        $content = SiteSetting::homepageContent();
        $safaris = Safari::query()
            ->published()
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $featuredSafaris = $safaris->where('is_featured', true)->values();
        $standardSafari = $featuredSafaris->first() ?? $safaris->first();
        $featuredSafari = $featuredSafaris->skip(1)->first()
            ?? $featuredSafaris->first()
            ?? $safaris->skip(1)->first()
            ?? $safaris->first();

        return response()->json([
            'navigationLinks' => $content[SiteSetting::NAVIGATION_LINKS],
            'heroContent' => $content[SiteSetting::HERO_CONTENT],
            'trustIndicators' => $content[SiteSetting::TRUST_INDICATORS],
            'safaris' => $safaris->map(fn (Safari $safari): array => [
                'recordId' => $safari->id,
                'id' => $safari->slug,
                'availability' => Safari::availabilityOptions()[$safari->availability] ?? $safari->availability,
                'basePrice' => $safari->base_price,
                'bestFor' => $safari->best_for ?? '',
                'difficulty' => $safari->difficulty,
                'difficultyGroup' => Safari::difficultyGroupOptions()[$safari->difficulty_group] ?? $safari->difficulty_group,
                'duration' => $safari->duration_days.' Days',
                'elevation' => number_format($safari->elevation_meters).'m',
                'imageAlt' => $safari->image_alt ?? $safari->name,
                'imageSrc' => $safari->image_url,
                'name' => $safari->name,
                'nextDeparture' => $safari->next_departure_at?->format('F d'),
                'spotsLeft' => $safari->spots_left ?? 0,
                'summary' => $safari->summary,
            ])->values(),
            'featuredSafariIds' => [
                'standard' => $standardSafari?->slug,
                'featured' => $featuredSafari?->slug,
            ],
            'pricingTiers' => PricingTierResource::collection(
                PricingTier::query()
                    ->published()
                    ->orderByDesc('is_recommended')
                    ->orderBy('sort_order')
                    ->orderBy('name')
                    ->get(),
            )->resolve(),
            'departureMonths' => $content[SiteSetting::DEPARTURE_MONTHS],
            'galleryItems' => GalleryItemResource::collection(
                GalleryItem::query()
                    ->published()
                    ->orderBy('sort_order')
                    ->orderBy('title')
                    ->get(),
            )->resolve(),
            'testimonials' => TestimonialResource::collection(
                Testimonial::query()
                    ->published()
                    ->with('safari:id,name')
                    ->orderBy('sort_order')
                    ->orderBy('author_name')
                    ->get(),
            )->resolve(),
            'footerLinks' => $content[SiteSetting::FOOTER_LINKS],
            'footerContent' => $content[SiteSetting::FOOTER_CONTENT],
        ]);
    }
}
