# Thêm mẫu thiệp

## Thiết kế hiện tại

- Thiệp truyền thống đỏ vàng (ảnh editor): `public/templates/mau-thiep-1/mau-thiep-1.html` ở frontend; bản chạy tại cổng 8000 là `laravel-backend/public/templates/mau-thiep-1/mau-thiep-1.html`.
- Thiệp số 48: `laravel-backend/public/templates/mau-thiep-2/mau-thiep-2.html`.
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

## Mẫu Passport (template thiệp 4)

- Mã database: `template_passport`; tên: Passport – Hành trình yêu thương.
- Thiết kế: `/templates/mau-thiep-4/mau-thiep-4.html`; bản nguồn ở `public/templates/mau-thiep-4/`, bản phục vụ cổng 8000 ở `laravel-backend/public/templates/mau-thiep-4/`.
- Ảnh và font lưu cục bộ trong `assets/`. Không sử dụng runtime, tracking, form gửi dữ liệu hoặc popup tài khoản ngân hàng của nhà phát hành gốc.
- Runtime nhỏ `assets/passport.js` xử lý mở passport, lịch, đếm ngược và bản đồ. Form RSVP đã khôi phục theo bố cục gốc. Link thiệp chia sẻ truyền slug vào iframe; phản hồi lưu trong bảng `card_rsvps` qua `POST /api/cards/view/{slug}/rsvp`. Chủ thiệp có thể đọc qua `GET /api/user/cards/{id}/rsvps` (đăng nhập). Bản xem mẫu báo rõ chưa gửi. Nút mừng cưới chưa khôi phục.
- `src/templates/passportTemplate.js` đồng bộ các trường lặp lại trong editor và guest viewer qua `data-card-field`. Các ID nguyên bản được thêm tiền tố để tránh trùng selector của mẫu khác.
- Migration `2026_10_14_100000_add_passport_template.php` đăng ký mẫu mà không sửa các mẫu hiện có.


## Nơi lưu trữ thống nhất

Bản mã nguồn: `public/templates/`. Bản chạy cổng 8000: `laravel-backend/public/templates/`.

- `mau-thiep-1/mau-thiep-1.html`: thiệp truyền thống đỏ vàng.
- `mau-thiep-2/mau-thiep-2.html`: thiệp số 48.
- `mau-thiep-3/mau-thiep-3.html`: Minimalism Đỏ Đô.
- `mau-thiep-4/mau-thiep-4.html`: Passport.
- `mau-thiep-5/mau-thiep-5.html`: Pearl.

Tài nguyên riêng của mỗi mẫu nằm cùng thư mục mẫu. Database lưu đường dẫn mới; các URL cũ chuyển hướng về URL mới. Không đổi mã template hoặc nội dung thiệp của khách.


## Kiểm tra nguồn độc lập — 14/10/2026

Cả 5 mẫu tải ảnh, font, CSS, JavaScript và nhạc từ chính thư mục của mẫu. Không cần CDN hoặc máy chủ nhà cung cấp khi mở trang.

- Đã chuyển 242 tài nguyên bên ngoài về máy chủ, gồm font gốc và nhạc.
- Mẫu 1–2 dùng runtime độc lập `assets/standalone.js`; không chạy LadiPage runtime hoặc form gửi về LadiPage.
- Mẫu 3 bỏ runtime Next.js, dữ liệu hydration và tracking của website gốc. Giữ màn hình mở riêng, font Viaoda Libre, The Nautigal và Lora; tương tác chạy bằng mã cục bộ.
- Mẫu 4 giữ mở passport, máy bay, tim rơi, trái đất xoay, hiệu ứng xuất hiện và form của hệ thống.
- Mẫu 5 giữ hiệu ứng và giao diện Pearl, đổi ảnh/font/nhạc sang file cục bộ; form không gửi về nhà cung cấp.
- CSP chỉ cho tải tài nguyên và gửi request đến cùng origin. Bản đồ không tự nhúng Google; nút bản đồ/lịch chỉ mở dịch vụ khi người xem bấm. Các liên kết này cần Internet khi sử dụng, nhưng không ảnh hưởng việc hiển thị thiệp.
- Ảnh đại diện của 5 mẫu hiện tại lưu trong `/uploads/images/`, không tải từ đối tác.
- Đã dọn runtime, CSS/font tiện ích trình duyệt, cache mirror và file không nằm trong đồ thị tài nguyên sử dụng. Bản trước khi dọn giữ ở `tmp/template-independent-backup/` để đối chiếu.

Chạy `node scripts/check-template-independence.mjs` để kiểm tra 5 mẫu: tài nguyên tồn tại, font đúng định dạng, không có tài nguyên CDN hay phụ thuộc giữa các thư mục mẫu.

Kiểm tra mã tương tác được chạy trong DOM mô phỏng, bao gồm mở mẫu 2/3/4, khóa cuộn, hạt tim và không gọi mạng lúc khởi tạo. Chưa xác nhận trực quan toàn bộ bố cục trong trình duyệt.


## Thay mẫu số 1 — 14/10/2026

Mẫu 1 hiện dùng bản `Pictures/template thiệp 5/Thư Mời Lễ Cưới.html`, giữ nguyên URL và mã mẫu. Đã giữ chuyển động rèm đỏ trái/phải bằng keyframe `mH` của bản gốc, ảnh, font, form và hiệu ứng; 105 tài nguyên ngoài được tải về thư mục riêng. Bản trước khi thay nằm ở `tmp/template-one-before-replacement-20261014/`.
