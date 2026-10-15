<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
return new class extends Migration {
    public function up(): void {
        DB::table('templates')->insertOrIgnore([
            'code' => 'template_passport',
            'name' => 'Passport – Hành trình yêu thương',
            'category' => 'Hiện Đại', 'tag' => 'NEW',
            'thumbnail' => '/templates/passport/assets/image-004.png',
            'file_url' => '/templates/passport/index.html',
            'price' => 0, 'is_active' => true, 'sort_order' => 5,
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }
    public function down(): void {
        DB::table('templates')->where('code', 'template_passport')->delete();
    }
};
