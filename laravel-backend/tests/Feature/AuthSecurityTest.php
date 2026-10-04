<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_credentials_cannot_create_admin(): void
    {
        $this->postJson('/api/auth/login', ['email' => 'admin@example.com', 'password' => 'password123'])->assertUnauthorized();
        $this->assertDatabaseCount('users', 0);
    }

    public function test_admin_routes_require_authentication_and_role(): void
    {
        $this->get('/api/admin/stats')->assertUnauthorized();
        $user = User::factory()->create(['role' => 'user']);
        $token = $user->createToken('test')->plainTextToken;
        $this->withToken($token)->getJson('/api/admin/stats')->assertForbidden();
        $this->withToken($token)->postJson('/api/admin/users/'.$user->id.'/toggle-role')->assertForbidden();
        $this->assertSame('user', $user->fresh()->role);
    }

    public function test_expired_and_invalid_tokens_are_rejected(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('expired', ['*'], now()->subMinute())->plainTextToken;
        $this->withToken($token)->getJson('/api/auth/me')->assertUnauthorized();
        $this->withToken('invalid')->getJson('/api/auth/me')->assertUnauthorized();
    }

    public function test_logout_revokes_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $this->withToken($token)->postJson('/api/auth/logout')->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/auth/me')->assertUnauthorized();
    }

    public function test_login_is_rate_limited(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/auth/login', ['email' => 'user@example.com', 'password' => 'wrong'])->assertUnauthorized();
        }
        $this->postJson('/api/auth/login', ['email' => 'USER@example.com', 'password' => 'wrong'])->assertStatus(429);
    }

    public function test_weak_password_and_invalid_identifier_are_rejected(): void
    {
        $this->postJson('/api/auth/register', ['name' => 'Test', 'email' => 'test@example.com', 'password' => '123456'])->assertUnprocessable();
        $this->postJson('/api/auth/register', ['name' => 'Test', 'email' => 'garbage!', 'password' => 'password12345'])->assertUnprocessable();
    }

    public function test_password_change_revokes_all_tokens(): void
    {
        $user = User::factory()->create(['password' => bcrypt('password12345')]);
        $token = $user->createToken('first')->plainTextToken;
        $user->createToken('second');
        $this->withToken($token)->postJson('/api/auth/change-password', [
            'current_password' => 'wrong', 'password' => 'newPassword12345', 'password_confirmation' => 'newPassword12345',
        ])->assertUnprocessable();
        $this->assertDatabaseCount('personal_access_tokens', 2);
        $this->withToken($token)->postJson('/api/auth/change-password', [
            'current_password' => 'password12345', 'password' => 'newPassword12345', 'password_confirmation' => 'newPassword12345',
        ])->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('newPassword12345', $user->fresh()->password));
    }
}
