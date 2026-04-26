<?php

namespace App\Services\Mailbox;

use Carbon\CarbonImmutable;
use Illuminate\Support\Str;

class NativeImapMailboxClient implements MailboxClient
{
    /**
     * @var resource|null
     */
    private mixed $connection = null;

    public function __destruct()
    {
        if (is_resource($this->connection)) {
            imap_close($this->connection);
        }
    }

    public function messages(int $limit = 25): array
    {
        $connection = $this->connection();
        $uids = imap_search($connection, 'ALL', $this->constant('SE_UID')) ?: [];

        rsort($uids, SORT_NUMERIC);

        return collect(array_slice($uids, 0, $limit))
            ->map(fn (int $uid): array => $this->messageSummary($connection, $uid))
            ->values()
            ->all();
    }

    public function message(int $uid): ?array
    {
        $connection = $this->connection();
        $overview = $this->overview($connection, $uid);

        if ($overview === null) {
            return null;
        }

        return [
            'uid' => $uid,
            'subject' => $this->decodeHeader($overview->subject ?? '(No subject)'),
            'from' => $this->decodeHeader($overview->from ?? 'Unknown sender'),
            'to' => isset($overview->to) ? $this->decodeHeader($overview->to) : null,
            'date' => $this->formatDate($overview->date ?? null),
            'seen' => (bool) ($overview->seen ?? false),
            'body' => $this->messageBody($connection, $uid),
        ];
    }

    private function connection(): mixed
    {
        if (! function_exists('imap_open')) {
            throw new MailboxUnavailableException('The PHP IMAP extension is not enabled on this server.');
        }

        if (is_resource($this->connection)) {
            return $this->connection;
        }

        $config = config('mail.incoming');
        $host = (string) data_get($config, 'host');
        $port = (int) data_get($config, 'port', 993);
        $username = (string) data_get($config, 'username');
        $password = (string) data_get($config, 'password');
        $mailbox = (string) data_get($config, 'mailbox', 'INBOX');
        $protocol = (string) data_get($config, 'protocol', 'imap');
        $encryption = (string) data_get($config, 'encryption', 'ssl');

        if ($host === '' || $username === '' || $password === '') {
            throw new MailboxUnavailableException('Incoming mailbox credentials are not configured.');
        }

        $path = sprintf(
            '{%s:%d/%s/%s}%s',
            $host,
            $port,
            $protocol,
            $encryption,
            $mailbox,
        );

        $connection = @imap_open(
            $path,
            $username,
            $password,
            $this->constant('OP_READONLY'),
            1,
            ['DISABLE_AUTHENTICATOR' => 'GSSAPI'],
        );

        if ($connection === false) {
            throw new MailboxUnavailableException('Unable to connect to the incoming support mailbox.');
        }

        return $this->connection = $connection;
    }

    private function messageSummary(mixed $connection, int $uid): array
    {
        $overview = $this->overview($connection, $uid);
        $body = Str::squish($this->messageBody($connection, $uid));

        return [
            'uid' => $uid,
            'subject' => $this->decodeHeader($overview->subject ?? '(No subject)'),
            'from' => $this->decodeHeader($overview->from ?? 'Unknown sender'),
            'date' => $this->formatDate($overview->date ?? null),
            'seen' => (bool) ($overview->seen ?? false),
            'excerpt' => Str::limit($body, 180),
        ];
    }

    private function overview(mixed $connection, int $uid): ?object
    {
        $items = imap_fetch_overview($connection, (string) $uid, $this->constant('FT_UID'));

        return $items[0] ?? null;
    }

    private function messageBody(mixed $connection, int $uid): string
    {
        $structure = imap_fetchstructure($connection, (string) $uid, $this->constant('FT_UID'));
        $body = $this->partBody($connection, $uid, $structure);

        if ($body === '') {
            $body = imap_body($connection, (string) $uid, $this->constant('FT_UID')) ?: '';
        }

        return trim(Str::squish(strip_tags($body)));
    }

    private function partBody(mixed $connection, int $uid, mixed $structure, string $partNumber = ''): string
    {
        if (! isset($structure->parts)) {
            $body = imap_fetchbody(
                $connection,
                (string) $uid,
                $partNumber === '' ? '1' : $partNumber,
                $this->constant('FT_UID'),
            ) ?: '';

            return $this->decodeBody($body, (int) ($structure->encoding ?? 0));
        }

        foreach ($structure->parts as $index => $part) {
            $nextPartNumber = $partNumber === '' ? (string) ($index + 1) : $partNumber.'.'.($index + 1);
            $subtype = strtoupper((string) ($part->subtype ?? ''));

            if ($subtype === 'PLAIN' || $subtype === 'HTML') {
                $body = imap_fetchbody($connection, (string) $uid, $nextPartNumber, $this->constant('FT_UID')) ?: '';

                return $this->decodeBody($body, (int) ($part->encoding ?? 0));
            }

            $body = $this->partBody($connection, $uid, $part, $nextPartNumber);

            if ($body !== '') {
                return $body;
            }
        }

        return '';
    }

    private function decodeHeader(string $value): string
    {
        if (! function_exists('imap_mime_header_decode')) {
            return $value;
        }

        $decoded = collect(imap_mime_header_decode($value))
            ->map(fn (object $part): string => $part->text)
            ->implode('');

        return $decoded === '' ? $value : $decoded;
    }

    private function decodeBody(string $body, int $encoding): string
    {
        return match ($encoding) {
            3 => base64_decode($body, true) ?: $body,
            4 => quoted_printable_decode($body),
            default => $body,
        };
    }

    private function formatDate(?string $date): ?string
    {
        if ($date === null || $date === '') {
            return null;
        }

        try {
            return CarbonImmutable::parse($date)->toIso8601String();
        } catch (\Throwable) {
            return null;
        }
    }

    private function constant(string $name): int
    {
        return defined($name) ? (int) constant($name) : 0;
    }
}
