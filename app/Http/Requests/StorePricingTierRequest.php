<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

class StorePricingTierRequest extends FormRequest
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
            'description' => ['required', 'string', 'max:2000'],
            'inclusions' => ['required', 'array', 'min:1', 'max:8'],
            'inclusions.*' => ['required', 'string', 'max:255'],
            'price_adjustment' => ['required', 'integer', 'min:0', 'max:100000'],
            'is_recommended' => ['required', 'boolean'],
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
            'inclusions' => collect($this->input('inclusions', []))
                ->map(fn (mixed $value): string => trim((string) $value))
                ->filter()
                ->values()
                ->all(),
            'is_recommended' => $this->boolean('is_recommended'),
            'is_published' => $this->boolean('is_published'),
        ]);
    }

    protected function uniqueSlugRule(): Unique
    {
        return Rule::unique('pricing_tiers', 'slug');
    }
}
