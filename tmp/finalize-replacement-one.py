from pathlib import Path
p=Path('public/templates/mau-thiep-1/assets/standalone.js');s=p.read_text(encoding='utf-8').replace('if (seal && doors) {',"if (seal && doors && doors.querySelector('.door-left, .door-right')) {");p.write_text(s,encoding='utf-8')
p=Path('laravel-backend/docs/template-designs.md');s=p.read_text(encoding='utf-8');s+='''

## Thay mẫu số 1 — 14/10/2026

Mẫu 1 hiện dùng bản `Pictures/template thiệp 5/Thư Mời Lễ Cưới.html`, giữ nguyên URL và mã mẫu. Đã giữ chuyển động rèm đỏ trái/phải bằng keyframe `mH` của bản gốc, ảnh, font, form và hiệu ứng; 105 tài nguyên ngoài được tải về thư mục riêng. Bản trước khi thay nằm ở `tmp/template-one-before-replacement-20261014/`.
''';p.write_text(s,encoding='utf-8')
