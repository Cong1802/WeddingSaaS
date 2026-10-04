# Một tài khoản, một URL và quyền sử dụng mẫu 6 tháng

- Lần lưu thiệp đầu tiên chốt URL cho tài khoản. Đổi tên cô dâu/chú rể hoặc đổi mẫu không đổi URL. Backend khóa hàng user khi lưu để không tạo thêm URL bằng các yêu cầu đồng thời.
- Mỗi đơn mua ghi `plan_code` và `template_code`. Giá lấy từ gói đang bán; không lấy giá client gửi. Mẫu mới và gia hạn đều thanh toán qua VietQR, chờ admin duyệt.
- Duyệt đơn cấp quyền cho đúng user/mẫu trong 6 tháng lịch. Gia hạn sớm cộng vào hạn hiện tại; gia hạn sau hết hạn tính từ ngày duyệt. Duyệt lại cùng đơn bị chặn, không cấp thêm thời gian.
- Hết hạn chặn cập nhật thiệp và API xem công khai (HTTP 410), không gửi nội dung thiệp. Frontend không dùng bản nháp localStorage để hiển thị thiệp đã khóa hoặc khi không xác minh được quyền.
- Một mẫu đã mua còn hạn có thể dùng lại. Mẫu chưa mua cần mua riêng. Gói giá vẫn do admin cấu hình, mỗi thanh toán mua/gia hạn cho một mẫu.
- Thiệp chính không xóa ở giao diện người dùng; có thể ẩn/hiện khi quyền còn hạn. Admin vẫn quản lý dữ liệu theo quyền admin. URL đã chốt vẫn được giữ nếu bản ghi thiệp bị admin xóa.

## Dữ liệu cũ

Migration giữ nguyên tất cả thiệp. Thiệp đầu tiên là đề xuất cho URL chính. Tài khoản có nhiều thiệp được chọn một thiệp thuộc tài khoản làm thiệp chính một lần trên `/my-cards`; sau đó các URL còn lại là dữ liệu lưu trữ và bị khóa công khai.

Đối với thanh toán cũ chưa gắn mã mẫu, quyền mẫu chính được chuyển từ đơn hoàn tất gần nhất, với hạn 6 tháng tính từ `updated_at` của đơn. Thiệp không có đơn hoàn tất không tự nhận quyền miễn phí. Khi chọn thiệp chính khác, thời hạn của đơn cũ vẫn được giữ. Đơn cũ đang chờ khi được duyệt cấp quyền cho mẫu chính hiện tại nếu có; credits cũ được giữ để đối soát, không cho phép vượt kiểm tra quyền mẫu.

Nội dung gói cước được chuyển sang `/mẫu · 6 tháng`; những câu quảng cáo “toàn bộ mẫu” và “12 tháng” cũ được cập nhật. Migration giữ bản sao nội dung trước chuyển đổi để phục vụ rollback.

## Kiểm tra

- `php artisan test`: 48 test, 328 assertions đạt.
- `npm run build`: đạt; còn cảnh báo kích thước bundle hiện có.
- `node tmp/layout-check/my-cards-license.cjs`: desktop/mobile, một thiệp, ẩn/hiện, đơn gắn mẫu, chờ duyệt, đổi mẫu giữ URL, hết hạn và trạng thái chưa tạo thiệp. Dữ liệu trình duyệt là mock, không gửi thanh toán hay thông báo thật.
- `node tmp/layout-check/card-api-security.mjs`: lỗi lưu không báo thành công; thiệp bị khóa/xóa không xuất hiện từ bản nháp.
- API local thật `/api/user/cards` và danh mục gói 6 tháng đã được kiểm tra bằng phiên admin tạm; token kiểm tra được đăng xuất sau đó, không sửa bản ghi kinh doanh. Lint các thành phần đã sửa không có lỗi, còn cảnh báo về cập nhật trạng thái trong effect.

Không bổ sung số lời chúc giả từ ảnh thiết kế; chức năng lưu/đếm lời chúc chưa nằm trong thay đổi này. Thanh toán vẫn được admin xác nhận, chưa có webhook ngân hàng tự đối soát.

Mẫu số 48 nhập từ LadiPage có lỗi thư viện form bên trong iframe trên localhost (đường dẫn builder hoặc phiên bản extension không khớp runtime). Kiểm tra trình duyệt ghi nhận riêng lỗi này; không coi đó là lỗi React của trang tài khoản. Thay đổi này không chứng nhận các form RSVP của mẫu nhập ngoài hoạt động đầy đủ.
