<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'customer_name' => $this->customer_name,
            'customer_email' => $this->customer_email,
            'departure_month' => $this->departure_month,
            'travelers' => $this->travelers,
            'pricing_tier_id' => $this->pricing_tier_id,
            'service_tier' => $this->service_tier,
            'estimated_total' => $this->estimated_total,
            'status' => $this->status,
            'notes' => $this->notes,
            'admin_notes' => $this->admin_notes,
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'pricing_tier' => PricingTierResource::make($this->whenLoaded('pricingTier')),
            'safari' => SafariResource::make($this->whenLoaded('safari')),
        ];
    }
}
