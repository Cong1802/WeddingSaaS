<?php
namespace App\Services;

use App\Models\TemplateLicense;
use App\Models\WeddingCard;
use App\Models\User;

class CardAccess
{
    public static function status(int $userId, string $templateCode): array
    {
        $license = TemplateLicense::where('user_id', $userId)->where('template_code', $templateCode)->first();
        return ['active' => $license && $license->expires_at->isFuture(), 'expires_at' => $license?->expires_at?->toIso8601String()];
    }

    public static function grant(int $userId, string $templateCode): TemplateLicense
    {
        // Serialize approvals for the same user, including the first license purchase.
        User::whereKey($userId)->lockForUpdate()->firstOrFail();
        $license = TemplateLicense::where('user_id', $userId)->where('template_code', $templateCode)->lockForUpdate()->first();
        $start = $license && $license->expires_at->isFuture() ? $license->expires_at->copy() : now();
        return TemplateLicense::updateOrCreate(['user_id' => $userId, 'template_code' => $templateCode], ['expires_at' => $start->addMonthsNoOverflow(6)]);
    }

    public static function primarySlug(User $user): ?string
    {
        return User::whereKey($user->id)->value('card_slug') ?? WeddingCard::where('user_id', $user->id)->orderBy('id')->value('slug');
    }
}
