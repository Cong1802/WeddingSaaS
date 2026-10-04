<?php

namespace Tests\Feature;

use App\Models\SystemSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicBrandingTest extends TestCase
{
    use RefreshDatabase;

    public function test_logo_is_public_without_exposing_private_settings(): void
    {
        foreach (['site_logo' => '/storage/logo.png', 'google_client_secret' => 'private-google',
            'telegram_notify_bot_token' => 'private-telegram', 'future_secret' => 'private'] as $key => $value) {
            SystemSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
        $this->getJson('/api/public/settings')->assertOk()->assertJsonPath('settings.site_logo', '/storage/logo.png')
            ->assertJsonMissingPath('settings.google_client_secret')
            ->assertJsonMissingPath('settings.telegram_notify_bot_token')->assertJsonMissingPath('settings.future_secret');
    }
}
