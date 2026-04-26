<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SafariResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'summary' => $this->summary,
            'description' => $this->description,
            'difficulty' => $this->difficulty,
            'difficulty_group' => $this->difficulty_group,
            'duration_days' => $this->duration_days,
            'elevation_meters' => $this->elevation_meters,
            'base_price' => $this->base_price,
            'availability' => $this->availability,
            'next_departure_at' => $this->next_departure_at?->toDateString(),
            'spots_left' => $this->spots_left,
            'best_for' => $this->best_for,
            'image_url' => $this->image_url,
            'image_alt' => $this->image_alt,
            'is_featured' => $this->is_featured,
            'is_published' => $this->is_published,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
