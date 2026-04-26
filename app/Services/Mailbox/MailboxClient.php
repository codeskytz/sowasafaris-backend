<?php

namespace App\Services\Mailbox;

interface MailboxClient
{
    /**
     * @return array<int, array{
     *     uid: int,
     *     subject: string,
     *     from: string,
     *     date: string|null,
     *     seen: bool,
     *     excerpt: string
     * }>
     */
    public function messages(int $limit = 25): array;

    /**
     * @return array{
     *     uid: int,
     *     subject: string,
     *     from: string,
     *     to: string|null,
     *     date: string|null,
     *     seen: bool,
     *     body: string
     * }|null
     */
    public function message(int $uid): ?array;
}
