<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WeddingCard;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class WeddingCardController extends Controller
{
    public function selectPrimary(Request $request)
    {
        $data = $request->validate(['card_id' => 'required|integer']);
        DB::transaction(function () use ($request, $data) {
            $user = \App\Models\User::whereKey($request->user()->id)->lockForUpdate()->firstOrFail();
            abort_if(!$user->primary_selection_pending, 409, 'Thiệp chính đã được chọn và URL được giữ cố định.');
            $card = WeddingCard::where('user_id', $user->id)->findOrFail($data['card_id']);
            $user->card_slug = $card->slug;
            $user->primary_selection_pending = false;
            $user->save();
            $payment = \App\Models\Order::where('user_id', $user->id)->where('status', 'completed')->whereNull('template_code')->latest('updated_at')->first();
            if ($payment && !\App\Models\TemplateLicense::where('user_id', $user->id)->where('template_code', $card->template_id)->exists()) {
                \App\Models\TemplateLicense::create(['user_id' => $user->id, 'template_code' => $card->template_id, 'expires_at' => $payment->updated_at->copy()->addMonthsNoOverflow(6)]);
            }
        });
        return response()->json(['success' => true]);
    }

    public function visibility(Request $request)
    {
        $data = $request->validate(['is_published' => 'required|boolean']);
        $slug = \App\Services\CardAccess::primarySlug($request->user());
        $card = WeddingCard::where('user_id', $request->user()->id)->where('slug', $slug)->firstOrFail();
        abort_if(!\App\Services\CardAccess::status($request->user()->id, $card->template_id)['active'], 403, 'Cần gia hạn mẫu trước khi thay đổi hiển thị.');
        $card->update($data);
        return response()->json(['success' => true, 'card' => $card]);
    }
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
        abort_if($slug === '', 422, 'Invalid card slug.');
        $userId = $request->user() ? $request->user()->id : null;
        $existing = WeddingCard::where('slug', $slug)->first();
        abort_if($existing && $existing->user_id !== $userId, 403, 'You cannot edit this card.');

        $card = DB::transaction(function () use ($userId, $slug, $validated) {
            $user = \App\Models\User::whereKey($userId)->lockForUpdate()->firstOrFail();
            $primary = \App\Services\CardAccess::primarySlug($user);
            abort_if($user->primary_selection_pending, 409, 'Hãy chọn thiệp chính trong Thiệp của tôi trước khi lưu.');
            abort_if($primary && $primary !== $slug, 409, 'Mỗi tài khoản chỉ có một URL thiệp cố định.');
            $template = \App\Models\Template::where('code', $validated['template_id'])->first();
            abort_if(!$template, 422, 'Mẫu thiệp không tồn tại.');
            $access = \App\Services\CardAccess::status($user->id, $template->code);
            abort_if(!$access['active'], 403, 'Bạn cần mua hoặc gia hạn mẫu thiệp này để sử dụng trong 6 tháng.');
            abort_if(!$template->is_active && (!$primary || WeddingCard::where('slug', $primary)->value('template_id') !== $template->code), 422, 'Mẫu thiệp đã ngừng bán.');
            $user->card_slug = $primary ?? $slug;
            $user->save();
            $owned = WeddingCard::where('slug', $user->card_slug)->lockForUpdate()->first();
            abort_if($owned && $owned->user_id !== $user->id, 403, 'URL thuộc tài khoản khác.');
            $data = ['user_id' => $user->id, 'template_id' => $template->code, 'card_data' => $validated['card_data']];
            if ($owned) { $owned->update($data); return $owned; }
            try { return WeddingCard::create(['slug' => $user->card_slug, ...$data]); }
            catch (\Illuminate\Database\UniqueConstraintViolationException $error) { abort(409, 'URL vừa được tài khoản khác sử dụng. Vui lòng chọn URL khác.'); }
        });

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

        $owner = $card->user;
        abort_if(!$owner || \App\Services\CardAccess::primarySlug($owner) !== $card->slug, 410, 'Thiệp này đã được lưu trữ.');
        abort_if(!$card->is_published, 404, 'Thiệp hiện không được công khai.');
        abort_if(!\App\Services\CardAccess::status($owner->id, $card->template_id)['active'], 410, 'Mẫu thiệp đã hết hạn hoặc chưa được kích hoạt.');
        $card->increment('views_count');

        return response()->json([
            'success' => true,
            'template_id' => $card->template_id,
            'template' => \App\Models\Template::where('code', $card->template_id)->first(['code', 'name', 'file_url']),
            'card_data' => $card->card_data,
            'views_count' => $card->views_count
        ], 200);
    }
}
