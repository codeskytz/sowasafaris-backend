import { Link, usePage } from '@inertiajs/react';
import {
    BadgeDollarSign,
    CalendarCheck2,
    Compass,
    FileText,
    Home,
    Image,
    LayoutGrid,
    MessageSquareText,
    Settings,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { home, dashboard } from '@/routes';
import { index as bookingsIndex } from '@/routes/admin/bookings';
import { edit as contentEdit } from '@/routes/admin/content';
import { index as galleryItemsIndex } from '@/routes/admin/gallery-items';
import { index as pricingTiersIndex } from '@/routes/admin/pricing-tiers';
import { index as safarisIndex } from '@/routes/admin/safaris';
import { index as testimonialsIndex } from '@/routes/admin/testimonials';
import { edit as editProfile } from '@/routes/profile';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Website home',
        href: home(),
        icon: Home,
    },
    {
        title: 'Profile',
        href: editProfile(),
        icon: Settings,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as { auth: { user: { is_admin: boolean } } };

    const isAdmin = auth.user?.is_admin ?? false;

    const mainNavItems: NavItem[] = isAdmin
        ? [
              {
                  title: 'Dashboard',
                  href: dashboard(),
                  icon: LayoutGrid,
              },
              {
                  title: 'Site content',
                  href: contentEdit(),
                  icon: FileText,
              },
              {
                  title: 'Safaris',
                  href: safarisIndex(),
                  icon: Compass,
              },
              {
                  title: 'Pricing tiers',
                  href: pricingTiersIndex(),
                  icon: BadgeDollarSign,
              },
              {
                  title: 'Gallery',
                  href: galleryItemsIndex(),
                  icon: Image,
              },
              {
                  title: 'Testimonials',
                  href: testimonialsIndex(),
                  icon: MessageSquareText,
              },
              {
                  title: 'Bookings',
                  href: bookingsIndex(),
                  icon: CalendarCheck2,
              },
          ]
        : [];

    const logoHref = isAdmin ? dashboard() : home();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={logoHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
