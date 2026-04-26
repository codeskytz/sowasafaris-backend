<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('safaris', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('summary');
            $table->text('description');
            $table->string('difficulty', 40);
            $table->unsignedSmallInteger('duration_days');
            $table->unsignedInteger('elevation_meters');
            $table->unsignedInteger('base_price');
            $table->string('availability', 40)->index();
            $table->date('next_departure_at')->nullable();
            $table->unsignedSmallInteger('spots_left')->nullable();
            $table->string('best_for')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_published')->default(false)->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_published', 'is_featured']);
            $table->index(['sort_order', 'next_departure_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('safaris');
    }
};
