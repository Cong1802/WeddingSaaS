-- ============================================================
-- Wedding Card SaaS - MySQL Database Dump
-- Database: wedding_card_saas
-- Exported on: 2026-10-18 00:23:24
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET NAMES utf8mb4;
SET TIME_ZONE = '+00:00';

-- ------------------------------------------------------------
-- Table structure for `cache`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `cache`
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-02ccf430a916f22510651cc3a209cf4a', 'i:1;', '1791983167'),
('laravel-cache-02ccf430a916f22510651cc3a209cf4a:timer', 'i:1791983167;', '1791983167'),
('laravel-cache-2ebe8723de08b61faa5fe16bb552de0d', 'i:1;', '1792068860'),
('laravel-cache-2ebe8723de08b61faa5fe16bb552de0d:timer', 'i:1792068860;', '1792068860'),
('laravel-cache-356a192b7913b04c54574d18c28d46e6395428ab', 'i:1;', '1791089301'),
('laravel-cache-356a192b7913b04c54574d18c28d46e6395428ab:timer', 'i:1791089301;', '1791089301'),
('laravel-cache-5742ca915daeeb569f3cd255dd3410d6', 'i:2;', '1791087202'),
('laravel-cache-5742ca915daeeb569f3cd255dd3410d6:timer', 'i:1791087202;', '1791087202'),
('laravel-cache-5c785c036466adea360111aa28563bfd556b5fba', 'i:1;', '1791114044'),
('laravel-cache-5c785c036466adea360111aa28563bfd556b5fba:timer', 'i:1791114044;', '1791114044'),
('laravel-cache-6ceef7de01c0f76a85b2850b84b36aef', 'i:1;', '1791290179'),
('laravel-cache-6ceef7de01c0f76a85b2850b84b36aef:timer', 'i:1791290179;', '1791290179'),
('laravel-cache-df19666b7fea5eb4fda6d2b497176ef3', 'i:1;', '1791396753'),
('laravel-cache-df19666b7fea5eb4fda6d2b497176ef3:timer', 'i:1791396753;', '1791396753'),
('laravel-cache-e2128a2a636a476a377b02b0b3e55fdd', 'i:1;', '1792068859'),
('laravel-cache-e2128a2a636a476a377b02b0b3e55fdd:timer', 'i:1792068859;', '1792068859');

-- ------------------------------------------------------------
-- Table structure for `cache_locks`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table structure for `card_rsvps`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `card_rsvps`;
CREATE TABLE `card_rsvps` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `wedding_card_id` bigint unsigned NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attending` tinyint(1) NOT NULL,
  `guest_count` smallint unsigned NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `card_rsvps_wedding_card_id_foreign` (`wedding_card_id`),
  CONSTRAINT `card_rsvps_wedding_card_id_foreign` FOREIGN KEY (`wedding_card_id`) REFERENCES `wedding_cards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table structure for `failed_jobs`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table structure for `job_batches`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table structure for `jobs`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table structure for `migrations`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `migrations`
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
('1', '0001_01_01_000000_create_users_table', '1'),
('2', '0001_01_01_000001_create_cache_table', '1'),
('3', '0001_01_01_000002_create_jobs_table', '1'),
('4', '2026_09_19_000000_create_wedding_cards_table', '1'),
('5', '2026_09_19_150420_create_personal_access_tokens_table', '1'),
('6', '2026_09_20_000000_create_orders_table', '1'),
('7', '2026_09_20_000001_create_templates_table', '1'),
('8', '2026_09_20_000002_create_plans_table', '1'),
('9', '2026_09_20_000003_create_system_settings_table', '1'),
('10', '2026_09_20_000004_create_music_tracks_table', '1'),
('11', '2026_09_20_000005_add_phone_to_users_table', '1'),
('12', '2026_10_04_000000_revoke_legacy_authentication', '2'),
('13', '2026_10_04_100000_add_template_licenses', '3'),
('14', '2026_10_04_110000_align_catalog_with_six_month_licenses', '4'),
('15', '2026_10_14_100000_add_passport_template', '5'),
('16', '2026_10_14_110000_create_card_rsvps_table', '6'),
('17', '2026_10_14_120000_enable_template_demo_catalog', '7'),
('18', '2026_10_14_130000_number_template_names', '8'),
('19', '2026_10_14_140000_consolidate_template_paths', '9'),
('20', '2026_10_16_200000_add_burgundy_template_six', '10'),
('21', '2026_10_17_120000_add_lilywedding_template_seven', '11');

