<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Auth\Notifications\ResetPassword::createUrlUsing(fn ($user, $token) =>
            rtrim(config('app.url'), '/').'/?'.http_build_query(['reset_token' => $token, 'reset_email' => $user->email]));
        \Illuminate\Auth\Notifications\ResetPassword::toMailUsing(function ($user, $token) {
            $url = rtrim(config('app.url'), '/').'/?'.http_build_query(['reset_token' => $token, 'reset_email' => $user->email]);
            return (new \Illuminate\Notifications\Messages\MailMessage)
                ->subject('WeddingSaaS — Đặt lại mật khẩu')
                ->greeting('Xin chào '.$user->name.'!')
                ->line('Bạn nhận được email này vì đã yêu cầu lấy lại mật khẩu tài khoản WeddingSaaS.')
                ->action('Đặt lại mật khẩu', $url)
                ->line('Liên kết có hiệu lực trong '.config('auth.passwords.users.expire', 60).' phút và chỉ sử dụng một lần.')
                ->line('Nếu bạn không yêu cầu, hãy bỏ qua email này. Mật khẩu hiện tại vẫn được giữ nguyên.')
                ->salutation('WeddingSaaS');
        });
        \Illuminate\Support\Facades\RateLimiter::for('login', function ($request) {
            $identifier = strtolower(trim((string) $request->input('email', '')));
            if (!filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
                $identifier = preg_replace('/[^0-9]/', '', $identifier).'@weddingcard.com';
            }
            return [
                \Illuminate\Cache\RateLimiting\Limit::perMinute(20)->by('ip:'.$request->ip()),
                \Illuminate\Cache\RateLimiting\Limit::perMinute(5)->by('account:'.hash('sha256', $identifier)),
            ];
        });
    }
}
