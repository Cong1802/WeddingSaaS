<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Seed initial system settings
        DB::table('system_settings')->insert([
            [
                'key' => 'vietqr_bank_bin',
                'value' => 'MB',
                'description' => 'Mã Ngân Hàng VietQR (MB, VPB, VCB, TCB...)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'vietqr_account_no',
                'value' => '0987654321',
                'description' => 'Số tài khoản nhận tiền thanh toán',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'vietqr_account_name',
                'value' => 'DUONG QUANG TUAN',
                'description' => 'Tên chủ tài khoản nhận tiền',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'telegram_notify_bot_token',
                'value' => '',
                'description' => 'Telegram Bot Token để nhận thông báo đơn hàng mới cho Admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
