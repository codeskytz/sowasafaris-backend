<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PricingTierResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'recordId' => $this->id,
            'id' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'inclusions' => $this->inclusions,
            'priceAdjustment' => $this->price_adjustment,
            'isRecommended' => $this->is_recommended,
        ];
    }
}
