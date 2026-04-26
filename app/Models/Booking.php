<?php

namespace App\Models;

use Database\Factories\BookingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'safari_id',
    'pricing_tier_id',
    'reference',
    'customer_name',
    'customer_email',
    'departure_month',
    'travelers',
    'service_tier',
    'notes',
    'estimated_total',
    'status',
    'admin_notes',
    'reviewed_at',
    'reviewed_by_user_id',
])]
class Booking extends Model
{
    /** @use HasFactory<BookingFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    public static function statusOptions(): array
    {
        return [
            'pending' => 'Pending',
            'contacted' => 'Contacted',
            'confirmed' => 'Confirmed',
            'cancelled' => 'Cancelled',
        ];
    }

    /**
     * @return array<int, string>
     */
    public static function statuses(): array
    {
        return array_keys(static::statusOptions());
    }

    public static function calculateEstimatedTotal(
        Safari $safari,
        PricingTier $pricingTier,
        int $travelers,
    ): int {
        return ($safari->base_price + $pricingTier->price_adjustment) * $travelers;
    }

    public function safari(): BelongsTo
    {
        return $this->belongsTo(Safari::class);
    }

    public function pricingTier(): BelongsTo
    {
        return $this->belongsTo(PricingTier::class);
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by_user_id');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'travelers' => 'integer',
            'estimated_total' => 'integer',
            'reviewed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Booking $booking): void {
            if ($booking->reference === null || $booking->reference === '') {
                $booking->reference = static::nextReference();
            }
        });
    }

    protected static function nextReference(): string
    {
        do {
            $reference = 'SOWA-'.Str::upper(Str::random(8));
        } while (static::query()->where('reference', $reference)->exists());

        return $reference;
    }
}
