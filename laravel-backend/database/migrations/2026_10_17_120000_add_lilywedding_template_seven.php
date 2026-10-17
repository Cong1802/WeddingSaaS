<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('templates')->insertOrIgnore([
            'code' => 'template_lilywedding_m2',
            'name' => 'Sắc Lily – Chiến Công & Thùy Tiên',
            'category' => 'Hoa Cưới',
            'tag' => 'NEW',
            'thumbnail' => '/templates/mau-thiep-7/assets/thumbnail.webp',
            'file_url' => '/templates/mau-thiep-7/mau-thiep-7.html',
            'price' => 0,
            'is_active' => true,
            'sort_order' => 9,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('templates')->where('code', 'template_lilywedding_m2')->delete();
    }
};
