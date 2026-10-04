<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * 1. Tạo đơn hàng Mua Thiệp mới
     * Endpoint: POST /api/orders/create
     */
    public function createOrder(Request $request)
    {
        $validated = $request->validate([
            'package_name' => 'nullable|string',
            'amount' => 'required_without:plan_code|numeric|min:10000',
            'plan_code' => 'nullable|string|max:100',
            'template_code' => 'required|string|max:100',
        ]);

        $user = $request->user();
        $template = \App\Models\Template::where('code', $validated['template_code'])->where('is_active', true)->first();
        if (!$template) throw \Illuminate\Validation\ValidationException::withMessages(['template_code' => 'Mẫu thiệp không còn được bán.']);
        $plan = !empty($validated['plan_code'])
            ? \App\Models\Plan::where('code', $validated['plan_code'])->where('is_active', true)->first()
            : \App\Models\Plan::where('price', $validated['amount'])->where('is_active', true)->first();
        if (!$plan || $plan->price < 10000) {
            throw \Illuminate\Validation\ValidationException::withMessages(['plan_code' => 'Please select an available paid plan.']);
        }
        $packageName = mb_substr($plan->name.' · '.$template->name.' · 6 tháng', 0, 255);
        $orderCode = 'PAY_' . strtoupper(Str::random(6));

        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => $orderCode,
            'package_name' => $packageName,
            'amount' => $plan->price,
            'status' => 'pending',
            'payment_method' => 'VietQR Bank Transfer',
            'template_code' => $template->code,
            'plan_code' => $plan->code,
        ]);

        app(\App\Services\OrderNotification::class)->send($order);

        // VietQR Link Generator
        $settings = \App\Models\SystemSetting::whereIn('key', ['vietqr_bank_bin', 'vietqr_account_no', 'vietqr_account_name'])->pluck('value', 'key');
        $bankBin = $settings['vietqr_bank_bin'] ?? 'MB';
        $accountNo = $settings['vietqr_account_no'] ?? '0987654321';
        $bankBin = rawurlencode($bankBin);
        $accountNo = rawurlencode($accountNo);
        $recipientName = $settings['vietqr_account_name'] ?? 'DUONG QUANG TUAN';
        $accountName = urlencode($recipientName);
        $addInfo = urlencode("THANHTOAN_{$orderCode}");

        $qrUrl = "https://img.vietqr.io/image/{$bankBin}-{$accountNo}-compact2.png?amount={$order->amount}&addInfo={$addInfo}&accountName={$accountName}";

        return response()->json([
            'success' => true,
            'message' => 'Tạo đơn hàng thanh toán thành công!',
            'order' => $order,
            'qr_url' => $qrUrl,
            'bank_info' => [
                'bank_name' => 'Ngân hàng Quân Đội (MB Bank)',
                'account_no' => $accountNo,
                'account_name' => $recipientName,
                'amount' => $order->amount,
                'transfer_content' => "THANHTOAN_{$orderCode}"
            ]
        ], 201);
    }

    /**
     * 2. Xem lịch sử đơn hàng cá nhân
     */
    public function getMyOrders(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders,
            'paid_credits' => $request->user()->paid_credits
        ], 200);
    }
}
