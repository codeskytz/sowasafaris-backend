import { Form, Head, Link, router } from '@inertiajs/react';
import {
    destroy as destroyBooking,
    update,
} from '@/actions/App/Http/Controllers/Admin/BookingController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index as bookingsIndex } from '@/routes/admin/bookings';
import { index as safarisIndex } from '@/routes/admin/safaris';
import type {
    AdminBooking,
    AdminBookingFilters,
    LengthAwarePaginator,
    Option,
} from '@/types';

type BookingManagementPageProps = {
    bookings: LengthAwarePaginator<AdminBooking>;
    filters: AdminBookingFilters;
    statusOptions: Option[];
    stats: {
        pending: number;
        contacted: number;
        confirmed: number;
        cancelled: number;
    };
};

const textAreaClasses =
    'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-28 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

const monthFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
});

function toLabel(value: string): string {
    return value
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function formatCurrency(value: number): string {
    return currencyFormatter.format(value);
}

function formatDate(value: string | null): string {
    if (value === null) {
        return 'Not reviewed yet';
    }

    return dateFormatter.format(new Date(value));
}

function formatMonth(value: string): string {
    return monthFormatter.format(new Date(`${value}-01T00:00:00`));
}

function statusVariant(
    value: string,
): 'default' | 'secondary' | 'outline' | 'destructive' {
    if (value === 'confirmed') {
        return 'default';
    }

    if (value === 'pending') {
        return 'secondary';
    }

    if (value === 'cancelled') {
        return 'destructive';
    }

    return 'outline';
}

function handleDeleteBooking(booking: AdminBooking): void {
    if (
        !window.confirm(
            `Delete booking ${booking.reference} for ${booking.customer_name}?`,
        )
    ) {
        return;
    }

    router.delete(destroyBooking(booking.id), {
        preserveScroll: true,
    });
}

export default function BookingManagementPage({
    bookings,
    filters,
    statusOptions,
    stats,
}: BookingManagementPageProps) {
    return (
        <>
            <Head title="Bookings" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <Heading
                        title="Booking Management"
                        description="Review incoming safari orders, update their status, and keep the frontend booking flow aligned with reality."
                    />

                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" asChild>
                            <Link href={dashboard()} prefetch>
                                Back to dashboard
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href={safarisIndex()} prefetch>
                                Manage safaris
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader className="gap-1">
                            <CardDescription>Pending</CardDescription>
                            <CardTitle className="text-3xl">
                                {stats.pending}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="gap-1">
                            <CardDescription>Contacted</CardDescription>
                            <CardTitle className="text-3xl">
                                {stats.contacted}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="gap-1">
                            <CardDescription>Confirmed</CardDescription>
                            <CardTitle className="text-3xl">
                                {stats.confirmed}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="gap-1">
                            <CardDescription>Cancelled</CardDescription>
                            <CardTitle className="text-3xl">
                                {stats.cancelled}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter the booking queue</CardTitle>
                        <CardDescription>
                            Search by traveler, email, reference, or safari and
                            narrow the queue by status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...bookingsIndex.form()}
                            options={{
                                preserveScroll: true,
                                preserveState: true,
                            }}
                            className="grid gap-4 md:grid-cols-[1.4fr_220px_auto]"
                        >
                            <div className="grid gap-2">
                                <label
                                    htmlFor="booking-search"
                                    className="text-sm font-medium"
                                >
                                    Search
                                </label>
                                <Input
                                    id="booking-search"
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Reference, traveler, email, or safari"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label
                                    htmlFor="booking-filter-status"
                                    className="text-sm font-medium"
                                >
                                    Status
                                </label>
                                <select
                                    id="booking-filter-status"
                                    name="status"
                                    defaultValue={filters.status}
                                    className={cn(
                                        textAreaClasses,
                                        'min-h-9 py-2',
                                    )}
                                >
                                    <option value="">All statuses</option>
                                    {statusOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end gap-3">
                                <Button type="submit">Apply filters</Button>
                                <Button variant="outline" asChild>
                                    <Link href={bookingsIndex()} prefetch>
                                        Clear
                                    </Link>
                                </Button>
                            </div>
                        </Form>
                    </CardContent>
                </Card>

                {bookings.data.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground">
                                No bookings match the current filters.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {bookings.data.map((booking) => (
                            <Card key={booking.id}>
                                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <CardTitle>
                                                {booking.customer_name}
                                            </CardTitle>
                                            <Badge
                                                variant={statusVariant(
                                                    booking.status,
                                                )}
                                            >
                                                {toLabel(booking.status)}
                                            </Badge>
                                        </div>
                                        <CardDescription>
                                            {booking.safari?.name ??
                                                'Safari unavailable'}{' '}
                                            for {booking.travelers} traveler
                                            {booking.travelers === 1
                                                ? ''
                                                : 's'}{' '}
                                            in{' '}
                                            {formatMonth(
                                                booking.departure_month,
                                            )}
                                            .
                                        </CardDescription>
                                    </div>

                                    <div className="flex flex-col items-end gap-3 text-right text-sm text-muted-foreground">
                                        <p className="font-medium text-foreground">
                                            {booking.reference}
                                        </p>
                                        <p>
                                            {formatCurrency(
                                                booking.estimated_total,
                                            )}
                                        </p>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                handleDeleteBooking(booking)
                                            }
                                        >
                                            Delete request
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        <div className="rounded-xl border p-4">
                                            <p className="text-sm text-muted-foreground">
                                                Contact
                                            </p>
                                            <p className="mt-2 font-medium">
                                                {booking.customer_email}
                                            </p>
                                        </div>
                                        <div className="rounded-xl border p-4">
                                            <p className="text-sm text-muted-foreground">
                                                Service tier
                                            </p>
                                            <p className="mt-2 font-medium">
                                                {toLabel(
                                                    booking.service_tier,
                                                )}
                                            </p>
                                        </div>
                                        <div className="rounded-xl border p-4">
                                            <p className="text-sm text-muted-foreground">
                                                Request created
                                            </p>
                                            <p className="mt-2 font-medium">
                                                {booking.created_at
                                                    ? formatDate(
                                                          booking.created_at,
                                                      )
                                                    : 'Not available'}
                                            </p>
                                        </div>
                                        <div className="rounded-xl border p-4">
                                            <p className="text-sm text-muted-foreground">
                                                Last review
                                            </p>
                                            <p className="mt-2 font-medium">
                                                {booking.reviewed_at
                                                    ? `${formatDate(
                                                          booking.reviewed_at,
                                                      )}${booking.reviewed_by ? ` by ${booking.reviewed_by.name}` : ''}`
                                                    : 'Awaiting first review'}
                                            </p>
                                        </div>
                                    </div>

                                    {booking.notes && (
                                        <div className="rounded-xl border p-4">
                                            <p className="text-sm font-medium">
                                                Traveler notes
                                            </p>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {booking.notes}
                                            </p>
                                        </div>
                                    )}

                                    <Form
                                        {...update.form(booking.id)}
                                        options={{ preserveScroll: true }}
                                        className="grid gap-4 rounded-xl border p-4"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                                                    <div className="grid gap-2">
                                                        <label
                                                            htmlFor={`status-${booking.id}`}
                                                            className="text-sm font-medium"
                                                        >
                                                            Status
                                                        </label>
                                                        <select
                                                            id={`status-${booking.id}`}
                                                            name="status"
                                                            defaultValue={
                                                                booking.status
                                                            }
                                                            className={cn(
                                                                textAreaClasses,
                                                                'min-h-9 py-2',
                                                            )}
                                                        >
                                                            {statusOptions.map(
                                                                (option) => (
                                                                    <option
                                                                        key={
                                                                            option.value
                                                                        }
                                                                        value={
                                                                            option.value
                                                                        }
                                                                    >
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                        <InputError
                                                            message={
                                                                errors.status
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <label
                                                            htmlFor={`admin-notes-${booking.id}`}
                                                            className="text-sm font-medium"
                                                        >
                                                            Internal notes
                                                        </label>
                                                        <textarea
                                                            id={`admin-notes-${booking.id}`}
                                                            name="admin_notes"
                                                            defaultValue={
                                                                booking.admin_notes ??
                                                                ''
                                                            }
                                                            className={
                                                                textAreaClasses
                                                            }
                                                            placeholder="Capture follow-up timing, payment notes, or guide coordination details."
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.admin_notes
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3">
                                                    <Button
                                                        disabled={processing}
                                                    >
                                                        Save booking update
                                                    </Button>
                                                    <p className="text-sm text-muted-foreground">
                                                        Status changes are
                                                        written back to the
                                                        admin queue and
                                                        preserved for future API
                                                        responses.
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </Form>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <Card>
                    <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {bookings.from ?? 0} to {bookings.to ?? 0}{' '}
                            of {bookings.total} booking requests.
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {bookings.links.map((link) => (
                                <Button
                                    key={`${link.label}-${link.url ?? 'null'}`}
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    asChild={link.url !== null}
                                    disabled={link.url === null}
                                >
                                    {link.url === null ? (
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <Link
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

BookingManagementPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Bookings',
            href: bookingsIndex(),
        },
    ],
};
