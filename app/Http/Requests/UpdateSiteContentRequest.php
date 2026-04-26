<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSiteContentRequest extends FormRequest
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
            'hero_content' => ['required', 'array'],
            'hero_content.headline' => ['required', 'string', 'max:160'],
            'hero_content.description' => ['required', 'string', 'max:1000'],
            'hero_content.image_alt' => ['required', 'string', 'max:255'],
            'hero_content.image_url' => ['required', 'url', 'max:2048'],
            'hero_content.primary_cta_label' => ['required', 'string', 'max:60'],
            'navigation_links' => ['required', 'array', 'min:1', 'max:10'],
            'navigation_links.*.label' => ['required', 'string', 'max:80'],
            'navigation_links.*.href' => ['required', 'string', 'max:255'],
            'trust_indicators' => ['required', 'array', 'min:1', 'max:6'],
            'trust_indicators.*.title' => ['required', 'string', 'max:120'],
            'trust_indicators.*.description' => ['required', 'string', 'max:255'],
            'trust_indicators.*.icon' => ['required', 'string', 'max:80'],
            'departure_months' => ['required', 'array', 'min:1', 'max:12'],
            'departure_months.*.value' => ['required', 'date_format:Y-m', 'distinct'],
            'departure_months.*.label' => ['required', 'string', 'max:80'],
            'footer_links' => ['required', 'array', 'min:1', 'max:10'],
            'footer_links.*.label' => ['required', 'string', 'max:80'],
            'footer_links.*.href' => ['required', 'string', 'max:255'],
            'footer_content' => ['required', 'array'],
            'footer_content.brand' => ['required', 'string', 'max:80'],
            'footer_content.copyright_text' => ['required', 'string', 'max:255'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'navigation_links' => $this->normalizeLinkRows('navigation_links'),
            'trust_indicators' => $this->normalizeTrustIndicators(),
            'departure_months' => $this->normalizeDepartureMonths(),
            'footer_links' => $this->normalizeLinkRows('footer_links'),
        ]);
    }

    /**
     * @return array<int, array{label: string, href: string}>
     */
    private function normalizeLinkRows(string $key): array
    {
        return collect($this->input($key, []))
            ->map(function (mixed $row): array {
                $link = is_array($row) ? $row : [];

                return [
                    'label' => trim((string) ($link['label'] ?? '')),
                    'href' => trim((string) ($link['href'] ?? '')),
                ];
            })
            ->filter(fn (array $row): bool => $row['label'] !== '' || $row['href'] !== '')
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{title: string, description: string, icon: string}>
     */
    private function normalizeTrustIndicators(): array
    {
        return collect($this->input('trust_indicators', []))
            ->map(function (mixed $row): array {
                $indicator = is_array($row) ? $row : [];

                return [
                    'title' => trim((string) ($indicator['title'] ?? '')),
                    'description' => trim((string) ($indicator['description'] ?? '')),
                    'icon' => trim((string) ($indicator['icon'] ?? '')),
                ];
            })
            ->filter(
                fn (array $row): bool => $row['title'] !== ''
                    || $row['description'] !== ''
                    || $row['icon'] !== '',
            )
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function normalizeDepartureMonths(): array
    {
        return collect($this->input('departure_months', []))
            ->map(function (mixed $row): array {
                $month = is_array($row) ? $row : [];

                return [
                    'value' => trim((string) ($month['value'] ?? '')),
                    'label' => trim((string) ($month['label'] ?? '')),
                ];
            })
            ->filter(fn (array $row): bool => $row['value'] !== '' || $row['label'] !== '')
            ->values()
            ->all();
    }
}
