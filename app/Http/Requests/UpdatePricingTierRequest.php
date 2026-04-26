<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

class UpdatePricingTierRequest extends StorePricingTierRequest
{
    protected function uniqueSlugRule(): Unique
    {
        return Rule::unique('pricing_tiers', 'slug')->ignore($this->route('pricing_tier'));
    }
}
