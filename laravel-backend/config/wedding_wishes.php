<?php

return [
    'bot_token' => env('TELEGRAM_WEDDING_BOT_TOKEN', ''),

    'default_chat_id' => env('TELEGRAM_WEDDING_CHAT_ID', ''),

    'cards' => [
        'bacong-thanhthu' => [
            'label' => 'Thiệp nhà trai — Bá Công & Thanh Thu',
            'chat_id' => env('TELEGRAM_GROOM_WISH_CHAT_ID', ''),
        ],
        'thanhthu-bacong' => [
            'label' => 'Thiệp nhà gái — Thanh Thu & Bá Công',
            'chat_id' => env('TELEGRAM_BRIDE_WISH_CHAT_ID', ''),
        ],
    ],
];
