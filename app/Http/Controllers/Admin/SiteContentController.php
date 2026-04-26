<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSiteContentRequest;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SiteContentController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/content/edit', [
            'content' => SiteSetting::homepageContent(),
        ]);
    }

    public function update(UpdateSiteContentRequest $request): RedirectResponse
    {
        SiteSetting::syncHomepageContent($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Site content updated.'),
        ]);

        return to_route('admin.content.edit');
    }
}
