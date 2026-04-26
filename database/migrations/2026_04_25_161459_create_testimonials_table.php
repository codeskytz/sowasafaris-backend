<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('safari_id')->nullable()->constrained()->nullOnDelete();
            $table->string('author_name');
            $table->string('author_image_url', 2048);
            $table->string('author_image_alt');
            $table->string('route_label')->nullable();
            $table->string('trip_date_label', 40);
            $table->text('quote');
            $table->boolean('is_published')->default(true)->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
