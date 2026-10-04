<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\SystemSetting;
use App\Services\SystemMail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class MailSettingsTest extends TestCase
{
    use RefreshDatabase;

    private function settings(): array
    {
        return ['mail_enabled' => '1', 'mail_host' => 'smtp.example.com', 'mail_port' => '587',
            'mail_encryption' => 'tls', 'mail_username' => 'sender@example.com',
            'mail_password' => 'test-secret', 'mail_from_address' => 'sender@example.com', 'mail_from_name' => 'WeddingSaaS'];
    }

    public function test_settings_encrypt_and_preserve_password_and_configure_smtp(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']), 'sanctum');
        $this->postJson('/api/admin/settings', $this->settings())->assertOk();
        $stored = SystemSetting::where('key', 'mail_password')->value('value');
        $this->assertNotSame('test-secret', $stored);
        $this->assertSame('test-secret', Crypt::decryptString($stored));
        $response = $this->getJson('/api/admin/settings')->assertOk();
        $this->assertArrayNotHasKey('mail_password', $response->json('settings'));
        $response->assertJsonPath('settings.mail_password_configured', true);
        $this->postJson('/api/admin/settings', [...$this->settings(), 'mail_password' => ''])->assertOk();
        $this->assertSame($stored, SystemSetting::where('key', 'mail_password')->value('value'));
        app(SystemMail::class)->configure();
        $this->assertSame('smtp', config('mail.default'));
        $this->assertSame('smtp.example.com', config('mail.mailers.smtp.host'));
        $this->assertSame('test-secret', config('mail.mailers.smtp.password'));
    }

    public function test_mail_test_requires_admin_and_valid_recipient(): void
    {
        $this->postJson('/api/admin/settings/test-mail', ['email' => 'test@example.com'])->assertUnauthorized();
        $this->actingAs(User::factory()->create(['role' => 'user']), 'sanctum');
        $this->postJson('/api/admin/settings/test-mail', ['email' => 'test@example.com'])->assertForbidden();
        $this->actingAs(User::factory()->create(['role' => 'admin']), 'sanctum');
        $this->postJson('/api/admin/settings/test-mail', ['email' => 'invalid'])->assertUnprocessable();
    }

    public function test_sends_test_mail_and_reports_transport_failure(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']), 'sanctum');
        $this->postJson('/api/admin/settings', $this->settings())->assertOk();
        Mail::shouldReceive('purge')->twice()->with('smtp');
        Mail::shouldReceive('raw')->once()->andReturnNull();
        $this->postJson('/api/admin/settings/test-mail', ['email' => 'test@example.com'])->assertOk()->assertJsonPath('success', true);
        Mail::shouldReceive('raw')->once()->andThrow(new \RuntimeException('SMTP unavailable'));
        $this->postJson('/api/admin/settings/test-mail', ['email' => 'test@example.com'])->assertStatus(502)->assertJsonPath('success', false);
    }
}
