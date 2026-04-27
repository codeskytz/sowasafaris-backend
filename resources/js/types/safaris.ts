export type Option = {
    value: string;
    label: string;
};

export type DashboardStats = {
    totalSafaris: number;
    publishedSafaris: number;
    pendingBookings: number;
    totalBookings: number;
    contactMessages: number;
    pricingTiers: number;
    galleryItems: number;
    testimonials: number;
    pipelineValue: number;
};

export type DashboardSafari = {
    id: number;
    name: string;
    slug: string;
    summary: string;
    difficulty: string;
    duration_days: number;
    base_price: number;
    availability: string;
    spots_left: number | null;
    isFeatured: boolean;
    isPublished: boolean;
    bookingsCount: number;
};

export type DashboardBooking = {
    id: number;
    reference: string;
    customerName: string;
    travelers: number;
    serviceTier: string;
    estimatedTotal: number;
    status: string;
    createdAt: string | null;
    safari: {
        id: number;
        name: string;
        slug: string;
    } | null;
};

export type AdminSafari = {
    id: number;
    name: string;
    slug: string;
    summary: string;
    description: string;
    difficulty: string;
    difficulty_group: string;
    duration_days: number;
    elevation_meters: number;
    base_price: number;
    availability: string;
    next_departure_at: string | null;
    spots_left: number | null;
    best_for: string | null;
    image_url: string | null;
    image_alt: string | null;
    is_featured: boolean;
    is_published: boolean;
    sort_order: number;
    bookings_count: number;
    created_at: string | null;
    updated_at: string | null;
};

export type AdminSafariFilters = {
    search: string;
    availability: string;
    publication: string;
};

export type AdminBooking = {
    id: number;
    reference: string;
    customer_name: string;
    customer_email: string;
    departure_month: string;
    travelers: number;
    service_tier: string;
    estimated_total: number;
    status: string;
    notes: string | null;
    admin_notes: string | null;
    reviewed_at: string | null;
    created_at: string | null;
    safari: {
        id: number;
        name: string;
        slug: string;
    } | null;
    reviewed_by: {
        id: number;
        name: string;
    } | null;
};

export type AdminBookingFilters = {
    search: string;
    status: string;
};

export type LengthAwarePaginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};
