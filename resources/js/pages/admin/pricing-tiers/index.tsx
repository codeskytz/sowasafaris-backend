import { Form, Head, Link, router } from '@inertiajs/react';
import {
    destroy as destroyPricingTier,
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/PricingTierController';
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
import { dashboard } from '@/routes';
import { edit as contentEdit } from '@/routes/admin/content';
import { index as pricingTiersIndex } from '@/routes/admin/pricing-tiers';
import type { AdminPricingTier } from '@/types';

type PricingTierManagementPageProps = {
    pricingTiers: AdminPricingTier[];
};

const textAreaClasses =
    'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-28 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

function formatCurrency(value: number): string {
    return currencyFormatter.format(value);
}

function inclusionRows(inclusions: string[]): string[] {
    return [...inclusions, '', '', '', '', ''].slice(0, 6);
}

function handleDeletePricingTier(pricingTier: AdminPricingTier): void {
    if (
        !window.confirm(
            `Delete "${pricingTier.name}"? Existing bookings must be removed first.`,
        )
    ) {
        return;
    }

    router.delete(destroyPricingTier(pricingTier.id), {
        preserveScroll: true,
    });
}

function PricingTierFields({
    pricingTier,
}: {
    pricingTier?: AdminPricingTier;
}) {
    const rows = inclusionRows(pricingTier?.inclusions ?? []);

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="grid gap-2 xl:col-span-2">
                <Label htmlFor={pricingTier ? `name-${pricingTier.id}` : 'name'}>
                    Tier name
                </Label>
                <Input
                    id={pricingTier ? `name-${pricingTier.id}` : 'name'}
                    name="name"
                    defaultValue={pricingTier?.name ?? ''}
                    placeholder="Comfort Camp"
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={pricingTier ? `slug-${pricingTier.id}` : 'slug'}>
                    Slug
                </Label>
                <Input
                    id={pricingTier ? `slug-${pricingTier.id}` : 'slug'}
                    name="slug"
                    defaultValue={pricingTier?.slug ?? ''}
                    placeholder="comfort"
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label
                    htmlFor={
                        pricingTier
                            ? `price-adjustment-${pricingTier.id}`
                            : 'price-adjustment'
                    }
                >
                    Price adjustment
                </Label>
                <Input
                    id={
                        pricingTier
                            ? `price-adjustment-${pricingTier.id}`
                            : 'price-adjustment'
                    }
                    name="price_adjustment"
                    type="number"
                    min={0}
                    defaultValue={pricingTier?.price_adjustment ?? 0}
                    required
                />
            </div>

            <div className="grid gap-2 xl:col-span-4">
                <Label
                    htmlFor={
                        pricingTier
                            ? `description-${pricingTier.id}`
                            : 'description'
                    }
                >
                    Description
                </Label>
                <textarea
                    id={
                        pricingTier
                            ? `description-${pricingTier.id}`
                            : 'description'
                    }
                    name="description"
                    defaultValue={pricingTier?.description ?? ''}
                    className={textAreaClasses}
                    placeholder="Explain the camp comfort and service level travelers will receive."
                    required
                />
            </div>

            <div className="grid gap-2 xl:col-span-4">
                <Label>Inclusions</Label>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {rows.map((inclusion, index) => (
                        <Input
                            key={`${pricingTier?.id ?? 'new'}-${index}`}
                            name={`inclusions[${index}]`}
                            defaultValue={inclusion}
                            placeholder={`Inclusion ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            <div className="grid gap-2">
                <Label
                    htmlFor={
                        pricingTier ? `sort-order-${pricingTier.id}` : 'sort-order'
                    }
                >
                    Sort order
                </Label>
                <Input
                    id={
                        pricingTier ? `sort-order-${pricingTier.id}` : 'sort-order'
                    }
                    name="sort_order"
                    type="number"
                    min={0}
                    defaultValue={pricingTier?.sort_order ?? 0}
                    required
                />
            </div>

            <div className="flex flex-wrap gap-6 xl:col-span-3">
                <label className="flex items-center gap-3 text-sm font-medium">
                    <input
                        type="checkbox"
                        name="is_recommended"
                        value="1"
                        defaultChecked={pricingTier?.is_recommended ?? false}
                        className="size-4 rounded border-input"
                    />
                    Mark as recommended
                </label>

                <label className="flex items-center gap-3 text-sm font-medium">
                    <input
                        type="checkbox"
                        name="is_published"
                        value="1"
                        defaultChecked={pricingTier?.is_published ?? true}
                        className="size-4 rounded border-input"
                    />
                    Published on frontend
                </label>
            </div>
        </div>
    );
}

export default function PricingTierManagementPage({
    pricingTiers,
}: PricingTierManagementPageProps) {
    return (
        <>
            <Head title="Pricing Tiers" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <Heading
                        title="Pricing Tier Management"
                        description="Control the service packages, price adjustments, and inclusions that power the booking flow."
                    />

                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" asChild>
                            <Link href={dashboard()} prefetch>
                                Back to dashboard
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href={contentEdit()} prefetch>
                                Edit site content
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Add a pricing tier</CardTitle>
                        <CardDescription>
                            Create flexible booking packages without editing
                            the frontend source file again.
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
                                    <PricingTierFields />

                                    <div className="grid gap-2">
                                        <InputError message={errors.name} />
                                        <InputError message={errors.slug} />
                                        <InputError
                                            message={errors.description}
                                        />
                                        <InputError
                                            message={errors.price_adjustment}
                                        />
                                        <InputError
                                            message={errors['inclusions.0']}
                                        />
                                    </div>

                                    <Button disabled={processing}>
                                        Create pricing tier
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                {pricingTiers.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground">
                                No pricing tiers have been created yet.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {pricingTiers.map((pricingTier) => (
                            <Card key={pricingTier.id}>
                                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <CardTitle>
                                                {pricingTier.name}
                                            </CardTitle>
                                            {pricingTier.is_recommended && (
                                                <Badge variant="secondary">
                                                    Recommended
                                                </Badge>
                                            )}
                                            <Badge
                                                variant={
                                                    pricingTier.is_published
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {pricingTier.is_published
                                                    ? 'Published'
                                                    : 'Draft'}
                                            </Badge>
                                            <Badge variant="outline">
                                                {
                                                    pricingTier.bookings_count
                                                }{' '}
                                                bookings
                                            </Badge>
                                        </div>
                                        <CardDescription>
                                            {formatCurrency(
                                                pricingTier.price_adjustment,
                                            )}{' '}
                                            adjustment over base safari pricing.
                                        </CardDescription>
                                    </div>

                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            handleDeletePricingTier(
                                                pricingTier,
                                            )
                                        }
                                        disabled={
                                            pricingTier.bookings_count > 0
                                        }
                                    >
                                        Delete
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <Form
                                        {...update.form(pricingTier.id)}
                                        options={{ preserveScroll: true }}
                                        className="space-y-4"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <PricingTierFields
                                                    pricingTier={pricingTier}
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
                                                            errors.description
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.price_adjustment
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                'inclusions.0'
                                                            ]
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
                                                        Last updated{' '}
                                                        {pricingTier.updated_at
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
                                                                      pricingTier.updated_at,
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

PricingTierManagementPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Pricing Tiers',
            href: pricingTiersIndex(),
        },
    ],
};
