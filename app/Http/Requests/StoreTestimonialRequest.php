<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTestimonialRequest extends FormRequest
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
            'safari_id' => ['nullable', 'integer', Rule::exists('safaris', 'id')],
            'author_name' => ['required', 'string', 'max:120'],
            'author_image_url' => ['required', 'url', 'max:2048'],
            'author_image_alt' => ['required', 'string', 'max:255'],
            'route_label' => ['nullable', 'string', 'max:120'],
            'trip_date_label' => ['required', 'string', 'max:40'],
            'quote' => ['required', 'string', 'max:4000'],
            'is_published' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:9999'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_published' => $this->boolean('is_published'),
        ]);
    }
}
