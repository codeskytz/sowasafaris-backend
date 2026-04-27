<?php

namespace Tests\Feature\Feature;

use App\Mail\BookingRequestReceived;
use App\Models\Booking;
use App\Models\ContactMessage;
use App\Models\PricingTier;
use App\Models\Safari;
use Database\Seeders\SowaSafariMockDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PublicApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_api_returns_only_published_safaris(): void
    {
        $publishedSafari = Safari::factory()->create([
            'slug' => 'published-summit-trek',
            'is_published' => true,
        ]);

        Safari::factory()->draft()->create([
            'slug' => 'draft-summit-trek',
        ]);

        $this->getJson(route('api.safaris.index'))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', $publishedSafari->slug)
            ->assertJsonPath('data.0.is_published', true);
    }

    public function test_unpublished_safaris_are_not_publicly_viewable(): void
    {
        $draftSafari = Safari::factory()->draft()->create([
            'slug' => 'hidden-expedition',
        ]);

        $this->getJson(route('api.safaris.show', $draftSafari))
            ->assertNotFound();
    }

    public function test_booking_requests_are_created_with_server_calculated_totals(): void
    {
        Mail::fake();

        $safari = Safari::factory()->create([
            'base_price' => 1400,
            'is_published' => true,
        ]);
        $pricingTier = PricingTier::factory()->create([
            'name' => 'Comfort Camp',
            'slug' => 'comfort',
            'price_adjustment' => 420,
            'is_published' => true,
        ]);

        $this->postJson(route('api.bookings.store'), [
            'safari_id' => $safari->id,
            'pricing_tier_id' => $pricingTier->id,
            'customer_name' => 'Amina Kato',
            'customer_email' => 'amina@example.com',
            'departure_month' => '2026-09',
            'travelers' => 3,
            'notes' => 'We need vegetarian meal support.',
        ])
            ->assertCreated()
            ->assertJsonPath('data.customer_name', 'Amina Kato')
            ->assertJsonPath('data.pricing_tier_id', $pricingTier->id)
            ->assertJsonPath('data.service_tier', 'comfort')
            ->assertJsonPath('data.estimated_total', 5460)
            ->assertJsonPath('data.safari.slug', $safari->slug);

        $booking = Booking::query()->firstOrFail();

        $this->assertModelExists($booking);
        $this->assertSame('Amina Kato', $booking->customer_name);
        $this->assertSame(5460, $booking->estimated_total);
        $this->assertSame('pending', $booking->status);
        $this->assertNotSame('', $booking->reference);

        Mail::assertSent(
            BookingRequestReceived::class,
            fn (BookingRequestReceived $mail): bool => $mail->hasTo('amina@example.com')
                && $mail->booking->is($booking),
        );
    }

    public function test_site_content_endpoint_returns_seeded_frontend_payload(): void
    {
        $this->seed(SowaSafariMockDataSeeder::class);

        $this->getJson(route('api.site-content.index'))
            ->assertOk()
            ->assertJsonPath(
                'heroContent.headline',
                'Conquer the Peak of Africa.',
            )
            ->assertJsonPath('featuredSafariIds.standard', 'machame')
            ->assertJsonPath('featuredSafariIds.featured', 'lemosho')
            ->assertJsonCount(4, 'safaris')
            ->assertJsonCount(3, 'pricingTiers')
            ->assertJsonCount(6, 'galleryItems')
            ->assertJsonCount(3, 'testimonials')
            ->assertJsonPath('departureMonths.0.value', '2026-06')
            ->assertJsonPath('contactContent.email', 'support@sowasafaris.com')
            ->assertJsonPath('footerContent.brand', 'SowaSafaris');
    }

    public function test_contact_messages_can_be_submitted_publicly(): void
    {
        $this->postJson(route('api.contact-messages.store'), [
            'name' => 'Nia Traveler',
            'email' => 'nia@example.com',
            'phone' => '+255 712 000 000',
            'subject' => 'Private family safari',
            'message' => 'We would like help planning a private family safari for August.',
        ])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Nia Traveler')
            ->assertJsonPath('data.status', 'new');

        $message = ContactMessage::query()->firstOrFail();

        $this->assertSame('Nia Traveler', $message->name);
        $this->assertSame('Private family safari', $message->subject);
        $this->assertSame('new', $message->status);
    }
}
