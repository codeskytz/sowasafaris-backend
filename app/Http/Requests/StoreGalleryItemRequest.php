<?php

namespace App\Http\Requests;

use App\Models\GalleryItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

class StoreGalleryItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:160'],
            'slug' => ['required', 'string', 'max:180', $this->uniqueSlugRule()],
            'category' => ['required', 'string', Rule::in(GalleryItem::categories())],
            'image_url' => ['required', 'url', 'max:2048'],
            'image_alt' => ['required', 'string', 'max:255'],
            'layout_size' => ['required', 'string', Rule::in(GalleryItem::layoutSizes())],
            'is_published' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:9999'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $title = $this->string('title')->toString();
        $slug = $this->string('slug')->toString();

        $this->merge([
            'slug' => Str::slug($slug !== '' ? $slug : $title),
            'is_published' => $this->boolean('is_published'),
        ]);
    }

    protected function uniqueSlugRule(): Unique
    {
        return Rule::unique('gallery_items', 'slug');
    }
}
