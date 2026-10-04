<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class AuthAndAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_registration_never_grants_admin()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password12345',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'user' => [
                    'email' => 'admin@example.com',
                    'role' => 'user',
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'admin@example.com',
            'role' => 'user',
        ]);
    }

    public function test_user_login()
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'user' => [
                    'email' => 'user@example.com'
                ]
            ]);
        
        $this->assertNotNull($response->json('token'));
    }

    public function test_unverified_google_profile_is_rejected()
    {
        $this->postJson('/api/auth/google', [
            'google_id' => 'fake', 'email' => 'victim@example.com', 'name' => 'Attacker',
        ])->assertUnprocessable();
        $this->assertDatabaseCount('users', 0);
    }

    public function test_create_and_approve_order()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);

        // 1. User creates order
        \Laravel\Sanctum\Sanctum::actingAs($user);
        $createRes = $this->postJson('/api/orders/create', [
            'package_name' => 'Gói Pro 99K',
            'template_code' => 'template_01',
            'amount' => 99000
        ]);

        $createRes->assertStatus(201)
            ->assertJson(['success' => true]);
        
        $orderId = $createRes->json('order.id');

        // 2. Admin approves order
        \Laravel\Sanctum\Sanctum::actingAs($admin);
        $approveRes = $this->postJson("/api/admin/orders/{$orderId}/approve");

        $approveRes->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertEquals('completed', \App\Models\Order::find($orderId)->status);
    }

    public function test_admin_template_and_plan_cms()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        \Laravel\Sanctum\Sanctum::actingAs($admin);

        // 1. Create new Template
        $templateRes = $this->postJson('/api/admin/templates', [
            'code' => 'template_test',
            'name' => 'Mẫu Test CMS',
            'category' => 'Cổ Điển',
            'tag' => 'TEST',
            'thumbnail' => 'https://example.com/thumb.jpg',
            'file_url' => '/template.html',
            'price' => 150000,
            'is_active' => true,
            'sort_order' => 5
        ]);

        $templateRes->assertStatus(200)->assertJson(['success' => true]);
        $this->assertDatabaseHas('templates', ['code' => $templateRes->json('template.code'), 'name' => 'Mẫu Test CMS']);

        // 2. Create new Plan
        $planRes = $this->postJson('/api/admin/plans', [
            'code' => 'test_plan',
            'name' => 'Gói Test CMS',
            'price' => 299000,
            'period' => '1 thiệp',
            'description' => 'Mô tả gói test',
            'features' => ['Tính năng 1', 'Tính năng 2'],
            'is_popular' => true,
            'is_active' => true
        ]);

        $planRes->assertStatus(200)->assertJson(['success' => true]);
        $this->assertDatabaseHas('plans', ['code' => 'test_plan']);

        // 3. Update Settings
        $settingRes = $this->postJson('/api/admin/settings', [
            'vietqr_bank_bin' => 'VCB',
            'vietqr_account_no' => '9999999999',
            'vietqr_account_name' => 'ADMIN TEST'
        ]);

        $settingRes->assertStatus(200)->assertJson(['success' => true]);
        $this->assertDatabaseHas('system_settings', ['key' => 'vietqr_bank_bin', 'value' => 'VCB']);
    }

    public function test_admin_music_cms()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        \Laravel\Sanctum\Sanctum::actingAs($admin);

        // 1. Create Music Track
        $createRes = $this->postJson('/api/admin/music', [
            'title' => 'Bài Nhạc Thử Nghiệm',
            'artist' => 'Ca Sĩ Mẫu',
            'url' => 'https://example.com/song.mp3',
            'is_active' => true,
            'sort_order' => 1
        ]);
        $createRes->assertStatus(200)->assertJson(['success' => true]);
        $this->assertDatabaseHas('music_tracks', ['title' => 'Bài Nhạc Thử Nghiệm']);

        // 2. Fetch Music Tracks
        $getRes = $this->getJson('/api/admin/music');
        $getRes->assertStatus(200)->assertJson(['success' => true]);

        // 3. Public Music List
        $publicRes = $this->getJson('/api/public/music');
        $publicRes->assertStatus(200)->assertJson(['success' => true]);
    }
}

