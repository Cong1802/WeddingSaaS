<?php

namespace Tests\Feature;

use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WeddingWishTest extends TestCase
{
    public function test_it_sends_a_wedding_wish_to_telegram(): void
    {
        config([
            'wedding_wishes.bot_token' => 'test-token',
            'wedding_wishes.default_chat_id' => '-100123456',
            'wedding_wishes.cards.bacong-thanhthu.chat_id' => '',
        ]);

        Http::fake([
            'api.telegram.org/*' => Http::response(['ok' => true, 'result' => ['message_id' => 1]]),
        ]);

        $response = $this->postJson('/api/wedding-wishes/bacong-thanhthu', [
            'name' => 'Nguyễn Văn A',
            'message' => 'Chúc hai bạn trăm năm hạnh phúc!',
            'source_url' => 'https://weddingsaas.online/bacong-thanhthu/',
            'website' => '',
        ]);

        $response
            ->assertCreated()
            ->assertJson([
                'success' => true,
                'message' => 'Đã gửi lời chúc. Cảm ơn bạn!',
            ]);

        Http::assertSent(function (ClientRequest $request): bool {
            return $request->url() === 'https://api.telegram.org/bottest-token/sendMessage'
                && $request['chat_id'] === '-100123456'
                && str_contains($request['text'], 'Nguyễn Văn A')
                && str_contains($request['text'], 'Chúc hai bạn trăm năm hạnh phúc!')
                && str_contains($request['text'], 'Thiệp nhà trai');
        });
    }

    public function test_it_rejects_unknown_invitation_slugs(): void
    {
        $this->postJson('/api/wedding-wishes/unknown-card', [
            'name' => 'Khách mời',
            'message' => 'Chúc mừng!',
        ])->assertNotFound();
    }

    public function test_it_reports_when_telegram_is_not_configured(): void
    {
        config([
            'wedding_wishes.bot_token' => '',
            'wedding_wishes.default_chat_id' => '',
            'wedding_wishes.cards.thanhthu-bacong.chat_id' => '',
        ]);

        $this->postJson('/api/wedding-wishes/thanhthu-bacong', [
            'name' => 'Khách mời',
            'message' => 'Chúc mừng hạnh phúc!',
        ])
            ->assertStatus(503)
            ->assertJson(['success' => false]);
    }
}
