<?php

namespace Tests\Feature;

use App\Mail\BookingRequestReceived;
use App\Models\Booking;
use App\Models\PricingTier;
use App\Models\Safari;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingRequestReceivedMailTest extends TestCase
{
    use RefreshDatabase;

    public function test_booking_request_received_mail_contains_booking_details(): void
    {
        $safari = Safari::factory()->create([
            'name' => 'Lemosho Route',
        ]);
        $pricingTier = PricingTier::factory()->create([
            'name' => 'Comfort Camp',
        ]);
        $booking = Booking::factory()->create([
            'customer_name' => 'Amina Kato',
            'customer_email' => 'amina@example.com',
            'departure_month' => '2026-09',
            'estimated_total' => 5460,
            'pricing_tier_id' => $pricingTier->id,
            'safari_id' => $safari->id,
            'travelers' => 3,
        ]);

        $mailable = new BookingRequestReceived($booking);

        $mailable->assertHasSubject('Sowa Safaris booking request received');
        $mailable->assertSeeInHtml('Amina Kato');
        $mailable->assertSeeInHtml($booking->reference);
        $mailable->assertSeeInHtml('Lemosho Route');
        $mailable->assertSeeInHtml('Comfort Camp');
        $mailable->assertSeeInHtml('$'.number_format($booking->estimated_total));
    $mailable->assertSeeInHtml('Sowa Safari & Adventures logo');
        $mailable->assertSeeInHtml('We are preparing your safari plan.');
    }
}
