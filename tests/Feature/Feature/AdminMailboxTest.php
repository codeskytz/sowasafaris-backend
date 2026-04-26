<?php

namespace Tests\Feature\Feature;

use App\Models\User;
use App\Services\Mailbox\MailboxClient;
use App\Services\Mailbox\MailboxUnavailableException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminMailboxTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_users_can_view_the_support_mailbox(): void
    {
        $this->app->instance(MailboxClient::class, new class implements MailboxClient
        {
            public function messages(int $limit = 25): array
            {
                return [
                    [
                        'uid' => 101,
                        'subject' => 'Kilimanjaro booking question',
                        'from' => 'traveler@example.com',
                        'date' => '2026-04-26T12:00:00+00:00',
                        'seen' => false,
                        'excerpt' => 'Can you help us plan a July climb?',
                    ],
                ];
            }

            public function message(int $uid): ?array
            {
                return [
                    'uid' => $uid,
                    'subject' => 'Kilimanjaro booking question',
                    'from' => 'traveler@example.com',
                    'to' => 'support@sowasafaris.com',
                    'date' => '2026-04-26T12:00:00+00:00',
                    'seen' => false,
                    'body' => 'Can you help us plan a July climb?',
                ];
            }
        });

        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get(route('admin.mailbox.index'))
            ->assertOk()
            ->assertInertia(
                fn (Assert $page): Assert => $page
                    ->component('admin/mailbox/index')
                    ->has('messages', 1)
                    ->where('messages.0.subject', 'Kilimanjaro booking question')
                    ->where('selectedMessage.body', 'Can you help us plan a July climb?')
                    ->where('error', null),
            );
    }

    public function test_admin_mailbox_page_reports_connection_errors(): void
    {
        $this->app->instance(MailboxClient::class, new class implements MailboxClient
        {
            public function messages(int $limit = 25): array
            {
                throw new MailboxUnavailableException('The PHP IMAP extension is not enabled on this server.');
            }

            public function message(int $uid): ?array
            {
                return null;
            }
        });

        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get(route('admin.mailbox.index'))
            ->assertOk()
            ->assertInertia(
                fn (Assert $page): Assert => $page
                    ->component('admin/mailbox/index')
                    ->has('messages', 0)
                    ->where('selectedMessage', null)
                    ->where('error', 'The PHP IMAP extension is not enabled on this server.'),
            );
    }
}
