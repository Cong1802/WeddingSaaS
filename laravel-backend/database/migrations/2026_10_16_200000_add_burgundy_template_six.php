<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('templates')->insertOrIgnore([
            'code' => 'template_06_burgundy',
            'name' => 'Đỏ Đô & Lời Hẹn',
            'category' => 'Cổ Điển',
            'tag' => 'NEW',
            'thumbnail' => '/templates/mau-thiep-6/assets/thumbnail.webp',
            'file_url' => '/templates/mau-thiep-6/mau-thiep-6.html',
            'price' => 0,
            'is_active' => true,
            'sort_order' => 8,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('templates')->where('code', 'template_06_burgundy')->delete();
    }
};
