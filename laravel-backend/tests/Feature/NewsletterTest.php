<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class NewsletterTest extends TestCase
{
    public function test_subscription_is_saved_privately_and_deduplicated(): void
    {
        Storage::fake('local');
        $payload = ['email' => 'Bride@example.com', 'consent' => true];
        $this->postJson('/api/public/newsletter', $payload)->assertOk()->assertJson(['success' => true]);
        $this->postJson('/api/public/newsletter', ['email' => 'bride@example.com', 'consent' => true])->assertOk();
        $files = Storage::disk('local')->files('newsletter/subscribers');
        $this->assertCount(1, $files);
        $record = json_decode(Storage::disk('local')->get($files[0]), true);
        $this->assertSame('bride@example.com', $record['email']);
        $this->assertTrue($record['consent']);
    }

    public function test_subscription_requires_valid_email_and_consent(): void
    {
        Storage::fake('local');
        $this->postJson('/api/public/newsletter', ['email' => 'invalid', 'consent' => false])
            ->assertUnprocessable()->assertJsonValidationErrors(['email', 'consent']);
        $this->assertCount(0, Storage::disk('local')->files('newsletter/subscribers'));
    }
}
