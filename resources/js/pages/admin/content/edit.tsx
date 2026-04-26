import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { update as updateContent } from '@/actions/App/Http/Controllers/Admin/SiteContentController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
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
import { index as safarisIndex } from '@/routes/admin/safaris';
import type {
    AdminSiteContent,
    DepartureMonth,
    SiteLink,
    TrustIndicator,
} from '@/types';

type SiteContentPageProps = {
    content: AdminSiteContent;
};

const textAreaClasses =
    'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-28 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

export default function SiteContentPage({ content }: SiteContentPageProps) {
    const { data, setData, put, processing, errors } =
        useForm<AdminSiteContent>(content);

    function errorFor(key: string): string | undefined {
        return (errors as Record<string, string | undefined>)[key];
    }

    function updateNavigationLink(
        index: number,
        field: keyof SiteLink,
        value: string,
    ): void {
        setData(
            'navigation_links',
            data.navigation_links.map((link, currentIndex) =>
                currentIndex === index ? { ...link, [field]: value } : link,
            ),
        );
    }

    function updateFooterLink(
        index: number,
        field: keyof SiteLink,
        value: string,
    ): void {
        setData(
            'footer_links',
            data.footer_links.map((link, currentIndex) =>
                currentIndex === index ? { ...link, [field]: value } : link,
            ),
        );
    }

    function updateTrustIndicator(
        index: number,
        field: keyof TrustIndicator,
        value: string,
    ): void {
        setData(
            'trust_indicators',
            data.trust_indicators.map((indicator, currentIndex) =>
                currentIndex === index
                    ? { ...indicator, [field]: value }
                    : indicator,
            ),
        );
    }

    function updateDepartureMonth(
        index: number,
        field: keyof DepartureMonth,
        value: string,
    ): void {
        setData(
            'departure_months',
            data.departure_months.map((month, currentIndex) =>
                currentIndex === index ? { ...month, [field]: value } : month,
            ),
        );
    }

    function submit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        put(updateContent.url(), {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Site Content" />

            <form
                onSubmit={submit}
                className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4"
            >
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <Heading
                        title="Site Content"
                        description="Edit the seeded homepage copy, hero image, links, trust blocks, and booking months without touching code."
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
                        <Button disabled={processing}>Save content</Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Homepage structure</CardTitle>
                        <CardDescription>
                            Featured route cards are controlled from Safari
                            Management using the featured toggle and sort order.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl border p-4">
                            <p className="text-sm font-medium">Standard card</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                First featured safari by sort order.
                            </p>
                        </div>
                        <div className="rounded-xl border p-4">
                            <p className="text-sm font-medium">Highlight card</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Second featured safari by sort order.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Hero</CardTitle>
                        <CardDescription>
                            Update the opening headline, image, and primary
                            description shown above the safari listings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="hero-headline">Headline</Label>
                            <Input
                                id="hero-headline"
                                value={data.hero_content.headline}
                                onChange={(event) =>
                                    setData('hero_content', {
                                        ...data.hero_content,
                                        headline: event.target.value,
                                    })
                                }
                            />
                            <InputError
                                message={errorFor('hero_content.headline')}
                            />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="hero-description">
                                Description
                            </Label>
                            <textarea
                                id="hero-description"
                                value={data.hero_content.description}
                                onChange={(event) =>
                                    setData('hero_content', {
                                        ...data.hero_content,
                                        description: event.target.value,
                                    })
                                }
                                className={textAreaClasses}
                            />
                            <InputError
                                message={errorFor('hero_content.description')}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="hero-image-url">Image URL</Label>
                            <Input
                                id="hero-image-url"
                                value={data.hero_content.image_url}
                                onChange={(event) =>
                                    setData('hero_content', {
                                        ...data.hero_content,
                                        image_url: event.target.value,
                                    })
                                }
                            />
                            <InputError
                                message={errorFor('hero_content.image_url')}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="hero-image-alt">
                                Image alt text
                            </Label>
                            <Input
                                id="hero-image-alt"
                                value={data.hero_content.image_alt}
                                onChange={(event) =>
                                    setData('hero_content', {
                                        ...data.hero_content,
                                        image_alt: event.target.value,
                                    })
                                }
                            />
                            <InputError
                                message={errorFor('hero_content.image_alt')}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="hero-cta">Primary CTA label</Label>
                            <Input
                                id="hero-cta"
                                value={data.hero_content.primary_cta_label}
                                onChange={(event) =>
                                    setData('hero_content', {
                                        ...data.hero_content,
                                        primary_cta_label: event.target.value,
                                    })
                                }
                            />
                            <InputError
                                message={errorFor(
                                    'hero_content.primary_cta_label',
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Navigation links</CardTitle>
                        <CardDescription>
                            Keep the header navigation synchronized with the
                            sections of the public page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.navigation_links.map((link, index) => (
                            <div
                                key={`navigation-link-${index}`}
                                className="grid gap-4 rounded-xl border p-4 md:grid-cols-[1fr_1.3fr_auto]"
                            >
                                <div className="grid gap-2">
                                    <Label>Label</Label>
                                    <Input
                                        value={link.label}
                                        onChange={(event) =>
                                            updateNavigationLink(
                                                index,
                                                'label',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errorFor(
                                            `navigation_links.${index}.label`,
                                        )}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Href</Label>
                                    <Input
                                        value={link.href}
                                        onChange={(event) =>
                                            updateNavigationLink(
                                                index,
                                                'href',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errorFor(
                                            `navigation_links.${index}.href`,
                                        )}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setData(
                                                'navigation_links',
                                                data.navigation_links.filter(
                                                    (_, currentIndex) =>
                                                        currentIndex !== index,
                                                ),
                                            )
                                        }
                                        disabled={
                                            data.navigation_links.length === 1
                                        }
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                setData('navigation_links', [
                                    ...data.navigation_links,
                                    { label: '', href: '' },
                                ])
                            }
                        >
                            Add navigation link
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Trust indicators</CardTitle>
                        <CardDescription>
                            Manage the credibility blocks shown below the hero.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.trust_indicators.map((indicator, index) => (
                            <div
                                key={`trust-indicator-${index}`}
                                className="grid gap-4 rounded-xl border p-4 md:grid-cols-2"
                            >
                                <div className="grid gap-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={indicator.title}
                                        onChange={(event) =>
                                            updateTrustIndicator(
                                                index,
                                                'title',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errorFor(
                                            `trust_indicators.${index}.title`,
                                        )}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Material icon name</Label>
                                    <Input
                                        value={indicator.icon}
                                        onChange={(event) =>
                                            updateTrustIndicator(
                                                index,
                                                'icon',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errorFor(
                                            `trust_indicators.${index}.icon`,
                                        )}
                                    />
                                </div>

                                <div className="grid gap-2 md:col-span-2">
                                    <Label>Description</Label>
                                    <textarea
                                        value={indicator.description}
                                        onChange={(event) =>
                                            updateTrustIndicator(
                                                index,
                                                'description',
                                                event.target.value,
                                            )
                                        }
                                        className={textAreaClasses}
                                    />
                                    <InputError
                                        message={errorFor(
                                            `trust_indicators.${index}.description`,
                                        )}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setData(
                                                'trust_indicators',
                                                data.trust_indicators.filter(
                                                    (_, currentIndex) =>
                                                        currentIndex !== index,
                                                ),
                                            )
                                        }
                                        disabled={
                                            data.trust_indicators.length === 1
                                        }
                                    >
                                        Remove indicator
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                setData('trust_indicators', [
                                    ...data.trust_indicators,
                                    {
                                        title: '',
                                        description: '',
                                        icon: '',
                                    },
                                ])
                            }
                        >
                            Add trust indicator
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Departure months</CardTitle>
                        <CardDescription>
                            These options feed the booking month selector and
                            validation for the public booking API.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.departure_months.map((month, index) => (
                            <div
                                key={`departure-month-${index}`}
                                className="grid gap-4 rounded-xl border p-4 md:grid-cols-[180px_1fr_auto]"
                            >
                                <div className="grid gap-2">
                                    <Label>Value</Label>
                                    <Input
                                        value={month.value}
                                        onChange={(event) =>
                                            updateDepartureMonth(
                                                index,
                                                'value',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="2026-06"
                                    />
                                    <InputError
                                        message={errorFor(
                                            `departure_months.${index}.value`,
                                        )}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Label</Label>
                                    <Input
                                        value={month.label}
                                        onChange={(event) =>
                                            updateDepartureMonth(
                                                index,
                                                'label',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="June 2026"
                                    />
                                    <InputError
                                        message={errorFor(
                                            `departure_months.${index}.label`,
                                        )}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setData(
                                                'departure_months',
                                                data.departure_months.filter(
                                                    (_, currentIndex) =>
                                                        currentIndex !== index,
                                                ),
                                            )
                                        }
                                        disabled={
                                            data.departure_months.length === 1
                                        }
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                setData('departure_months', [
                                    ...data.departure_months,
                                    { value: '', label: '' },
                                ])
                            }
                        >
                            Add departure month
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Footer</CardTitle>
                        <CardDescription>
                            Edit the footer brand copy and utility links.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="footer-brand">Brand</Label>
                                <Input
                                    id="footer-brand"
                                    value={data.footer_content.brand}
                                    onChange={(event) =>
                                        setData('footer_content', {
                                            ...data.footer_content,
                                            brand: event.target.value,
                                        })
                                    }
                                />
                                <InputError
                                    message={errorFor('footer_content.brand')}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="footer-copyright">
                                    Copyright text
                                </Label>
                                <Input
                                    id="footer-copyright"
                                    value={data.footer_content.copyright_text}
                                    onChange={(event) =>
                                        setData('footer_content', {
                                            ...data.footer_content,
                                            copyright_text:
                                                event.target.value,
                                        })
                                    }
                                />
                                <InputError
                                    message={errorFor(
                                        'footer_content.copyright_text',
                                    )}
                                />
                            </div>
                        </div>

                        {data.footer_links.map((link, index) => (
                            <div
                                key={`footer-link-${index}`}
                                className="grid gap-4 rounded-xl border p-4 md:grid-cols-[1fr_1.3fr_auto]"
                            >
                                <div className="grid gap-2">
                                    <Label>Label</Label>
                                    <Input
                                        value={link.label}
                                        onChange={(event) =>
                                            updateFooterLink(
                                                index,
                                                'label',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errorFor(
                                            `footer_links.${index}.label`,
                                        )}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Href</Label>
                                    <Input
                                        value={link.href}
                                        onChange={(event) =>
                                            updateFooterLink(
                                                index,
                                                'href',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errorFor(
                                            `footer_links.${index}.href`,
                                        )}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setData(
                                                'footer_links',
                                                data.footer_links.filter(
                                                    (_, currentIndex) =>
                                                        currentIndex !== index,
                                                ),
                                            )
                                        }
                                        disabled={data.footer_links.length === 1}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                setData('footer_links', [
                                    ...data.footer_links,
                                    { label: '', href: '' },
                                ])
                            }
                        >
                            Add footer link
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </>
    );
}

SiteContentPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Site Content',
            href: contentEdit(),
        },
    ],
};
