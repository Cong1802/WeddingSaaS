<?php

use App\Http\Controllers\SeoPageController;
use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', [SeoPageController::class, 'sitemap']);
Route::get('/{any?}', [SeoPageController::class, 'page'])->where('any', '^(?!api).*$');
