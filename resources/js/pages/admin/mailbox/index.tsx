import { Form, Head, Link } from '@inertiajs/react';
import { AlertCircle, Inbox, MailOpen, RefreshCw, Send } from 'lucide-react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import {
    index as mailboxIndex,
    reply as mailboxReply,
} from '@/routes/admin/mailbox';
import type { BreadcrumbItem } from '@/types';

type MailboxMessage = {
    uid: number;
    subject: string;
    from: string;
    date: string | null;
    seen: boolean;
    excerpt: string;
};

type SelectedMessage = {
    uid: number;
    subject: string;
    from: string;
    to: string | null;
    date: string | null;
    seen: boolean;
    body: string;
} | null;

type MailboxPageProps = {
    messages: MailboxMessage[];
    selectedMessage: SelectedMessage;
    selectedUid: number | null;
    mailbox: {
        address: string | null;
        host: string | null;
        port: number | string | null;
    };
    error: string | null;
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

function formatDate(value: string | null): string {
    if (value === null) {
        return 'Unknown time';
    }

    return dateFormatter.format(new Date(value));
}

function extractEmailAddress(value: string | null | undefined): string {
    if (!value) {
        return '';
    }

    const match = value.match(/<([^>]+)>/);

    return (match?.[1] ?? value).trim();
}

export default function MailboxPage({
    messages,
    selectedMessage,
    selectedUid,
    mailbox,
    error,
}: MailboxPageProps) {
    const replyTo = extractEmailAddress(selectedMessage?.from);
    const replySubject = selectedMessage?.subject ?? '';

    return (
        <>
            <Head title="Support Inbox" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-hidden rounded-xl p-3 sm:p-4">
                <div className="relative overflow-hidden rounded-[2rem] border border-[#d8c8a8] bg-[#0b2b24] p-6 text-[#fff7df] shadow-xl shadow-[#0b2b24]/10 md:p-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(255,186,32,0.24),transparent_24rem)]" />
                    <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs font-black tracking-[0.4em] text-[#ffba20] uppercase">
                                Support Mailbox
                            </p>
                            <h1 className="mt-4 text-4xl font-black tracking-tight">
                                Incoming traveler messages.
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#fff7df]/72 md:text-base">
                                Review messages arriving at{' '}
                                <span className="font-semibold text-[#ffba20]">
                                    {mailbox.address ?? 'the support mailbox'}
                                </span>{' '}
                                and keep booking follow-up moving from the admin
                                desk.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button
                                asChild
                                className="rounded-full bg-[#ffba20] font-bold text-[#11251f] hover:bg-[#ffd166]"
                            >
                                <Link href={mailboxIndex()} preserveScroll>
                                    <RefreshCw className="size-4" />
                                    Refresh inbox
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                asChild
                                className="rounded-full border-[#ffba20]/40 bg-white/10 text-[#fff7df] hover:bg-white/20 hover:text-[#fff7df]"
                            >
                                <Link href={dashboard()} prefetch>
                                    Back to dashboard
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {error && (
                    <Card className="border-[#dca21f] bg-[#fff7df]">
                        <CardContent className="flex gap-3 pt-6 text-[#57432e]">
                            <AlertCircle className="mt-0.5 size-5 shrink-0 text-[#b43b2f]" />
                            <div>
                                <p className="font-semibold">
                                    Inbox connection needs attention
                                </p>
                                <p className="mt-1 text-sm text-[#705a44]">
                                    {error}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid min-h-[70vh] gap-4 xl:grid-cols-[390px_minmax(0,1fr)]">
                    <Card className="overflow-hidden border-[#28594a] bg-[#0f3d31] text-[#fff7df] shadow-lg shadow-[#061a16]/20">
                        <CardHeader className="border-b border-[#28594a] bg-[#0b2b24]">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-[#fff7df]">
                                        Inbox
                                    </CardTitle>
                                    <CardDescription className="text-[#fff7df]/65">
                                        {messages.length} latest message
                                        {messages.length === 1 ? '' : 's'} from{' '}
                                        {mailbox.host ?? 'IMAP server'}:
                                        {mailbox.port ?? 993}
                                    </CardDescription>
                                </div>
                                <Inbox className="size-8 text-[#ffba20]" />
                            </div>
                        </CardHeader>
                        <CardContent className="max-h-[72vh] space-y-2 overflow-y-auto p-3">
                            {messages.length === 0 ? (
                                <div className="rounded-3xl border border-dashed border-[#ffba20]/30 p-6 text-sm text-[#fff7df]/70">
                                    No incoming messages are available yet.
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <Button
                                        key={message.uid}
                                        variant="ghost"
                                        asChild
                                        className={cn(
                                            'h-auto w-full justify-start rounded-2xl border border-[#28594a] bg-[#173f34] p-0 text-left text-[#fff7df] hover:bg-[#235244] hover:text-[#fff7df]',
                                            selectedUid === message.uid &&
                                                'border-[#ffba20] bg-[#ffba20]/15',
                                        )}
                                    >
                                        <Link
                                            href={mailboxIndex({
                                                query: {
                                                    message: message.uid,
                                                },
                                            })}
                                            preserveScroll
                                            preserveState
                                            className="block w-full p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-[#fff7df]">
                                                        {message.subject}
                                                    </p>
                                                    <p className="mt-1 truncate text-sm text-[#fff7df]/68">
                                                        {message.from}
                                                    </p>
                                                </div>
                                                {!message.seen && (
                                                    <Badge className="bg-[#ffba20] text-[#11251f]">
                                                        New
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="mt-3 line-clamp-2 text-sm text-[#fff7df]/70">
                                                {message.excerpt}
                                            </p>
                                            <p className="mt-3 text-xs font-semibold tracking-wide text-[#ffba20] uppercase">
                                                {formatDate(message.date)}
                                            </p>
                                        </Link>
                                    </Button>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border-[#28594a] bg-[#fffaf0] text-[#11251f] shadow-lg shadow-[#061a16]/15">
                        <CardHeader className="border-b border-[#d8c8a8] bg-[#fff7df]">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#0f3d31] text-[#fff7df]">
                                    <MailOpen className="size-5" />
                                </div>
                                <div className="min-w-0">
                                    <CardTitle className="break-words text-[#11251f]">
                                        {selectedMessage?.subject ??
                                            'Select a message'}
                                    </CardTitle>
                                    <CardDescription className="break-words text-[#705a44]">
                                        {selectedMessage
                                            ? `${selectedMessage.from} | ${formatDate(selectedMessage.date)}`
                                            : 'Choose an incoming email to read its details.'}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="max-h-none overflow-y-auto p-4 xl:max-h-[72vh] xl:p-6">
                            {selectedMessage ? (
                                <div className="space-y-5">
                                    <div className="grid gap-3 rounded-3xl border border-[#d8c8a8] bg-white/80 p-4 text-sm md:grid-cols-2">
                                        <div>
                                            <p className="font-semibold text-[#705a44]">
                                                From
                                            </p>
                                            <p className="mt-1 text-[#11251f]">
                                                {selectedMessage.from}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#705a44]">
                                                To
                                            </p>
                                            <p className="mt-1 text-[#11251f]">
                                                {selectedMessage.to ??
                                                    mailbox.address ??
                                                    'Support mailbox'}
                                            </p>
                                        </div>
                                    </div>

                                    <article className="min-h-80 whitespace-pre-wrap rounded-3xl border border-[#d8c8a8] bg-white/80 p-5 text-sm leading-7 text-[#2d2619]">
                                        {selectedMessage.body ||
                                            'This message did not include a readable text body.'}
                                    </article>

                                    <Form
                                        {...mailboxReply.form()}
                                        options={{
                                            preserveScroll: true,
                                            preserveState: true,
                                        }}
                                        className="rounded-3xl border border-[#d8c8a8] bg-white/90 p-4"
                                    >
                                        {({
                                            errors,
                                            processing,
                                            recentlySuccessful,
                                        }) => (
                                            <div className="space-y-4">
                                                <input
                                                    type="hidden"
                                                    name="message"
                                                    value={selectedMessage.uid}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="to"
                                                    value={replyTo}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="subject"
                                                    value={replySubject}
                                                />

                                                <div className="flex flex-col gap-1">
                                                    <p className="text-sm font-bold text-[#11251f]">
                                                        Reply to {replyTo}
                                                    </p>
                                                    <p className="text-xs text-[#705a44]">
                                                        Sent from the Sowa
                                                        Safaris support mailbox.
                                                    </p>
                                                </div>

                                                <textarea
                                                    name="body"
                                                    rows={7}
                                                    required
                                                    className="min-h-40 w-full rounded-2xl border border-[#d8c8a8] bg-[#fffaf0] px-4 py-3 text-sm leading-6 text-[#11251f] outline-none transition focus:border-[#ffba20] focus:ring-4 focus:ring-[#ffba20]/20"
                                                    placeholder="Write a helpful reply to this traveler..."
                                                />
                                                <InputError
                                                    message={
                                                        errors.body ??
                                                        errors.to ??
                                                        errors.subject
                                                    }
                                                />

                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    {recentlySuccessful ? (
                                                        <p className="text-sm font-semibold text-[#0f3d31]">
                                                            Reply sent
                                                            successfully.
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm text-[#705a44]">
                                                            Keep the reply
                                                            concise and confirm
                                                            the next follow-up
                                                            step.
                                                        </p>
                                                    )}
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            processing ||
                                                            replyTo === ''
                                                        }
                                                        className="rounded-full bg-[#0f3d31] font-bold text-[#fff7df] hover:bg-[#173f34]"
                                                    >
                                                        <Send className="size-4" />
                                                        {processing
                                                            ? 'Sending...'
                                                            : 'Send reply'}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Form>
                                </div>
                            ) : (
                                <div className="rounded-3xl border border-dashed border-[#d8c8a8] p-8 text-center text-[#705a44]">
                                    <MailOpen className="mx-auto mb-4 size-10 text-[#0f3d31]" />
                                    Open a message from the inbox list to read
                                    the traveler conversation.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

MailboxPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Support Inbox',
            href: mailboxIndex(),
        },
    ] satisfies BreadcrumbItem[],
};
