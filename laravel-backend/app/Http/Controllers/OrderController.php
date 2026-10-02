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
            'amount' => 'required|numeric|min:10000',
        ]);

        $user = $request->user();
        $packageName = $validated['package_name'] ?? ($validated['amount'] >= 199000 ? 'Gói VIP 199K' : 'Gói Pro 99K');
        $orderCode = 'PAY_' . strtoupper(Str::random(6));

        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => $orderCode,
            'package_name' => $packageName,
            'amount' => $validated['amount'],
            'status' => 'pending',
            'payment_method' => 'VietQR Bank Transfer',
        ]);

        // VietQR Link Generator
        $bankBin = 'MB';
        $accountNo = '0987654321';
        $accountName = urlencode('DUONG QUANG TUAN');
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
                'account_name' => 'DUONG QUANG TUAN',
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
