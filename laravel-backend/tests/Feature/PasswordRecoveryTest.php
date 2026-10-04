<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordRecoveryTest extends TestCase
{
    use RefreshDatabase;

    public function test_forgot_password_sends_notification_without_exposing_account(): void
    {
        Notification::fake();
        $user = User::factory()->create();
        $existing = $this->postJson('/api/auth/forgot-password', ['email' => $user->email])->assertOk();
        $missing = $this->postJson('/api/auth/forgot-password', ['email' => 'missing@example.com'])->assertOk();
        $this->assertSame($existing->json(), $missing->json());
        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_reset_token_is_single_use_and_revokes_sessions(): void
    {
        $user = User::factory()->create();
        $user->createToken('old-session');
        $payload = ['email' => $user->email, 'token' => Password::createToken($user),
            'password' => 'newPassword12345', 'password_confirmation' => 'newPassword12345'];
        $this->postJson('/api/auth/reset-password', $payload)->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->postJson('/api/auth/reset-password', $payload)->assertUnprocessable();
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check($payload['password'], $user->fresh()->password));
    }

    public function test_invalid_and_expired_reset_tokens_fail(): void
    {
        $user = User::factory()->create();
        $token = Password::createToken($user);
        $payload = ['email' => $user->email, 'token' => 'invalid',
            'password' => 'newPassword12345', 'password_confirmation' => 'newPassword12345'];
        $this->postJson('/api/auth/reset-password', $payload)->assertUnprocessable();
        $this->travel(61)->minutes();
        $payload['token'] = $token;
        $this->postJson('/api/auth/reset-password', $payload)->assertUnprocessable();
    }
}
