<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReplyToMailboxMessageRequest;
use App\Mail\AdminMailboxReply;
use App\Services\Mailbox\MailboxClient;
use App\Services\Mailbox\MailboxUnavailableException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MailboxController extends Controller
{
    public function __invoke(Request $request, MailboxClient $mailbox): Response
    {
        $selectedUid = $request->integer('message');
        $messages = [];
        $selectedMessage = null;
        $error = null;

        try {
            $messages = $mailbox->messages(25);
            $selectedMessage = $selectedUid > 0
                ? $mailbox->message($selectedUid)
                : ($messages === [] ? null : $mailbox->message($messages[0]['uid']));
        } catch (MailboxUnavailableException $exception) {
            $error = $exception->getMessage();
        }

        return Inertia::render('admin/mailbox/index', [
            'messages' => $messages,
            'selectedMessage' => $selectedMessage,
            'selectedUid' => $selectedUid > 0 ? $selectedUid : ($messages[0]['uid'] ?? null),
            'mailbox' => [
                'address' => config('mail.incoming.username'),
                'host' => config('mail.incoming.host'),
                'port' => config('mail.incoming.port'),
            ],
            'error' => $error,
        ]);
    }

    public function reply(ReplyToMailboxMessageRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $to = (string) $validated['to'];
        $subject = Str::startsWith((string) $validated['subject'], 'Re:')
            ? (string) $validated['subject']
            : 'Re: '.$validated['subject'];

        Mail::to($to)->send(new AdminMailboxReply($subject, (string) $validated['body']));

        return redirect()
            ->route('admin.mailbox.index', array_filter([
                'message' => $validated['message'] ?? null,
            ]))
            ->with('success', 'Reply sent to '.$to.'.');
    }
}