-- ------------------------------------------------------------
-- Table structure for `music_tracks`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `music_tracks`;
CREATE TABLE `music_tracks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `artist` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `music_tracks`
INSERT INTO `music_tracks` (`id`, `title`, `artist`, `url`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
('1', '50 Năm Về Sau', 'Bùi Anh Tuấn', 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/50 Năm Về Sau.mp3', '1', '1', '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('2', 'Hơn Cả Yêu', 'Đức Phúc', 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Hon-Ca-Yeu.mp3', '1', '2', '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('3', 'Cầu Hôn', 'Văn Mai Hương', 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Cau-Hon.mp3', '1', '3', '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('4', 'Ngày Đầu Tiên', 'Đức Phúc', 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Ngay-Dau-Tien.mp3', '1', '4', '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('5', 'Ánh Nắng Của Anh', 'Đức Phúc', 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Anh-Nang-Cua-Anh.mp3', '1', '5', '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('6', 'Ta Là Của Nhau', 'Đông Nhi & Ông Cao Thắng', 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Ta-La-Cua-Nhau.mp3', '1', '6', '2026-10-04 03:45:42', '2026-10-04 03:45:42');

-- ------------------------------------------------------------
-- Table structure for `orders`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `order_code` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Gói Pro 99K',
  `amount` bigint unsigned NOT NULL DEFAULT '99000',
  `status` enum('pending','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'VietQR Bank Transfer',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `template_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plan_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_code_unique` (`order_code`),
  KEY `orders_user_id_foreign` (`user_id`),
  KEY `orders_template_code_index` (`template_code`),
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `orders`
INSERT INTO `orders` (`id`, `user_id`, `order_code`, `package_name`, `amount`, `status`, `payment_method`, `created_at`, `updated_at`, `template_code`, `plan_code`) VALUES
('1', '4', 'PAY_5JQ3JY', 'Gói Pro Nổi Bật · Mẫu 02: Thư Mời Số 48 (Tình Yêu & Hoa Anh Đào) · 6 tháng', '99000', 'pending', 'VietQR Bank Transfer', '2026-10-04 06:38:31', '2026-10-04 06:38:31', 'template_02', 'pro'),
('2', '4', 'PAY_P7VMPE', 'Gói Pro Nổi Bật · Mẫu 03: European Vintage Floral · 6 tháng', '99000', 'pending', 'VietQR Bank Transfer', '2026-10-04 12:29:02', '2026-10-04 12:29:02', 'template_03', 'pro'),
('3', '4', 'PAY_DB52QQ', 'Gói Cơ Bản · Mẫu 01: Lễ Cưới Hoàng Gia (Đỏ & Vàng) · 6 tháng', '49000', 'pending', 'VietQR Bank Transfer', '2026-10-06 12:37:29', '2026-10-06 12:37:29', 'template_01', 'basic'),
('4', '4', 'PAY_WMNUVF', 'Gói Cơ Bản · Mẫu 01: Lễ Cưới Hoàng Gia (Đỏ & Vàng) · 6 tháng', '49000', 'pending', 'VietQR Bank Transfer', '2026-10-06 12:39:27', '2026-10-06 12:39:27', 'template_01', 'basic'),
('5', '4', 'PAY_VULXMJ', 'Gói Cơ Bản · Mẫu 01: Lễ Cưới Hoàng Gia (Đỏ & Vàng) · 6 tháng', '49000', 'pending', 'VietQR Bank Transfer', '2026-10-06 12:53:18', '2026-10-06 12:53:18', 'template_01', 'basic');

-- ------------------------------------------------------------
-- Table structure for `password_reset_tokens`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `password_reset_tokens`
INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('superadmin@acculance.com', '$2y$12$/vnkvn5Vycf8BWnEN6dqKu/EP89zUY32fL8kOMBlM0iq3JKqiZpnK', '2026-10-04 04:10:01');

-- ------------------------------------------------------------
-- Table structure for `personal_access_tokens`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `personal_access_tokens`
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
('4', 'App\\Models\\User', '1', 'auth_token', 'e7bfcd582d478843a69866498f61f3e86d99daa50bdc5bfd880694d951da31dd', '[\"*\"]', '2026-10-04 04:12:15', '2026-10-04 16:07:17', '2026-10-04 04:07:17', '2026-10-04 04:12:15'),
('5', 'App\\Models\\User', '4', 'auth_token', 'e18bd7d29b233381886160c42b62fab009115c3f023af6c4603889d3122919da', '[\"*\"]', '2026-10-04 04:21:22', '2026-10-04 16:15:40', '2026-10-04 04:15:40', '2026-10-04 04:21:22'),
('12', 'App\\Models\\User', '4', 'auth_token', 'b49790c8efc17f4f746232493dbdaeb9762210b2bd7579368ffc0300bec9e38e', '[\"*\"]', '2026-10-04 06:50:40', '2026-10-04 17:10:19', '2026-10-04 05:10:19', '2026-10-04 06:50:40'),
('13', 'App\\Models\\User', '1', 'auth_token', '4d2fa447018e65a0badb446a20bc2e305c9f45523932acd8c645e38710368db7', '[\"*\"]', '2026-10-04 05:19:52', '2026-10-04 17:18:29', '2026-10-04 05:18:29', '2026-10-04 05:19:52'),
('15', 'App\\Models\\User', '4', 'auth_token', '61f6ba9cd81986b19acbf3db9b7ac7d6a52bf61634e62c1ce72eb3f80ec43a04', '[\"*\"]', '2026-10-04 08:15:32', '2026-10-04 20:14:26', '2026-10-04 08:14:26', '2026-10-04 08:15:32'),
('16', 'App\\Models\\User', '4', 'auth_token', '7045a6fdd54fe0ded71bce992018df5e1978d820e668000e63b104dfcf18695f', '[\"*\"]', '2026-10-04 12:34:17', '2026-10-04 23:39:58', '2026-10-04 11:39:58', '2026-10-04 12:34:17'),
('17', 'App\\Models\\User', '1', 'auth_token', 'db0edd6449201aac4c8730dc92e587d764d9687097228b4a178123749b246fe5', '[\"*\"]', '2026-10-04 12:17:08', '2026-10-05 00:17:05', '2026-10-04 12:17:05', '2026-10-04 12:17:08'),
('18', 'App\\Models\\User', '4', 'auth_token', 'b6620f616447c122d287d6fb7d2fc27744e88b9334a42ba997738bc2dea02c53', '[\"*\"]', '2026-10-06 16:58:53', '2026-10-07 00:35:29', '2026-10-06 12:35:30', '2026-10-06 16:58:53'),
('19', 'App\\Models\\User', '4', 'auth_token', '314791d4e5d5347628a798523758e12696185bddace0df5e20fdf5bcc88c1784', '[\"*\"]', '2026-10-07 18:38:14', '2026-10-08 06:11:35', '2026-10-07 18:11:35', '2026-10-07 18:38:14'),
('20', 'App\\Models\\User', '1', 'auth_token', '850d73a99ea1b4c89508641572e1a1f2b4727b7e87964ba19fa8ce9c0ea619c4', '[\"*\"]', '2026-10-14 15:21:53', '2026-10-15 01:05:36', '2026-10-14 13:05:37', '2026-10-14 15:21:53'),
('21', 'App\\Models\\User', '1', 'auth_token', '96efe75296321454984f67648b851a6774cedc9bd0b709a7bd78bf9fc155d80d', '[\"*\"]', '2026-10-15 14:29:24', '2026-10-16 00:53:20', '2026-10-15 12:53:21', '2026-10-15 14:29:24');

-- ------------------------------------------------------------
-- Table structure for `plans`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `plans`;
CREATE TABLE `plans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `period` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '/thiệp',
  `description` text COLLATE utf8mb4_unicode_ci,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `features` json DEFAULT NULL,
  `is_popular` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plans_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `plans`
