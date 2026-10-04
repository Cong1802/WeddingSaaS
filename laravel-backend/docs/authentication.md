# Authentication setup

The API uses Sanctum bearer tokens with a 12-hour lifetime. Public registration
always creates a normal user. Admin endpoints require `auth:sanctum` and `admin`.
Login is limited to five requests per account per minute and twenty per IP.
New passwords require at least twelve characters with letters and numbers.

## Deployment

1. Run `composer install` and `php artisan migrate` from `laravel-backend`.
   The authentication migration revokes old sessions, removes Google IDs that
   were never verified, and disables admin passwords matching the old demo
   password. It preserves users and their cards. Existing Google-only users
   can recover access through password reset using their email.
2. Set `APP_URL` to the public HTTPS frontend URL. Configure a real mail
   transport and sender for password reset; the log mailer does not deliver mail.
3. Set `GOOGLE_CLIENT_ID` to the Google OAuth web client ID and configure the
   frontend origin in Google Console. Without this value Google login is disabled.
   The backend verifies signed tokens against Google's public keys and checks
   issuer, audience, expiry and verified email. Existing password accounts are
   never automatically linked to Google.
4. Create or secure an administrator with `php artisan auth:admin EMAIL`.
   The command asks for the password without echoing it and revokes prior tokens.
5. Set `APP_DEBUG=false` in production, serve over HTTPS, and run Laravel's
   scheduler for the daily expired-token cleanup. Clear/rebuild configuration
   cache after changing environment settings.

## Endpoints

- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/auth/config`, `POST /api/auth/google` with `credential` (signed ID token)
- `GET /api/auth/me`, `POST /api/auth/logout` with bearer token
- `POST /api/auth/change-password` with current_password, password and
  password_confirmation; success revokes all tokens.
- `POST /api/auth/forgot-password` with email. Always returns the same success
  response for an existing or unknown email.
- `POST /api/auth/reset-password` with email, token, password and
  password_confirmation. Links expire after sixty minutes and can be used once.
  Success revokes all tokens; the frontend prompts for login again.

Phone identifiers preserve the existing synthetic email mapping. Email recovery
is available for real email accounts; phone recovery requires a separate verified
SMS provider and is not implemented.

The frontend still stores bearer tokens in localStorage. This architecture
requires preventing XSS across all same-origin content; HttpOnly cookie sessions
would require migrating every authenticated frontend API consumer and CSRF
handling. These changes do not constitute a security audit of the card editor,
uploaded content, payments or other application features.

Validation: `php artisan test`, frontend `npm run build`, and `composer audit`.
