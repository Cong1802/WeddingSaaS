<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->decimal('price', 10, 2)->default(0);
            $table->string('period')->default('12 tháng');
            $table->text('description')->nullable();
            $table->json('features')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed initial plans
        DB::table('plans')->insert([
            [
                'code' => 'free',
                'name' => 'Gói Thử Nghiệm',
                'price' => 0,
                'period' => 'Dùng thử',
                'description' => 'Trải nghiệm tự do tất cả tính năng trình chỉnh sửa thiệp',
                'features' => json_encode([
                    'Tự do xem thử & chỉnh sửa',
                    'Xuất file HTML tải về',
                    'Không có đường dẫn tĩnh riêng'
                ]),
                'is_popular' => false,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'pro',
                'name' => 'Gói Pro Nổi Bật',
                'price' => 99000,
                'period' => '1 thiệp',
                'description' => 'Đầy đủ tính năng cao cấp & đường dẫn riêng chuẩn SaaS',
                'features' => json_encode([
                    'Link tĩnh riêng biệt 12 tháng',
                    'Tự động mừng cưới VietQR',
                    'Thông báo RSVP về Telegram',
                    'Nhạc nền lãng mạn tự chọn'
                ]),
                'is_popular' => true,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'vip',
                'name' => 'Gói VIP Đặc Biệt',
                'price' => 199000,
                'period' => '1 thiệp',
                'description' => 'Dành cho cặp đôi muốn hỗ trợ thiết kế riêng trọn gói',
                'features' => json_encode([
                    'Bao gồm toàn bộ tính năng Gói Pro',
                    'Hỗ trợ nhập liệu thông tin 24/7',
                    'Tặng kèm Mã QR in lên thiệp giấy'
                ]),
                'is_popular' => false,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
