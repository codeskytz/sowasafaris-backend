<?php

namespace App\Http\Requests;

use App\Models\Safari;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;
use Illuminate\Validation\Rules\Unique;

class StoreSafariRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['required', 'string', 'max:140', $this->uniqueSlugRule()],
            'summary' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:4000'],
            'difficulty' => ['required', 'string', 'max:40'],
            'difficulty_group' => ['required', 'string', Rule::in(Safari::difficultyGroups())],
            'duration_days' => ['required', 'integer', 'min:1', 'max:30'],
            'elevation_meters' => ['required', 'integer', 'min:100', 'max:10000'],
            'base_price' => ['required', 'integer', 'min:100'],
            'availability' => ['required', 'string', Rule::in(Safari::availabilities())],
            'next_departure_at' => ['nullable', 'date'],
            'spots_left' => ['nullable', 'integer', 'min:0', 'max:60'],
            'best_for' => ['nullable', 'string', 'max:255'],
            'image_url' => ['nullable', 'url', 'max:2048'],
            'image_file' => ['nullable', File::image()->max(6 * 1024)],
            'image_alt' => ['nullable', 'string', 'max:255', Rule::requiredIf($this->filled('image_url') || $this->hasFile('image_file'))],
            'is_featured' => ['required', 'boolean'],
            'is_published' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:9999'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $name = $this->string('name')->toString();
        $slug = $this->string('slug')->toString();

        $this->merge([
            'slug' => Str::slug($slug !== '' ? $slug : $name),
            'is_featured' => $this->boolean('is_featured'),
            'is_published' => $this->boolean('is_published'),
        ]);
    }

    protected function uniqueSlugRule(): Unique
    {
        return Rule::unique('safaris', 'slug');
    }
}
