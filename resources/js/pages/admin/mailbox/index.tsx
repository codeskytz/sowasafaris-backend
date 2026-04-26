import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Inbox, MailOpen, RefreshCw } from 'lucide-react';
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
import { index as mailboxIndex } from '@/routes/admin/mailbox';
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

export default function MailboxPage({
    messages,
    selectedMessage,
    selectedUid,
    mailbox,
    error,
}: MailboxPageProps) {
    return (
        <>
            <Head title="Support Inbox" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
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

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
                    <Card className="border-[#d8c8a8] bg-[#fffaf0]/95">
                        <CardHeader>
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <CardTitle>Inbox</CardTitle>
                                    <CardDescription>
                                        {messages.length} latest message
                                        {messages.length === 1 ? '' : 's'} from{' '}
                                        {mailbox.host ?? 'IMAP server'}:
                                        {mailbox.port ?? 993}
                                    </CardDescription>
                                </div>
                                <Inbox className="size-8 text-[#0f3d31]" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {messages.length === 0 ? (
                                <div className="rounded-3xl border border-dashed border-[#d8c8a8] p-6 text-sm text-[#705a44]">
                                    No incoming messages are available yet.
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <Button
                                        key={message.uid}
                                        variant="ghost"
                                        asChild
                                        className={cn(
                                            'h-auto w-full justify-start rounded-3xl border border-[#d8c8a8] bg-white/60 p-0 text-left hover:bg-[#efe4ca]',
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
                                                    <p className="truncate font-semibold text-[#11251f]">
                                                        {message.subject}
                                                    </p>
                                                    <p className="mt-1 truncate text-sm text-[#705a44]">
                                                        {message.from}
                                                    </p>
                                                </div>
                                                {!message.seen && (
                                                    <Badge className="bg-[#0f3d31] text-[#fff7df]">
                                                        New
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="mt-3 line-clamp-2 text-sm text-[#705a44]">
                                                {message.excerpt}
                                            </p>
                                            <p className="mt-3 text-xs font-semibold tracking-wide text-[#9a6b05] uppercase">
                                                {formatDate(message.date)}
                                            </p>
                                        </Link>
                                    </Button>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-[#d8c8a8] bg-[#fffaf0]/95">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-11 items-center justify-center rounded-2xl bg-[#0f3d31] text-[#fff7df]">
                                    <MailOpen className="size-5" />
                                </div>
                                <div>
                                    <CardTitle>
                                        {selectedMessage?.subject ??
                                            'Select a message'}
                                    </CardTitle>
                                    <CardDescription>
                                        {selectedMessage
                                            ? `${selectedMessage.from} | ${formatDate(selectedMessage.date)}`
                                            : 'Choose an incoming email to read its details.'}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {selectedMessage ? (
                                <div className="space-y-5">
                                    <div className="grid gap-3 rounded-3xl border border-[#d8c8a8] bg-white/65 p-4 text-sm md:grid-cols-2">
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
