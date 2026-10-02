<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('order_code', 64)->unique();
            $table->string('package_name')->default('Gói Pro 99K');
            $table->unsignedBigInteger('amount')->default(99000);
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->string('payment_method')->default('VietQR Bank Transfer');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
