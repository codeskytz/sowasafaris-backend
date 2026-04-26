<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

class UpdateSafariRequest extends StoreSafariRequest
{
    protected function uniqueSlugRule(): Unique
    {
        return Rule::unique('safaris', 'slug')->ignore($this->route('safari'));
    }
}
