from pathlib import Path
p=Path('src/components/TemplateAdminModal.jsx');s=p.read_text(encoding='utf-8');s="import AdminSelect2 from './AdminSelect2';\n"+s
s=s.replace("    if (event.key === 'Escape' && !saving && !uploading) onClose();", "    if (event.key === 'Escape' && dialog.current.querySelector('.select2-container--open')) return;\n    if (event.key === 'Escape' && !saving && !uploading) onClose();")
s=s.replace('select:not(:disabled), a[href]', 'select:not(:disabled), a[href], [tabindex="0"]')
start=s.index('<select required value={form.file_url');end=s.index('</select>',start)+len('</select>');s=s[:start]+'''<AdminSelect2 required label="Thiết kế thiệp" value={form.file_url || '/template.html'} onChange={value => update('file_url', value)} options={designs.map(design => ({ value: design.url, label: design.name }))} />'''+s[end:]
start=s.index('<select required value={form.category');end=s.index('</select>',start)+len('</select>');s=s[:start]+'''<AdminSelect2 required label="Danh mục" value={form.category} onChange={value => update('category', value)} options={categories.map(category => ({ value: category, label: category }))} />'''+s[end:]
p.write_text(s,encoding='utf-8')
p=Path('src/components/TemplateAdminModal.css');s=p.read_text(encoding='utf-8');s+='''
.template-admin-select{position:relative}
.template-admin-select>.select2-container{flex:1;min-width:0}
.template-admin-dialog .select2-container{font-family:"Plus Jakarta Sans",sans-serif;font-size:13px}
.template-admin-dialog .select2-container--default .select2-selection--single{height:44px;border:0;background:transparent;border-radius:9px;outline:none}
.template-admin-dialog .select2-container--default .select2-selection--single .select2-selection__rendered{line-height:44px;color:#282739;padding-left:0;padding-right:32px}
.template-admin-dialog .select2-container--default .select2-selection--single .select2-selection__arrow{height:44px;right:10px}
.template-admin-dialog .select2-dropdown{border:1px solid #ded5e9;border-radius:10px;box-shadow:0 10px 30px #30203a1a;overflow:hidden;background:#fff;color:#37374c;z-index:1100}
.template-admin-dialog .select2-search--dropdown{padding:8px}
.template-admin-dialog .select2-container--default .select2-search--dropdown .select2-search__field{font-family:inherit;font-size:13px;padding:9px 11px;border:1px solid #dfdae7;border-radius:7px;outline:none;height:36px;width:100%}
.template-admin-dialog .select2-search__field:focus{border-color:#a772db!important}
.template-admin-dialog .select2-search__field::placeholder{font-size:12px;color:#a4a1af}
.template-admin-dialog .select2-results__option{font-size:13px;padding:10px 12px}
.template-admin-dialog .select2-container--default .select2-results__option[aria-selected=true]{background:#f5ecff;color:#8243bc}
.template-admin-dialog .select2-container--default .select2-results__option--highlighted[aria-selected]{background:#8b43d1;color:#fff}
.template-admin-dialog .select2-container--default .select2-results>.select2-results__options{max-height:220px}
''';p.write_text(s,encoding='utf-8')
