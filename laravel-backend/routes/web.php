<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any?}', function () {
    $indexPath = public_path('dist/index.html');
    if (file_exists($indexPath)) {
        return response()->file($indexPath);
    }
    return response('Giao diện đang được cập nhật. Vui lòng tải lại sau ít giây.', 503)
        ->header('Retry-After', '3');
})->where('any', '^(?!api).*$');
