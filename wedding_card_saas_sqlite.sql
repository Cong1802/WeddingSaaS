PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

-- Table structure for migrations
DROP TABLE IF EXISTS "migrations";
CREATE TABLE "migrations" ("id" integer primary key autoincrement not null, "migration" varchar not null, "batch" integer not null);
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('1', '0001_01_01_000000_create_users_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('2', '0001_01_01_000001_create_cache_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('3', '0001_01_01_000002_create_jobs_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('4', '2026_09_19_000000_create_wedding_cards_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('5', '2026_09_19_150420_create_personal_access_tokens_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('6', '2026_09_20_000000_create_orders_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('7', '2026_09_20_000001_create_templates_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('8', '2026_09_20_000002_create_plans_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('9', '2026_09_20_000003_create_system_settings_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('10', '2026_09_20_000004_create_music_tracks_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('11', '2026_09_20_000005_add_phone_to_users_table', '1');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('12', '2026_10_04_000000_revoke_legacy_authentication', '2');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('13', '2026_10_04_100000_add_template_licenses', '3');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('14', '2026_10_04_110000_align_catalog_with_six_month_licenses', '4');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('15', '2026_10_14_100000_add_passport_template', '5');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('16', '2026_10_14_110000_create_card_rsvps_table', '6');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('17', '2026_10_14_120000_enable_template_demo_catalog', '7');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('18', '2026_10_14_130000_number_template_names', '8');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('19', '2026_10_14_140000_consolidate_template_paths', '9');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('20', '2026_10_16_200000_add_burgundy_template_six', '10');
INSERT INTO "migrations" ("id", "migration", "batch") VALUES ('21', '2026_10_17_120000_add_lilywedding_template_seven', '11');

-- Table structure for users
DROP TABLE IF EXISTS "users";
CREATE TABLE "users" ("id" integer primary key autoincrement not null, "name" varchar not null, "email" varchar not null, "email_verified_at" datetime, "password" varchar, "avatar" varchar, "google_id" varchar, "role" varchar check ("role" in ('admin', 'user')) not null default 'user', "paid_credits" integer not null default '0', "remember_token" varchar, "created_at" datetime, "updated_at" datetime, "phone" varchar, "card_slug" varchar, "primary_selection_pending" tinyint(1) not null default '0');
INSERT INTO "users" ("id", "name", "email", "email_verified_at", "password", "avatar", "google_id", "role", "paid_credits", "remember_token", "created_at", "updated_at", "phone", "card_slug", "primary_selection_pending") VALUES ('1', 'Quản Trị Viên (Admin)', 'admin@example.com', NULL, '$2y$12$ZjfB9F62MVCv9N6o9iNhvu5OCOEfJddyF0evv5JCJWYS6ffwI7zTu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', NULL, 'admin', '9999', NULL, '2026-10-04 03:45:42', '2026-10-04 04:03:26', NULL, NULL, '0');
INSERT INTO "users" ("id", "name", "email", "email_verified_at", "password", "avatar", "google_id", "role", "paid_credits", "remember_token", "created_at", "updated_at", "phone", "card_slug", "primary_selection_pending") VALUES ('2', 'Quản Trị Viên (Gmail Admin)', 'admin@gmail.com', NULL, NULL, 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminGmail', NULL, 'admin', '9999', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42', NULL, NULL, '0');
INSERT INTO "users" ("id", "name", "email", "email_verified_at", "password", "avatar", "google_id", "role", "paid_credits", "remember_token", "created_at", "updated_at", "phone", "card_slug", "primary_selection_pending") VALUES ('3', '3245345', 'superadmin@acculance.com', NULL, '$2y$12$odI6URYD3mtYapEMCefU6eadN6oQJVb76rQUUEFdltbrxurqFGz/6', 'https://api.dicebear.com/7.x/avataaars/svg?seed=3245345', NULL, 'user', '0', NULL, '2026-10-04 03:58:53', '2026-10-04 03:58:53', NULL, NULL, '0');
INSERT INTO "users" ("id", "name", "email", "email_verified_at", "password", "avatar", "google_id", "role", "paid_credits", "remember_token", "created_at", "updated_at", "phone", "card_slug", "primary_selection_pending") VALUES ('4', '2234324', 'conguyen6262@gmail.com', NULL, '$2y$12$NF.v1tbEnrTWD0Z5GsE2zewV5xr93TdppELyUG0/xUOBuiS6tXXAy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=2234324', NULL, 'user', '0', NULL, '2026-10-04 04:15:40', '2026-10-04 04:15:40', NULL, NULL, '0');

-- Table structure for password_reset_tokens
DROP TABLE IF EXISTS "password_reset_tokens";
CREATE TABLE "password_reset_tokens" ("email" varchar not null, "token" varchar not null, "created_at" datetime, primary key ("email"));
INSERT INTO "password_reset_tokens" ("email", "token", "created_at") VALUES ('superadmin@acculance.com', '$2y$12$/vnkvn5Vycf8BWnEN6dqKu/EP89zUY32fL8kOMBlM0iq3JKqiZpnK', '2026-10-04 04:10:01');

-- Table structure for sessions
DROP TABLE IF EXISTS "sessions";
CREATE TABLE "sessions" ("id" varchar not null, "user_id" integer, "ip_address" varchar, "user_agent" text, "payload" text not null, "last_activity" integer not null, primary key ("id"));
INSERT INTO "sessions" ("id", "user_id", "ip_address", "user_agent", "payload", "last_activity") VALUES ('K9vifuR5jmrpqSbINkHlbhhSapzrjFDrjjMVSqN1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib2NvNXFBdzBKYmpvVzlXU0pDWnF5MHE4djI0Nk05QjBjRFVEVDBtOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC8ud2VsbC1rbm93bi9hcHBzcGVjaWZpYy9jb20uY2hyb21lLmRldnRvb2xzLmpzb24iO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', '1792259797');
INSERT INTO "sessions" ("id", "user_id", "ip_address", "user_agent", "payload", "last_activity") VALUES ('0Hf2hG87FS5UOIqplM0505TP9S5LaTx8wEfthn2U', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibGJDd1M4RExsUHN5UEo0TDBKYXN6ZmYwUGdBU0J6dWdiRFdZSjMwRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC8ud2VsbC1rbm93bi9hcHBzcGVjaWZpYy9jb20uY2hyb21lLmRldnRvb2xzLmpzb24iO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', '1792256850');
INSERT INTO "sessions" ("id", "user_id", "ip_address", "user_agent", "payload", "last_activity") VALUES ('RkZhAS1Nzi2xFOeE8J9uEfRRi0FJ1NFjJU60QICU', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.9711', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiaTJ5WElVS2d2R3F4emtZRFd4SDg1OE50aE4zcTJMdUxDUkJlZVg4RCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1792257286');
INSERT INTO "sessions" ("id", "user_id", "ip_address", "user_agent", "payload", "last_activity") VALUES ('96bj2ytD2bcdjuxgzuh7NsxBxpCiWYaVOgFupoDa', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ05TWjg1Ylp0aDFZcGE1Y3R5Z05SWXpPYk1OZURSNVhTZXJKNlFMeiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC8ud2VsbC1rbm93bi9hcHBzcGVjaWZpYy9jb20uY2hyb21lLmRldnRvb2xzLmpzb24iO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', '1792280768');
INSERT INTO "sessions" ("id", "user_id", "ip_address", "user_agent", "payload", "last_activity") VALUES ('VN1ByFY4cr8LUe7kCa7s5y4gaARvx7u0iq9zN4ZE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVm13Z3UzbmpJaFQ2YTdsTE1zVWY2SVlRcDJHaFpkV0hoU2FQQkZxZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC8ud2VsbC1rbm93bi9hcHBzcGVjaWZpYy9jb20uY2hyb21lLmRldnRvb2xzLmpzb24iO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', '1792282692');

-- Table structure for cache
DROP TABLE IF EXISTS "cache";
CREATE TABLE "cache" ("key" varchar not null, "value" text not null, "expiration" integer not null, primary key ("key"));
INSERT INTO "cache" ("key", "value", "expiration") VALUES ('laravel-cache-5742ca915daeeb569f3cd255dd3410d6:timer', 'i:1791087202;', '1791087202');
INSERT INTO "cache" ("key", "value", "expiration") VALUES ('laravel-cache-5742ca915daeeb569f3cd255dd3410d6', 'i:2;', '1791087202');
INSERT INTO "cache" ("key", "value", "expiration") VALUES ('laravel-cache-356a192b7913b04c54574d18c28d46e6395428ab:timer', 'i:1791089301;', '1791089301');
INSERT INTO "cache" ("key", "value", "expiration") VALUES ('laravel-cache-356a192b7913b04c54574d18c28d46e6395428ab', 'i:1;', '1791089301');
INSERT INTO "cache" ("key", "value", "expiration") VALUES ('laravel-cache-5c785c036466adea360111aa28563bfd556b5fba:timer', 'i:1791114044;', '1791114044');
INSERT INTO "cache" ("key", "value", "expiration") VALUES ('laravel-cache-5c785c036466adea360111aa28563bfd556b5fba', 'i:1;', '1791114044');
INSERT INTO "cache" ("key", "value", "expiration") VALUES ('laravel-cache-6ceef7de01c0f76a85b2850b84b36aef:timer', 'i:1791290179;', '1791290179');
INSERT INTO "cache" ("key", "value", "expiration") VALUES ('laravel-cache-6ceef7de01c0f76a85b2850b84b36aef', 'i:1;', '1791290179');
INSERT INTO "cache" ("key", "value", "expiration") VALUES ('laravel-cache-df19666b7fea5eb4fda6d2b497176ef3:timer', 'i:1791396753;', '1791396753');
INSERT INTO "cache" ("key", "value", "expiration") VALUES ('laravel-cache-df19666b7fea5eb4fda6d2b497176ef3', 'i:1;', '1791396753');
INSERT INTO "cache" ("key", "value", "expiration") VALUES ('laravel-cache-02ccf430a916f22510651cc3a209cf4a:timer', 'i:1791983167;', '1791983167');
INSERT INTO "cache" ("key", "value", "expiration") VALUES ('laravel-cache-02ccf430a916f22510651cc3a209cf4a', 'i:1;', '1791983167');
INSERT INTO "cache" ("key", "value", "expiration") VALUES ('laravel-cache-e2128a2a636a476a377b02b0b3e55fdd:timer', 'i:1792068859;', '1792068859');
INSERT INTO "cache" ("key", "value", "expiration") VALUES ('laravel-cache-e2128a2a636a476a377b02b0b3e55fdd', 'i:1;', '1792068859');
INSERT INTO "cache" ("key", "value", "expiration") VALUES ('laravel-cache-2ebe8723de08b61faa5fe16bb552de0d:timer', 'i:1792068860;', '1792068860');
INSERT INTO "cache" ("key", "value", "expiration") VALUES ('laravel-cache-2ebe8723de08b61faa5fe16bb552de0d', 'i:1;', '1792068860');

-- Table structure for cache_locks
DROP TABLE IF EXISTS "cache_locks";
CREATE TABLE "cache_locks" ("key" varchar not null, "owner" varchar not null, "expiration" integer not null, primary key ("key"));

-- Table structure for jobs
DROP TABLE IF EXISTS "jobs";
CREATE TABLE "jobs" ("id" integer primary key autoincrement not null, "queue" varchar not null, "payload" text not null, "attempts" integer not null, "reserved_at" integer, "available_at" integer not null, "created_at" integer not null);

-- Table structure for job_batches
DROP TABLE IF EXISTS "job_batches";
CREATE TABLE "job_batches" ("id" varchar not null, "name" varchar not null, "total_jobs" integer not null, "pending_jobs" integer not null, "failed_jobs" integer not null, "failed_job_ids" text not null, "options" text, "cancelled_at" integer, "created_at" integer not null, "finished_at" integer, primary key ("id"));

-- Table structure for failed_jobs
DROP TABLE IF EXISTS "failed_jobs";
CREATE TABLE "failed_jobs" ("id" integer primary key autoincrement not null, "uuid" varchar not null, "connection" text not null, "queue" text not null, "payload" text not null, "exception" text not null, "failed_at" datetime not null default CURRENT_TIMESTAMP);

-- Table structure for wedding_cards
DROP TABLE IF EXISTS "wedding_cards";
CREATE TABLE "wedding_cards" ("id" integer primary key autoincrement not null, "user_id" integer, "slug" varchar not null, "template_id" varchar not null default 'template_01', "card_data" text not null, "is_published" tinyint(1) not null default '1', "views_count" integer not null default '0', "created_at" datetime, "updated_at" datetime, foreign key("user_id") references "users"("id") on delete cascade);

-- Table structure for personal_access_tokens
DROP TABLE IF EXISTS "personal_access_tokens";
CREATE TABLE "personal_access_tokens" ("id" integer primary key autoincrement not null, "tokenable_type" varchar not null, "tokenable_id" integer not null, "name" text not null, "token" varchar not null, "abilities" text, "last_used_at" datetime, "expires_at" datetime, "created_at" datetime, "updated_at" datetime);
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES ('4', 'App\Models\User', '1', 'auth_token', 'e7bfcd582d478843a69866498f61f3e86d99daa50bdc5bfd880694d951da31dd', '["*"]', '2026-10-04 04:12:15', '2026-10-04 16:07:17', '2026-10-04 04:07:17', '2026-10-04 04:12:15');
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES ('5', 'App\Models\User', '4', 'auth_token', 'e18bd7d29b233381886160c42b62fab009115c3f023af6c4603889d3122919da', '["*"]', '2026-10-04 04:21:22', '2026-10-04 16:15:40', '2026-10-04 04:15:40', '2026-10-04 04:21:22');
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES ('12', 'App\Models\User', '4', 'auth_token', 'b49790c8efc17f4f746232493dbdaeb9762210b2bd7579368ffc0300bec9e38e', '["*"]', '2026-10-04 06:50:40', '2026-10-04 17:10:19', '2026-10-04 05:10:19', '2026-10-04 06:50:40');
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES ('13', 'App\Models\User', '1', 'auth_token', '4d2fa447018e65a0badb446a20bc2e305c9f45523932acd8c645e38710368db7', '["*"]', '2026-10-04 05:19:52', '2026-10-04 17:18:29', '2026-10-04 05:18:29', '2026-10-04 05:19:52');
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES ('15', 'App\Models\User', '4', 'auth_token', '61f6ba9cd81986b19acbf3db9b7ac7d6a52bf61634e62c1ce72eb3f80ec43a04', '["*"]', '2026-10-04 08:15:32', '2026-10-04 20:14:26', '2026-10-04 08:14:26', '2026-10-04 08:15:32');
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES ('16', 'App\Models\User', '4', 'auth_token', '7045a6fdd54fe0ded71bce992018df5e1978d820e668000e63b104dfcf18695f', '["*"]', '2026-10-04 12:34:17', '2026-10-04 23:39:58', '2026-10-04 11:39:58', '2026-10-04 12:34:17');
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES ('17', 'App\Models\User', '1', 'auth_token', 'db0edd6449201aac4c8730dc92e587d764d9687097228b4a178123749b246fe5', '["*"]', '2026-10-04 12:17:08', '2026-10-05 00:17:05', '2026-10-04 12:17:05', '2026-10-04 12:17:08');
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES ('18', 'App\Models\User', '4', 'auth_token', 'b6620f616447c122d287d6fb7d2fc27744e88b9334a42ba997738bc2dea02c53', '["*"]', '2026-10-06 16:58:53', '2026-10-07 00:35:29', '2026-10-06 12:35:30', '2026-10-06 16:58:53');
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES ('19', 'App\Models\User', '4', 'auth_token', '314791d4e5d5347628a798523758e12696185bddace0df5e20fdf5bcc88c1784', '["*"]', '2026-10-07 18:38:14', '2026-10-08 06:11:35', '2026-10-07 18:11:35', '2026-10-07 18:38:14');
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES ('20', 'App\Models\User', '1', 'auth_token', '850d73a99ea1b4c89508641572e1a1f2b4727b7e87964ba19fa8ce9c0ea619c4', '["*"]', '2026-10-14 15:21:53', '2026-10-15 01:05:36', '2026-10-14 13:05:37', '2026-10-14 15:21:53');
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES ('21', 'App\Models\User', '1', 'auth_token', '96efe75296321454984f67648b851a6774cedc9bd0b709a7bd78bf9fc155d80d', '["*"]', '2026-10-15 14:29:24', '2026-10-16 00:53:20', '2026-10-15 12:53:21', '2026-10-15 14:29:24');

-- Table structure for orders
DROP TABLE IF EXISTS "orders";
CREATE TABLE "orders" ("id" integer primary key autoincrement not null, "user_id" integer not null, "order_code" varchar not null, "package_name" varchar not null default 'Gói Pro 99K', "amount" integer not null default '99000', "status" varchar check ("status" in ('pending', 'completed', 'cancelled')) not null default 'pending', "payment_method" varchar not null default 'VietQR Bank Transfer', "created_at" datetime, "updated_at" datetime, "template_code" varchar, "plan_code" varchar, foreign key("user_id") references "users"("id") on delete cascade);
INSERT INTO "orders" ("id", "user_id", "order_code", "package_name", "amount", "status", "payment_method", "created_at", "updated_at", "template_code", "plan_code") VALUES ('1', '4', 'PAY_5JQ3JY', 'Gói Pro Nổi Bật · Mẫu 02: Thư Mời Số 48 (Tình Yêu & Hoa Anh Đào) · 6 tháng', '99000', 'pending', 'VietQR Bank Transfer', '2026-10-04 06:38:31', '2026-10-04 06:38:31', 'template_02', 'pro');
INSERT INTO "orders" ("id", "user_id", "order_code", "package_name", "amount", "status", "payment_method", "created_at", "updated_at", "template_code", "plan_code") VALUES ('2', '4', 'PAY_P7VMPE', 'Gói Pro Nổi Bật · Mẫu 03: European Vintage Floral · 6 tháng', '99000', 'pending', 'VietQR Bank Transfer', '2026-10-04 12:29:02', '2026-10-04 12:29:02', 'template_03', 'pro');
INSERT INTO "orders" ("id", "user_id", "order_code", "package_name", "amount", "status", "payment_method", "created_at", "updated_at", "template_code", "plan_code") VALUES ('3', '4', 'PAY_DB52QQ', 'Gói Cơ Bản · Mẫu 01: Lễ Cưới Hoàng Gia (Đỏ & Vàng) · 6 tháng', '49000', 'pending', 'VietQR Bank Transfer', '2026-10-06 12:37:29', '2026-10-06 12:37:29', 'template_01', 'basic');
INSERT INTO "orders" ("id", "user_id", "order_code", "package_name", "amount", "status", "payment_method", "created_at", "updated_at", "template_code", "plan_code") VALUES ('4', '4', 'PAY_WMNUVF', 'Gói Cơ Bản · Mẫu 01: Lễ Cưới Hoàng Gia (Đỏ & Vàng) · 6 tháng', '49000', 'pending', 'VietQR Bank Transfer', '2026-10-06 12:39:27', '2026-10-06 12:39:27', 'template_01', 'basic');
INSERT INTO "orders" ("id", "user_id", "order_code", "package_name", "amount", "status", "payment_method", "created_at", "updated_at", "template_code", "plan_code") VALUES ('5', '4', 'PAY_VULXMJ', 'Gói Cơ Bản · Mẫu 01: Lễ Cưới Hoàng Gia (Đỏ & Vàng) · 6 tháng', '49000', 'pending', 'VietQR Bank Transfer', '2026-10-06 12:53:18', '2026-10-06 12:53:18', 'template_01', 'basic');

-- Table structure for templates
DROP TABLE IF EXISTS "templates";
CREATE TABLE "templates" ("id" integer primary key autoincrement not null, "code" varchar not null, "name" varchar not null, "category" varchar not null default 'Sang Trọng', "tag" varchar default 'HOT', "thumbnail" text not null, "file_url" text, "price" numeric not null default '0', "is_active" tinyint(1) not null default '1', "sort_order" integer not null default '0', "created_at" datetime, "updated_at" datetime);
INSERT INTO "templates" ("id", "code", "name", "category", "tag", "thumbnail", "file_url", "price", "is_active", "sort_order", "created_at", "updated_at") VALUES ('2', 'template_02', 'Mẫu thiệp cưới 2', 'Thiên Nhiên', 'HOT', '/uploads/images/img_1791986587_6acf8b9bc434e.png', '/templates/mau-thiep-2/mau-thiep-2.html', '99000', '1', '2', '2026-10-04 03:45:42', '2026-10-14 14:03:08');
INSERT INTO "templates" ("id", "code", "name", "category", "tag", "thumbnail", "file_url", "price", "is_active", "sort_order", "created_at", "updated_at") VALUES ('6', 'template_passport', 'Mẫu thiệp cưới 5', 'Hiện Đại', 'NEW', '/uploads/images/img_1791984500_6acf83740077d.png', '/templates/mau-thiep-4/mau-thiep-4.html', '0', '1', '5', '2026-10-14 11:21:33', '2026-10-14 13:50:47');
INSERT INTO "templates" ("id", "code", "name", "category", "tag", "thumbnail", "file_url", "price", "is_active", "sort_order", "created_at", "updated_at") VALUES ('7', 'template_pearl', 'Mẫu thiệp cưới 5', 'Sang Trọng', 'VIP', '/uploads/images/img_1791985853_6acf88bdef58a.png', '/templates/mau-thiep-5/mau-thiep-5.html', '0', '1', '6', '2026-10-14 13:08:41', '2026-10-14 13:51:15');
INSERT INTO "templates" ("id", "code", "name", "category", "tag", "thumbnail", "file_url", "price", "is_active", "sort_order", "created_at", "updated_at") VALUES ('8', 'template_minimalism_red', 'Mẫu thiệp cưới 7', 'Tối Giản', 'NEW', '/uploads/images/img_1791984309_6acf82b547130.png', '/templates/mau-thiep-3/mau-thiep-3.html', '0', '1', '7', '2026-10-14 13:08:41', '2026-10-14 14:04:12');
INSERT INTO "templates" ("id", "code", "name", "category", "tag", "thumbnail", "file_url", "price", "is_active", "sort_order", "created_at", "updated_at") VALUES ('9', 'template_e1ba289a-c887-4550-95da-ece00b96acd7', 'Mẫu thiệp cưới 1', 'Cổ Điển', 'HOT', '/uploads/images/img_1791986186_6acf8a0a2ae4c.png', '/templates/mau-thiep-1/mau-thiep-1.html', '0', '1', '8', '2026-10-14 13:56:34', '2026-10-14 13:56:34');
INSERT INTO "templates" ("id", "code", "name", "category", "tag", "thumbnail", "file_url", "price", "is_active", "sort_order", "created_at", "updated_at") VALUES ('10', 'template_06_burgundy', 'Đỏ Đô & Lời Hẹn', 'Cổ Điển', 'NEW', '/templates/mau-thiep-6/assets/thumbnail.webp', '/templates/mau-thiep-6/mau-thiep-6.html', '0', '1', '8', '2026-10-16 14:34:26', '2026-10-16 14:34:26');
INSERT INTO "templates" ("id", "code", "name", "category", "tag", "thumbnail", "file_url", "price", "is_active", "sort_order", "created_at", "updated_at") VALUES ('11', 'template_lilywedding_m2', 'Sắc Lily – Chiến Công & Thùy Tiên', 'Hoa Cưới', 'NEW', '/templates/mau-thiep-7/assets/thumbnail.webp', '/templates/mau-thiep-7/mau-thiep-7.html', '0', '1', '9', '2026-10-17 05:46:22', '2026-10-17 05:46:22');

-- Table structure for plans
DROP TABLE IF EXISTS "plans";
CREATE TABLE "plans" ("id" integer primary key autoincrement not null, "code" varchar not null, "name" varchar not null, "subtitle" varchar, "price" numeric not null default '0', "period" varchar not null default '/thiệp', "description" text, "action" varchar, "features" text, "is_popular" tinyint(1) not null default '0', "is_active" tinyint(1) not null default '1', "created_at" datetime, "updated_at" datetime);
INSERT INTO "plans" ("id", "code", "name", "subtitle", "price", "period", "description", "action", "features", "is_popular", "is_active", "created_at", "updated_at") VALUES ('1', 'trial', 'Gói Thử Nghiệm', 'Trải nghiệm miễn phí', '0', '', 'Xem thử thiết kế; mua mẫu để lưu và chia sẻ thiệp.', 'Xem thử mẫu', '["Xem & trải nghiệm mẫu thiệp","Tự do tạo thiệp với mẫu cơ bản","- Cần mua mẫu để lưu và công khai thiệp","Có logo WeddingSaaS","- Tùy chỉnh tên miền riêng","- Không hỗ trợ quản lý khách mời"]', '0', '1', '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "plans" ("id", "code", "name", "subtitle", "price", "period", "description", "action", "features", "is_popular", "is_active", "created_at", "updated_at") VALUES ('2', 'basic', 'Gói Cơ Bản', 'Phù hợp cho cá nhân', '49000', '/mẫu · 6 tháng', 'Giải pháp tiết kiệm, đầy đủ tính năng cơ bản', 'Chọn Gói Cơ Bản', '["Quyền sử dụng một mẫu thiệp trong 6 tháng","Tùy chỉnh nội dung, hình ảnh, màu sắc","Xuất link chia sẻ không logo","Tùy chỉnh tên miền phụ (vd: tenban.weddingsaas.vn)","Nhạc nền lãng mạn","Thông báo khi có khách mời RSVP","- Quản lý khách mời nâng cao","- Không hỗ trợ mã QR tùy chỉnh"]', '0', '1', '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "plans" ("id", "code", "name", "subtitle", "price", "period", "description", "action", "features", "is_popular", "is_active", "created_at", "updated_at") VALUES ('3', 'pro', 'Gói Pro Nổi Bật', 'Lựa chọn hoàn hảo cho đám cưới', '99000', '/mẫu · 6 tháng', 'Đầy đủ tính năng cao cấp, dễ dàng quản lý', 'Chọn Gói Pro Ngay', '["Quyền sử dụng một mẫu thiệp trong 6 tháng","Tùy chỉnh giao diện chuyên nghiệp","Tên miền riêng (vd: tenban.com)","Nhạc nền theo sở thích","Quản lý khách mời thông minh","Gửi thông báo tự động (Email\/SMS\/Telegram)","Mã QR mừng cưới & chỉ đường","Thống kê lượt xem, xác nhận tham dự","Hỗ trợ 24\/7 qua chat"]', '1', '1', '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "plans" ("id", "code", "name", "subtitle", "price", "period", "description", "action", "features", "is_popular", "is_active", "created_at", "updated_at") VALUES ('4', 'vip', 'Gói VIP Đặc Biệt', 'Dành cho tiệc cưới lớn & cao cấp', '199000', '/mẫu · 6 tháng', 'Trải nghiệm trọn vẹn, chuyên nghiệp và khác biệt', 'Đăng Ký Gói VIP', '["Tất cả tính năng của Gói Pro","Thiết kế giao diện theo yêu cầu","Tên miền riêng .com\/.vn","Mời khách qua Email\/SMS\/Telegram","Tích hợp bản đồ, chỉ đường, lịch trình","Mã QR mừng cưới tùy chỉnh","Thống kê chi tiết & xuất danh sách khách mời","Hỗ trợ kỹ thuật 1:1 trong suốt thời gian sử dụng","Tư vấn thiết kế miễn phí"]', '0', '1', '2026-10-04 03:45:42', '2026-10-04 03:45:42');

-- Table structure for system_settings
DROP TABLE IF EXISTS "system_settings";
CREATE TABLE "system_settings" ("id" integer primary key autoincrement not null, "key" varchar not null, "value" text, "description" varchar, "created_at" datetime, "updated_at" datetime);
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('1', 'vietqr_bank_bin', 'MB', 'Mã Ngân Hàng VietQR (MB, VPB, VCB, TCB...)', '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('2', 'vietqr_account_no', '0987654321', 'Số tài khoản nhận tiền thanh toán', '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('3', 'vietqr_account_name', 'DUONG QUANG TUAN', 'Tên chủ tài khoản nhận tiền', '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('4', 'telegram_notify_bot_token', '', 'Telegram Bot Token để nhận thông báo đơn hàng mới cho Admin', '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('5', 'site_name', 'WeddingCard SaaS', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('6', 'site_title', 'Thiệp Cưới Online Thông Minh & Đẳng Cấp 2026', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('7', 'site_description', 'Nền tảng tạo thiệp cưới online cao cấp, thiết kế đẹp mắt, nhận mừng cưới tự động VietQR, gửi lời chúc & album ảnh cưới.', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('8', 'site_keywords', 'thiệp cưới online, tạo thiệp cưới, thiệp cưới số, vietqr mừng cưới', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('9', 'site_logo', '', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('10', 'site_favicon', '', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('11', 'contact_email', 'contact@weddingcardsaas.vn', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('12', 'contact_phone', '0987.654.321', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('13', 'contact_address', 'Tòa nhà Landmark 81, Bình Thạnh, TP. Hồ Chí Minh', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('14', 'social_facebook', 'https://facebook.com/weddingcardsaas', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('15', 'social_zalo', 'https://zalo.me/0987654321', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('16', 'telegram_chat_id', '', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('17', 'google_client_id', '', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('18', 'google_client_secret', '', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('19', 'mail_enabled', '0', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('20', 'mail_host', 'smtp.gmail.com', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('21', 'mail_port', '587', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('22', 'mail_encryption', 'tls', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('23', 'mail_username', 'conguyen6262@gmail.com', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('24', 'mail_password', 'eyJpdiI6Ik9hOVJESVFnS2JtZjk4VGkxcVE5N3c9PSIsInZhbHVlIjoiWGhvRXc3TzVKOW52SFR2Mms2ZnBvd2gyZFpmOVY1MEdjZWpITXVFZG5uST0iLCJtYWMiOiIyZTJjYWM4MmU5MTc1ZTkyMDI2MmU3OTBjMDNiZDVhNjA4OTQwZjAyYzhjMzY2MGY3ZjU0ZWY2YjVlN2M4YjRjIiwidGFnIjoiIn0=', NULL, '2026-10-04 04:42:42', '2026-10-04 04:43:15');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('25', 'mail_from_address', 'conguyen6262@gmail.com', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('26', 'mail_from_name', 'WeddingSaaS', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('27', 'migration.six_month_catalog_backup', '[{"id":1,"period":"","features":"[\"Xem & tr\\u1ea3i nghi\\u1ec7m m\\u1eabu thi\\u1ec7p\",\"T\\u1ef1 do t\\u1ea1o thi\\u1ec7p v\\u1edbi m\\u1eabu c\\u01a1 b\\u1ea3n\",\"Xu\\u1ea5t file HTML \\u0111\\u1ec3 chia s\\u1ebb\",\"C\\u00f3 logo WeddingSaaS\",\"- T\\u00f9y ch\\u1ec9nh t\\u00ean mi\\u1ec1n ri\\u00eang\",\"- Kh\\u00f4ng h\\u1ed7 tr\\u1ee3 qu\\u1ea3n l\\u00fd kh\\u00e1ch m\\u1eddi\"]","description":"D\u00e0nh cho b\u1ea1n m\u1edbi b\u1eaft \u0111\u1ea7u","action":"T\u1ea1o Thi\u1ec7p Mi\u1ec5n Ph\u00ed"},{"id":2,"period":"\/thi\u1ec7p","features":"[\"S\\u1eed d\\u1ee5ng to\\u00e0n b\\u1ed9 m\\u1eabu thi\\u1ec7p \\u0111\\u1eb9p\",\"T\\u00f9y ch\\u1ec9nh n\\u1ed9i dung, h\\u00ecnh \\u1ea3nh, m\\u00e0u s\\u1eafc\",\"Xu\\u1ea5t link chia s\\u1ebb kh\\u00f4ng logo\",\"T\\u00f9y ch\\u1ec9nh t\\u00ean mi\\u1ec1n ph\\u1ee5 (vd: tenban.weddingsaas.vn)\",\"Nh\\u1ea1c n\\u1ec1n l\\u00e3ng m\\u1ea1n\",\"Th\\u00f4ng b\\u00e1o khi c\\u00f3 kh\\u00e1ch m\\u1eddi RSVP\",\"- Qu\\u1ea3n l\\u00fd kh\\u00e1ch m\\u1eddi n\\u00e2ng cao\",\"- Kh\\u00f4ng h\\u1ed7 tr\\u1ee3 m\\u00e3 QR t\\u00f9y ch\\u1ec9nh\"]","description":"Gi\u1ea3i ph\u00e1p ti\u1ebft ki\u1ec7m, \u0111\u1ea7y \u0111\u1ee7 t\u00ednh n\u0103ng c\u01a1 b\u1ea3n","action":"Ch\u1ecdn G\u00f3i C\u01a1 B\u1ea3n"},{"id":3,"period":"\/thi\u1ec7p","features":"[\"S\\u1eed d\\u1ee5ng to\\u00e0n b\\u1ed9 m\\u1eabu thi\\u1ec7p cao c\\u1ea5p\",\"T\\u00f9y ch\\u1ec9nh giao di\\u1ec7n chuy\\u00ean nghi\\u1ec7p\",\"T\\u00ean mi\\u1ec1n ri\\u00eang (vd: tenban.com)\",\"Nh\\u1ea1c n\\u1ec1n theo s\\u1edf th\\u00edch\",\"Qu\\u1ea3n l\\u00fd kh\\u00e1ch m\\u1eddi th\\u00f4ng minh\",\"G\\u1eedi th\\u00f4ng b\\u00e1o t\\u1ef1 \\u0111\\u1ed9ng (Email\\\/SMS\\\/Telegram)\",\"M\\u00e3 QR m\\u1eebng c\\u01b0\\u1edbi & ch\\u1ec9 \\u0111\\u01b0\\u1eddng\",\"Th\\u1ed1ng k\\u00ea l\\u01b0\\u1ee3t xem, x\\u00e1c nh\\u1eadn tham d\\u1ef1\",\"H\\u1ed7 tr\\u1ee3 24\\\/7 qua chat\"]","description":"\u0110\u1ea7y \u0111\u1ee7 t\u00ednh n\u0103ng cao c\u1ea5p, d\u1ec5 d\u00e0ng qu\u1ea3n l\u00fd","action":"Ch\u1ecdn G\u00f3i Pro Ngay"},{"id":4,"period":"\/thi\u1ec7p","features":"[\"T\\u1ea5t c\\u1ea3 t\\u00ednh n\\u0103ng c\\u1ee7a G\\u00f3i Pro\",\"Thi\\u1ebft k\\u1ebf giao di\\u1ec7n theo y\\u00eau c\\u1ea7u\",\"T\\u00ean mi\\u1ec1n ri\\u00eang .com\\\/.vn\",\"M\\u1eddi kh\\u00e1ch qua Email\\\/SMS\\\/Telegram\",\"T\\u00edch h\\u1ee3p b\\u1ea3n \\u0111\\u1ed3, ch\\u1ec9 \\u0111\\u01b0\\u1eddng, l\\u1ecbch tr\\u00ecnh\",\"M\\u00e3 QR m\\u1eebng c\\u01b0\\u1edbi t\\u00f9y ch\\u1ec9nh\",\"Th\\u1ed1ng k\\u00ea chi ti\\u1ebft & xu\\u1ea5t danh s\\u00e1ch kh\\u00e1ch m\\u1eddi\",\"H\\u1ed7 tr\\u1ee3 k\\u1ef9 thu\\u1eadt 1:1 trong su\\u1ed1t th\\u1eddi gian s\\u1eed d\\u1ee5ng\",\"T\\u01b0 v\\u1ea5n thi\\u1ebft k\\u1ebf mi\\u1ec5n ph\\u00ed\"]","description":"Tr\u1ea3i nghi\u1ec7m tr\u1ecdn v\u1eb9n, chuy\u00ean nghi\u1ec7p v\u00e0 kh\u00e1c bi\u1ec7t","action":"\u0110\u0103ng K\u00fd G\u00f3i VIP"}]', NULL, '2026-10-04 06:46:48', '2026-10-04 06:46:48');
INSERT INTO "system_settings" ("id", "key", "value", "description", "created_at", "updated_at") VALUES ('28', 'templates_demo_only', '1', 'Chỉ xem demo mẫu thiệp', '2026-10-14 13:08:41', '2026-10-15 12:53:35');

-- Table structure for music_tracks
DROP TABLE IF EXISTS "music_tracks";
CREATE TABLE "music_tracks" ("id" integer primary key autoincrement not null, "title" varchar not null, "artist" varchar, "url" text not null, "is_active" tinyint(1) not null default '1', "sort_order" integer not null default '1', "created_at" datetime, "updated_at" datetime);
INSERT INTO "music_tracks" ("id", "title", "artist", "url", "is_active", "sort_order", "created_at", "updated_at") VALUES ('1', '50 Năm Về Sau', 'Bùi Anh Tuấn', 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/50 Năm Về Sau.mp3', '1', '1', '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "music_tracks" ("id", "title", "artist", "url", "is_active", "sort_order", "created_at", "updated_at") VALUES ('2', 'Hơn Cả Yêu', 'Đức Phúc', 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Hon-Ca-Yeu.mp3', '1', '2', '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "music_tracks" ("id", "title", "artist", "url", "is_active", "sort_order", "created_at", "updated_at") VALUES ('3', 'Cầu Hôn', 'Văn Mai Hương', 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Cau-Hon.mp3', '1', '3', '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "music_tracks" ("id", "title", "artist", "url", "is_active", "sort_order", "created_at", "updated_at") VALUES ('4', 'Ngày Đầu Tiên', 'Đức Phúc', 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Ngay-Dau-Tien.mp3', '1', '4', '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "music_tracks" ("id", "title", "artist", "url", "is_active", "sort_order", "created_at", "updated_at") VALUES ('5', 'Ánh Nắng Của Anh', 'Đức Phúc', 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Anh-Nang-Cua-Anh.mp3', '1', '5', '2026-10-04 03:45:42', '2026-10-04 03:45:42');
INSERT INTO "music_tracks" ("id", "title", "artist", "url", "is_active", "sort_order", "created_at", "updated_at") VALUES ('6', 'Ta Là Của Nhau', 'Đông Nhi & Ông Cao Thắng', 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Ta-La-Cua-Nhau.mp3', '1', '6', '2026-10-04 03:45:42', '2026-10-04 03:45:42');

-- Table structure for template_licenses
DROP TABLE IF EXISTS "template_licenses";
CREATE TABLE "template_licenses" ("id" integer primary key autoincrement not null, "user_id" integer not null, "template_code" varchar not null, "expires_at" datetime not null, "created_at" datetime, "updated_at" datetime, foreign key("user_id") references "users"("id") on delete cascade);

-- Table structure for card_rsvps
DROP TABLE IF EXISTS "card_rsvps";
CREATE TABLE "card_rsvps" ("id" integer primary key autoincrement not null, "wedding_card_id" integer not null, "name" varchar not null, "attending" tinyint(1) not null, "guest_count" integer not null, "message" text, "created_at" datetime, "updated_at" datetime, foreign key("wedding_card_id") references "wedding_cards"("id") on delete cascade);
CREATE UNIQUE INDEX "users_email_unique" on "users" ("email");
CREATE INDEX "users_google_id_index" on "users" ("google_id");
CREATE INDEX "sessions_user_id_index" on "sessions" ("user_id");
CREATE INDEX "sessions_last_activity_index" on "sessions" ("last_activity");
CREATE INDEX "cache_expiration_index" on "cache" ("expiration");
CREATE INDEX "cache_locks_expiration_index" on "cache_locks" ("expiration");
CREATE INDEX "jobs_queue_index" on "jobs" ("queue");
CREATE UNIQUE INDEX "failed_jobs_uuid_unique" on "failed_jobs" ("uuid");
CREATE UNIQUE INDEX "wedding_cards_slug_unique" on "wedding_cards" ("slug");
CREATE INDEX "personal_access_tokens_tokenable_type_tokenable_id_index" on "personal_access_tokens" ("tokenable_type", "tokenable_id");
CREATE UNIQUE INDEX "personal_access_tokens_token_unique" on "personal_access_tokens" ("token");
CREATE INDEX "personal_access_tokens_expires_at_index" on "personal_access_tokens" ("expires_at");
CREATE UNIQUE INDEX "orders_order_code_unique" on "orders" ("order_code");
CREATE UNIQUE INDEX "templates_code_unique" on "templates" ("code");
CREATE UNIQUE INDEX "plans_code_unique" on "plans" ("code");
CREATE UNIQUE INDEX "system_settings_key_unique" on "system_settings" ("key");
CREATE UNIQUE INDEX "users_card_slug_unique" on "users" ("card_slug");
CREATE INDEX "orders_template_code_index" on "orders" ("template_code");
CREATE UNIQUE INDEX "template_licenses_user_id_template_code_unique" on "template_licenses" ("user_id", "template_code");

COMMIT;
