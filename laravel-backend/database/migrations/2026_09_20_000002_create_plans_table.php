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
            $table->string('subtitle')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->string('period')->default('/thiệp');
            $table->text('description')->nullable();
            $table->string('action')->nullable();
            $table->json('features')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed initial plans
        DB::table('plans')->insert([
            [
                'code' => 'trial',
                'name' => 'Gói Thử Nghiệm',
                'subtitle' => 'Trải nghiệm miễn phí',
                'price' => 0,
                'period' => '',
                'description' => 'Dành cho bạn mới bắt đầu',
                'action' => 'Tạo Thiệp Miễn Phí',
                'features' => json_encode([
                    'Xem & trải nghiệm mẫu thiệp',
                    'Tự do tạo thiệp với mẫu cơ bản',
                    'Xuất file HTML để chia sẻ',
                    'Có logo WeddingSaaS',
                    '- Tùy chỉnh tên miền riêng',
                    '- Không hỗ trợ quản lý khách mời'
                ]),
                'is_popular' => false,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'basic',
                'name' => 'Gói Cơ Bản',
                'subtitle' => 'Phù hợp cho cá nhân',
                'price' => 49000,
                'period' => '/thiệp',
                'description' => 'Giải pháp tiết kiệm, đầy đủ tính năng cơ bản',
                'action' => 'Chọn Gói Cơ Bản',
                'features' => json_encode([
                    'Sử dụng toàn bộ mẫu thiệp đẹp',
                    'Tùy chỉnh nội dung, hình ảnh, màu sắc',
                    'Xuất link chia sẻ không logo',
                    'Tùy chỉnh tên miền phụ (vd: tenban.weddingsaas.vn)',
                    'Nhạc nền lãng mạn',
                    'Thông báo khi có khách mời RSVP',
                    '- Quản lý khách mời nâng cao',
                    '- Không hỗ trợ mã QR tùy chỉnh'
                ]),
                'is_popular' => false,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'pro',
                'name' => 'Gói Pro Nổi Bật',
                'subtitle' => 'Lựa chọn hoàn hảo cho đám cưới',
                'price' => 99000,
                'period' => '/thiệp',
                'description' => 'Đầy đủ tính năng cao cấp, dễ dàng quản lý',
                'action' => 'Chọn Gói Pro Ngay',
                'features' => json_encode([
                    'Sử dụng toàn bộ mẫu thiệp cao cấp',
                    'Tùy chỉnh giao diện chuyên nghiệp',
                    'Tên miền riêng (vd: tenban.com)',
                    'Nhạc nền theo sở thích',
                    'Quản lý khách mời thông minh',
                    'Gửi thông báo tự động (Email/SMS/Telegram)',
                    'Mã QR mừng cưới & chỉ đường',
                    'Thống kê lượt xem, xác nhận tham dự',
                    'Hỗ trợ 24/7 qua chat'
                ]),
                'is_popular' => true,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'vip',
                'name' => 'Gói VIP Đặc Biệt',
                'subtitle' => 'Dành cho tiệc cưới lớn & cao cấp',
                'price' => 199000,
                'period' => '/thiệp',
                'description' => 'Trải nghiệm trọn vẹn, chuyên nghiệp và khác biệt',
                'action' => 'Đăng Ký Gói VIP',
                'features' => json_encode([
                    'Tất cả tính năng của Gói Pro',
                    'Thiết kế giao diện theo yêu cầu',
                    'Tên miền riêng .com/.vn',
                    'Mời khách qua Email/SMS/Telegram',
                    'Tích hợp bản đồ, chỉ đường, lịch trình',
                    'Mã QR mừng cưới tùy chỉnh',
                    'Thống kê chi tiết & xuất danh sách khách mời',
                    'Hỗ trợ kỹ thuật 1:1 trong suốt thời gian sử dụng',
                    'Tư vấn thiết kế miễn phí'
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
