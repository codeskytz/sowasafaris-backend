<?php

namespace App\Models;

use Database\Factories\GalleryItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'title',
    'slug',
    'category',
    'image_url',
    'image_alt',
    'layout_size',
    'is_published',
    'sort_order',
])]
class GalleryItem extends Model
{
    /** @use HasFactory<GalleryItemFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    public static function categoryOptions(): array
    {
        return [
            'camp' => 'Camp',
            'culture' => 'Culture',
            'summit' => 'Summit',
            'trail' => 'Trail',
        ];
    }

    /**
     * @return array<int, string>
     */
    public static function categories(): array
    {
        return array_keys(static::categoryOptions());
    }

    /**
     * @return array<string, string>
     */
    public static function layoutSizeOptions(): array
    {
        return [
            'regular' => 'Regular',
            'tall' => 'Tall',
            'wide' => 'Wide',
        ];
    }

    /**
     * @return array<int, string>
     */
    public static function layoutSizes(): array
    {
        return array_keys(static::layoutSizeOptions());
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
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
