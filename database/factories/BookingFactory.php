<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\PricingTier;
use App\Models\Safari;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $travelers = fake()->numberBetween(1, 6);

        return [
            'safari_id' => Safari::factory(),
            'pricing_tier_id' => PricingTier::factory(),
            'reference' => null,
            'customer_name' => fake()->name(),
            'customer_email' => fake()->safeEmail(),
            'departure_month' => fake()->date('Y-m', '+8 months'),
            'travelers' => $travelers,
            'service_tier' => 'summit-essential',
            'notes' => fake()->optional()->sentence(),
            'estimated_total' => 0,
            'status' => fake()->randomElement(Booking::statuses()),
            'admin_notes' => null,
            'reviewed_at' => null,
            'reviewed_by_user_id' => null,
        ];
    }

    public function configure(): static
    {
        return $this->afterMaking(function (Booking $booking): void {
            $safari = $booking->safari ?? Safari::query()->find($booking->safari_id);
            $pricingTier = $booking->pricingTier ?? PricingTier::query()->find($booking->pricing_tier_id);

            if ($safari instanceof Safari && $pricingTier instanceof PricingTier) {
                $booking->service_tier = $pricingTier->slug;
                $booking->estimated_total = Booking::calculateEstimatedTotal(
                    $safari,
                    $pricingTier,
                    $booking->travelers,
                );
            }
        })->afterCreating(function (Booking $booking): void {
            $booking->loadMissing(['safari', 'pricingTier']);

            if ($booking->safari instanceof Safari && $booking->pricingTier instanceof PricingTier) {
                $booking->service_tier = $booking->pricingTier->slug;
                $booking->estimated_total = Booking::calculateEstimatedTotal(
                    $booking->safari,
                    $booking->pricingTier,
                    $booking->travelers,
                );

                $booking->saveQuietly();
            }
        });
    }
}
