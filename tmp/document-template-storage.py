from pathlib import Path
p=Path('laravel-backend/docs/template-designs.md');s=p.read_text(encoding='utf-8');m={'public/template.html':'public/templates/mau-thiep-1/mau-thiep-1.html','/templates/passport/index.html':'/templates/mau-thiep-4/mau-thiep-4.html','public/templates/passport/':'public/templates/mau-thiep-4/'}
for a,b in m.items():s=s.replace(a,b)
s+='''

## Nơi lưu trữ thống nhất

Bản mã nguồn: `public/templates/`. Bản chạy cổng 8000: `laravel-backend/public/templates/`.

- `mau-thiep-1/mau-thiep-1.html`: thiệp truyền thống đỏ vàng.
- `mau-thiep-2/mau-thiep-2.html`: thiệp số 48.
- `mau-thiep-3/mau-thiep-3.html`: Minimalism Đỏ Đô.
- `mau-thiep-4/mau-thiep-4.html`: Passport.
- `mau-thiep-5/mau-thiep-5.html`: Pearl.

Tài nguyên riêng của mỗi mẫu nằm cùng thư mục mẫu. Database lưu đường dẫn mới; các URL cũ chuyển hướng về URL mới. Không đổi mã template hoặc nội dung thiệp của khách.
'''
p.write_text(s,encoding='utf-8')
