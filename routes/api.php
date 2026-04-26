<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\SafariController;
use App\Http\Controllers\Api\SiteContentController;
use Illuminate\Support\Facades\Route;

Route::name('api.')->group(function (): void {
    Route::get('site-content', [SiteContentController::class, 'index'])->name('site-content.index');
    Route::get('safaris', [SafariController::class, 'index'])->name('safaris.index');
    Route::get('safaris/{safari}', [SafariController::class, 'show'])->name('safaris.show');
    Route::post('bookings', [BookingController::class, 'store'])->name('bookings.store');
});
