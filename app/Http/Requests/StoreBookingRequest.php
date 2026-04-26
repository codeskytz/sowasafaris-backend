<?php

namespace App\Http\Requests;

use App\Models\Booking;
use App\Models\PricingTier;
use App\Models\SiteSetting;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'safari_id' => [
                'required',
                'integer',
                Rule::exists('safaris', 'id')->where(function (Builder $query): void {
                    $query->where('is_published', true);
                }),
            ],
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_email' => ['required', 'email:rfc', 'max:255'],
            'departure_month' => ['required', 'date_format:Y-m'],
            'travelers' => ['required', 'integer', 'min:1', 'max:12'],
            'pricing_tier_id' => [
                'nullable',
                'integer',
                Rule::exists('pricing_tiers', 'id')->where(function (Builder $query): void {
                    $query->where('is_published', true);
                }),
            ],
            'service_tier' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:3000'],
        ];
    }

    /**
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if (! $this->filled('pricing_tier_id') && ! $this->filled('service_tier')) {
                    $validator->errors()->add('pricing_tier_id', 'Please choose a pricing tier.');
                }

                if (
                    $this->filled('service_tier')
                    && ! PricingTier::query()
                        ->published()
                        ->where('slug', $this->string('service_tier')->toString())
                        ->exists()
                ) {
                    $validator->errors()->add('service_tier', 'The selected pricing tier is not available.');
                }

                $availableDepartureMonths = SiteSetting::departureMonthValues();

                if (
                    $this->filled('departure_month')
                    && $availableDepartureMonths !== []
                    && ! in_array($this->string('departure_month')->toString(), $availableDepartureMonths, true)
                ) {
                    $validator->errors()->add('departure_month', 'That departure month is no longer available.');
                }
            },
        ];
    }
}
