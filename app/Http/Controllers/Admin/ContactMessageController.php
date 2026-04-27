<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => trim($request->string('search')->toString()),
            'status' => $request->string('status')->toString(),
        ];

        return Inertia::render('admin/contact-messages/index', [
            'messages' => ContactMessage::query()
                ->with('reviewedBy:id,name')
                ->when($filters['search'] !== '', function ($query) use ($filters): void {
                    $query->where(function ($searchQuery) use ($filters): void {
                        $searchQuery
                            ->where('name', 'like', '%'.$filters['search'].'%')
                            ->orWhere('email', 'like', '%'.$filters['search'].'%')
                            ->orWhere('subject', 'like', '%'.$filters['search'].'%')
                            ->orWhere('message', 'like', '%'.$filters['search'].'%');
                    });
                })
                ->when($filters['status'] !== '', function ($query) use ($filters): void {
                    $query->where('status', $filters['status']);
                })
                ->latest()
                ->paginate(10)
                ->withQueryString()
                ->through(fn (ContactMessage $message): array => [
                    'id' => $message->id,
                    'name' => $message->name,
                    'email' => $message->email,
                    'phone' => $message->phone,
                    'subject' => $message->subject,
                    'message' => $message->message,
                    'status' => $message->status,
                    'admin_notes' => $message->admin_notes,
                    'reviewed_at' => $message->reviewed_at?->toIso8601String(),
                    'created_at' => $message->created_at?->toIso8601String(),
                    'reviewed_by' => $message->reviewedBy === null ? null : [
                        'id' => $message->reviewedBy->id,
                        'name' => $message->reviewedBy->name,
                    ],
                ]),
            'filters' => $filters,
            'stats' => [
                'new' => ContactMessage::query()->where('status', 'new')->count(),
                'reviewing' => ContactMessage::query()->where('status', 'reviewing')->count(),
                'replied' => ContactMessage::query()->where('status', 'replied')->count(),
                'closed' => ContactMessage::query()->where('status', 'closed')->count(),
            ],
            'statusOptions' => $this->optionsFromAssociativeArray(ContactMessage::statusOptions()),
        ]);
    }

    public function update(UpdateContactMessageRequest $request, ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->fill($request->validated());
        $contactMessage->reviewed_at = now();
        $contactMessage->reviewed_by_user_id = $request->user()?->id;
        $contactMessage->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Contact message updated.'),
        ]);

        return back();
    }

    public function destroy(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Contact message deleted.'),
        ]);

        return back();
    }

    /**
     * @param  array<string, string>  $options
     * @return Collection<int, array{value: string, label: string}>
     */
    private function optionsFromAssociativeArray(array $options): Collection
    {
        return collect($options)->map(
            fn (string $label, string $value): array => [
                'value' => $value,
                'label' => $label,
            ],
        )->values();
    }
}
