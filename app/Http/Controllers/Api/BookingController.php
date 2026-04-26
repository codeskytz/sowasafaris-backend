<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Mail\BookingRequestReceived;
use App\Models\Booking;
use App\Models\PricingTier;
use App\Models\Safari;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    public function store(StoreBookingRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $safari = Safari::query()->published()->findOrFail($validated['safari_id']);
        $pricingTier = isset($validated['pricing_tier_id'])
            ? PricingTier::query()->published()->findOrFail($validated['pricing_tier_id'])
            : PricingTier::query()
                ->published()
                ->where('slug', $validated['service_tier'])
                ->firstOrFail();

        $booking = Booking::query()->create([
            ...$validated,
            'pricing_tier_id' => $pricingTier->id,
            'service_tier' => $pricingTier->slug,
            'estimated_total' => Booking::calculateEstimatedTotal(
                $safari,
                $pricingTier,
                $validated['travelers'],
            ),
        ]);

        $booking->load(['safari', 'pricingTier']);

        Mail::to($booking->customer_email, $booking->customer_name)
            ->send(new BookingRequestReceived($booking));

        return BookingResource::make($booking)
            ->response()
            ->setStatusCode(201);
    }
}
