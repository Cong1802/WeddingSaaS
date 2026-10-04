<?php

namespace Tests\Feature;

use Firebase\JWT\JWT;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GoogleIdentityTest extends TestCase
{
    use RefreshDatabase;

    private function credential(array $overrides = []): string
    {
        config(['services.google.client_id' => 'test-client']);
        $options = ['config' => base_path('tests/Fixtures/openssl.cnf'), 'private_key_bits' => 2048, 'private_key_type' => OPENSSL_KEYTYPE_RSA];
        $key = openssl_pkey_new($options);
        openssl_pkey_export($key, $private, null, $options);
        $rsa = openssl_pkey_get_details($key)['rsa'];
        $encode = fn ($value) => rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
        Http::fake(['https://www.googleapis.com/oauth2/v3/certs' => Http::response(['keys' => [[
            'kty' => 'RSA', 'kid' => 'test-key', 'alg' => 'RS256', 'use' => 'sig',
            'n' => $encode($rsa['n']), 'e' => $encode($rsa['e']),
        ]]])]);
        return JWT::encode(array_merge([
            'iss' => 'https://accounts.google.com', 'aud' => 'test-client', 'sub' => '123456789',
            'iat' => time(), 'exp' => time() + 600, 'email' => 'google@example.com',
            'email_verified' => true, 'name' => 'Google User',
        ], $overrides), $private, 'RS256', 'test-key');
    }

    public function test_verified_google_token_creates_normal_user(): void
    {
        $this->postJson('/api/auth/google', ['credential' => $this->credential()])
            ->assertOk()->assertJsonPath('user.role', 'user')->assertJsonPath('user.email', 'google@example.com');
    }

    public function test_wrong_audience_expired_and_unverified_tokens_fail(): void
    {
        foreach ([['aud' => 'attacker-client'], ['exp' => time() - 1], ['email_verified' => false], ['iss' => 'attacker']] as $claims) {
            \Illuminate\Support\Facades\Cache::forget('google-signing-keys');
            $this->postJson('/api/auth/google', ['credential' => $this->credential($claims)])->assertUnprocessable();
        }
        $this->assertDatabaseCount('users', 0);
    }

    public function test_forged_signature_fails(): void
    {
        $token = $this->credential();
        $parts = explode('.', $token);
        $parts[2] = str_repeat('A', strlen($parts[2]));
        $this->postJson('/api/auth/google', ['credential' => implode('.', $parts)])->assertUnprocessable();
    }

    public function test_google_does_not_silently_link_password_account(): void
    {
        $user = \App\Models\User::factory()->create(['email' => 'google@example.com', 'role' => 'admin']);
        $this->postJson('/api/auth/google', ['credential' => $this->credential()])->assertStatus(409);
        $this->assertNull($user->fresh()->google_id);
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
