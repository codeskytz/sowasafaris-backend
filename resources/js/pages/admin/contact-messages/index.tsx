import { Form, Head, Link, router } from '@inertiajs/react';
import {
    destroy as destroyContactMessage,
    update,
} from '@/actions/App/Http/Controllers/Admin/ContactMessageController';
import Heading from '@/components/heading';
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
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import { index as contactMessagesIndex } from '@/routes/admin/contact-messages';
import { edit as contentEdit } from '@/routes/admin/content';
import type {
    AdminContactMessage,
    LengthAwarePaginator,
    Option,
} from '@/types';

type ContactMessagesPageProps = {
    messages: LengthAwarePaginator<AdminContactMessage>;
    filters: {
        search: string;
        status: string;
    };
    stats: {
        new: number;
        reviewing: number;
        replied: number;
        closed: number;
    };
    statusOptions: Option[];
};

const textAreaClasses =
    'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-28 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

function formatDate(value: string | null): string {
    if (value === null) {
        return 'Not reviewed yet';
    }

    return dateFormatter.format(new Date(value));
}

function toLabel(value: string): string {
    return value
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function statusVariant(
    value: string,
): 'default' | 'secondary' | 'outline' | 'destructive' {
    if (value === 'new') {
        return 'secondary';
    }

    if (value === 'closed') {
        return 'destructive';
    }

    if (value === 'replied') {
        return 'default';
    }

    return 'outline';
}

function handleDeleteMessage(message: AdminContactMessage): void {
    if (!window.confirm(`Delete message from ${message.name}?`)) {
        return;
    }

    router.delete(destroyContactMessage(message.id), {
        preserveScroll: true,
    });
}

export default function ContactMessagesPage({
    messages,
    filters,
    stats,
    statusOptions,
}: ContactMessagesPageProps) {
    return (
        <>
            <Head title="Contact Messages" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <Heading
                        title="Contact Messages"
                        description="Review messages sent from the public contact page and keep track of follow-up."
                    />

                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" asChild>
                            <Link href={dashboard()} prefetch>
                                Back to dashboard
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href={contentEdit()} prefetch>
                                Edit contact details
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {Object.entries(stats).map(([status, count]) => (
                        <Card key={status}>
                            <CardHeader className="gap-1">
                                <CardDescription>{toLabel(status)}</CardDescription>
                                <CardTitle className="text-3xl">{count}</CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter contact requests</CardTitle>
                        <CardDescription>
                            Search by guest, email, subject, or message and narrow
                            the queue by follow-up status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...contactMessagesIndex.form()}
                            options={{
                                preserveScroll: true,
                                preserveState: true,
                            }}
                            className="grid gap-4 md:grid-cols-[1.4fr_220px_auto]"
                        >
                            <div className="grid gap-2">
                                <label
                                    htmlFor="contact-search"
                                    className="text-sm font-medium"
                                >
                                    Search
                                </label>
                                <Input
                                    id="contact-search"
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Guest, email, subject, or message"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label
                                    htmlFor="contact-filter-status"
                                    className="text-sm font-medium"
                                >
                                    Status
                                </label>
                                <select
                                    id="contact-filter-status"
                                    name="status"
                                    defaultValue={filters.status}
                                    className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                                >
                                    <option value="">All statuses</option>
                                    {statusOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end gap-2">
                                <Button type="submit">Apply</Button>
                                <Button variant="outline" asChild>
                                    <Link href={contactMessagesIndex()} prefetch>
                                        Reset
                                    </Link>
                                </Button>
                            </div>
                        </Form>
                    </CardContent>
                </Card>

                <div className="grid gap-4">
                    {messages.data.length === 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>No contact messages found</CardTitle>
                                <CardDescription>
                                    New contact page submissions will appear here.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ) : (
                        messages.data.map((message) => (
                            <Card key={message.id}>
                                <CardHeader>
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <CardTitle>{message.subject}</CardTitle>
                                            <CardDescription>
                                                {message.name} ·{' '}
                                                <a href={`mailto:${message.email}`}>
                                                    {message.email}
                                                </a>
                                                {message.phone
                                                    ? ` · ${message.phone}`
                                                    : ''}
                                            </CardDescription>
                                        </div>
                                        <Badge variant={statusVariant(message.status)}>
                                            {toLabel(message.status)}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="rounded-xl border bg-muted/30 p-4 text-sm leading-6">
                                        {message.message}
                                    </div>

                                    <Form
                                        {...update.form(message.id)}
                                        options={{
                                            preserveScroll: true,
                                        }}
                                        className="grid gap-4 lg:grid-cols-[220px_1fr_auto]"
                                    >
                                        {({ errors, processing }) => (
                                            <>
                                                <div className="grid gap-2">
                                                    <label className="text-sm font-medium">
                                                        Status
                                                    </label>
                                                    <select
                                                        name="status"
                                                        defaultValue={message.status}
                                                        className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                                                    >
                                                        {statusOptions.map(
                                                            (option) => (
                                                                <option
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    value={
                                                                        option.value
                                                                    }
                                                                >
                                                                    {option.label}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                    <InputError
                                                        message={errors.status}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <label className="text-sm font-medium">
                                                        Follow-up notes
                                                    </label>
                                                    <textarea
                                                        name="admin_notes"
                                                        defaultValue={
                                                            message.admin_notes ?? ''
                                                        }
                                                        className={textAreaClasses}
                                                    />
                                                    <InputError
                                                        message={errors.admin_notes}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Reviewed:{' '}
                                                        {formatDate(
                                                            message.reviewed_at,
                                                        )}
                                                        {message.reviewed_by
                                                            ? ` by ${message.reviewed_by.name}`
                                                            : ''}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                                                    <Button disabled={processing}>
                                                        Save
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        asChild
                                                    >
                                                        <a
                                                            href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                                                        >
                                                            Reply
                                                        </a>
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleDeleteMessage(
                                                                message,
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </Form>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
