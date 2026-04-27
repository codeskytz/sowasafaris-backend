<?php

namespace App\Models;

use Database\Factories\SiteSettingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'key',
    'value',
])]
class SiteSetting extends Model
{
    public const HERO_CONTENT = 'hero_content';

    public const NAVIGATION_LINKS = 'navigation_links';

    public const TRUST_INDICATORS = 'trust_indicators';

    public const DEPARTURE_MONTHS = 'departure_months';

    public const CONTACT_CONTENT = 'contact_content';

    public const FOOTER_LINKS = 'footer_links';

    public const FOOTER_CONTENT = 'footer_content';

    /** @use HasFactory<SiteSettingFactory> */
    use HasFactory;

    /**
     * @return array<string, mixed>
     */
    public static function homepageContent(): array
    {
        return [
            static::HERO_CONTENT => static::getValue(static::HERO_CONTENT, static::defaultHeroContent()),
            static::NAVIGATION_LINKS => static::getValue(static::NAVIGATION_LINKS, []),
            static::TRUST_INDICATORS => static::getValue(static::TRUST_INDICATORS, []),
            static::DEPARTURE_MONTHS => static::getValue(static::DEPARTURE_MONTHS, []),
            static::CONTACT_CONTENT => static::getValue(static::CONTACT_CONTENT, static::defaultContactContent()),
            static::FOOTER_LINKS => static::getValue(static::FOOTER_LINKS, []),
            static::FOOTER_CONTENT => static::getValue(static::FOOTER_CONTENT, static::defaultFooterContent()),
        ];
    }

    public static function getValue(string $key, mixed $default = null): mixed
    {
        return static::query()->where('key', $key)->first()?->value ?? $default;
    }

    public static function putValue(string $key, mixed $value): self
    {
        return static::query()->updateOrCreate(
            ['key' => $key],
            ['value' => $value],
        );
    }

    /**
     * @param  array<string, mixed>  $content
     */
    public static function syncHomepageContent(array $content): void
    {
        foreach ([
            static::HERO_CONTENT,
            static::NAVIGATION_LINKS,
            static::TRUST_INDICATORS,
            static::DEPARTURE_MONTHS,
            static::CONTACT_CONTENT,
            static::FOOTER_LINKS,
            static::FOOTER_CONTENT,
        ] as $key) {
            static::putValue($key, $content[$key] ?? []);
        }
    }

    /**
     * @return array<int, string>
     */
    public static function departureMonthValues(): array
    {
        return collect(static::getValue(static::DEPARTURE_MONTHS, []))
            ->pluck('value')
            ->filter(fn (mixed $value): bool => is_string($value) && $value !== '')
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'value' => 'array',
        ];
    }

    /**
     * @return array<string, string>
     */
    private static function defaultHeroContent(): array
    {
        return [
            'headline' => '',
            'description' => '',
            'image_alt' => '',
            'image_url' => '',
            'primary_cta_label' => '',
        ];
    }

    /**
     * @return array<string, string>
     */
    private static function defaultFooterContent(): array
    {
        return [
            'brand' => 'SowaSafaris',
            'copyright_text' => '',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function defaultContactContent(): array
    {
        return [
            'headline' => 'Talk to Sowa Safaris',
            'description' => 'Ask about routes, availability, group trips, or custom safari planning. Our team will help you choose the right journey.',
            'email' => 'support@sowasafaris.com',
            'phone' => '+255 700 000 000',
            'whatsapp' => '+255 700 000 000',
            'address' => 'Moshi, Kilimanjaro, Tanzania',
            'office_hours' => 'Monday to Saturday, 8:00 AM - 6:00 PM',
            'response_time' => 'We usually reply within one business day.',
        ];
    }
}
