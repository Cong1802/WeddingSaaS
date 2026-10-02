<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WeddingCard;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class WeddingCardController extends Controller
{
    /**
     * 1. API Lưu / Cập nhật Thiệp Cưới từ SaaS Editor
     * Endpoint: POST /api/cards/save
     */
    public function saveCard(Request $request)
    {
        $validated = $request->validate([
            'slug' => 'required|string|max:191',
            'template_id' => 'required|string',
            'card_data' => 'required|array'
        ]);

        $slug = Str::slug($validated['slug']);
        $userId = $request->user() ? $request->user()->id : null;

        $card = WeddingCard::updateOrCreate(
            ['slug' => $slug],
            [
                'user_id' => $userId ?? DB::raw('user_id'),
                'template_id' => $validated['template_id'],
                'card_data' => $validated['card_data']
            ]
        );

        $cardUrl = url("/v/{$card->slug}");

        return response()->json([
            'success' => true,
            'message' => 'Lưu thiệp cưới thành công!',
            'slug' => $card->slug,
            'card_url' => $cardUrl
        ], 200);
    }

    /**
     * 2. API Lấy dữ liệu Thiệp Cưới công khai theo Slug
     * Endpoint: GET /api/cards/view/{slug}
     */
    public function getCardBySlug($slug)
    {
        $card = WeddingCard::where('slug', $slug)->first();

        if (!$card) {
            return response()->json([
                'success' => false,
                'message' => 'Thiệp cưới không tồn tại'
            ], 404);
        }

        $card->increment('views_count');

        return response()->json([
            'success' => true,
            'template_id' => $card->template_id,
            'card_data' => $card->card_data,
            'views_count' => $card->views_count
        ], 200);
    }
}
