<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

class UpdateGalleryItemRequest extends StoreGalleryItemRequest
{
    protected function uniqueSlugRule(): Unique
    {
        return Rule::unique('gallery_items', 'slug')->ignore($this->route('gallery_item'));
    }
}
