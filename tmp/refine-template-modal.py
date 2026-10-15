from pathlib import Path
p=Path('src/components/TemplateAdminModal.jsx');s=p.read_text(encoding='utf-8');s=s.replace('Save, Camera, Image, Info','Save, Image, Info')
s=s.replace("  const tags =", "  const tagLabel = tag => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();\n  const tags =")
s=s.replace('<div className="template-admin-card-image">', '<button type="button" className="template-admin-card-image" onClick={() => fileInput.current?.click()} disabled={uploading || saving} aria-label={form.thumbnail ? \'Thay ảnh đại diện mẫu thiệp\' : \'Chọn ảnh đại diện mẫu thiệp\'}>')
s=s.replace('<span>Chọn ảnh đại diện mẫu thiệp</span>', "<span>{uploading ? 'Đang tải ảnh…' : 'Chọn ảnh đại diện mẫu thiệp'}</span>")
s=s.replace('<span className="template-admin-tag">{form.tag}</span>}</div>', '<span className="template-admin-tag">{tagLabel(form.tag)}</span>}<span className="template-admin-image-hover">{uploading ? \'Đang tải ảnh…\' : form.thumbnail ? \'Bấm để thay ảnh\' : \'Bấm để chọn ảnh\'}</span></button>')
start=s.index('        <div className="template-admin-upload">');end=s.index('\n      </aside>',start)
s=s[:start]+'''        <div className="template-admin-upload"><h3>Ảnh đại diện mẫu thiệp</h3><p>Bấm trực tiếp vào khung ảnh để chọn hoặc thay ảnh.<br />Ảnh dọc 1000 × 1400 px (5:7), WebP hoặc JPG.</p><input ref={fileInput} className="template-admin-file" type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} disabled={uploading || saving} aria-label="Chọn ảnh đại diện mẫu thiệp" tabIndex={-1} /></div>'''+s[end:]
s=s.replace("update('tag', tag)} />{tag}","update('tag', tag)} />{tagLabel(tag)}")
s=s.replace('Tag (HOT/NEW/VIP)', 'Nhãn mẫu thiệp')
p.write_text(s,encoding='utf-8')
p=Path('src/components/TemplateAdminModal.css');s=p.read_text(encoding='utf-8');s+='''
.template-admin-dialog{font-family:"Plus Jakarta Sans",sans-serif}
.template-admin-preview h2{font-family:inherit;font-size:21px;font-weight:600}
.template-admin-form h1{font-family:inherit;font-size:27px;font-weight:700;letter-spacing:-.6px}
.template-admin-card-image{display:block;width:100%;padding:0;border:0;text-align:inherit;font:inherit;cursor:pointer;color:inherit}
.template-admin-card-image:disabled{opacity:1;cursor:wait}
.template-admin-image-hover{position:absolute;bottom:0;left:0;right:0;background:#322439b3;color:#fff;font-size:12px;padding:12px;opacity:0;transform:translateY(5px);transition:opacity .18s,transform .18s;text-align:center}
.template-admin-card-image:hover .template-admin-image-hover,.template-admin-card-image:focus-visible .template-admin-image-hover{opacity:1;transform:translateY(0)}
.template-admin-field>input,.template-admin-select{font-family:inherit;font-size:13px}
.template-admin-field>input::placeholder{font-family:inherit;font-size:12px;font-weight:400;color:#a4a1af;opacity:1}
.template-admin-tags label{font-size:13px;font-weight:500;text-transform:none}
.template-admin-tag{font-family:inherit;text-transform:none;font-size:12px;font-weight:600}
.template-admin-image-empty span{font-size:12px}
.template-admin-card-copy h3{font-size:15px;font-weight:600}
@media(max-width:600px){.template-admin-form h1{font-size:23px}.template-admin-preview h2{font-size:20px}}
''';p.write_text(s,encoding='utf-8')
