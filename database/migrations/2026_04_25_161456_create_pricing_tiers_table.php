<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pricing_tiers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug', 191)->unique();
            $table->text('description');
            $table->json('inclusions');
            $table->unsignedInteger('price_adjustment')->default(0);
            $table->boolean('is_recommended')->default(false)->index();
            $table->boolean('is_published')->default(true)->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pricing_tiers');
    }
};
