<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
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
            'author' => $this->author_name,
            'authorImageAlt' => $this->author_image_alt,
            'authorImageSrc' => $this->author_image_url,
            'date' => $this->trip_date_label,
            'quote' => $this->quote,
            'route' => $this->safari?->name ?? $this->route_label ?? 'Sowa Safari',
        ];
    }
}
