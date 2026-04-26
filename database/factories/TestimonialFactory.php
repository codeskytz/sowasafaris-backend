<?php

namespace Database\Factories;

use App\Models\Safari;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Testimonial>
 */
class TestimonialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'safari_id' => Safari::factory(),
            'author_name' => fake()->name(),
            'author_image_url' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
            'author_image_alt' => fake()->sentence(4),
            'route_label' => null,
            'trip_date_label' => fake()->randomElement(['Jan 2024', 'Aug 2023', 'Sept 2023']),
            'quote' => fake()->paragraph(3),
            'is_published' => true,
            'sort_order' => 0,
        ];
    }
}