INSERT INTO `plans` (`id`, `code`, `name`, `subtitle`, `price`, `period`, `description`, `action`, `features`, `is_popular`, `is_active`, `created_at`, `updated_at`) VALUES
('1', 'trial', 'Gói Thử Nghiệm', 'Trải nghiệm miễn phí', '0.00', '', 'Xem thử thiết kế; mua mẫu để lưu và chia sẻ thiệp.', 'Xem thử mẫu', '[\"Xem & trải nghiệm mẫu thiệp\", \"Tự do tạo thiệp với mẫu cơ bản\", \"- Cần mua mẫu để lưu và công khai thiệp\", \"Có logo WeddingSaaS\", \"- Tùy chỉnh tên miền riêng\", \"- Không hỗ trợ quản lý khách mời\"]', '0', '1', '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('2', 'basic', 'Gói Cơ Bản', 'Phù hợp cho cá nhân', '49000.00', '/mẫu · 6 tháng', 'Giải pháp tiết kiệm, đầy đủ tính năng cơ bản', 'Chọn Gói Cơ Bản', '[\"Quyền sử dụng một mẫu thiệp trong 6 tháng\", \"Tùy chỉnh nội dung, hình ảnh, màu sắc\", \"Xuất link chia sẻ không logo\", \"Tùy chỉnh tên miền phụ (vd: tenban.weddingsaas.vn)\", \"Nhạc nền lãng mạn\", \"Thông báo khi có khách mời RSVP\", \"- Quản lý khách mời nâng cao\", \"- Không hỗ trợ mã QR tùy chỉnh\"]', '0', '1', '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('3', 'pro', 'Gói Pro Nổi Bật', 'Lựa chọn hoàn hảo cho đám cưới', '99000.00', '/mẫu · 6 tháng', 'Đầy đủ tính năng cao cấp, dễ dàng quản lý', 'Chọn Gói Pro Ngay', '[\"Quyền sử dụng một mẫu thiệp trong 6 tháng\", \"Tùy chỉnh giao diện chuyên nghiệp\", \"Tên miền riêng (vd: tenban.com)\", \"Nhạc nền theo sở thích\", \"Quản lý khách mời thông minh\", \"Gửi thông báo tự động (Email/SMS/Telegram)\", \"Mã QR mừng cưới & chỉ đường\", \"Thống kê lượt xem, xác nhận tham dự\", \"Hỗ trợ 24/7 qua chat\"]', '1', '1', '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('4', 'vip', 'Gói VIP Đặc Biệt', 'Dành cho tiệc cưới lớn & cao cấp', '199000.00', '/mẫu · 6 tháng', 'Trải nghiệm trọn vẹn, chuyên nghiệp và khác biệt', 'Đăng Ký Gói VIP', '[\"Tất cả tính năng của Gói Pro\", \"Thiết kế giao diện theo yêu cầu\", \"Tên miền riêng .com/.vn\", \"Mời khách qua Email/SMS/Telegram\", \"Tích hợp bản đồ, chỉ đường, lịch trình\", \"Mã QR mừng cưới tùy chỉnh\", \"Thống kê chi tiết & xuất danh sách khách mời\", \"Hỗ trợ kỹ thuật 1:1 trong suốt thời gian sử dụng\", \"Tư vấn thiết kế miễn phí\"]', '0', '1', '2026-10-04 03:45:42', '2026-10-04 03:45:42');

-- ------------------------------------------------------------
-- Table structure for `sessions`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `sessions`
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0Hf2hG87FS5UOIqplM0505TP9S5LaTx8wEfthn2U', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibGJDd1M4RExsUHN5UEo0TDBKYXN6ZmYwUGdBU0J6dWdiRFdZSjMwRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC8ud2VsbC1rbm93bi9hcHBzcGVjaWZpYy9jb20uY2hyb21lLmRldnRvb2xzLmpzb24iO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', '1792256850'),
('96bj2ytD2bcdjuxgzuh7NsxBxpCiWYaVOgFupoDa', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ05TWjg1Ylp0aDFZcGE1Y3R5Z05SWXpPYk1OZURSNVhTZXJKNlFMeiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC8ud2VsbC1rbm93bi9hcHBzcGVjaWZpYy9jb20uY2hyb21lLmRldnRvb2xzLmpzb24iO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', '1792280768'),
('K9vifuR5jmrpqSbINkHlbhhSapzrjFDrjjMVSqN1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib2NvNXFBdzBKYmpvVzlXU0pDWnF5MHE4djI0Nk05QjBjRFVEVDBtOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC8ud2VsbC1rbm93bi9hcHBzcGVjaWZpYy9jb20uY2hyb21lLmRldnRvb2xzLmpzb24iO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', '1792259797'),
('RkZhAS1Nzi2xFOeE8J9uEfRRi0FJ1NFjJU60QICU', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.9711', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiaTJ5WElVS2d2R3F4emtZRFd4SDg1OE50aE4zcTJMdUxDUkJlZVg4RCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1792257286'),
('VN1ByFY4cr8LUe7kCa7s5y4gaARvx7u0iq9zN4ZE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVm13Z3UzbmpJaFQ2YTdsTE1zVWY2SVlRcDJHaFpkV0hoU2FQQkZxZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC8ud2VsbC1rbm93bi9hcHBzcGVjaWZpYy9jb20uY2hyb21lLmRldnRvb2xzLmpzb24iO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', '1792282692');

-- ------------------------------------------------------------
-- Table structure for `system_settings`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE `system_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `system_settings_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `system_settings`
INSERT INTO `system_settings` (`id`, `key`, `value`, `description`, `created_at`, `updated_at`) VALUES
('1', 'vietqr_bank_bin', 'MB', 'Mã Ngân Hàng VietQR (MB, VPB, VCB, TCB...)', '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('2', 'vietqr_account_no', '0987654321', 'Số tài khoản nhận tiền thanh toán', '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('3', 'vietqr_account_name', 'DUONG QUANG TUAN', 'Tên chủ tài khoản nhận tiền', '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('4', 'telegram_notify_bot_token', '', 'Telegram Bot Token để nhận thông báo đơn hàng mới cho Admin', '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('5', 'site_name', 'WeddingCard SaaS', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('6', 'site_title', 'Thiệp Cưới Online Thông Minh & Đẳng Cấp 2026', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('7', 'site_description', 'Nền tảng tạo thiệp cưới online cao cấp, thiết kế đẹp mắt, nhận mừng cưới tự động VietQR, gửi lời chúc & album ảnh cưới.', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('8', 'site_keywords', 'thiệp cưới online, tạo thiệp cưới, thiệp cưới số, vietqr mừng cưới', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('9', 'site_logo', '', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('10', 'site_favicon', '', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('11', 'contact_email', 'contact@weddingcardsaas.vn', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('12', 'contact_phone', '0987.654.321', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('13', 'contact_address', 'Tòa nhà Landmark 81, Bình Thạnh, TP. Hồ Chí Minh', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('14', 'social_facebook', 'https://facebook.com/weddingcardsaas', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('15', 'social_zalo', 'https://zalo.me/0987654321', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('16', 'telegram_chat_id', '', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42'),
('17', 'google_client_id', '', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42'),
('18', 'google_client_secret', '', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42'),
('19', 'mail_enabled', '0', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42'),
('20', 'mail_host', 'smtp.gmail.com', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42'),
('21', 'mail_port', '587', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42'),
('22', 'mail_encryption', 'tls', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42'),
('23', 'mail_username', 'conguyen6262@gmail.com', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42'),
('24', 'mail_password', 'eyJpdiI6Ik9hOVJESVFnS2JtZjk4VGkxcVE5N3c9PSIsInZhbHVlIjoiWGhvRXc3TzVKOW52SFR2Mms2ZnBvd2gyZFpmOVY1MEdjZWpITXVFZG5uST0iLCJtYWMiOiIyZTJjYWM4MmU5MTc1ZTkyMDI2MmU3OTBjMDNiZDVhNjA4OTQwZjAyYzhjMzY2MGY3ZjU0ZWY2YjVlN2M4YjRjIiwidGFnIjoiIn0=', NULL, '2026-10-04 04:42:42', '2026-10-04 04:43:15'),
('25', 'mail_from_address', 'conguyen6262@gmail.com', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42'),
('26', 'mail_from_name', 'WeddingSaaS', NULL, '2026-10-04 04:42:42', '2026-10-04 04:42:42'),
('27', 'migration.six_month_catalog_backup', '[{\"id\":1,\"period\":\"\",\"features\":\"[\\\"Xem & tr\\\\u1ea3i nghi\\\\u1ec7m m\\\\u1eabu thi\\\\u1ec7p\\\",\\\"T\\\\u1ef1 do t\\\\u1ea1o thi\\\\u1ec7p v\\\\u1edbi m\\\\u1eabu c\\\\u01a1 b\\\\u1ea3n\\\",\\\"Xu\\\\u1ea5t file HTML \\\\u0111\\\\u1ec3 chia s\\\\u1ebb\\\",\\\"C\\\\u00f3 logo WeddingSaaS\\\",\\\"- T\\\\u00f9y ch\\\\u1ec9nh t\\\\u00ean mi\\\\u1ec1n ri\\\\u00eang\\\",\\\"- Kh\\\\u00f4ng h\\\\u1ed7 tr\\\\u1ee3 qu\\\\u1ea3n l\\\\u00fd kh\\\\u00e1ch m\\\\u1eddi\\\"]\",\"description\":\"D\\u00e0nh cho b\\u1ea1n m\\u1edbi b\\u1eaft \\u0111\\u1ea7u\",\"action\":\"T\\u1ea1o Thi\\u1ec7p Mi\\u1ec5n Ph\\u00ed\"},{\"id\":2,\"period\":\"\\/thi\\u1ec7p\",\"features\":\"[\\\"S\\\\u1eed d\\\\u1ee5ng to\\\\u00e0n b\\\\u1ed9 m\\\\u1eabu thi\\\\u1ec7p \\\\u0111\\\\u1eb9p\\\",\\\"T\\\\u00f9y ch\\\\u1ec9nh n\\\\u1ed9i dung, h\\\\u00ecnh \\\\u1ea3nh, m\\\\u00e0u s\\\\u1eafc\\\",\\\"Xu\\\\u1ea5t link chia s\\\\u1ebb kh\\\\u00f4ng logo\\\",\\\"T\\\\u00f9y ch\\\\u1ec9nh t\\\\u00ean mi\\\\u1ec1n ph\\\\u1ee5 (vd: tenban.weddingsaas.vn)\\\",\\\"Nh\\\\u1ea1c n\\\\u1ec1n l\\\\u00e3ng m\\\\u1ea1n\\\",\\\"Th\\\\u00f4ng b\\\\u00e1o khi c\\\\u00f3 kh\\\\u00e1ch m\\\\u1eddi RSVP\\\",\\\"- Qu\\\\u1ea3n l\\\\u00fd kh\\\\u00e1ch m\\\\u1eddi n\\\\u00e2ng cao\\\",\\\"- Kh\\\\u00f4ng h\\\\u1ed7 tr\\\\u1ee3 m\\\\u00e3 QR t\\\\u00f9y ch\\\\u1ec9nh\\\"]\",\"description\":\"Gi\\u1ea3i ph\\u00e1p ti\\u1ebft ki\\u1ec7m, \\u0111\\u1ea7y \\u0111\\u1ee7 t\\u00ednh n\\u0103ng c\\u01a1 b\\u1ea3n\",\"action\":\"Ch\\u1ecdn G\\u00f3i C\\u01a1 B\\u1ea3n\"},{\"id\":3,\"period\":\"\\/thi\\u1ec7p\",\"features\":\"[\\\"S\\\\u1eed d\\\\u1ee5ng to\\\\u00e0n b\\\\u1ed9 m\\\\u1eabu thi\\\\u1ec7p cao c\\\\u1ea5p\\\",\\\"T\\\\u00f9y ch\\\\u1ec9nh giao di\\\\u1ec7n chuy\\\\u00ean nghi\\\\u1ec7p\\\",\\\"T\\\\u00ean mi\\\\u1ec1n ri\\\\u00eang (vd: tenban.com)\\\",\\\"Nh\\\\u1ea1c n\\\\u1ec1n theo s\\\\u1edf th\\\\u00edch\\\",\\\"Qu\\\\u1ea3n l\\\\u00fd kh\\\\u00e1ch m\\\\u1eddi th\\\\u00f4ng minh\\\",\\\"G\\\\u1eedi th\\\\u00f4ng b\\\\u00e1o t\\\\u1ef1 \\\\u0111\\\\u1ed9ng (Email\\\\\\/SMS\\\\\\/Telegram)\\\",\\\"M\\\\u00e3 QR m\\\\u1eebng c\\\\u01b0\\\\u1edbi & ch\\\\u1ec9 \\\\u0111\\\\u01b0\\\\u1eddng\\\",\\\"Th\\\\u1ed1ng k\\\\u00ea l\\\\u01b0\\\\u1ee3t xem, x\\\\u00e1c nh\\\\u1eadn tham d\\\\u1ef1\\\",\\\"H\\\\u1ed7 tr\\\\u1ee3 24\\\\\\/7 qua chat\\\"]\",\"description\":\"\\u0110\\u1ea7y \\u0111\\u1ee7 t\\u00ednh n\\u0103ng cao c\\u1ea5p, d\\u1ec5 d\\u00e0ng qu\\u1ea3n l\\u00fd\",\"action\":\"Ch\\u1ecdn G\\u00f3i Pro Ngay\"},{\"id\":4,\"period\":\"\\/thi\\u1ec7p\",\"features\":\"[\\\"T\\\\u1ea5t c\\\\u1ea3 t\\\\u00ednh n\\\\u0103ng c\\\\u1ee7a G\\\\u00f3i Pro\\\",\\\"Thi\\\\u1ebft k\\\\u1ebf giao di\\\\u1ec7n theo y\\\\u00eau c\\\\u1ea7u\\\",\\\"T\\\\u00ean mi\\\\u1ec1n ri\\\\u00eang .com\\\\\\/.vn\\\",\\\"M\\\\u1eddi kh\\\\u00e1ch qua Email\\\\\\/SMS\\\\\\/Telegram\\\",\\\"T\\\\u00edch h\\\\u1ee3p b\\\\u1ea3n \\\\u0111\\\\u1ed3, ch\\\\u1ec9 \\\\u0111\\\\u01b0\\\\u1eddng, l\\\\u1ecbch tr\\\\u00ecnh\\\",\\\"M\\\\u00e3 QR m\\\\u1eebng c\\\\u01b0\\\\u1edbi t\\\\u00f9y ch\\\\u1ec9nh\\\",\\\"Th\\\\u1ed1ng k\\\\u00ea chi ti\\\\u1ebft & xu\\\\u1ea5t danh s\\\\u00e1ch kh\\\\u00e1ch m\\\\u1eddi\\\",\\\"H\\\\u1ed7 tr\\\\u1ee3 k\\\\u1ef9 thu\\\\u1eadt 1:1 trong su\\\\u1ed1t th\\\\u1eddi gian s\\\\u1eed d\\\\u1ee5ng\\\",\\\"T\\\\u01b0 v\\\\u1ea5n thi\\\\u1ebft k\\\\u1ebf mi\\\\u1ec5n ph\\\\u00ed\\\"]\",\"description\":\"Tr\\u1ea3i nghi\\u1ec7m tr\\u1ecdn v\\u1eb9n, chuy\\u00ean nghi\\u1ec7p v\\u00e0 kh\\u00e1c bi\\u1ec7t\",\"action\":\"\\u0110\\u0103ng K\\u00fd G\\u00f3i VIP\"}]', NULL, '2026-10-04 06:46:48', '2026-10-04 06:46:48'),
('28', 'templates_demo_only', '1', 'Chỉ xem demo mẫu thiệp', '2026-10-14 13:08:41', '2026-10-15 12:53:35');

-- ------------------------------------------------------------
-- Table structure for `template_licenses`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `template_licenses`;
CREATE TABLE `template_licenses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `template_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `template_licenses_user_id_template_code_unique` (`user_id`,`template_code`),
  CONSTRAINT `template_licenses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table structure for `templates`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `templates`;
CREATE TABLE `templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Sang Trọng',
  `tag` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'HOT',
  `thumbnail` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_url` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `templates_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `templates`
INSERT INTO `templates` (`id`, `code`, `name`, `category`, `tag`, `thumbnail`, `file_url`, `price`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
('2', 'template_02', 'Mẫu thiệp cưới 2', 'Thiên Nhiên', 'HOT', '/uploads/images/img_1791986587_6acf8b9bc434e.png', '/templates/mau-thiep-2/mau-thiep-2.html', '99000.00', '1', '2', '2026-10-04 03:45:42', '2026-10-14 14:03:08'),
('6', 'template_passport', 'Mẫu thiệp cưới 5', 'Hiện Đại', 'NEW', '/uploads/images/img_1791984500_6acf83740077d.png', '/templates/mau-thiep-4/mau-thiep-4.html', '0.00', '1', '5', '2026-10-14 11:21:33', '2026-10-14 13:50:47'),
('7', 'template_pearl', 'Mẫu thiệp cưới 5', 'Sang Trọng', 'VIP', '/uploads/images/img_1791985853_6acf88bdef58a.png', '/templates/mau-thiep-5/mau-thiep-5.html', '0.00', '1', '6', '2026-10-14 13:08:41', '2026-10-14 13:51:15'),
('8', 'template_minimalism_red', 'Mẫu thiệp cưới 7', 'Tối Giản', 'NEW', '/uploads/images/img_1791984309_6acf82b547130.png', '/templates/mau-thiep-3/mau-thiep-3.html', '0.00', '1', '7', '2026-10-14 13:08:41', '2026-10-14 14:04:12'),
('9', 'template_e1ba289a-c887-4550-95da-ece00b96acd7', 'Mẫu thiệp cưới 1', 'Cổ Điển', 'HOT', '/uploads/images/img_1791986186_6acf8a0a2ae4c.png', '/templates/mau-thiep-1/mau-thiep-1.html', '0.00', '1', '8', '2026-10-14 13:56:34', '2026-10-14 13:56:34'),
('10', 'template_06_burgundy', 'Đỏ Đô & Lời Hẹn', 'Cổ Điển', 'NEW', '/templates/mau-thiep-6/assets/thumbnail.webp', '/templates/mau-thiep-6/mau-thiep-6.html', '0.00', '1', '8', '2026-10-16 14:34:26', '2026-10-16 14:34:26'),
('11', 'template_lilywedding_m2', 'Sắc Lily – Chiến Công & Thùy Tiên', 'Hoa Cưới', 'NEW', '/templates/mau-thiep-7/assets/thumbnail.webp', '/templates/mau-thiep-7/mau-thiep-7.html', '0.00', '1', '9', '2026-10-17 05:46:22', '2026-10-17 05:46:22');

-- ------------------------------------------------------------
-- Table structure for `users`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `paid_credits` int NOT NULL DEFAULT '0',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `card_slug` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primary_selection_pending` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_card_slug_unique` (`card_slug`),
  KEY `users_google_id_index` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `users`
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `email_verified_at`, `password`, `avatar`, `google_id`, `role`, `paid_credits`, `remember_token`, `created_at`, `updated_at`, `card_slug`, `primary_selection_pending`) VALUES
('1', 'Quản Trị Viên (Admin)', 'admin@example.com', NULL, NULL, '$2y$12$ZjfB9F62MVCv9N6o9iNhvu5OCOEfJddyF0evv5JCJWYS6ffwI7zTu', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', NULL, 'admin', '9999', NULL, '2026-10-04 03:45:42', '2026-10-04 04:03:26', NULL, '0'),
('2', 'Quản Trị Viên (Gmail Admin)', 'admin@gmail.com', NULL, NULL, NULL, 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminGmail', NULL, 'admin', '9999', NULL, '2026-10-04 03:45:42', '2026-10-04 03:45:42', NULL, '0'),
('3', '3245345', 'superadmin@acculance.com', NULL, NULL, '$2y$12$odI6URYD3mtYapEMCefU6eadN6oQJVb76rQUUEFdltbrxurqFGz/6', 'https://api.dicebear.com/7.x/avataaars/svg?seed=3245345', NULL, 'user', '0', NULL, '2026-10-04 03:58:53', '2026-10-04 03:58:53', NULL, '0'),
('4', '2234324', 'conguyen6262@gmail.com', NULL, NULL, '$2y$12$NF.v1tbEnrTWD0Z5GsE2zewV5xr93TdppELyUG0/xUOBuiS6tXXAy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=2234324', NULL, 'user', '0', NULL, '2026-10-04 04:15:40', '2026-10-04 04:15:40', NULL, '0');

-- ------------------------------------------------------------
-- Table structure for `wedding_cards`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `wedding_cards`;
CREATE TABLE `wedding_cards` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `template_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'template_01',
  `card_data` json NOT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT '1',
  `views_count` bigint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wedding_cards_slug_unique` (`slug`),
  KEY `wedding_cards_user_id_foreign` (`user_id`),
  CONSTRAINT `wedding_cards_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
