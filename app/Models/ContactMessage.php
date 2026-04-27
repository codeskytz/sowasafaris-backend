<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'name',
    'email',
    'phone',
    'subject',
    'message',
    'status',
    'admin_notes',
    'reviewed_at',
    'reviewed_by_user_id',
])]
class ContactMessage extends Model
{
    /**
     * @return array<string, string>
     */
    public static function statusOptions(): array
    {
        return [
            'new' => 'New',
            'reviewing' => 'Reviewing',
            'replied' => 'Replied',
            'closed' => 'Closed',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
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
            'reviewed_at' => 'datetime',
        ];
    }
}
