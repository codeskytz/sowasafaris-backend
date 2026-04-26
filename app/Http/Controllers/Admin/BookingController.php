<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => trim($request->string('search')->toString()),
            'status' => $request->string('status')->toString(),
        ];

        return Inertia::render('admin/bookings/index', [
            'bookings' => Booking::query()
                ->with(['safari:id,name,slug', 'reviewedBy:id,name'])
                ->when($filters['search'] !== '', function ($query) use ($filters): void {
                    $query->where(function ($searchQuery) use ($filters): void {
                        $searchQuery
                            ->where('reference', 'like', '%'.$filters['search'].'%')
                            ->orWhere('customer_name', 'like', '%'.$filters['search'].'%')
                            ->orWhere('customer_email', 'like', '%'.$filters['search'].'%')
                            ->orWhereHas('safari', function ($safariQuery) use ($filters): void {
                                $safariQuery->where('name', 'like', '%'.$filters['search'].'%');
                            });
                    });
                })
                ->when($filters['status'] !== '', function ($query) use ($filters): void {
                    $query->where('status', $filters['status']);
                })
                ->latest()
                ->paginate(10)
                ->withQueryString()
                ->through(fn (Booking $booking): array => [
                    'id' => $booking->id,
                    'reference' => $booking->reference,
                    'customer_name' => $booking->customer_name,
                    'customer_email' => $booking->customer_email,
                    'departure_month' => $booking->departure_month,
                    'travelers' => $booking->travelers,
                    'service_tier' => $booking->service_tier,
                    'estimated_total' => $booking->estimated_total,
                    'status' => $booking->status,
                    'notes' => $booking->notes,
                    'admin_notes' => $booking->admin_notes,
                    'reviewed_at' => $booking->reviewed_at?->toIso8601String(),
                    'created_at' => $booking->created_at?->toIso8601String(),
                    'safari' => $booking->safari === null ? null : [
                        'id' => $booking->safari->id,
                        'name' => $booking->safari->name,
                        'slug' => $booking->safari->slug,
                    ],
                    'reviewed_by' => $booking->reviewedBy === null ? null : [
                        'id' => $booking->reviewedBy->id,
                        'name' => $booking->reviewedBy->name,
                    ],
                ]),
            'filters' => $filters,
            'stats' => [
                'pending' => Booking::query()->where('status', 'pending')->count(),
                'contacted' => Booking::query()->where('status', 'contacted')->count(),
                'confirmed' => Booking::query()->where('status', 'confirmed')->count(),
                'cancelled' => Booking::query()->where('status', 'cancelled')->count(),
            ],
            'statusOptions' => $this->optionsFromAssociativeArray(Booking::statusOptions()),
        ]);
    }

    public function update(UpdateBookingRequest $request, Booking $booking): RedirectResponse
    {
        $booking->fill($request->validated());
        $booking->reviewed_at = now();
        $booking->reviewed_by_user_id = $request->user()?->id;
        $booking->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Booking updated.'),
        ]);

        return back();
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        $booking->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Booking deleted.'),
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
