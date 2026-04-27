<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\GalleryItem;
use App\Models\PricingTier;
use App\Models\Safari;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class SowaSafariMockDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedSafaris();
        $this->seedPricingTiers();
        $this->seedGalleryItems();
        $this->seedSiteSettings();
        $this->seedTestimonials();
        $this->syncLegacyBookings();
    }

    private function seedSafaris(): void
    {
        collect([
            [
                'name' => 'Machame Route',
                'slug' => 'machame',
                'summary' => 'A dramatic ridge-to-summit line with strong acclimatization and a rewarding final ascent.',
                'description' => 'Machame is our classic ridge approach for trekkers who want dramatic scenery, strong acclimatization, and a summit push that still feels like a real expedition from day one through summit night.',
                'difficulty' => 'Challenging',
                'difficulty_group' => 'challenge',
                'duration_days' => 7,
                'elevation_meters' => 5895,
                'base_price' => 2480,
                'availability' => 'few_spots',
                'next_departure_at' => '2026-06-14',
                'spots_left' => 7,
                'best_for' => 'Trekkers who want the classic ridge approach and dramatic scenery.',
                'image_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAR3-bfsMGAVZj-nt44Owmy8UhmvMGCOtC-zwSM0QMTT4ee7xPSiw9aYsOUVzZEJdzcTnZty5SHqvebgWoOnVbJrAcks1aLEtKylpMyWTePiR_ICAMvydbmSaoHZqwvKeWIhKGx0-Ap-WIBoSPANaS2ybOW6vSjGucTGlG3RqNxpQc6c4WztxIevh8gaLPSy1wIJq7qc3IEttNWnS-2rUiT5HdquzQXx1ogDtOq5t3l7HyDVpNVTnJi2LI_qWs2Bkgpd83RuF5dOmz',
                'image_alt' => 'Machame Route scenery',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Lemosho Route',
                'slug' => 'lemosho',
                'summary' => 'The most cinematic and remote Kilimanjaro line, delivering wide-open plateaus and steady altitude gain.',
                'description' => 'Lemosho is the scenic flagship itinerary for guests who want broad plateaus, steady acclimatization, and the most cinematic approach to the summit with premium guiding support throughout.',
                'difficulty' => 'Moderate to Challenging',
                'difficulty_group' => 'scenic',
                'duration_days' => 8,
                'elevation_meters' => 5895,
                'base_price' => 2890,
                'availability' => 'open',
                'next_departure_at' => '2026-06-20',
                'spots_left' => 5,
                'best_for' => 'Guests who want the most scenic approach and a premium acclimatization curve.',
                'image_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJjYoD5uE8Yvp20njhEa45Z4TTViBrOxpK0ysq7NKoEjeyKSJFHSskHaTd7jf8cNhYSj5VmWh_u05glxU9vLi52AMKATSIc5gBqTeKFSgxmyvkszwekES28NNvmO3bALKzXM9thWAduN-7TSirA_QwntI-6yA4Q7JmBVGcsjJFdmv-d4w_1ozzhAPfkqmT6d3oRZ92GFDE4wmzu59Egyj6p5vBfsg8_Ku80DZbR8m_tS2wfHZLB0Kapt2lKFkYcWl78LPnvewaLsUa',
                'image_alt' => 'Lemosho Route scenery',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Rongai Route',
                'slug' => 'rongai',
                'summary' => 'A drier northern traverse that blends strong summit odds with a quieter trail experience.',
                'description' => 'Rongai offers a quieter northern approach for travelers seeking stable pacing, fewer crowds, and a route profile that balances accessibility with a genuine high-altitude challenge.',
                'difficulty' => 'Moderate',
                'difficulty_group' => 'balanced',
                'duration_days' => 7,
                'elevation_meters' => 5895,
                'base_price' => 2590,
                'availability' => 'open',
                'next_departure_at' => '2026-07-03',
                'spots_left' => 9,
                'best_for' => 'Travelers seeking a quieter northern approach with stable pacing and fewer crowds.',
                'image_url' => 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
                'image_alt' => 'Rongai Route trail with hikers on the northern slope of Kilimanjaro',
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Northern Circuit',
                'slug' => 'northern-circuit',
                'summary' => 'The longest loop around Kilimanjaro, offering the calmest pacing and the highest overall comfort.',
                'description' => 'Northern Circuit is built for experienced hikers who want maximum acclimatization, the mountain’s grandest itinerary, and the calmest pacing available on Kilimanjaro.',
                'difficulty' => 'Moderate',
                'difficulty_group' => 'scenic',
                'duration_days' => 9,
                'elevation_meters' => 5895,
                'base_price' => 3290,
                'availability' => 'few_spots',
                'next_departure_at' => '2026-07-12',
                'spots_left' => 4,
                'best_for' => 'Experienced hikers wanting maximum acclimatization and the mountain’s grandest itinerary.',
                'image_url' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
                'image_alt' => 'Northern Circuit panorama around Mount Kilimanjaro',
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 4,
            ],
        ])->each(function (array $attributes): void {
            Safari::query()->updateOrCreate(
                ['slug' => $attributes['slug']],
                $attributes,
            );
        });
    }

    private function seedPricingTiers(): void
    {
        collect([
            [
                'name' => 'Summit Essential',
                'slug' => 'essential',
                'description' => 'Shared crew logistics with every summit-critical inclusion covered from gate to gate.',
                'inclusions' => [
                    'Park fees and rescue coverage',
                    'Shared mountain crew and dining tent',
                    'Daily medical checks and oxygen',
                ],
                'price_adjustment' => 0,
                'is_recommended' => false,
                'is_published' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Comfort Camp',
                'slug' => 'comfort',
                'description' => 'Our most requested setup with upgraded camp comfort, warmer sleep systems, and recovery touches.',
                'inclusions' => [
                    'Larger sleeping tents and thicker sleeping pads',
                    'Private toilet tent and hot wash water',
                    'Premium snacks, espresso, and recovery drinks',
                ],
                'price_adjustment' => 420,
                'is_recommended' => true,
                'is_published' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Private Expedition',
                'slug' => 'private',
                'description' => 'Private departures, flexible pacing, and dedicated guide ratios for families, photographers, or teams.',
                'inclusions' => [
                    'Private guide team and custom departure window',
                    'Dedicated airport and hotel transfers',
                    'Concierge planning call and gear review',
                ],
                'price_adjustment' => 980,
                'is_recommended' => false,
                'is_published' => true,
                'sort_order' => 3,
            ],
        ])->each(function (array $attributes): void {
            PricingTier::query()->updateOrCreate(
                ['slug' => $attributes['slug']],
                $attributes,
            );
        });
    }

    private function seedGalleryItems(): void
    {
        collect([
            [
                'title' => 'Sunrise on Uhuru Peak',
                'slug' => 'summit-sunrise',
                'category' => 'summit',
                'image_url' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
                'image_alt' => 'Summit team at sunrise on Uhuru Peak',
                'layout_size' => 'wide',
                'is_published' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Moorland camp in the mist',
                'slug' => 'camp-mist',
                'category' => 'camp',
                'image_url' => 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
                'image_alt' => 'Mountain camp in mist on Kilimanjaro',
                'layout_size' => 'tall',
                'is_published' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Ridgeline movement above the clouds',
                'slug' => 'trail-ridge',
                'category' => 'trail',
                'image_url' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
                'image_alt' => 'Trekkers walking a ridge trail on Kilimanjaro',
                'layout_size' => 'regular',
                'is_published' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'Pre-climb briefing with our mountain crew',
                'slug' => 'crew-briefing',
                'category' => 'culture',
                'image_url' => 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80',
                'image_alt' => 'Local guiding crew briefing trekkers before an expedition',
                'layout_size' => 'regular',
                'is_published' => true,
                'sort_order' => 4,
            ],
            [
                'title' => 'Rainforest approach on day one',
                'slug' => 'forest-traverse',
                'category' => 'trail',
                'image_url' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
                'image_alt' => 'Hiking through dense rainforest on Kilimanjaro',
                'layout_size' => 'wide',
                'is_published' => true,
                'sort_order' => 5,
            ],
            [
                'title' => 'Glacier light at high camp',
                'slug' => 'glacier-light',
                'category' => 'summit',
                'image_url' => 'https://images.unsplash.com/photo-1464823063530-08f10ed1a2dd?auto=format&fit=crop&w=900&q=80',
                'image_alt' => 'Glacier edge glowing in morning light on Kilimanjaro',
                'layout_size' => 'regular',
                'is_published' => true,
                'sort_order' => 6,
            ],
        ])->each(function (array $attributes): void {
            GalleryItem::query()->updateOrCreate(
                ['slug' => $attributes['slug']],
                $attributes,
            );
        });
    }

    private function seedSiteSettings(): void
    {
        SiteSetting::syncHomepageContent([
            SiteSetting::HERO_CONTENT => [
                'headline' => 'Conquer the Peak of Africa.',
                'description' => 'Embark on an unforgettable expedition to the summit of Mount Kilimanjaro. Expert guides, premium gear, and a journey that will change you forever.',
                'image_alt' => 'Hikers ascending Mount Kilimanjaro at sunrise',
                'image_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA81Sx4phLjbLn2WBL3o9QO4NFylSZcut9vV3oAqvnTqCMbIMppPvkdrk9zMgO3bjG9fwuHEKfyUGksOi6r-Hz3kotoIWaF6mK0XtA4f6N8NQYGGhDPn8Cc-J3rZ3z_uVYqgujMBBt3mle--KIEqrcAWyzNh79h0V6g2tK8PsAVrq4YqKoEwW6oQtzQxrdHNSNHrVDRQkgGJabe0sjf7E7O2l69Or7-z78x225JOulSReQ7WHPZmxll5oSJeopB_9sA9s9LgIlvkk7',
                'primary_cta_label' => 'Explore Routes',
            ],
            SiteSetting::NAVIGATION_LINKS => [
                ['label' => 'Safaris', 'href' => '#availability'],
                ['label' => 'Pricing', 'href' => '#pricing'],
                ['label' => 'Gallery', 'href' => '#gallery'],
                ['label' => 'Reviews', 'href' => '#reviews'],
                ['label' => 'Booking', 'href' => '#booking'],
                ['label' => 'Contact', 'href' => '/contact'],
            ],
            SiteSetting::TRUST_INDICATORS => [
                [
                    'title' => '98% Summit Success',
                    'description' => 'Industry-leading success rates achieved through superior acclimatization protocols.',
                    'icon' => 'military_tech',
                ],
                [
                    'title' => 'Certified Local Guides',
                    'description' => 'Expert Tanzanian guides with deep knowledge of the mountain’s volatile environment.',
                    'icon' => 'explore',
                ],
                [
                    'title' => 'Safety First Equipment',
                    'description' => 'Premium four-season tents, portable oxygen, and daily medical checks.',
                    'icon' => 'health_and_safety',
                ],
            ],
            SiteSetting::DEPARTURE_MONTHS => [
                ['value' => '2026-06', 'label' => 'June 2026'],
                ['value' => '2026-07', 'label' => 'July 2026'],
                ['value' => '2026-08', 'label' => 'August 2026'],
                ['value' => '2026-09', 'label' => 'September 2026'],
                ['value' => '2026-12', 'label' => 'December 2026'],
            ],
            SiteSetting::FOOTER_LINKS => [
                ['label' => 'Pricing Guide', 'href' => '#pricing'],
                ['label' => 'Summit Gallery', 'href' => '#gallery'],
                ['label' => 'Contact Us', 'href' => '/contact'],
                ['label' => 'Reserve Climb', 'href' => '#booking'],
            ],
            SiteSetting::CONTACT_CONTENT => [
                'headline' => 'Talk to Sowa Safaris',
                'description' => 'Ask about routes, availability, group trips, private departures, or custom safari planning. Our team will help you choose the right journey.',
                'email' => 'support@sowasafaris.com',
                'phone' => '+255 700 000 000',
                'whatsapp' => '+255 700 000 000',
                'address' => 'Moshi, Kilimanjaro, Tanzania',
                'office_hours' => 'Monday to Saturday, 8:00 AM - 6:00 PM',
                'response_time' => 'We usually reply within one business day.',
            ],
            SiteSetting::FOOTER_CONTENT => [
                'brand' => 'SowaSafaris',
                'copyright_text' => '© 2024 SowaSafaris Expedition Group. The Summit Editorial.',
            ],
        ]);
    }

    private function seedTestimonials(): void
    {
        $safariIdsBySlug = Safari::query()->pluck('id', 'slug');

        collect([
            [
                'author_name' => 'James T.',
                'author_image_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkpMceWFlD1dU-3kqAmSxt9cJGDaDCq86urKjS3ulj5Z1xF_1jY3w3af4-3QIpIwLHFJHhL2pw-NEwDXSSIvt8CfyZa3bFiZfJ7KuQ0G2FN9qaXEkoeWC6BzLggPE9z7gEmvWW_sky4tEphZlDaJY_bWccZyecMs8t5h68ZtJPCLPD6cs4tIJOcEYpH-4p22Z6uryNTBnpd2iEB8MM7Av7X1MsVYYER43lCNWkbyo7EsG2ydu4WwMrq6Xx2CjD6tz_JNFcd6Owf86b',
                'author_image_alt' => 'Climber portrait',
                'safari_id' => $safariIdsBySlug['lemosho'] ?? null,
                'route_label' => 'Lemosho Route',
                'trip_date_label' => 'Aug 2023',
                'quote' => 'The level of professionalism and care the Sowa team provided was unmatched. When altitude sickness threatened my summit attempt, their guides knew exactly what to do. Standing on Uhuru Peak was the hardest, most rewarding moment of my life.',
                'is_published' => true,
                'sort_order' => 1,
            ],
            [
                'author_name' => 'Amina R.',
                'author_image_url' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
                'author_image_alt' => 'Portrait of a woman smiling in outdoor gear',
                'safari_id' => $safariIdsBySlug['northern-circuit'] ?? null,
                'route_label' => 'Northern Circuit',
                'trip_date_label' => 'Jan 2024',
                'quote' => 'Every detail felt intentional, from gear prep to summit pacing. I never felt like I was in a tourist convoy. It felt like a real expedition designed around our team.',
                'is_published' => true,
                'sort_order' => 2,
            ],
            [
                'author_name' => 'Daniel M.',
                'author_image_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
                'author_image_alt' => 'Portrait of a male trekker wearing a jacket',
                'safari_id' => $safariIdsBySlug['machame'] ?? null,
                'route_label' => 'Machame Route',
                'trip_date_label' => 'Sept 2023',
                'quote' => 'The booking process was clear, the route recommendations were honest, and the mountain crew made the entire climb feel safe without losing the sense of adventure.',
                'is_published' => true,
                'sort_order' => 3,
            ],
        ])->each(function (array $attributes): void {
            Testimonial::query()->updateOrCreate(
                [
                    'author_name' => $attributes['author_name'],
                    'trip_date_label' => $attributes['trip_date_label'],
                ],
                $attributes,
            );
        });
    }

    private function syncLegacyBookings(): void
    {
        $pricingTierIdsBySlug = PricingTier::query()->pluck('id', 'slug');

        foreach ($pricingTierIdsBySlug as $slug => $pricingTierId) {
            Booking::query()
                ->whereNull('pricing_tier_id')
                ->where('service_tier', $slug)
                ->update(['pricing_tier_id' => $pricingTierId]);
        }
    }
}
