from pathlib import Path
p=Path('src/components/TemplateAdminModal.css');s=p.read_text(encoding='utf-8-sig').replace('font:500 13px inherit','font-family:inherit;font-size:13px;font-weight:500').replace('font:600 14px inherit','font-family:inherit;font-size:14px;font-weight:600');p.write_text(s,encoding='utf-8')
