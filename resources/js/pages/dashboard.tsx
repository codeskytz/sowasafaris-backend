import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';
import { index as bookingsIndex } from '@/routes/admin/bookings';
import { edit as contentEdit } from '@/routes/admin/content';
import { index as galleryItemsIndex } from '@/routes/admin/gallery-items';
import { index as pricingTiersIndex } from '@/routes/admin/pricing-tiers';
import { index as safarisIndex } from '@/routes/admin/safaris';
import { index as testimonialsIndex } from '@/routes/admin/testimonials';
import type {
    DashboardBooking,
    DashboardSafari,
    DashboardStats,
} from '@/types';

type DashboardProps = {
    stats: DashboardStats;
    featuredSafaris: DashboardSafari[];
    recentBookings: DashboardBooking[];
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
});

const statusVariants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    pending: 'secondary',
    contacted: 'outline',
    confirmed: 'default',
    cancelled: 'destructive',
    open: 'default',
    few_spots: 'secondary',
    waitlist: 'outline',
    closed: 'destructive',
};

function formatCurrency(value: number): string {
    return currencyFormatter.format(value);
}

function formatDate(value: string | null): string {
    if (value === null) {
        return 'Just now';
    }

    return dateFormatter.format(new Date(value));
}

function toLabel(value: string): string {
    return value
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export default function Dashboard({
    stats,
    featuredSafaris,
    recentBookings,
}: DashboardProps) {
    return (
        <>
            <Head title="Sowa Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="relative overflow-hidden rounded-[2rem] border border-[#d8c8a8] bg-[#0b2b24] p-6 text-[#fff7df] shadow-xl shadow-[#0b2b24]/10 md:p-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,186,32,0.28),transparent_22rem)]" />
                    <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-xs font-black tracking-[0.4em] text-[#ffba20] uppercase">
                                Sowa Safaris Admin
                            </p>
                            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                                Expedition operations, all from base camp.
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#fff7df]/72 md:text-base">
                                Track active safari inventory, booking demand,
                                gallery stories, testimonials, and pricing
                                momentum from one grounded command center.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button
                                asChild
                                className="rounded-full bg-[#ffba20] font-bold text-[#11251f] hover:bg-[#ffd166]"
                            >
                                <Link href={safarisIndex()} prefetch>
                                    Manage safaris
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                asChild
                                className="rounded-full border-[#ffba20]/40 bg-white/10 text-[#fff7df] hover:bg-white/20 hover:text-[#fff7df]"
                            >
                                <Link href={bookingsIndex()} prefetch>
                                    Review bookings
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                asChild
                                className="rounded-full text-[#fff7df] hover:bg-white/10 hover:text-[#fff7df]"
                            >
                                <Link href={contentEdit()} prefetch>
                                    Edit site content
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
                    <Card className="border-[#d8c8a8] bg-[#fffaf0]/90">
                        <CardHeader className="gap-1">
                            <CardDescription>Total safaris</CardDescription>
                            <CardTitle className="text-3xl">
                                {stats.totalSafaris}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="border-[#d8c8a8] bg-[#fffaf0]/90">
                        <CardHeader className="gap-1">
                            <CardDescription>Published</CardDescription>
                            <CardTitle className="text-3xl">
                                {stats.publishedSafaris}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="border-[#d8c8a8] bg-[#fffaf0]/90">
                        <CardHeader className="gap-1">
                            <CardDescription>Pending bookings</CardDescription>
                            <CardTitle className="text-3xl">
                                {stats.pendingBookings}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="border-[#d8c8a8] bg-[#fffaf0]/90">
                        <CardHeader className="gap-1">
                            <CardDescription>Total requests</CardDescription>
                            <CardTitle className="text-3xl">
                                {stats.totalBookings}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="border-[#d8c8a8] bg-[#fffaf0]/90">
                        <CardHeader className="gap-1">
                            <CardDescription>Pricing tiers</CardDescription>
                            <CardTitle className="text-3xl">
                                {stats.pricingTiers}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="border-[#d8c8a8] bg-[#fffaf0]/90">
                        <CardHeader className="gap-1">
                            <CardDescription>Gallery items</CardDescription>
                            <CardTitle className="text-3xl">
                                {stats.galleryItems}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="border-[#d8c8a8] bg-[#fffaf0]/90">
                        <CardHeader className="gap-1">
                            <CardDescription>Testimonials</CardDescription>
                            <CardTitle className="text-3xl">
                                {stats.testimonials}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="border-[#d8c8a8] bg-[#fffaf0]/90 md:col-span-2 xl:col-span-7">
                        <CardHeader className="gap-1">
                            <CardDescription>Pipeline value</CardDescription>
                            <CardTitle className="text-3xl">
                                {formatCurrency(stats.pipelineValue)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Content modules</CardTitle>
                        <CardDescription>
                            Everything seeded from the public SowaSafaris UI is
                            now organized into editable admin modules.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Button variant="outline" className="justify-start" asChild>
                            <Link href={contentEdit()} prefetch>
                                Site content
                            </Link>
                        </Button>
                        <Button variant="outline" className="justify-start" asChild>
                            <Link href={pricingTiersIndex()} prefetch>
                                Pricing tiers
                            </Link>
                        </Button>
                        <Button variant="outline" className="justify-start" asChild>
                            <Link href={galleryItemsIndex()} prefetch>
                                Gallery library
                            </Link>
                        </Button>
                        <Button variant="outline" className="justify-start" asChild>
                            <Link href={testimonialsIndex()} prefetch>
                                Testimonials
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <Card>
                        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-1">
                                <CardTitle>Featured safari lineup</CardTitle>
                                <CardDescription>
                                    The trips currently shaping the front page
                                    and most likely to convert.
                                </CardDescription>
                            </div>

                            <Button variant="ghost" asChild>
                                <Link href={safarisIndex()} prefetch>
                                    View all safaris
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            {featuredSafaris.map((safari) => (
                                <div
                                    key={safari.id}
                                    className="rounded-xl border p-4"
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-base font-semibold">
                                            {safari.name}
                                        </h3>
                                        {safari.isFeatured && (
                                            <Badge variant="secondary">
                                                Featured
                                            </Badge>
                                        )}
                                        <Badge
                                            variant={
                                                statusVariants[
                                                    safari.availability
                                                ] ?? 'outline'
                                            }
                                        >
                                            {toLabel(safari.availability)}
                                        </Badge>
                                    </div>

                                    <p className="mt-3 text-sm text-muted-foreground">
                                        {safari.summary}
                                    </p>

                                    <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                                        <div className="flex items-center justify-between gap-3">
                                            <span>Difficulty</span>
                                            <span className="font-medium text-foreground">
                                                {safari.difficulty}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span>Duration</span>
                                            <span className="font-medium text-foreground">
                                                {safari.duration_days} days
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span>Price</span>
                                            <span className="font-medium text-foreground">
                                                {formatCurrency(
                                                    safari.base_price,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span>Bookings</span>
                                            <span className="font-medium text-foreground">
                                                {safari.bookingsCount}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span>Spots left</span>
                                            <span className="font-medium text-foreground">
                                                {safari.spots_left ?? 'TBD'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-1">
                                <CardTitle>Latest booking activity</CardTitle>
                                <CardDescription>
                                    New safari requests waiting for follow-up.
                                </CardDescription>
                            </div>

                            <Button variant="ghost" asChild>
                                <Link href={bookingsIndex()} prefetch>
                                    Open queue
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="rounded-xl border p-4"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="font-semibold">
                                                {booking.customerName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {booking.safari?.name ??
                                                    'Safari unavailable'}
                                            </p>
                                        </div>

                                        <Badge
                                            variant={
                                                statusVariants[
                                                    booking.status
                                                ] ?? 'outline'
                                            }
                                        >
                                            {toLabel(booking.status)}
                                        </Badge>
                                    </div>

                                    <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                                        <div className="flex items-center justify-between gap-3">
                                            <span>Reference</span>
                                            <span className="font-medium text-foreground">
                                                {booking.reference}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span>Travelers</span>
                                            <span className="font-medium text-foreground">
                                                {booking.travelers}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span>Tier</span>
                                            <span className="font-medium text-foreground">
                                                {toLabel(booking.serviceTier)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span>Est. total</span>
                                            <span className="font-medium text-foreground">
                                                {formatCurrency(
                                                    booking.estimatedTotal,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span>Requested</span>
                                            <span className="font-medium text-foreground">
                                                {formatDate(booking.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
