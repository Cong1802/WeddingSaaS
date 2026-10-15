import AdminSelect2 from './AdminSelect2';
import React, { useEffect, useRef, useState } from 'react';
import { X, ExternalLink, Save, Image, Info } from 'lucide-react';
import floral from '../../images/shared/florals/shared-floral-sprig.png';
import './TemplateAdminModal.css';

export default function TemplateAdminModal({ form, setForm, designs, token, onClose, onSave, notify }) {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const dialog = useRef(null);
  const fileInput = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.querySelector('input[type="text"]')?.focus();
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  const autoName = useRef(!form.name || /^Mẫu thiệp cưới \d+$/.test(form.name));
  useEffect(() => {
    if (autoName.current) {
      const design = designs.find(item => item.url === (form.file_url || '/templates/mau-thiep-1/mau-thiep-1.html'));
      if (design && form.name !== design.name) setForm(previous => ({ ...previous, name: design.name }));
    }
  }, [designs, form.file_url, form.name, setForm]);
  const chooseDesign = value => {
    const design = designs.find(item => item.url === value);
    setForm(previous => ({ ...previous, file_url: value, name: autoName.current && design ? design.name : previous.name }));
  };
  const changeName = value => {
    autoName.current = value === designs.find(item => item.url === form.file_url)?.name;
    setForm(previous => ({ ...previous, name: value }));
  };
  const update = (field, value) => setForm(previous => ({ ...previous, [field]: value }));
  const upload = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData(); data.append('file', file);
    try {
      const response = await fetch('/api/admin/upload/image', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: data });
      const result = await response.json();
      if (!response.ok || !result.success) throw Error(result.message || 'Không tải được ảnh.');
      update('thumbnail', result.url);
      notify('Đã tải ảnh lên thành công!');
    } catch (error) { notify(error.message, true); }
    finally { setUploading(false); event.target.value = ''; }
  };
  const submit = async event => {
    event.preventDefault();
    if (uploading || saving) return;
    if (!form.thumbnail) { notify('Vui lòng chọn ảnh đại diện mẫu thiệp.', true); fileInput.current?.focus(); return; }
    setSaving(true);
    try { await onSave(event); } finally { setSaving(false); }
  };
  const keys = event => {
    if (event.key === 'Escape' && dialog.current.querySelector('.select2-container--open')) return;
    if (event.key === 'Escape' && !saving && !uploading) onClose();
    if (event.key !== 'Tab') return;
    const elements = [...dialog.current.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]')].filter(element => element.type !== 'hidden' && element.tabIndex !== -1);
    const first = elements[0], last = elements.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };
  const categories = [...new Set(['Sang Trọng', 'Hiện Đại', 'Cổ Điển', 'Tối Giản', 'Vintage', 'Thiên Nhiên', 'Hàn Quốc', form.category].filter(Boolean))];
  const tagLabel = tag => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
  const tags = [...new Set(['HOT', 'NEW', 'VIP', form.tag].filter(Boolean))];
  return <div className="template-admin-backdrop" onKeyDown={keys}>
    <section className="template-admin-dialog" role="dialog" aria-modal="true" aria-labelledby="template-admin-title" ref={dialog}>
      <button className="template-admin-close" type="button" aria-label="Đóng cửa sổ" onClick={onClose} disabled={saving || uploading}><X size={22} /></button>
      <aside className="template-admin-preview" style={{ '--preview-floral': `url(${floral})` }}>
        <h2>Xem trước mẫu thiệp</h2><p>Đây là cách mẫu thiệp sẽ hiển thị trong danh sách trên website.</p>
        <article className="template-admin-card">
          <button type="button" className="template-admin-card-image" onClick={() => fileInput.current?.click()} disabled={uploading || saving} aria-label={form.thumbnail ? 'Thay ảnh đại diện mẫu thiệp' : 'Chọn ảnh đại diện mẫu thiệp'}>{form.thumbnail ? <img src={form.thumbnail} alt="Ảnh đại diện mẫu thiệp" /> : <div className="template-admin-image-empty"><Image size={38} strokeWidth={1.2} /><span>{uploading ? 'Đang tải ảnh…' : 'Chọn ảnh đại diện mẫu thiệp'}</span></div>}{form.tag && <span className="template-admin-tag">{tagLabel(form.tag)}</span>}<span className="template-admin-image-hover">{uploading ? 'Đang tải ảnh…' : form.thumbnail ? 'Bấm để thay ảnh' : 'Bấm để chọn ảnh'}</span></button>
          <div className="template-admin-card-copy"><span>{form.category || 'Danh mục'}</span><h3>{form.name || 'Tên mẫu thiệp của bạn'}</h3></div>
        </article>
        <div className="template-admin-upload"><h3>Ảnh đại diện mẫu thiệp</h3><p>Bấm trực tiếp vào khung ảnh để chọn hoặc thay ảnh.<br />Ảnh dọc 1000 × 1400 px (5:7), WebP hoặc JPG.</p><input ref={fileInput} className="template-admin-file" type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} disabled={uploading || saving} aria-label="Chọn ảnh đại diện mẫu thiệp" tabIndex={-1} /></div>
      </aside>
      <form className="template-admin-form" onSubmit={submit}>
        <header><h1 id="template-admin-title">{form.id ? 'Chỉnh sửa mẫu thiệp' : 'Thêm mẫu thiệp nổi bật'}</h1><p>Hoàn thiện thông tin để giới thiệu mẫu thiệp trên website.</p></header>
        <label className="template-admin-field">Thiết kế thiệp<div className="template-admin-select"><AdminSelect2 required label="Thiết kế thiệp" value={form.file_url || '/templates/mau-thiep-1/mau-thiep-1.html'} onChange={chooseDesign} options={designs.map(design => ({ value: design.url, label: design.name }))} /></div></label>
        <label className="template-admin-field">Tên mẫu thiệp<input required maxLength={255} type="text" placeholder="Ví dụ: Lễ Cưới Hoàng Gia" value={form.name} onChange={event => changeName(event.target.value)} /></label>
        <fieldset className="template-admin-tags"><legend>Nhãn mẫu thiệp</legend><div>{tags.map(tag => <label key={tag} className={form.tag === tag ? 'selected' : ''}><input type="radio" name="template-tag" value={tag} checked={form.tag === tag} onChange={() => update('tag', tag)} />{tagLabel(tag)}</label>)}</div></fieldset>
        <label className="template-admin-field">Danh mục<div className="template-admin-select"><AdminSelect2 required label="Danh mục" value={form.category} onChange={value => update('category', value)} options={categories.map(category => ({ value: category, label: category }))} /></div></label>
        <div className="template-admin-design-note"><ExternalLink size={21} /><div><a href={form.file_url || '/templates/mau-thiep-1/mau-thiep-1.html'} target="_blank" rel="noopener noreferrer">Xem trước thiết kế thiệp ↗</a><p>Ảnh đại diện dùng để giới thiệu mẫu. Bố cục thiệp được lấy từ thiết kế bạn chọn.</p></div></div>
        <div className="template-admin-info"><Info size={21} /><p>Giá được quản lý theo gói cước.<br />{form.id ? 'Mã mẫu được giữ nguyên khi chỉnh sửa.' : 'Mã mẫu được tạo tự động.'}</p></div>
        <footer><button type="button" onClick={onClose} disabled={saving || uploading}>Hủy</button><button type="submit" disabled={saving || uploading}><Save size={20} />{saving ? 'Đang lưu…' : 'Lưu mẫu thiệp'}</button></footer>
      </form>
    </section>
  </div>;
}
