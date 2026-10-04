<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeddingCardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\NewsletterController;

// Public Auth Routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/google', [AuthController::class, 'googleLogin']);

// Public Card & Dynamic Catalog Routes
Route::post('/cards/save', [WeddingCardController::class, 'saveCard']);
Route::get('/cards/view/{slug}', [WeddingCardController::class, 'getCardBySlug']);
Route::get('/public/templates', [AdminController::class, 'getPublicTemplates']);
Route::get('/public/plans', [AdminController::class, 'getPublicPlans']);
Route::get('/public/music', [AdminController::class, 'getPublicMusicTracks']);
Route::get('/public/settings', [AdminController::class, 'getPublicSettings']);
Route::post('/public/newsletter', [NewsletterController::class, 'subscribe'])->middleware('throttle:5,1');

// Authenticated User Routes (Requires Sanctum Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // User My Cards & Orders
    Route::get('/user/cards', [AdminController::class, 'getUserCards']);
    Route::delete('/user/cards/{id}', [AdminController::class, 'deleteMyCard']);
    Route::post('/orders/create', [OrderController::class, 'createOrder']);
    Route::get('/orders/my-orders', [OrderController::class, 'getMyOrders']);

    // Dedicated Admin CMS Routes
    Route::prefix('admin')->group(function () {
        // Analytics
        Route::get('/stats', [AdminController::class, 'getStats']);
        
        // Users Management
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::get('/users/{id}', [AdminController::class, 'getUserDetail']);
        Route::post('/users/{id}/update', [AdminController::class, 'updateUser']);
        Route::post('/users/{id}/toggle-role', [AdminController::class, 'toggleUserRole']);
        Route::post('/users/{id}/grant-credit', [AdminController::class, 'grantCredit']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        
        // Template CMS
        Route::get('/templates', [AdminController::class, 'getTemplates']);
        Route::post('/templates', [AdminController::class, 'saveTemplate']);
        Route::post('/templates/{id}/toggle', [AdminController::class, 'toggleTemplate']);
        Route::delete('/templates/{id}', [AdminController::class, 'deleteTemplate']);
        
        // Plan & Pricing CMS
        Route::get('/plans', [AdminController::class, 'getPlans']);
        Route::post('/plans', [AdminController::class, 'savePlan']);
        Route::post('/plans/{id}/toggle', [AdminController::class, 'togglePlan']);
        Route::delete('/plans/{id}', [AdminController::class, 'deletePlan']);

        // Orders & VietQR
        Route::get('/orders', [AdminController::class, 'getOrders']);
        Route::post('/orders/{id}/approve', [AdminController::class, 'approveOrder']);
        Route::post('/orders/{id}/cancel', [AdminController::class, 'cancelOrder']);

        // Wedding Cards
        Route::get('/cards', [AdminController::class, 'getCards']);
        Route::delete('/cards/{id}', [AdminController::class, 'deleteCard']);

        // Settings
        Route::get('/settings', [AdminController::class, 'getSettings']);
        Route::post('/settings', [AdminController::class, 'saveSettings']);

        // Image Upload
        Route::post('/upload/image', [AdminController::class, 'uploadImageFile']);

        // Music Management & Upload
        Route::get('/music', [AdminController::class, 'getMusicTracks']);
        Route::post('/music', [AdminController::class, 'saveMusicTrack']);
        Route::post('/music/upload', [AdminController::class, 'uploadMusicFile']);
        Route::post('/music/{id}/toggle', [AdminController::class, 'toggleMusicTrack']);
        Route::delete('/music/{id}', [AdminController::class, 'deleteMusicTrack']);
    });
});
