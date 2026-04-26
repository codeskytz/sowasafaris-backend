import { Form, Head, Link, router } from '@inertiajs/react';
import {
    destroy as destroyGalleryItem,
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/GalleryItemController';
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
import { edit as contentEdit } from '@/routes/admin/content';
import { index as galleryItemsIndex } from '@/routes/admin/gallery-items';
import type { AdminGalleryItem, Option } from '@/types';

type GalleryManagementPageProps = {
    galleryItems: AdminGalleryItem[];
    categoryOptions: Option[];
    layoutSizeOptions: Option[];
};

const textAreaClasses =
    'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-28 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

function handleDeleteGalleryItem(galleryItem: AdminGalleryItem): void {
    if (!window.confirm(`Delete "${galleryItem.title}" from the gallery?`)) {
        return;
    }

    router.delete(destroyGalleryItem(galleryItem.id), {
        preserveScroll: true,
    });
}

function GalleryItemFields({
    galleryItem,
    categoryOptions,
    layoutSizeOptions,
}: {
    galleryItem?: AdminGalleryItem;
    categoryOptions: Option[];
    layoutSizeOptions: Option[];
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="grid gap-2 xl:col-span-2">
                <Label htmlFor={galleryItem ? `title-${galleryItem.id}` : 'title'}>
                    Title
                </Label>
                <Input
                    id={galleryItem ? `title-${galleryItem.id}` : 'title'}
                    name="title"
                    defaultValue={galleryItem?.title ?? ''}
                    placeholder="Sunrise on Uhuru Peak"
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={galleryItem ? `slug-${galleryItem.id}` : 'slug'}>
                    Slug
                </Label>
                <Input
                    id={galleryItem ? `slug-${galleryItem.id}` : 'slug'}
                    name="slug"
                    defaultValue={galleryItem?.slug ?? ''}
                    placeholder="sunrise-on-uhuru-peak"
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label
                    htmlFor={galleryItem ? `sort-order-${galleryItem.id}` : 'sort-order'}
                >
                    Sort order
                </Label>
                <Input
                    id={
                        galleryItem ? `sort-order-${galleryItem.id}` : 'sort-order'
                    }
                    name="sort_order"
                    type="number"
                    min={0}
                    defaultValue={galleryItem?.sort_order ?? 0}
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label
                    htmlFor={galleryItem ? `category-${galleryItem.id}` : 'category'}
                >
                    Category
                </Label>
                <select
                    id={galleryItem ? `category-${galleryItem.id}` : 'category'}
                    name="category"
                    defaultValue={
                        galleryItem?.category ?? categoryOptions[0]?.value
                    }
                    className={cn(textAreaClasses, 'min-h-9 py-2')}
                >
                    {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <Label
                    htmlFor={
                        galleryItem
                            ? `layout-size-${galleryItem.id}`
                            : 'layout-size'
                    }
                >
                    Layout size
                </Label>
                <select
                    id={
                        galleryItem
                            ? `layout-size-${galleryItem.id}`
                            : 'layout-size'
                    }
                    name="layout_size"
                    defaultValue={
                        galleryItem?.layout_size ??
                        layoutSizeOptions[0]?.value
                    }
                    className={cn(textAreaClasses, 'min-h-9 py-2')}
                >
                    {layoutSizeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2 xl:col-span-2">
                <Label
                    htmlFor={
                        galleryItem ? `image-url-${galleryItem.id}` : 'image-url'
                    }
                >
                    Image URL
                </Label>
                <Input
                    id={
                        galleryItem ? `image-url-${galleryItem.id}` : 'image-url'
                    }
                    name="image_url"
                    type="url"
                    defaultValue={galleryItem?.image_url ?? ''}
                    placeholder="https://..."
                    required
                />
            </div>

            <div className="grid gap-2 xl:col-span-4">
                <Label
                    htmlFor={
                        galleryItem ? `image-alt-${galleryItem.id}` : 'image-alt'
                    }
                >
                    Image alt text
                </Label>
                <Input
                    id={
                        galleryItem ? `image-alt-${galleryItem.id}` : 'image-alt'
                    }
                    name="image_alt"
                    defaultValue={galleryItem?.image_alt ?? ''}
                    placeholder="Summit team at sunrise on Uhuru Peak"
                    required
                />
            </div>

            <div className="flex flex-wrap gap-6 xl:col-span-4">
                <label className="flex items-center gap-3 text-sm font-medium">
                    <input
                        type="checkbox"
                        name="is_published"
                        value="1"
                        defaultChecked={galleryItem?.is_published ?? true}
                        className="size-4 rounded border-input"
                    />
                    Published on frontend
                </label>
            </div>
        </div>
    );
}

export default function GalleryManagementPage({
    galleryItems,
    categoryOptions,
    layoutSizeOptions,
}: GalleryManagementPageProps) {
    return (
        <>
            <Head title="Gallery Items" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <Heading
                        title="Gallery Management"
                        description="Keep the expedition gallery fresh with admin-managed imagery, categories, and layout sizing."
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
                        <CardTitle>Add a gallery item</CardTitle>
                        <CardDescription>
                            Upload a new visual story block for the landing
                            page gallery.
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
                                    <GalleryItemFields
                                        categoryOptions={categoryOptions}
                                        layoutSizeOptions={layoutSizeOptions}
                                    />

                                    <div className="grid gap-2">
                                        <InputError message={errors.title} />
                                        <InputError message={errors.slug} />
                                        <InputError
                                            message={errors.category}
                                        />
                                        <InputError
                                            message={errors.layout_size}
                                        />
                                        <InputError
                                            message={errors.image_url}
                                        />
                                    </div>

                                    <Button disabled={processing}>
                                        Create gallery item
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                {galleryItems.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground">
                                No gallery items have been created yet.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {galleryItems.map((galleryItem) => (
                            <Card key={galleryItem.id}>
                                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <CardTitle>
                                                {galleryItem.title}
                                            </CardTitle>
                                            <Badge variant="secondary">
                                                {galleryItem.category}
                                            </Badge>
                                            <Badge
                                                variant={
                                                    galleryItem.is_published
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {galleryItem.is_published
                                                    ? 'Published'
                                                    : 'Draft'}
                                            </Badge>
                                        </div>
                                        <CardDescription>
                                            Layout size:{' '}
                                            {galleryItem.layout_size}.
                                        </CardDescription>
                                    </div>

                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            handleDeleteGalleryItem(
                                                galleryItem,
                                            )
                                        }
                                    >
                                        Delete
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <img
                                        src={galleryItem.image_url}
                                        alt={galleryItem.image_alt}
                                        className="h-52 w-full rounded-xl object-cover"
                                    />

                                    <Form
                                        {...update.form(galleryItem.id)}
                                        options={{ preserveScroll: true }}
                                        className="space-y-4"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <GalleryItemFields
                                                    galleryItem={galleryItem}
                                                    categoryOptions={
                                                        categoryOptions
                                                    }
                                                    layoutSizeOptions={
                                                        layoutSizeOptions
                                                    }
                                                />

                                                <div className="grid gap-2">
                                                    <InputError
                                                        message={errors.title}
                                                    />
                                                    <InputError
                                                        message={errors.slug}
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.category
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.layout_size
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.image_url
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
                                                        {galleryItem.updated_at
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
                                                                      galleryItem.updated_at,
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

GalleryManagementPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Gallery',
            href: galleryItemsIndex(),
        },
    ],
};
