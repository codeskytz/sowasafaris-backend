<?php

use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GalleryItemController as AdminGalleryItemController;
use App\Http\Controllers\Admin\MailboxController;
use App\Http\Controllers\Admin\PricingTierController as AdminPricingTierController;
use App\Http\Controllers\Admin\SafariController as AdminSafariController;
use App\Http\Controllers\Admin\SiteContentController as AdminSiteContentController;
use App\Http\Controllers\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function (Request $request) {
    if ($request->user()?->is_admin) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('auth/login', [
        'canResetPassword' => Features::enabled(Features::resetPasswords()),
        'canRegister' => false,
        'status' => $request->session()->get('status'),
    ]);
})->name('home');

Route::middleware(['auth', 'verified', EnsureUserIsAdmin::class])->group(function (): void {
    Route::redirect('dashboard', 'sowa-admin');

    Route::get('sowa-admin', DashboardController::class)->name('dashboard');

    Route::prefix('sowa-admin')->name('admin.')->group(function (): void {
        Route::get('content', [AdminSiteContentController::class, 'edit'])->name('content.edit');
        Route::put('content', [AdminSiteContentController::class, 'update'])->name('content.update');
        Route::get('mailbox', MailboxController::class)->name('mailbox.index');
        Route::resource('safaris', AdminSafariController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::resource('pricing-tiers', AdminPricingTierController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::resource('gallery-items', AdminGalleryItemController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::resource('testimonials', AdminTestimonialController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::resource('bookings', AdminBookingController::class)
            ->only(['index', 'update', 'destroy']);
    });
});

require __DIR__.'/settings.php';
