# SEO landing WeddingSaaS

Trang chính nhắm đến nhu cầu “tạo thiệp cưới online”, với các cụm liên quan “mẫu thiệp cưới online” và “thiệp cưới điện tử” dùng trong nội dung hiện có. Không thêm meta keywords, điểm đánh giá giả hoặc giá cố định vào schema.

`npm run build` tạo bundle và `laravel-backend/public/dist/landing.html` từ chính component landing. Laravel trả nội dung HTML, metadata và schema cho cả người dùng lẫn crawler. Các màn hình tài khoản, quản trị và thiệp được chia sẻ có `noindex`. Sitemap hiện chỉ gồm landing; mở rộng khi các trang công khai khác có nội dung riêng được kiểm tra.

## Đưa lên production

1. Đặt document root vào `laravel-backend/public`, bật HTTPS và chuyển hướng HTTP hoặc tên miền phụ về `https://weddingsaas.online/` tại web server.
2. Đặt `APP_URL=https://weddingsaas.online` và `SEO_URL=https://weddingsaas.online` trong môi trường production. Khi đổi domain, cập nhật URL sitemap trong `public/robots.txt`.
3. Chạy `npm run build`, deploy cả thư mục `public/dist` và ảnh `public/seo`, rồi chạy `php artisan config:cache` theo quy trình deploy.
4. Kiểm tra mã nguồn trang chính có một H1, canonical, description, Open Graph và JSON-LD. Kiểm tra ảnh chia sẻ trả HTTP 200, `/sitemap.xml` trả XML, `/robots.txt` có URL sitemap.
5. Xác minh quyền sở hữu tên miền trong Google Search Console, gửi `https://weddingsaas.online/sitemap.xml` và dùng URL Inspection kiểm tra landing sau deploy.
6. Theo dõi truy vấn, impressions, clicks, indexation và Core Web Vitals từ dữ liệu thực tế. Tạo nội dung hướng dẫn hữu ích và trang mẫu riêng theo nhu cầu người dùng trước khi mở rộng sitemap.

Không thể đảm bảo thứ hạng hoặc thời gian lên top. Việc deploy, xác minh Search Console và đo hiệu năng production cần được thực hiện trên hệ thống thực tế; thay đổi trong workspace không tự xuất bản lên tên miền.
