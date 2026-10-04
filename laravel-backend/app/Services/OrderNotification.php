<?php
namespace App\Services;

use App\Models\Order;
use App\Models\SystemSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OrderNotification
{
    public function send(Order $order): void
    {
        $settings = SystemSetting::whereIn('key', ['telegram_notify_bot_token', 'telegram_chat_id'])->pluck('value', 'key');
        $token = $settings['telegram_notify_bot_token'] ?? '';
        $chat = $settings['telegram_chat_id'] ?? '';
        if (!$token || !$chat) return;
        try {
            $response = Http::timeout(5)->post('https://api.telegram.org/bot'.$token.'/sendMessage', [
                'chat_id' => $chat,
                'text' => "Đơn hàng mới: {$order->order_code}\nGói: {$order->package_name}\nSố tiền: {$order->amount} VND",
            ]);
            if (!$response->successful() || !$response->json('ok')) Log::warning('Order notification was not accepted.', ['order_id' => $order->id]);
        } catch (\Throwable $exception) {
            Log::warning('Order notification transport failed.', ['order_id' => $order->id]);
        }
    }
}
