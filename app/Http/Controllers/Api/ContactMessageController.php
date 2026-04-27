<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactMessageRequest;
use App\Http\Resources\ContactMessageResource;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;

class ContactMessageController extends Controller
{
    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $contactMessage = ContactMessage::query()->create([
            ...$request->validated(),
            'status' => 'new',
        ]);

        return ContactMessageResource::make($contactMessage)
            ->response()
            ->setStatusCode(201);
    }
}
