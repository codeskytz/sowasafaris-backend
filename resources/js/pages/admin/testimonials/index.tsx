import { Form, Head, Link, router } from '@inertiajs/react';
import {
    destroy as destroyTestimonial,
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/TestimonialController';
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
import { index as testimonialsIndex } from '@/routes/admin/testimonials';
import type { AdminTestimonial, Option } from '@/types';

type TestimonialManagementPageProps = {
    testimonials: AdminTestimonial[];
    safariOptions: Option[];
};

const textAreaClasses =
    'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-28 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

function handleDeleteTestimonial(testimonial: AdminTestimonial): void {
    if (!window.confirm(`Delete testimonial from ${testimonial.author_name}?`)) {
        return;
    }

    router.delete(destroyTestimonial(testimonial.id), {
        preserveScroll: true,
    });
}

function TestimonialFields({
    testimonial,
    safariOptions,
}: {
    testimonial?: AdminTestimonial;
    safariOptions: Option[];
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="grid gap-2">
                <Label
                    htmlFor={testimonial ? `author-${testimonial.id}` : 'author'}
                >
                    Author
                </Label>
                <Input
                    id={testimonial ? `author-${testimonial.id}` : 'author'}
                    name="author_name"
                    defaultValue={testimonial?.author_name ?? ''}
                    placeholder="James T."
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label
                    htmlFor={
                        testimonial ? `trip-date-${testimonial.id}` : 'trip-date'
                    }
                >
                    Trip date label
                </Label>
                <Input
                    id={
                        testimonial ? `trip-date-${testimonial.id}` : 'trip-date'
                    }
                    name="trip_date_label"
                    defaultValue={testimonial?.trip_date_label ?? ''}
                    placeholder="Aug 2023"
                    required
                />
            </div>

            <div className="grid gap-2 xl:col-span-2">
                <Label
                    htmlFor={testimonial ? `safari-${testimonial.id}` : 'safari'}
                >
                    Linked safari
                </Label>
                <select
                    id={testimonial ? `safari-${testimonial.id}` : 'safari'}
                    name="safari_id"
                    defaultValue={testimonial?.safari_id ?? ''}
                    className={cn(textAreaClasses, 'min-h-9 py-2')}
                >
                    <option value="">No safari linked</option>
                    {safariOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2 xl:col-span-2">
                <Label
                    htmlFor={
                        testimonial ? `route-label-${testimonial.id}` : 'route-label'
                    }
                >
                    Route label fallback
                </Label>
                <Input
                    id={
                        testimonial ? `route-label-${testimonial.id}` : 'route-label'
                    }
                    name="route_label"
                    defaultValue={testimonial?.route_label ?? ''}
                    placeholder="Northern Circuit"
                />
            </div>

            <div className="grid gap-2 xl:col-span-2">
                <Label
                    htmlFor={
                        testimonial
                            ? `author-image-url-${testimonial.id}`
                            : 'author-image-url'
                    }
                >
                    Author image URL
                </Label>
                <Input
                    id={
                        testimonial
                            ? `author-image-url-${testimonial.id}`
                            : 'author-image-url'
                    }
                    name="author_image_url"
                    type="url"
                    defaultValue={testimonial?.author_image_url ?? ''}
                    placeholder="https://..."
                    required
                />
            </div>

            <div className="grid gap-2 xl:col-span-4">
                <Label
                    htmlFor={
                        testimonial
                            ? `author-image-alt-${testimonial.id}`
                            : 'author-image-alt'
                    }
                >
                    Author image alt text
                </Label>
                <Input
                    id={
                        testimonial
                            ? `author-image-alt-${testimonial.id}`
                            : 'author-image-alt'
                    }
                    name="author_image_alt"
                    defaultValue={testimonial?.author_image_alt ?? ''}
                    placeholder="Portrait of a trekker smiling in alpine gear"
                    required
                />
            </div>

            <div className="grid gap-2 xl:col-span-4">
                <Label htmlFor={testimonial ? `quote-${testimonial.id}` : 'quote'}>
                    Quote
                </Label>
                <textarea
                    id={testimonial ? `quote-${testimonial.id}` : 'quote'}
                    name="quote"
                    defaultValue={testimonial?.quote ?? ''}
                    className={textAreaClasses}
                    placeholder="Share the traveler's experience, outcome, and emotional highlight."
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label
                    htmlFor={
                        testimonial ? `sort-order-${testimonial.id}` : 'sort-order'
                    }
                >
                    Sort order
                </Label>
                <Input
                    id={
                        testimonial ? `sort-order-${testimonial.id}` : 'sort-order'
                    }
                    name="sort_order"
                    type="number"
                    min={0}
                    defaultValue={testimonial?.sort_order ?? 0}
                    required
                />
            </div>

            <div className="flex flex-wrap gap-6 xl:col-span-3">
                <label className="flex items-center gap-3 text-sm font-medium">
                    <input
                        type="checkbox"
                        name="is_published"
                        value="1"
                        defaultChecked={testimonial?.is_published ?? true}
                        className="size-4 rounded border-input"
                    />
                    Published on frontend
                </label>
            </div>
        </div>
    );
}

export default function TestimonialManagementPage({
    testimonials,
    safariOptions,
}: TestimonialManagementPageProps) {
    return (
        <>
            <Head title="Testimonials" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <Heading
                        title="Testimonial Management"
                        description="Manage the traveler stories and route-specific social proof shown on the booking site."
                    />

                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" asChild>
                            <Link href={dashboard()} prefetch>
                                Back to dashboard
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Add a testimonial</CardTitle>
                        <CardDescription>
                            Create admin-moderated testimonials that can be
                            published directly to the frontend.
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
                                    <TestimonialFields
                                        safariOptions={safariOptions}
                                    />

                                    <div className="grid gap-2">
                                        <InputError
                                            message={errors.author_name}
                                        />
                                        <InputError
                                            message={errors.trip_date_label}
                                        />
                                        <InputError message={errors.quote} />
                                        <InputError
                                            message={errors.author_image_url}
                                        />
                                    </div>

                                    <Button disabled={processing}>
                                        Create testimonial
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                {testimonials.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground">
                                No testimonials have been created yet.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {testimonials.map((testimonial) => (
                            <Card key={testimonial.id}>
                                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <CardTitle>
                                                {testimonial.author_name}
                                            </CardTitle>
                                            <Badge
                                                variant={
                                                    testimonial.is_published
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {testimonial.is_published
                                                    ? 'Published'
                                                    : 'Draft'}
                                            </Badge>
                                        </div>
                                        <CardDescription>
                                            {testimonial.safari?.name ??
                                                testimonial.route_label ??
                                                'Unassigned route'}{' '}
                                            • {testimonial.trip_date_label}
                                        </CardDescription>
                                    </div>

                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            handleDeleteTestimonial(
                                                testimonial,
                                            )
                                        }
                                    >
                                        Delete
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <Form
                                        {...update.form(testimonial.id)}
                                        options={{ preserveScroll: true }}
                                        className="space-y-4"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <TestimonialFields
                                                    testimonial={testimonial}
                                                    safariOptions={
                                                        safariOptions
                                                    }
                                                />

                                                <div className="grid gap-2">
                                                    <InputError
                                                        message={
                                                            errors.author_name
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.trip_date_label
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.quote}
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.author_image_url
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
                                                        {testimonial.updated_at
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
                                                                      testimonial.updated_at,
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

TestimonialManagementPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Testimonials',
            href: testimonialsIndex(),
        },
    ],
};
