<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:254'],
            'consent' => ['required', 'accepted'],
        ]);

        $email = strtolower(trim($validated['email']));
        $path = 'newsletter/subscribers/'.hash('sha256', $email).'.json';
        $disk = Storage::disk('local');

        if (!$disk->exists($path)) {
            $saved = $disk->put($path, json_encode([
                'email' => $email,
                'consent' => true,
                'subscribed_at' => now()->toIso8601String(),
            ], JSON_THROW_ON_ERROR));

            if (!$saved) {
                return response()->json(['success' => false, 'message' => 'Không thể đăng ký lúc này. Vui lòng thử lại sau.'], 503);
            }
        }

        return response()->json(['success' => true, 'message' => 'Đăng ký thành công. Cảm ơn bạn đã đồng hành cùng WeddingSaaS!']);
    }
}
