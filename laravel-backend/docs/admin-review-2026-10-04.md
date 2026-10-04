# Admin workflow review — 2026-10-04

## Verification

- Latest full backend rerun: 39 tests / 257 assertions passed, including the final email-normalization regression assertion.
- Real browser and database: dashboard, templates, users, plans, orders, cards, music and settings load successfully. Template, plan and music edit dialogs open. Reload, Back/Forward and invalid-token access checks pass without JavaScript exceptions.
- Frontend production build passes. Existing bundle-size warnings remain.
- TinyMCE initialization and formatted feature payload were checked separately.
- CRUD, deletion, upload, payment transitions and notifications are verified using an isolated SQLite test database. Real admin data was not edited/deleted for browser checks. Browser test login tokens are revoked afterward.
- Card API regression checks confirm HTTP/network save failures cannot report successful publication, and backend 404s cannot display deleted local drafts.

## Corrections made

1. Only pending orders can be approved/cancelled. Approval grants one purchased-card credit in a locked transaction; repeated approval cannot grant more credits.
2. Checkout reads active catalog prices server-side and uses bank configuration from admin. The purchase UI now displays available paid plans from the catalog.
3. Google Client ID saved in admin is used by both frontend configuration and backend token verification.
4. New-order Telegram notifications now use the saved bot/chat configuration. Provider errors do not roll back an order and do not log bot credentials.
5. Duplicate template/plan codes return validation errors; editing missing music records returns 404.
6. Credit grants reject negative or excessive amounts. Admin user management includes administrators, exposes purchased-credit editing and role switching, and protects self-deletion/self-demotion.
7. User deletion removes associated tokens, orders and cards. Edited emails are normalized consistently with login.
8. Uploaded filenames use MIME-derived extensions. Image uploads accept raster formats/ICO; SVG is excluded because active SVG content requires a separate sanitizer.
9. Saving cards requires authentication and ownership. Save failures are visible; deleted cards do not reappear from a local draft after a backend 404.
10. Expired/revoked admin sessions leave the admin UI. Plan editing includes subtitle, period, description and action label; long dialogs scroll within the viewport.
11. New template/plan codes use a full timestamp rather than its last two digits to reduce collisions.

## Limits

- SMTP, Google and Telegram success/failure paths have automated provider mocks. Real email delivery, Google Console origin/client configuration, and Telegram delivery have not been tested against live providers in this review. No real test message was sent.
- Payment approval is manual; this does not implement bank webhooks or automatic transaction matching.
- Paid credits are granted on approval. Enforcement of all advertised plan limits (including 12-month publication expiry) is outside the verified admin workflows and is not established by this review.
- Browser checks cover desktop admin navigation and edit dialogs, not an exhaustive mobile/accessibility audit or every possible concurrent action.
- Frontend bearer tokens remain in localStorage. This review is not a penetration test of uploaded/embedded card content or the entire application.

## Repeatable checks

From `laravel-backend`: `php artisan test`.

From the project root: `npm run build`, `node tmp/layout-check/card-api-security.mjs`.

Browser scripts: `tmp/layout-check/admin-routes.cjs`, `tmp/layout-check/tinymce-plans.cjs`,
and `tmp/layout-check/admin-live-audit.cjs` (requires `ADMIN_AUDIT_PASSWORD`; does not print the password/token).
