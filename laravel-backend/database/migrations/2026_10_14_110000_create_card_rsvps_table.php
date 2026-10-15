<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void {
  Schema::create('card_rsvps', function (Blueprint $table) {
   $table->id(); $table->foreignId('wedding_card_id')->constrained('wedding_cards')->cascadeOnDelete();
   $table->string('name', 150); $table->boolean('attending'); $table->unsignedSmallInteger('guest_count');
   $table->text('message')->nullable(); $table->timestamps();
  });
 }
 public function down(): void { Schema::dropIfExists('card_rsvps'); }
};
