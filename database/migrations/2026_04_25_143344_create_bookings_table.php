<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('safari_id')->constrained()->restrictOnDelete();
            $table->string('reference', 191)->unique();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('departure_month', 7);
            $table->unsignedSmallInteger('travelers');
            $table->string('service_tier', 40);
            $table->text('notes')->nullable();
            $table->unsignedInteger('estimated_total');
            $table->string('status', 40)->default('pending')->index();
            $table->text('admin_notes')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['departure_month', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
