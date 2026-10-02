# HƯỚNG DẪN KẾT NỐI SAAS THIỆP CƯỚI VỚI BACKEND LARAVEL + MYSQL (LARAGON)

Tệp hướng dẫn này giúp bạn kết nối hệ thống SaaS Thiệp cưới React Frontend với Backend Laravel & MySQL Database trên Laragon để mỗi người dùng có một **Unique URL chia sẻ trực tiếp (VD: `lovecard.click/v/thanh-thu-ba-cong`)** lưu trữ trên Database mà không cần xuất file HTML thủ công!

---

## 🚀 CÁC BƯỚC THỰC HIỆN TRÊN LARAGON

### Bước 1: Thêm File Controller & Model vào dự án Laravel

1. Chép file `WeddingCardController.php` vào thư mục:
   `app/Http/Controllers/WeddingCardController.php`

2. Chép file `WeddingCard.php` vào thư mục:
   `app/Models/WeddingCard.php`

3. Chép file `2026_09_19_000000_create_wedding_cards_table.php` vào thư mục:
   `database/migrations/`

---

### Bước 2: Chạy Migration tạo Bảng Database trong Laragon

Mở Terminal trong Laragon và chạy lệnh:
```bash
php artisan migrate
```

Lệnh này sẽ tạo bảng `wedding_cards` trong MySQL Database với đầy đủ các cột:
- `id`
- `slug` (Unique URL)
- `template_id`
- `card_data` (JSON lưu toàn bộ thông tin Chú Rể, Cô Dâu, VietQR, Ngày Cưới, Ảnh, Nhạc)
- `views_count` (Số lượt xem thiệp)

---

### Bước 3: Thêm API Routes vào Laravel (`routes/api.php`)

Mở file `routes/api.php` trong Laravel và thêm 2 dòng sau:

```php
use App\Http\Controllers\WeddingCardController;

// Route lưu thiệp từ React SaaS Editor
Route::post('/cards/save', [WeddingCardController::class, 'saveCard']);

// Route xem thiệp công khai cho khách mời
Route::get('/cards/view/{slug}', [WeddingCardController::class, 'getCardBySlug']);
```

---

### Bước 4: Kiểm tra kết nối

Khi người dùng thao tác trên React SaaS Editor:
1. Nhấp vào nút **"✨ Lưu & Link Chia Sẻ"** trên thanh Công cụ.
2. Nhập tên slug (Ví dụ: `thanh-thu-ba-cong-2026`).
3. Bấm **"Lưu Thiệp & Tạo Link"**.
4. Hệ thống sẽ tự động lưu vào MySQL Database và cấp cho khách hàng URL độc quyền kèm **Mã QR Code** để gửi cho Khách mời!
