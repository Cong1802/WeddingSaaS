<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WeddingWishNotification
{
    public function send(string $slug, string $name, string $message, ?string $sourceUrl = null): bool
    {
        $token = (string) config('wedding_wishes.bot_token', '');
        $card = config("wedding_wishes.cards.{$slug}");

        if (!is_array($card)) {
            return false;
        }

        $chatId = (string) ($card['chat_id'] ?: config('wedding_wishes.default_chat_id', ''));
        if ($token === '' || $chatId === '') {
            Log::warning('Wedding wish Telegram notification is not configured.', ['slug' => $slug]);
            return false;
        }

        $lines = [
            '💌 LỜI CHÚC CƯỚI MỚI',
            '',
            'Thiệp: '.($card['label'] ?? $slug),
            'Người gửi: '.$name,
            'Lời chúc: '.$message,
        ];

        if ($sourceUrl) {
            $lines[] = 'Trang: '.$sourceUrl;
        }

        try {
            $response = Http::asForm()
                ->acceptJson()
                ->timeout(8)
                ->post("https://api.telegram.org/bot{$token}/sendMessage", [
                    'chat_id' => $chatId,
                    'text' => implode("\n", $lines),
                    'disable_web_page_preview' => true,
                ]);

            if ($response->successful() && $response->json('ok') === true) {
                return true;
            }

            Log::warning('Wedding wish Telegram notification was rejected.', [
                'slug' => $slug,
                'status' => $response->status(),
                'description' => $response->json('description'),
            ]);
        } catch (\Throwable $exception) {
            Log::warning('Wedding wish Telegram notification failed.', [
                'slug' => $slug,
                'exception' => $exception::class,
            ]);
        }

        return false;
    }
}
