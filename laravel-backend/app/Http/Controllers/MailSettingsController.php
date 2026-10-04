<?php

namespace App\Http\Controllers;

use App\Services\SystemMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailSettingsController extends Controller
{
    public function test(Request $request, SystemMail $mail)
    {
        $data = $request->validate([
            'email' => 'required|email|max:255',
            'mail_enabled' => 'nullable|string',
            'mail_host' => 'nullable|string',
            'mail_port' => 'nullable|integer',
            'mail_username' => 'nullable|string',
            'mail_password' => 'nullable|string',
            'mail_encryption' => 'nullable|string',
            'mail_from_address' => 'nullable|email',
            'mail_from_name' => 'nullable|string',
        ]);
        try {
            $mail->configure($data);
            if (config('mail.default') !== 'smtp') {
                return response()->json(['success' => false, 'message' => 'Vui lòng tích "Bật gửi email qua SMTP" và lưu cấu hình trước khi gửi thử.'], 422);
            }
            Mail::raw('Email thử từ WeddingSaaS. Cấu hình gửi mail của bạn đang hoạt động.', function ($message) use ($data) {
                $message->to($data['email'])->subject('WeddingSaaS — Kiểm tra cấu hình email');
            });
        } catch (\Throwable $e) {
            report($e);
            return response()->json(['success' => false, 'message' => 'Không gửi được email: ' . $e->getMessage()], 502);
        }
        return response()->json(['success' => true, 'message' => 'Gửi email thử thành công! Máy chủ SMTP đã nhận thư, vui lòng kiểm tra hộp thư và thư rác.']);
    }
}

