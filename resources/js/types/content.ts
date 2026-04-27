export type HeroContent = {
    headline: string;
    description: string;
    image_alt: string;
    image_url: string;
    primary_cta_label: string;
};

export type SiteLink = {
    label: string;
    href: string;
};

export type TrustIndicator = {
    title: string;
    description: string;
    icon: string;
};

export type DepartureMonth = {
    value: string;
    label: string;
};

export type FooterContent = {
    brand: string;
    copyright_text: string;
};

export type ContactContent = {
    headline: string;
    description: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    office_hours: string;
    response_time: string;
};

export type AdminSiteContent = {
    hero_content: HeroContent;
    navigation_links: SiteLink[];
    trust_indicators: TrustIndicator[];
    departure_months: DepartureMonth[];
    contact_content: ContactContent;
    footer_links: SiteLink[];
    footer_content: FooterContent;
};

export type AdminPricingTier = {
    id: number;
    name: string;
    slug: string;
    description: string;
    inclusions: string[];
    price_adjustment: number;
    is_recommended: boolean;
    is_published: boolean;
    sort_order: number;
    bookings_count: number;
    updated_at: string | null;
};

export type AdminGalleryItem = {
    id: number;
    title: string;
    slug: string;
    category: string;
    image_url: string;
    image_alt: string;
    layout_size: string;
    is_published: boolean;
    sort_order: number;
    updated_at: string | null;
};

export type AdminTestimonial = {
    id: number;
    safari_id: number | null;
    author_name: string;
    author_image_url: string;
    author_image_alt: string;
    route_label: string | null;
    trip_date_label: string;
    quote: string;
    is_published: boolean;
    sort_order: number;
    safari: {
        id: number;
        name: string;
    } | null;
    updated_at: string | null;
};

export type AdminContactMessage = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    status: string;
    admin_notes: string | null;
    reviewed_at: string | null;
    created_at: string | null;
    reviewed_by: {
        id: number;
        name: string;
    } | null;
};
