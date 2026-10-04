<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Services\GoogleIdentity;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * 1. Đăng ký tài khoản bằng Email / Số điện thoại & Mật khẩu
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255',
            'password' => ['required', 'string', 'max:128', Password::min(12)->letters()->numbers()],
        ]);

        $rawEmail = trim($validated['email']);
        // If user typed a phone number or account without @, convert to standard email format
        if (!filter_var($rawEmail, FILTER_VALIDATE_EMAIL)) {
            $rawEmail = $this->phoneEmail($rawEmail);
        }

        if (User::where('email', strtolower($rawEmail))->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc số điện thoại này đã được đăng ký.'
            ], 422);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower($rawEmail),
            'password' => Hash::make($validated['password']),
            'role' => 'user',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . urlencode($validated['name']),
        ]);

        $token = $user->createToken('auth_token', ['*'], now()->addMinutes(720))->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Đăng ký tài khoản thành công!',
            'user' => $user,
            'token' => $token,
        ], 201)->header('Cache-Control', 'no-store');
    }

    /**
     * 2. Đăng nhập với Email / Số điện thoại & Mật khẩu
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|max:255',
            'password' => 'required|string|max:128',
        ]);

        $rawInput = trim($validated['email']);
        $formattedEmail = strtolower($rawInput);

        if (!filter_var($formattedEmail, FILTER_VALIDATE_EMAIL)) {
            $formattedEmail = $this->phoneEmail($rawInput);
        }

        $user = User::where('email', strtolower($rawInput))
            ->orWhere('email', $formattedEmail)
            ->first();

        $matches = Hash::check($validated['password'], $user?->password ?: Hash::make(\Illuminate\Support\Str::random(32)));
        if (!$user || !$user->password || !$matches || ($user->role === 'admin' && $validated['password'] === 'password123')) {
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản (Email/SĐT) hoặc mật khẩu không chính xác.'
            ], 401);
        }

        $token = $user->createToken('auth_token', ['*'], now()->addMinutes(720))->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công!',
            'user' => $user,
            'token' => $token,
        ], 200)->header('Cache-Control', 'no-store');
    }

    /**
     * 3. Đăng nhập / Đăng ký qua Google OAuth
     */
    public function googleLogin(Request $request, GoogleIdentity $google)
    {
        $input = $request->validate(['credential' => 'required|string|max:10000']);
        $identity = $google->verify($input['credential']);
        $user = User::where('google_id', $identity['sub'])->first();
        if (!$user) {
            if (User::where('email', $identity['email'])->exists()) {
                return response()->json(['success' => false, 'message' => 'Email đã có tài khoản. Vui lòng đăng nhập bằng mật khẩu.'], 409);
            }
            $user = User::create([
                'name' => $identity['name'] ?? $identity['email'],
                'email' => $identity['email'], 'google_id' => $identity['sub'], 'role' => 'user',
            ]);
        }
        $token = $user->createToken('auth_token', ['*'], now()->addMinutes(720))->plainTextToken;
        return response()->json(['success' => true, 'user' => $user, 'token' => $token])->header('Cache-Control', 'no-store');
    }

    private function phoneEmail(string $input): string
    {
        if (!preg_match('/^\+?[0-9][0-9 .()-]{7,19}$/', $input)) {
            throw \Illuminate\Validation\ValidationException::withMessages(['email' => 'Email hoặc số điện thoại không hợp lệ.']);
        }
        return preg_replace('/[^0-9]/', '', $input).'@weddingcard.com';
    }

    /**
     * 4. Đăng xuất
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đăng xuất thành công!'
        ], 200)->header('Cache-Control', 'no-store');
    }

    /**
     * 5. Lấy thông tin user hiện tại
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ], 200)->header('Cache-Control', 'no-store');
    }
    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => 'required|string|max:128',
            'password' => ['required', 'confirmed', 'string', 'max:128', Password::min(12)->letters()->numbers()],
        ]);
        $user = $request->user();
        if (!$user->password || !Hash::check($data['current_password'], $user->password)) {
            throw \Illuminate\Validation\ValidationException::withMessages(['current_password' => 'Current password is incorrect.']);
        }
        \Illuminate\Support\Facades\DB::transaction(function () use ($user, $data) {
            $user->update(['password' => Hash::make($data['password'])]);
            $user->tokens()->delete();
        });
        return response()->json(['success' => true, 'message' => 'Password changed. Please sign in again.']);
    }

}
