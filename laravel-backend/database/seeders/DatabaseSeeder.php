<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Quản Trị Viên (Admin)',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'role' => 'admin',
                'paid_credits' => 9999,
                'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Quản Trị Viên (Gmail Admin)',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'role' => 'admin',
                'paid_credits' => 9999,
                'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminGmail'
            ]
        );

        $presetSongs = [
            ['title' => '50 Năm Về Sau', 'artist' => 'Bùi Anh Tuấn', 'url' => 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/50 Năm Về Sau.mp3'],
            ['title' => 'Hơn Cả Yêu', 'artist' => 'Đức Phúc', 'url' => 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Hon-Ca-Yeu.mp3'],
            ['title' => 'Cầu Hôn', 'artist' => 'Văn Mai Hương', 'url' => 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Cau-Hon.mp3'],
            ['title' => 'Ngày Đầu Tiên', 'artist' => 'Đức Phúc', 'url' => 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Ngay-Dau-Tien.mp3'],
            ['title' => 'Ánh Nắng Của Anh', 'artist' => 'Đức Phúc', 'url' => 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Anh-Nang-Cua-Anh.mp3'],
            ['title' => 'Ta Là Của Nhau', 'artist' => 'Đông Nhi & Ông Cao Thắng', 'url' => 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Ta-La-Cua-Nhau.mp3'],
        ];

        foreach ($presetSongs as $index => $song) {
            \App\Models\MusicTrack::updateOrCreate(
                ['url' => $song['url']],
                [
                    'title' => $song['title'],
                    'artist' => $song['artist'],
                    'is_active' => true,
                    'sort_order' => $index + 1
                ]
            );
        }

        $defaultSettings = [
            'site_name' => 'WeddingCard SaaS',
            'site_title' => 'Thiệp Cưới Online Thông Minh & Đẳng Cấp 2026',
            'site_description' => 'Nền tảng tạo thiệp cưới online cao cấp, thiết kế đẹp mắt, nhận mừng cưới tự động VietQR, gửi lời chúc & album ảnh cưới.',
            'site_keywords' => 'thiệp cưới online, tạo thiệp cưới, thiệp cưới số, vietqr mừng cưới',
            'site_logo' => '',
            'site_favicon' => '',
            'contact_email' => 'contact@weddingcardsaas.vn',
            'contact_phone' => '0987.654.321',
            'contact_address' => 'Tòa nhà Landmark 81, Bình Thạnh, TP. Hồ Chí Minh',
            'social_facebook' => 'https://facebook.com/weddingcardsaas',
            'social_zalo' => 'https://zalo.me/0987654321',
            'vietqr_bank_bin' => 'MB',
            'vietqr_account_no' => '0987654321',
            'vietqr_account_name' => 'DUONG QUANG TUAN',
            'telegram_notify_bot_token' => '',
            'telegram_chat_id' => '',
        ];

        foreach ($defaultSettings as $key => $value) {
            \App\Models\SystemSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
    }
}
