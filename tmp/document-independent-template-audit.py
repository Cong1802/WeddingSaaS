from pathlib import Path
p=Path('laravel-backend/docs/template-designs.md');s=p.read_text(encoding='utf-8');s+='''

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
'''
p.write_text(s,encoding='utf-8')
