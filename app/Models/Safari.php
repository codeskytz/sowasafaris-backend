<?php

namespace App\Models;

use Database\Factories\SafariFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'slug',
    'summary',
    'description',
    'difficulty',
    'difficulty_group',
    'duration_days',
    'elevation_meters',
    'base_price',
    'availability',
    'next_departure_at',
    'spots_left',
    'best_for',
    'image_url',
    'image_alt',
    'is_featured',
    'is_published',
    'sort_order',
])]
class Safari extends Model
{
    /** @use HasFactory<SafariFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    public static function availabilityOptions(): array
    {
        return [
            'open' => 'Open',
            'few_spots' => 'Few Spots',
            'waitlist' => 'Waitlist',
            'closed' => 'Closed',
        ];
    }

    /**
     * @return array<int, string>
     */
    public static function availabilities(): array
    {
        return array_keys(static::availabilityOptions());
    }

    /**
     * @return array<string, string>
     */
    public static function difficultyGroupOptions(): array
    {
        return [
            'balanced' => 'Balanced',
            'challenge' => 'Challenge',
            'scenic' => 'Scenic',
        ];
    }

    /**
     * @return array<int, string>
     */
    public static function difficultyGroups(): array
    {
        return array_keys(static::difficultyGroupOptions());
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'duration_days' => 'integer',
            'elevation_meters' => 'integer',
            'base_price' => 'integer',
            'spots_left' => 'integer',
            'next_departure_at' => 'date',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
