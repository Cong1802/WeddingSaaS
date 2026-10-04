# Thêm mẫu thiệp

## Thiết kế hiện tại

- Thiệp truyền thống đỏ vàng (ảnh editor): `public/template.html` ở frontend; bản chạy tại cổng 8000 là `laravel-backend/public/template.html`.
- Thiệp số 48: `laravel-backend/public/https___www.lovecard.click_thiepso48/www.lovecard.click/thiepso48.html`.
- Database lưu tên, danh mục, ảnh giới thiệu và file thiết kế. Nhiều mẫu có thể dùng chung một file HTML; đổi tên/ảnh giới thiệu không tạo ra bố cục mới.

## Thêm mẫu dùng thiết kế có sẵn

1. Mở `/admin/templates`, chọn **Thêm mẫu thiệp mới**.
2. Chọn **Thiết kế thiệp**, dùng **Xem trước thiết kế** để kiểm tra.
3. Điền tên, danh mục, nhãn và ảnh xem trước; lưu.
4. Mẫu đang bật xuất hiện ở trang chủ và bộ chọn mẫu trong editor. Mã mẫu tự tạo và không thay đổi khi sửa tên; giá quản lý ở gói cước.

## Thêm một thiết kế HTML mới

1. Đặt HTML và tài nguyên liên quan vào `laravel-backend/public/templates/ten-mau/`, ví dụ `index.html`, `assets/style.css`, `assets/photo.jpg`.
2. Dùng đường dẫn tài nguyên tương đối trong HTML, ví dụ `./assets/style.css`. Nếu chạy Vite riêng, sao chép thư mục tương ứng sang `public/templates/ten-mau/`.
3. Mở `/templates/ten-mau/index.html` để xác nhận thiết kế tải được.
4. Tải lại trang admin; file HTML được nhận diện tự động trong ô **Thiết kế thiệp**. Thêm mẫu và chọn file đó.

Thiết kế cần tương thích với cơ chế gán dữ liệu editor. Hiện tại editor/guest viewer dùng selector của các mẫu LadiPage: `#HEADLINE3 .ladi-headline` (tiêu đề), `#PARAGRAPH2 .ladi-paragraph` (ngày), `#PARAGRAPH3 .ladi-paragraph` (chú rể), `#PARAGRAPH5 .ladi-paragraph` (cô dâu), `#PARAGRAPH6 .ladi-paragraph` (địa chỉ), `#PARAGRAPH8` và `#PARAGRAPH9 .ladi-paragraph` (bố mẹ), `#IMAGE3` (ảnh bìa). Xem đầy đủ trong `src/components/WeddingCardPreview.jsx` và `src/components/GuestCardViewer.jsx`.

HTML bất kỳ có thể hiển thị nhưng các trường sẽ không tự cập nhật nếu không có selector tương ứng. Thiết kế có cấu trúc khác cần bổ sung bộ ánh xạ và kiểm tra cả editor lẫn link chia sẻ. Admin hiện chọn file đã có trên máy chủ, chưa có chức năng upload ZIP/HTML trong trình duyệt.

Nhãn VIP chỉ là nhãn giới thiệu; thay đổi này không áp đặt giới hạn mẫu theo gói.
