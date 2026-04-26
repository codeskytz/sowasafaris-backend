import { Form, Head, Link, router } from '@inertiajs/react';
import {
    destroy as destroySafari,
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/SafariController';
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
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index as bookingsIndex } from '@/routes/admin/bookings';
import { index as safarisIndex } from '@/routes/admin/safaris';
import type {
    AdminSafari,
    AdminSafariFilters,
    Option,
} from '@/types';

type SafariManagementPageProps = {
    safaris: AdminSafari[];
    availabilityOptions: Option[];
    difficultyGroupOptions: Option[];
    filters: AdminSafariFilters;
    publicationOptions: Option[];
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

const textAreaClasses =
    'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-28 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

function toLabel(value: string): string {
    return value
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function formatCurrency(value: number): string {
    return currencyFormatter.format(value);
}

function handleDeleteSafari(safari: AdminSafari): void {
    if (!window.confirm(`Delete "${safari.name}"? This cannot be undone.`)) {
        return;
    }

    router.delete(destroySafari(safari.slug), {
        preserveScroll: true,
    });
}

function SafariFields({
    safari,
    availabilityOptions,
    difficultyGroupOptions,
}: {
    safari?: AdminSafari;
    availabilityOptions: Option[];
    difficultyGroupOptions: Option[];
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="grid gap-2 xl:col-span-2">
                <Label htmlFor={safari ? `name-${safari.id}` : 'name'}>
                    Safari name
                </Label>
                <Input
                    id={safari ? `name-${safari.id}` : 'name'}
                    name="name"
                    defaultValue={safari?.name ?? ''}
                    placeholder="Rwenzori Glacial Traverse"
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={safari ? `slug-${safari.id}` : 'slug'}>
                    Slug
                </Label>
                <Input
                    id={safari ? `slug-${safari.id}` : 'slug'}
                    name="slug"
                    defaultValue={safari?.slug ?? ''}
                    placeholder="rwenzori-glacial-traverse"
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={safari ? `difficulty-${safari.id}` : 'difficulty'}>
                    Difficulty
                </Label>
                <Input
                    id={safari ? `difficulty-${safari.id}` : 'difficulty'}
                    name="difficulty"
                    defaultValue={safari?.difficulty ?? 'Moderate'}
                    placeholder="Demanding"
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label
                    htmlFor={
                        safari
                            ? `difficulty-group-${safari.id}`
                            : 'difficulty-group'
                    }
                >
                    Difficulty group
                </Label>
                <select
                    id={
                        safari
                            ? `difficulty-group-${safari.id}`
                            : 'difficulty-group'
                    }
                    name="difficulty_group"
                    defaultValue={
                        safari?.difficulty_group ??
                        difficultyGroupOptions[0]?.value
                    }
                    className={cn(textAreaClasses, 'min-h-9 py-2')}
                >
                    {difficultyGroupOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2 xl:col-span-4">
                <Label htmlFor={safari ? `summary-${safari.id}` : 'summary'}>
                    Summary
                </Label>
                <Input
                    id={safari ? `summary-${safari.id}` : 'summary'}
                    name="summary"
                    defaultValue={safari?.summary ?? ''}
                    placeholder="A high-altitude expedition with glacier crossings and expert support."
                    required
                />
            </div>

            <div className="grid gap-2 xl:col-span-4">
                <Label htmlFor={safari ? `description-${safari.id}` : 'description'}>
                    Description
                </Label>
                <textarea
                    id={safari ? `description-${safari.id}` : 'description'}
                    name="description"
                    defaultValue={safari?.description ?? ''}
                    className={textAreaClasses}
                    placeholder="Describe the route, camp rhythm, guide support, and what guests should expect."
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={safari ? `duration-${safari.id}` : 'duration'}>
                    Duration (days)
                </Label>
                <Input
                    id={safari ? `duration-${safari.id}` : 'duration'}
                    name="duration_days"
                    type="number"
                    min={1}
                    max={30}
                    defaultValue={safari?.duration_days ?? 6}
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={safari ? `elevation-${safari.id}` : 'elevation'}>
                    Elevation (m)
                </Label>
                <Input
                    id={safari ? `elevation-${safari.id}` : 'elevation'}
                    name="elevation_meters"
                    type="number"
                    min={100}
                    max={10000}
                    defaultValue={safari?.elevation_meters ?? 3000}
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={safari ? `price-${safari.id}` : 'price'}>
                    Base price (USD)
                </Label>
                <Input
                    id={safari ? `price-${safari.id}` : 'price'}
                    name="base_price"
                    type="number"
                    min={100}
                    defaultValue={safari?.base_price ?? 1800}
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={safari ? `availability-${safari.id}` : 'availability'}>
                    Availability
                </Label>
                <select
                    id={safari ? `availability-${safari.id}` : 'availability'}
                    name="availability"
                    defaultValue={
                        safari?.availability ?? availabilityOptions[0]?.value
                    }
                    className={cn(textAreaClasses, 'min-h-9 py-2')}
                >
                    {availabilityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <Label
                    htmlFor={
                        safari ? `next-departure-${safari.id}` : 'next-departure'
                    }
                >
                    Next departure
                </Label>
                <Input
                    id={safari ? `next-departure-${safari.id}` : 'next-departure'}
                    name="next_departure_at"
                    type="date"
                    defaultValue={safari?.next_departure_at ?? ''}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={safari ? `spots-${safari.id}` : 'spots'}>
                    Spots left
                </Label>
                <Input
                    id={safari ? `spots-${safari.id}` : 'spots'}
                    name="spots_left"
                    type="number"
                    min={0}
                    max={60}
                    defaultValue={safari?.spots_left ?? ''}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={safari ? `order-${safari.id}` : 'order'}>
                    Sort order
                </Label>
                <Input
                    id={safari ? `order-${safari.id}` : 'order'}
                    name="sort_order"
                    type="number"
                    min={0}
                    defaultValue={safari?.sort_order ?? 0}
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={safari ? `best-for-${safari.id}` : 'best-for'}>
                    Best for
                </Label>
                <Input
                    id={safari ? `best-for-${safari.id}` : 'best-for'}
                    name="best_for"
                    defaultValue={safari?.best_for ?? ''}
                    placeholder="Experienced alpine hikers"
                />
            </div>

            <div className="grid gap-2 xl:col-span-3">
                <Label htmlFor={safari ? `image-${safari.id}` : 'image'}>
                    Cover image URL
                </Label>
                <Input
                    id={safari ? `image-${safari.id}` : 'image'}
                    name="image_url"
                    type="url"
                    defaultValue={safari?.image_url ?? ''}
                    placeholder="https://..."
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={safari ? `image-alt-${safari.id}` : 'image-alt'}>
                    Cover image alt text
                </Label>
                <Input
                    id={safari ? `image-alt-${safari.id}` : 'image-alt'}
                    name="image_alt"
                    defaultValue={safari?.image_alt ?? ''}
                    placeholder="Trekkers crossing a misty ridge"
                />
            </div>

            <div className="flex flex-wrap gap-6 xl:col-span-4">
                <label className="flex items-center gap-3 text-sm font-medium">
                    <input
                        type="checkbox"
                        name="is_featured"
                        value="1"
                        defaultChecked={safari?.is_featured ?? false}
                        className="size-4 rounded border-input"
                    />
                    Featured safari
                </label>

                <label className="flex items-center gap-3 text-sm font-medium">
                    <input
                        type="checkbox"
                        name="is_published"
                        value="1"
                        defaultChecked={safari?.is_published ?? true}
                        className="size-4 rounded border-input"
                    />
                    Published on frontend
                </label>
            </div>
        </div>
    );
}

export default function SafariManagementPage({
    safaris,
    availabilityOptions,
    difficultyGroupOptions,
    filters,
    publicationOptions,
}: SafariManagementPageProps) {
    return (
        <>
            <Head title="Safaris" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <Heading
                        title="Safari Management"
                        description="Publish, price, and reorder the trips that feed the public booking site."
                    />

                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" asChild>
                            <Link href={dashboard()} prefetch>
                                Back to dashboard
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href={bookingsIndex()} prefetch>
                                View bookings
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Find the right safari faster</CardTitle>
                        <CardDescription>
                            Filter by publication state, availability, or a
                            quick keyword while you manage inventory.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...safarisIndex.form()}
                            options={{
                                preserveScroll: true,
                                preserveState: true,
                            }}
                            className="grid gap-4 md:grid-cols-[1.4fr_220px_220px_auto]"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="safari-search">Search</Label>
                                <Input
                                    id="safari-search"
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Name, slug, or summary"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="safari-filter-publication">
                                    Publication
                                </Label>
                                <select
                                    id="safari-filter-publication"
                                    name="publication"
                                    defaultValue={filters.publication}
                                    className={cn(
                                        textAreaClasses,
                                        'min-h-9 py-2',
                                    )}
                                >
                                    {publicationOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="safari-filter-availability">
                                    Availability
                                </Label>
                                <select
                                    id="safari-filter-availability"
                                    name="availability"
                                    defaultValue={filters.availability}
                                    className={cn(
                                        textAreaClasses,
                                        'min-h-9 py-2',
                                    )}
                                >
                                    <option value="">All availability</option>
                                    {availabilityOptions.map((option) => (
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
                                    <Link href={safarisIndex()} prefetch>
                                        Clear
                                    </Link>
                                </Button>
                            </div>
                        </Form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Add a new safari</CardTitle>
                        <CardDescription>
                            Create a trip once here, then let the separate
                            frontend app consume it through the API.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...store.form()}
                            resetOnSuccess
                            options={{ preserveScroll: true }}
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <SafariFields
                                        availabilityOptions={
                                            availabilityOptions
                                        }
                                        difficultyGroupOptions={
                                            difficultyGroupOptions
                                        }
                                    />

                                    <div className="grid gap-2">
                                        <InputError message={errors.name} />
                                        <InputError message={errors.slug} />
                                        <InputError message={errors.summary} />
                                        <InputError
                                            message={errors.description}
                                        />
                                        <InputError
                                            message={errors.availability}
                                        />
                                        <InputError
                                            message={errors.base_price}
                                        />
                                    </div>

                                    <Button disabled={processing}>
                                        Create safari
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                {safaris.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground">
                                No safaris match the current filters.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {safaris.map((safari) => (
                            <Card key={safari.id}>
                                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <CardTitle>{safari.name}</CardTitle>
                                            <Badge variant="secondary">
                                                {safari.bookings_count} bookings
                                            </Badge>
                                            <Badge
                                                variant={
                                                    safari.is_published
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {safari.is_published
                                                    ? 'Published'
                                                    : 'Draft'}
                                            </Badge>
                                            {safari.is_featured && (
                                                <Badge variant="outline">
                                                    Featured
                                                </Badge>
                                            )}
                                        </div>
                                        <CardDescription>
                                            {toLabel(safari.availability)}{' '}
                                            availability and{' '}
                                            {formatCurrency(
                                                safari.base_price,
                                            )}{' '}
                                            base price.
                                        </CardDescription>
                                    </div>

                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            handleDeleteSafari(safari)
                                        }
                                        disabled={safari.bookings_count > 0}
                                    >
                                        Delete
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <Form
                                        {...update.form(safari.slug)}
                                        options={{ preserveScroll: true }}
                                        className="space-y-4"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <SafariFields
                                                    safari={safari}
                                                    availabilityOptions={
                                                        availabilityOptions
                                                    }
                                                    difficultyGroupOptions={
                                                        difficultyGroupOptions
                                                    }
                                                />

                                                <div className="grid gap-2">
                                                    <InputError
                                                        message={errors.name}
                                                    />
                                                    <InputError
                                                        message={errors.slug}
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.summary
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.description
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.availability
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.base_price
                                                        }
                                                    />
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3">
                                                    <Button
                                                        disabled={processing}
                                                    >
                                                        Save changes
                                                    </Button>
                                                    <p className="text-sm text-muted-foreground">
                                                        Updated at{' '}
                                                        {safari.updated_at
                                                            ? new Intl.DateTimeFormat(
                                                                  'en-US',
                                                                  {
                                                                      dateStyle:
                                                                          'medium',
                                                                      timeStyle:
                                                                          'short',
                                                                  },
                                                              ).format(
                                                                  new Date(
                                                                      safari.updated_at,
                                                                  ),
                                                              )
                                                            : 'not available'}
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
            </div>
        </>
    );
}

SafariManagementPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Safaris',
            href: safarisIndex(),
        },
    ],
};
