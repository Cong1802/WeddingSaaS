<?php
namespace App\Services;

use App\Models\SystemSetting;

class GoogleSettings
{
    public static function clientId(): ?string
    {
        return SystemSetting::where('key', 'google_client_id')->value('value') ?: config('services.google.client_id');
    }
}
