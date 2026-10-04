<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\JWK;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class GoogleIdentity
{
    public function verify(string $credential): array
    {
        $clientId = GoogleSettings::clientId();
        abort_unless($clientId, 503, 'Google login is not configured.');
        try {
            $keys = Cache::remember('google-signing-keys', 3600, fn () =>
                Http::timeout(5)->get('https://www.googleapis.com/oauth2/v3/certs')->throw()->json());
            $claims = (array) JWT::decode($credential, JWK::parseKeySet($keys, 'RS256'));
        } catch (\Throwable $e) {
            throw ValidationException::withMessages(['credential' => 'Google authentication failed.']);
        }
        if (!in_array($claims['iss'] ?? '', ['accounts.google.com', 'https://accounts.google.com'], true)
            || ($claims['aud'] ?? null) !== $clientId
            || (isset($claims['azp']) && $claims['azp'] !== $clientId)
            || ($claims['exp'] ?? 0) <= time()
            || ($claims['iat'] ?? PHP_INT_MAX) > time() + 60
            || empty($claims['sub']) || !is_string($claims['sub'])
            || ($claims['email_verified'] ?? false) !== true
            || !filter_var($claims['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
            throw ValidationException::withMessages(['credential' => 'Invalid Google identity.']);
        }
        $claims['email'] = strtolower($claims['email']);
        return $claims;
    }
}
