<?php

namespace Tests\Feature\Feature;

use App\Models\Booking;
use App\Models\Safari;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_users_are_redirected_away_from_admin_routes(): void
    {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
        $this->get(route('admin.content.edit'))->assertRedirect(route('login'));
        $this->get(route('admin.safaris.index'))->assertRedirect(route('login'));
        $this->get(route('admin.pricing-tiers.index'))->assertRedirect(route('login'));
        $this->get(route('admin.gallery-items.index'))->assertRedirect(route('login'));
        $this->get(route('admin.testimonials.index'))->assertRedirect(route('login'));
        $this->get(route('admin.bookings.index'))->assertRedirect(route('login'));
        $this->get(route('admin.mailbox.index'))->assertRedirect(route('login'));
    }

    public function test_non_admin_users_are_forbidden_from_admin_routes(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get(route('dashboard'))->assertForbidden();
        $this->actingAs($user)->get(route('admin.content.edit'))->assertForbidden();
        $this->actingAs($user)->get(route('admin.safaris.index'))->assertForbidden();
        $this->actingAs($user)->get(route('admin.pricing-tiers.index'))->assertForbidden();
        $this->actingAs($user)->get(route('admin.gallery-items.index'))->assertForbidden();
        $this->actingAs($user)->get(route('admin.testimonials.index'))->assertForbidden();
        $this->actingAs($user)->get(route('admin.bookings.index'))->assertForbidden();
        $this->actingAs($user)->get(route('admin.mailbox.index'))->assertForbidden();
    }

    public function test_admin_users_are_redirected_to_sowa_admin_after_login(): void
    {
        $admin = User::factory()->admin()->create([
            'email' => 'admin-test@sowasafaris.com',
        ]);

        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ])->assertRedirect(route('dashboard'));
    }

    public function test_regular_users_are_redirected_home_after_login(): void
    {
        $user = User::factory()->create([
            'email' => 'traveler@sowasafaris.com',
        ]);

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertRedirect(route('home'));
    }

    public function test_admin_users_can_view_the_dashboard(): void
    {
        $user = User::factory()->admin()->create();
        $safari = Safari::factory()->featured()->create();
        Booking::factory()->for($safari)->create([
            'status' => 'pending',
        ]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(
                fn (Assert $page): Assert => $page
                    ->component('dashboard')
                    ->where('stats.totalSafaris', 1)
                    ->where('stats.pendingBookings', 1)
                    ->has('featuredSafaris', 1)
                    ->has('recentBookings', 1),
            );
    }

    public function test_admin_users_can_create_and_update_safaris(): void
    {
        $user = User::factory()->admin()->create();

        $createPayload = [
            'name' => 'Rift Valley Ridge Trek',
            'slug' => 'rift-valley-ridge-trek',
            'summary' => 'A scenic multi-day climb with volcanic escarpment views.',
            'description' => 'This guided ascent mixes ridge walking, campfire evenings, and high-country traverses.',
            'difficulty' => 'Challenging',
            'difficulty_group' => 'challenge',
            'duration_days' => 6,
            'elevation_meters' => 4120,
            'base_price' => 1850,
            'availability' => 'open',
            'next_departure_at' => '2026-07-14',
            'spots_left' => 8,
            'best_for' => 'Adventure groups',
            'image_url' => 'https://example.com/safari.jpg',
            'image_alt' => 'Trekkers on a high ridge',
            'is_featured' => true,
            'is_published' => true,
            'sort_order' => 2,
        ];

        $this->actingAs($user)
            ->post(route('admin.safaris.store'), $createPayload)
            ->assertRedirect(route('admin.safaris.index'));

        $safari = Safari::query()->firstOrFail();

        $this->assertModelExists($safari);
        $this->assertSame('Rift Valley Ridge Trek', $safari->name);
        $this->assertTrue($safari->is_featured);

        $updatePayload = [
            ...$createPayload,
            'slug' => 'rift-valley-ridge-expedition',
            'base_price' => 2190,
            'availability' => 'few_spots',
            'spots_left' => 3,
            'is_featured' => false,
        ];

        $this->actingAs($user)
            ->patch(route('admin.safaris.update', $safari), $updatePayload)
            ->assertRedirect(route('admin.safaris.index'));

        $safari->refresh();

        $this->assertSame('rift-valley-ridge-expedition', $safari->slug);
        $this->assertSame(2190, $safari->base_price);
        $this->assertSame('few_spots', $safari->availability);
        $this->assertFalse($safari->is_featured);
    }

    public function test_admin_users_can_filter_and_update_booking_statuses(): void
    {
        $user = User::factory()->admin()->create();
        $booking = Booking::factory()->create([
            'status' => 'pending',
            'admin_notes' => null,
            'reference' => 'SOWA-FILTER1',
        ]);
        Booking::factory()->create([
            'status' => 'confirmed',
            'reference' => 'SOWA-FILTER2',
        ]);

        $this->actingAs($user)
            ->get(route('admin.bookings.index', [
                'search' => 'FILTER1',
                'status' => 'pending',
            ]))
            ->assertOk()
            ->assertInertia(
                fn (Assert $page): Assert => $page
                    ->component('admin/bookings/index')
                    ->where('filters.search', 'FILTER1')
                    ->where('filters.status', 'pending')
                    ->has('bookings.data', 1)
                    ->where('bookings.data.0.reference', 'SOWA-FILTER1'),
            );

        $this->actingAs($user)
            ->patch(route('admin.bookings.update', $booking), [
                'status' => 'contacted',
                'admin_notes' => 'Call scheduled for tomorrow morning.',
            ])
            ->assertRedirect();

        $booking->refresh();

        $this->assertSame('contacted', $booking->status);
        $this->assertSame('Call scheduled for tomorrow morning.', $booking->admin_notes);
        $this->assertNotNull($booking->reviewed_at);
        $this->assertSame($user->id, $booking->reviewed_by_user_id);
    }

    public function test_admin_users_can_delete_booking_requests(): void
    {
        $user = User::factory()->admin()->create();
        $booking = Booking::factory()->create();

        $this->actingAs($user)
            ->delete(route('admin.bookings.destroy', $booking))
            ->assertRedirect();

        $this->assertModelMissing($booking);
    }

    public function test_admin_seeder_creates_the_expected_admin_credentials(): void
    {
        $this->seed(AdminUserSeeder::class);

        $admin = User::query()
            ->where('email', 'admin@sowasafaris.com')
            ->firstOrFail();

        $this->assertTrue($admin->is_admin);
        $this->assertTrue(Hash::check('sowasafaris@2026', $admin->password));
        $this->assertNotNull($admin->email_verified_at);
    }
}
