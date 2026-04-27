<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\ContactMessage;
use App\Models\GalleryItem;
use App\Models\PricingTier;
use App\Models\Safari;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'totalSafaris' => Safari::query()->count(),
                'publishedSafaris' => Safari::query()->published()->count(),
                'pendingBookings' => Booking::query()->where('status', 'pending')->count(),
                'totalBookings' => Booking::query()->count(),
                'contactMessages' => ContactMessage::query()->where('status', 'new')->count(),
                'pricingTiers' => PricingTier::query()->count(),
                'galleryItems' => GalleryItem::query()->count(),
                'testimonials' => Testimonial::query()->count(),
                'pipelineValue' => Booking::query()
                    ->whereIn('status', ['pending', 'contacted', 'confirmed'])
                    ->sum('estimated_total'),
            ],
            'featuredSafaris' => Safari::query()
                ->select([
                    'id',
                    'name',
                    'slug',
                    'summary',
                    'difficulty',
                    'duration_days',
                    'base_price',
                    'availability',
                    'spots_left',
                    'is_featured',
                    'is_published',
                ])
                ->withCount('bookings')
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->limit(4)
                ->get()
                ->map(fn (Safari $safari): array => [
                    'id' => $safari->id,
                    'name' => $safari->name,
                    'slug' => $safari->slug,
                    'summary' => $safari->summary,
                    'difficulty' => $safari->difficulty,
                    'duration_days' => $safari->duration_days,
                    'base_price' => $safari->base_price,
                    'availability' => $safari->availability,
                    'spots_left' => $safari->spots_left,
                    'isFeatured' => $safari->is_featured,
                    'isPublished' => $safari->is_published,
                    'bookingsCount' => $safari->bookings_count,
                ])
                ->values(),
            'recentBookings' => Booking::query()
                ->with(['safari:id,name,slug'])
                ->select([
                    'id',
                    'safari_id',
                    'reference',
                    'customer_name',
                    'travelers',
                    'service_tier',
                    'estimated_total',
                    'status',
                    'created_at',
                ])
                ->latest()
                ->limit(6)
                ->get()
                ->map(fn (Booking $booking): array => [
                    'id' => $booking->id,
                    'reference' => $booking->reference,
                    'customerName' => $booking->customer_name,
                    'travelers' => $booking->travelers,
                    'serviceTier' => $booking->service_tier,
                    'estimatedTotal' => $booking->estimated_total,
                    'status' => $booking->status,
                    'createdAt' => $booking->created_at?->toIso8601String(),
                    'safari' => $booking->safari === null ? null : [
                        'id' => $booking->safari->id,
                        'name' => $booking->safari->name,
                        'slug' => $booking->safari->slug,
                    ],
                ])
                ->values(),
        ]);
    }
}
