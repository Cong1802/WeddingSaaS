<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', fn (Blueprint $table) => $table->string('card_slug', 191)->nullable()->unique());
        Schema::table('users', fn (Blueprint $table) => $table->boolean('primary_selection_pending')->default(false));
        Schema::table('orders', function (Blueprint $table) {
            $table->string('template_code', 100)->nullable()->index();
            $table->string('plan_code', 100)->nullable();
        });
        Schema::create('template_licenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('template_code', 100);
            $table->timestamp('expires_at');
            $table->timestamps();
            $table->unique(['user_id', 'template_code']);
        });
        // Preserve every old card; the oldest URL becomes the account's primary URL.
        foreach (DB::table('users')->select('id')->cursor() as $user) {
            $card = DB::table('wedding_cards')->where('user_id', $user->id)->orderBy('id')->first();
            if (!$card) continue;
            DB::table('users')->where('id', $user->id)->update(['card_slug' => $card->slug, 'primary_selection_pending' => DB::table('wedding_cards')->where('user_id', $user->id)->count() > 1]);
            $payment = DB::table('orders')->where('user_id', $user->id)->where('status', 'completed')->latest('updated_at')->first();
            if ($payment) {
                DB::table('template_licenses')->insert([
                    'user_id' => $user->id, 'template_code' => $card->template_id,
                    'expires_at' => Carbon::parse($payment->updated_at)->addMonthsNoOverflow(6),
                    'created_at' => now(), 'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('template_licenses');
        Schema::table('orders', fn (Blueprint $table) => $table->dropColumn(['template_code', 'plan_code']));
        Schema::table('users', fn (Blueprint $table) => $table->dropColumn(['card_slug', 'primary_selection_pending']));
    }
};
