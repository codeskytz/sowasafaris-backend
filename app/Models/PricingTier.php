<?php

namespace App\Models;

use Database\Factories\PricingTierFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'slug',
    'description',
    'inclusions',
    'price_adjustment',
    'is_recommended',
    'is_published',
    'sort_order',
])]
class PricingTier extends Model
{
    /** @use HasFactory<PricingTierFactory> */
    use HasFactory;

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'inclusions' => 'array',
            'price_adjustment' => 'integer',
            'is_recommended' => 'boolean',
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
