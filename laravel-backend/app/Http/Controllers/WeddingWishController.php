<?php

namespace App\Http\Controllers;

use App\Services\WeddingWishNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeddingWishController extends Controller
{
    public function store(Request $request, string $slug, WeddingWishNotification $notification): JsonResponse
    {
        abort_unless(config("wedding_wishes.cards.{$slug}"), 404);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'message' => ['required', 'string', 'max:1000'],
            'source_url' => ['nullable', 'url', 'max:500'],
            'website' => ['nullable', 'string', 'max:0'],
        ]);

        $name = trim($data['name']);
        $message = trim($data['message']);

        if ($name === '' || $message === '') {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng nhập đầy đủ tên và lời chúc.',
            ], 422);
        }

        if (!$notification->send($slug, $name, $message, $data['source_url'] ?? null)) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa gửi được lời chúc. Vui lòng thử lại sau.',
            ], 503);
        }

        return response()->json([
            'success' => true,
            'message' => 'Đã gửi lời chúc. Cảm ơn bạn!',
        ], 201);
    }
}
