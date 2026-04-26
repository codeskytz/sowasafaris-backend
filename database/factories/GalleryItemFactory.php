<?php

namespace Database\Factories;

use App\Models\GalleryItem;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<GalleryItem>
 */
class GalleryItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(10, 99),
            'category' => fake()->randomElement(GalleryItem::categories()),
            'image_url' => 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
            'image_alt' => fake()->sentence(6),
            'layout_size' => fake()->randomElement(GalleryItem::layoutSizes()),
            'is_published' => true,
            'sort_order' => 0,
        ];
    }
}
