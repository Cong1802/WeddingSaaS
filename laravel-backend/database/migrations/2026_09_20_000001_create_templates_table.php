<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('category')->default('Sang Trọng');
            $table->string('tag')->nullable()->default('HOT');
            $table->text('thumbnail');
            $table->text('file_url')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Seed initial templates
        DB::table('templates')->insert([
            [
                'code' => 'template_01',
                'name' => 'Mẫu 01: Lễ Cưới Hoàng Gia (Đỏ & Vàng)',
                'category' => 'Sang Trọng',
                'tag' => 'HOT',
                'thumbnail' => 'https://static.ladipage.net/644bd195fdccd700206206ea/1784694207141_5878546174374599182_g6112929478382919247_d4a720c5583655cc94927ee40b98547d-20260722043050-kosnr.jpg',
                'file_url' => '/template.html',
                'price' => 99000,
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'template_02',
                'name' => 'Mẫu 02: Thư Mời Số 48 (Tình Yêu & Hoa Anh Đào)',
                'category' => 'Hiện Đại',
                'tag' => 'NEW',
                'thumbnail' => 'https://static.ladipage.net/644bd195fdccd700206206ea/z6640805870113_69d4a5d9fc44ce8c3ed1c4581f63b7b4-20250527163223-3mlxn.jpg',
                'file_url' => '/https___www.lovecard.click_thiepso48/www.lovecard.click/thiepso48.html',
                'price' => 99000,
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'template_03',
                'name' => 'Mẫu 03: European Vintage Floral',
                'category' => 'Cổ Điển',
                'tag' => 'VIP',
                'thumbnail' => 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80',
                'file_url' => '/template.html',
                'price' => 199000,
                'is_active' => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'template_04',
                'name' => 'Mẫu 04: Đêm Tiệc Ánh Sáng (Gold Luxury)',
                'category' => 'Sang Trọng',
                'tag' => 'PRO',
                'thumbnail' => 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&auto=format&fit=crop&q=80',
                'file_url' => '/template.html',
                'price' => 99000,
                'is_active' => true,
                'sort_order' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
