<?php

namespace Database\Factories;

use App\Models\PricingTier;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PricingTier>
 */
class PricingTierFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Summit Essential',
            'Comfort Camp',
            'Private Expedition',
            'Altitude Reserve',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->sentence(14),
            'inclusions' => fake()->sentences(3),
            'price_adjustment' => fake()->numberBetween(0, 1200),
            'is_recommended' => false,
            'is_published' => true,
            'sort_order' => 0,
        ];
    }
}
