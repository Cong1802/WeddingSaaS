import { useState } from 'react';
import { ArrowRight, Headphones, Heart, Mail, Music2, QrCode, ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.png';
import background from '../../images/section-08-footer/footer-background.png';
import './SiteFooter.css';

const safeUrl = value => typeof value === 'string' && /^(https?:\/\/|mailto:|tel:)/i.test(value.trim()) ? value.trim() : null;
const Facebook = () => <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 22v-9h3l.5-4H14V7c0-1 .3-2 2-2h2V1.5C17 1.2 16 1 15 1c-3 0-5 2-5 5v3H7v4h3v9z" /></svg>;
const Instagram = () => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
const Youtube = () => <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 6 3-6 3z" fill="#ffe7e9" /></svg>;
const columns = [
  { title: 'Sản phẩm', links: [['Mẫu thiệp cưới', '#templates'], ['Tính năng', '#features'], ['Bảng giá', '#pricing'], ['Khách hàng', '#testimonials'], ['Câu hỏi thường gặp', '#faq']] },
  { title: 'Hỗ trợ', links: [['Hướng dẫn sử dụng', '#steps'], ['Liên hệ', '#footer-contact'], ['Chính sách bảo mật', null, 'privacy_url'], ['Điều khoản dịch vụ', null, 'terms_url'], ['Hướng dẫn thanh toán', '#pricing']] },
  { title: 'Về chúng tôi', links: [['Giới thiệu', '#whyus'], ['Blog chia sẻ', null, 'blog_url'], ['Câu chuyện khách hàng', '#testimonials'], ['Tuyển dụng', null, 'careers_url'], ['Đối tác', null, 'partners_url']] },
];
const socials = [
  { name: 'Facebook', key: 'social_facebook', icon: Facebook },
  { name: 'Instagram', key: 'social_instagram', icon: Instagram },
  { name: 'TikTok', key: 'social_tiktok', icon: Music2 },
  { name: 'YouTube', key: 'social_youtube', icon: Youtube },
  { name: 'Zalo', key: 'social_zalo' },
];

export default function SiteFooter({ settings = {} }) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const submit = async event => {
    event.preventDefault();
    if (busy || !consent) return;
    setBusy(true);
    setFeedback(null);
    try {
      const response = await fetch('/api/public/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ email: email.trim(), consent }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.errors?.email?.[0] || (response.status === 429 ? 'Bạn đã thử nhiều lần. Vui lòng đợi một phút rồi thử lại.' : data.message || 'Chưa thể đăng ký. Vui lòng thử lại sau.'));
      setFeedback({ success: true, message: data.message });
      setEmail('');
      setConsent(false);
    } catch (error) {
      setFeedback({ success: false, message: error instanceof SyntaxError || error instanceof TypeError ? 'Không thể kết nối. Vui lòng thử lại sau.' : error.message });
    } finally { setBusy(false); }
  };

  return (
    <footer className="site-footer" style={{ '--footer-artwork': `url(${background})` }} aria-label="Thông tin WeddingSaaS">
      <div className="site-footer__inner">
        <div className="site-footer__columns">
          <div className="site-footer__brand" id="footer-contact">
            <a href="#home" aria-label="WeddingSaaS — Trang chủ"><img src={logo} alt="WeddingSaaS — Thiệp cưới Online Thông Minh" width="270" height="85" loading="lazy" /></a>
            <p>Đồng hành cùng hàng ngàn cặp đôi tạo nên tấm thiệp cưới đẹp, tinh tế và đầy ý nghĩa trong ngày trọng đại.</p>
            <div className="site-footer__socials">
              {socials.map(({ name, key, icon: Icon }) => {
                const url = safeUrl(settings[key]);
                const content = Icon ? <Icon size={21} /> : <span className="site-footer__zalo">Zalo</span>;
                return url ? <a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={name}>{content}</a> : <span key={key} className="is-unavailable" aria-label={`${name} — sắp cập nhật`} title={`${name} — sắp cập nhật`}>{content}</span>;
              })}
            </div>
            {settings.contact_email && <a className="site-footer__contact" href={`mailto:${settings.contact_email}`}><Mail size={15} />{settings.contact_email}</a>}
            {settings.contact_phone && <a className="site-footer__contact" href={`tel:${settings.contact_phone}`}>{settings.contact_phone}</a>}
          </div>
          {columns.map(column => <nav className="site-footer__links" key={column.title} aria-label={column.title}><h2>{column.title}</h2><ul>{column.links.map(([label, anchor, setting]) => { const url = anchor || safeUrl(settings[setting]); return <li key={label}>{url ? <a href={url}>{label}</a> : <span title="Sắp cập nhật">{label}</span>}</li>; })}</ul></nav>)}
          <div className="site-footer__newsletter">
            <h2>Nhận thông tin mới nhất</h2>
            <p>Đăng ký để nhận ưu đãi, mẫu thiệp mới và các tips hữu ích từ WeddingSaaS.</p>
            <form onSubmit={submit} aria-label="Đăng ký nhận email">
              <label className="site-footer__email"><Mail size={21} aria-hidden="true" /><input type="email" aria-label="Email của bạn" placeholder="Nhập email của bạn" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} disabled={busy} /><button type="submit" aria-label="Đăng ký nhận thông tin" disabled={busy}>{busy ? <span className="site-footer__loading" /> : <ArrowRight size={22} />}</button></label>
              <label className="site-footer__consent"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} required disabled={busy} /><span>Tôi đồng ý nhận email từ WeddingSaaS.</span></label>
              <div className={`site-footer__feedback${feedback?.success ? ' is-success' : ''}`} role="status" aria-live="polite">{feedback?.message}</div>
            </form>
          </div>
        </div>
        <div className="site-footer__divider" aria-hidden="true"><span /><Heart size={22} /><span /></div>
        <div className="site-footer__bottom">
          <p>© 2026 WeddingSaaS. Tất cả quyền được bảo lưu.</p>
          <div className="site-footer__payment"><QrCode size={25} /><strong>VietQR</strong><span>Chuyển khoản ngân hàng</span></div>
          <div className="site-footer__assurances"><div><ShieldCheck size={29} /><p><strong>Bảo mật thông tin</strong><span>Tôn trọng quyền riêng tư</span></p></div><div><Headphones size={29} /><p><strong>Hỗ trợ 24/7</strong><span>Luôn sẵn sàng giúp đỡ</span></p></div></div>
        </div>
      </div>
    </footer>
  );
}
