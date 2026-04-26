<?php

namespace Tests\Feature\Feature;

use App\Models\GalleryItem;
use App\Models\PricingTier;
use App\Models\Safari;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use App\Models\User;
use Database\Seeders\SowaSafariMockDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SiteContentManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_mock_data_seeder_populates_frontend_content_models(): void
    {
        $this->seed(SowaSafariMockDataSeeder::class);

        $this->assertSame(4, Safari::query()->count());
        $this->assertSame(3, PricingTier::query()->count());
        $this->assertSame(6, GalleryItem::query()->count());
        $this->assertSame(3, Testimonial::query()->count());
        $this->assertSame(6, SiteSetting::query()->count());
    }

    public function test_admin_users_can_view_and_update_site_content(): void
    {
        $this->seed(SowaSafariMockDataSeeder::class);

        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get(route('admin.content.edit'))
            ->assertOk()
            ->assertInertia(
                fn (Assert $page): Assert => $page
                    ->component('admin/content/edit')
                    ->where(
                        'content.hero_content.headline',
                        'Conquer the Peak of Africa.',
                    )
                    ->has('content.navigation_links', 5)
                    ->has('content.departure_months', 5),
            );

        $this->actingAs($admin)
            ->put(route('admin.content.update'), [
                'hero_content' => [
                    'headline' => 'Scale Kilimanjaro with Sowa.',
                    'description' => 'Curated expeditions with local guides and altitude-first pacing.',
                    'image_alt' => 'Climbers approaching the summit at dawn',
                    'image_url' => 'https://example.com/hero.jpg',
                    'primary_cta_label' => 'Start Planning',
                ],
                'navigation_links' => [
                    ['label' => 'Safaris', 'href' => '#availability'],
                    ['label' => 'Pricing', 'href' => '#pricing'],
                ],
                'trust_indicators' => [
                    [
                        'title' => 'Local Experts',
                        'description' => 'Mountain-first guide leadership on every climb.',
                        'icon' => 'explore',
                    ],
                ],
                'departure_months' => [
                    ['value' => '2026-10', 'label' => 'October 2026'],
                ],
                'footer_links' => [
                    ['label' => 'Reserve Climb', 'href' => '#booking'],
                ],
                'footer_content' => [
                    'brand' => 'SowaSafaris',
                    'copyright_text' => '© 2026 SowaSafaris Expedition Group.',
                ],
            ])
            ->assertRedirect(route('admin.content.edit'));

        $this->assertSame(
            'Scale Kilimanjaro with Sowa.',
            SiteSetting::homepageContent()[SiteSetting::HERO_CONTENT]['headline'],
        );
        $this->assertSame(
            '2026-10',
            SiteSetting::homepageContent()[SiteSetting::DEPARTURE_MONTHS][0]['value'],
        );
    }

    public function test_admin_users_can_manage_pricing_gallery_and_testimonial_modules(): void
    {
        $this->seed(SowaSafariMockDataSeeder::class);

        $admin = User::factory()->admin()->create();
        $safari = Safari::query()->where('slug', 'machame')->firstOrFail();

        $this->actingAs($admin)
            ->post(route('admin.pricing-tiers.store'), [
                'name' => 'Photographer Camp',
                'slug' => 'photographer-camp',
                'description' => 'Extra recovery support and sunrise-ready pacing.',
                'inclusions' => [
                    'Sunrise summit prep',
                    'Camera-safe packing support',
                ],
                'price_adjustment' => 650,
                'is_recommended' => false,
                'is_published' => true,
                'sort_order' => 8,
            ])
            ->assertRedirect(route('admin.pricing-tiers.index'));

        $pricingTier = PricingTier::query()
            ->where('slug', 'photographer-camp')
            ->firstOrFail();

        $this->actingAs($admin)
            ->post(route('admin.gallery-items.store'), [
                'title' => 'Summit ice wall',
                'slug' => 'summit-ice-wall',
                'category' => 'summit',
                'image_url' => 'https://example.com/gallery.jpg',
                'image_alt' => 'Ice wall near Kilimanjaro summit camp',
                'layout_size' => 'wide',
                'is_published' => true,
                'sort_order' => 8,
            ])
            ->assertRedirect(route('admin.gallery-items.index'));

        $galleryItem = GalleryItem::query()
            ->where('slug', 'summit-ice-wall')
            ->firstOrFail();

        $this->actingAs($admin)
            ->post(route('admin.testimonials.store'), [
                'safari_id' => $safari->id,
                'author_name' => 'Rita S.',
                'author_image_url' => 'https://example.com/rita.jpg',
                'author_image_alt' => 'Portrait of Rita in expedition gear',
                'route_label' => 'Machame Route',
                'trip_date_label' => 'Feb 2026',
                'quote' => 'Every checkpoint felt expertly managed and deeply personal.',
                'is_published' => true,
                'sort_order' => 9,
            ])
            ->assertRedirect(route('admin.testimonials.index'));

        $testimonial = Testimonial::query()
            ->where('author_name', 'Rita S.')
            ->firstOrFail();

        $this->assertSame(650, $pricingTier->price_adjustment);
        $this->assertSame('summit', $galleryItem->category);
        $this->assertSame($safari->id, $testimonial->safari_id);
    }
}
