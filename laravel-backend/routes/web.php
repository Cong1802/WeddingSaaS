<?php

use App\Http\Controllers\SeoPageController;
use Illuminate\Support\Facades\Route;

Route::redirect('/template.html', '/templates/mau-thiep-1/mau-thiep-1.html', 302);
Route::redirect('/https___www.lovecard.click_thiepso48/www.lovecard.click/thiepso48.html', '/templates/mau-thiep-2/mau-thiep-2.html', 302);
Route::redirect('/templates/minimalism_red/minimalism_red.html', '/templates/mau-thiep-3/mau-thiep-3.html', 302);
Route::redirect('/templates/passport/index.html', '/templates/mau-thiep-4/mau-thiep-4.html', 302);
Route::redirect('/templates/pearl/pearl.html', '/templates/mau-thiep-5/mau-thiep-5.html', 302);

Route::get('/sitemap.xml', [SeoPageController::class, 'sitemap']);
Route::get('/{any?}', [SeoPageController::class, 'page'])->where('any', '^(?!api).*$');
