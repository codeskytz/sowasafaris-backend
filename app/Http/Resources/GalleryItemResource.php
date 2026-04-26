<?php

namespace App\Http\Resources;

use App\Models\GalleryItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GalleryItemResource extends JsonResource
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
            'category' => GalleryItem::categoryOptions()[$this->category] ?? $this->category,
            'imageAlt' => $this->image_alt,
            'imageSrc' => $this->image_url,
            'size' => $this->layout_size,
            'title' => $this->title,
        ];
    }
}
