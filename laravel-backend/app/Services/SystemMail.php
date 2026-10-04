<?php

namespace App\Services;

use App\Models\SystemSetting;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;

class SystemMail
{
    public function configure(?array $overrides = null): void
    {
        $dbSettings = SystemSetting::where('key', 'like', 'mail_%')->pluck('value', 'key')->toArray();

        $settings = array_merge($dbSettings, array_filter([
            'mail_enabled' => $overrides['mail_enabled'] ?? null,
            'mail_host' => $overrides['mail_host'] ?? null,
            'mail_port' => isset($overrides['mail_port']) ? (string)$overrides['mail_port'] : null,
            'mail_encryption' => $overrides['mail_encryption'] ?? null,
            'mail_username' => $overrides['mail_username'] ?? null,
            'mail_from_address' => $overrides['mail_from_address'] ?? null,
            'mail_from_name' => $overrides['mail_from_name'] ?? null,
        ], fn ($v) => $v !== null && $v !== ''));

        $enabled = $overrides['mail_enabled'] ?? ($dbSettings['mail_enabled'] ?? '0');
        if ($enabled !== '1') {
            return;
        }

        $overridePassword = $overrides['mail_password'] ?? '';
        if ($overridePassword !== '' && $overridePassword !== '********' && $overridePassword !== '••••••••') {
            $password = $overridePassword;
        } else {
            $dbPassword = $dbSettings['mail_password'] ?? '';
            $password = $dbPassword !== '' ? Crypt::decryptString($dbPassword) : '';
        }

        $encryption = $settings['mail_encryption'] ?? 'tls';
        $scheme = $encryption === 'ssl' ? 'smtps' : 'smtp';

        config([
            'mail.default' => 'smtp',
            'mail.mailers.smtp.transport' => 'smtp',
            'mail.mailers.smtp.url' => null,
            'mail.mailers.smtp.host' => $settings['mail_host'] ?? 'smtp.gmail.com',
            'mail.mailers.smtp.port' => (int) ($settings['mail_port'] ?? 587),
            'mail.mailers.smtp.scheme' => $scheme,
            'mail.mailers.smtp.encryption' => $encryption === 'none' ? null : $encryption,
            'mail.mailers.smtp.require_tls' => $encryption === 'tls',
            'mail.mailers.smtp.auto_tls' => $encryption !== 'none',
            'mail.mailers.smtp.username' => $settings['mail_username'] ?? null,
            'mail.mailers.smtp.password' => $password ?: null,
            'mail.mailers.smtp.timeout' => 15,
            'mail.from.address' => $settings['mail_from_address'] ?? ($settings['mail_username'] ?? 'no-reply@example.com'),
            'mail.from.name' => $settings['mail_from_name'] ?? 'WeddingSaaS',
        ]);

        Mail::purge('smtp');
    }
}

