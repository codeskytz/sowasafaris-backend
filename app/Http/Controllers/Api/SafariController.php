<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SafariResource;
use App\Models\Safari;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class SafariController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return SafariResource::collection(
            Safari::query()
                ->published()
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        );
    }

    public function show(Safari $safari): SafariResource
    {
        abort_unless($safari->is_published, Response::HTTP_NOT_FOUND);

        return SafariResource::make($safari);
    }
}
