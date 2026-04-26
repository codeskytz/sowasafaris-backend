<?php

namespace Database\Factories;

use App\Models\Safari;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Safari>
 */
class SafariFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Mount Kilimanjaro Summit Trek',
            'Rwenzori Glacial Traverse',
            'Virunga Volcano Ridge Walk',
            'Meru Forest Ascent',
            'Atlas High Camp Expedition',
            'Bwindi Highlands Discovery',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(10, 99),
            'summary' => fake()->sentence(10),
            'description' => fake()->paragraphs(3, true),
            'difficulty' => fake()->randomElement(['Moderate', 'Challenging', 'Demanding']),
            'difficulty_group' => fake()->randomElement(Safari::difficultyGroups()),
            'duration_days' => fake()->numberBetween(3, 12),
            'elevation_meters' => fake()->numberBetween(1800, 5895),
            'base_price' => fake()->numberBetween(980, 4200),
            'availability' => fake()->randomElement(Safari::availabilities()),
            'next_departure_at' => fake()->dateTimeBetween('+2 weeks', '+6 months'),
            'spots_left' => fake()->numberBetween(2, 14),
            'best_for' => fake()->randomElement([
                'First-time alpine travelers',
                'Photography-focused groups',
                'Private milestone trips',
                'Experienced high-altitude hikers',
            ]),
            'image_url' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
            'image_alt' => fake()->sentence(5),
            'is_featured' => false,
            'is_published' => true,
            'sort_order' => 0,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes): array => [
            'is_published' => false,
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes): array => [
            'is_featured' => true,
        ]);
    }
}
