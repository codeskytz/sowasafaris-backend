import { Link, usePage } from '@inertiajs/react';
import {
    BadgeDollarSign,
    CalendarCheck2,
    Compass,
    FileText,
    Image,
    Inbox,
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
import { dashboard } from '@/routes';
import { index as bookingsIndex } from '@/routes/admin/bookings';
import { edit as contentEdit } from '@/routes/admin/content';
import { index as galleryItemsIndex } from '@/routes/admin/gallery-items';
import { index as mailboxIndex } from '@/routes/admin/mailbox';
import { index as pricingTiersIndex } from '@/routes/admin/pricing-tiers';
import { index as safarisIndex } from '@/routes/admin/safaris';
import { index as testimonialsIndex } from '@/routes/admin/testimonials';
import { edit as editProfile } from '@/routes/profile';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
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
              {
                  title: 'Inbox',
                  href: mailboxIndex(),
                  icon: Inbox,
              },
          ]
        : [];

    const logoHref = dashboard();

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-sidebar-border bg-sidebar text-sidebar-foreground"
        >
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
                <div className="mx-3 mb-3 rounded-3xl border border-sidebar-primary/20 bg-sidebar-accent/70 p-4 text-sidebar-foreground shadow-inner shadow-black/10 group-data-[collapsible=icon]:hidden">
                    <p className="text-xs font-bold tracking-[0.32em] text-sidebar-primary uppercase">
                        Expedition Desk
                    </p>
                    <p className="mt-2 text-sm leading-5 text-sidebar-foreground/72">
                        Manage safaris, bookings, inbox messages, pricing,
                        gallery stories, and testimonials.
                    </p>
                </div>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
