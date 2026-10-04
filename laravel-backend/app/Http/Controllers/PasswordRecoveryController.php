<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

class PasswordRecoveryController extends Controller
{
    public function forgot(Request $request)
    {
        $data = $request->validate(['email' => 'required|email|max:255']);
        try {
            app(\App\Services\SystemMail::class)->configure();
            Password::sendResetLink(['email' => strtolower(trim($data['email']))]);
        } catch (\Throwable $e) {
            report($e);
            return response()->json(['success' => false, 'message' => 'Dịch vụ gửi email đang gặp sự cố. Vui lòng thử lại sau.'], 503);
        }
        return response()->json(['success' => true, 'message' => 'Nếu email đã đăng ký, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.']);
    }

    public function reset(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email|max:255', 'token' => 'required|string|max:255',
            'password' => ['required', 'confirmed', 'string', 'max:128', PasswordRule::min(12)->letters()->numbers()],
        ]);
        $data['email'] = strtolower(trim($data['email']));
        $status = Password::reset($data, function (User $user, string $password) {
            DB::transaction(function () use ($user, $password) {
                $user->forceFill(['password' => Hash::make($password), 'remember_token' => Str::random(60)])->save();
                $user->tokens()->delete();
            });
        });
        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages(['token' => 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.']);
        }
        return response()->json(['success' => true, 'message' => 'Đã đặt lại mật khẩu. Vui lòng đăng nhập lại.']);
    }
}
