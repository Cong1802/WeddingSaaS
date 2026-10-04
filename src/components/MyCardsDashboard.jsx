import React, { useState, useEffect, useCallback } from 'react';
import { Eye, Pencil, Copy, Check, Heart, Mail, ChevronDown, QrCode, Share2, LockKeyhole, RefreshCw, ExternalLink } from 'lucide-react';
import logo from '../assets/logo.png';
import useTemplates, { normalizeTemplate } from '../templates/useTemplates';
import PurchaseModal from './PurchaseModal';
import './MyCardsDashboard.css';

const date = value => value ? new Date(value).toLocaleDateString('vi-VN') : 'Chưa kích hoạt';

export default function MyCardsDashboard({ user, token, onBackToLanding, onGoToEditor, onOpenAuthModal, onOpenAdmin, onLogout, settings = {} }) {
  const templates = useTemplates();
  const [account, setAccount] = useState({ cards: [], licenses: [], legacy_cards: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [menu, setMenu] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [purchase, setPurchase] = useState(null);
  const [primaryId, setPrimaryId] = useState('');
  const [busy, setBusy] = useState(false);
  const card = account.cards[0];
  const active = !!card?.access?.active;
  const url = account.card_url || '';
  const title = card?.card_data?.title || [card?.card_data?.groomName, card?.card_data?.brideName].filter(Boolean).join(' & ') || 'Thiệp cưới của bạn';

  const load = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/user/cards', { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
      const data = await response.json();
      if (!response.ok) throw Error(data.message || 'Không tải được thiệp.');
      setAccount(data);
      setPrimaryId(String(data.cards[0]?.id || data.legacy_cards?.[0]?.id || ''));
    } catch (error) { setError(error.message); }
    finally { setLoading(false); }
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const mutate = async (path, data, method = 'POST') => {
    setBusy(true); setError('');
    try {
      const response = await fetch(path, { method, headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw Error(result.message || 'Không thể cập nhật thiệp.');
      await load();
      return true;
    } catch (error) { setError(error.message); return false; }
    finally { setBusy(false); }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { setError('Không sao chép được. Bạn có thể chọn và sao chép liên kết bên dưới.'); }
  };
  const share = async () => {
    try { if (navigator.share) await navigator.share({ title, url }); else await copy(); }
    catch (error) { if (error.name !== 'AbortError') setError('Không thể chia sẻ liên kết.'); }
  };
  const downloadQr = async () => {
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(url)}`);
      if (!response.ok) throw Error('Không tạo được mã QR.');
      const image = URL.createObjectURL(await response.blob());
      const link = document.createElement('a'); link.href = image; link.download = `thiep-${card.slug}-qr.png`; link.click();
      setTimeout(() => URL.revokeObjectURL(image), 1000);
    } catch { setError('Không tải được mã QR. Vui lòng thử lại.'); }
  };
  const activateTemplate = async template => {
    const owned = account.licenses.find(license => license.template_code === template.id && new Date(license.expires_at) > new Date());
    if (!owned) { setPurchase(template); return; }
    if (card) {
      const saved = await mutate('/api/cards/save', { slug: card.slug, template_id: template.id, card_data: card.card_data });
      if (!saved) return;
      setShowTemplates(false);
      onGoToEditor(template, 'pro', { ...card, template_id: template.id, template });
    } else onGoToEditor(template);
  };
  const renew = () => {
    const template = card?.template ? normalizeTemplate(card.template) : templates.find(template => template.id === card?.template_id);
    if (template) setPurchase(template);
    else { setShowTemplates(true); setError('Thiết kế cũ không còn trong danh sách. Hãy chọn mẫu đang được bán.'); }
  };

  return <div className="my-card-page">
    <header className="my-card-header">
      <button className="my-card-brand" onClick={onBackToLanding}><img src={settings.site_logo || logo} alt={settings.site_name || 'WeddingSaaS'} /></button>
      <nav aria-label="Điều hướng website">{[['Trang chủ', ''], ['Mẫu thiệp', 'templates'], ['Tính năng', 'features'], ['Bảng giá', 'pricing'], ['Hướng dẫn', 'how-it-works'], ['Liên hệ', 'faq']].map(([label, anchor]) => <a key={label} href={`/#${anchor}`}>{label}</a>)}</nav>
      <div className="my-card-account">
        <button onClick={() => user ? setMenu(!menu) : onOpenAuthModal()}>{user?.avatar && <img src={user.avatar} alt="" />}<span>{user?.name || 'Đăng nhập'}</span><ChevronDown size={18} /></button>
        {menu && <div className="my-card-menu">{user?.role === 'admin' && <button onClick={onOpenAdmin}>Quản trị admin</button>}<button onClick={onLogout}>Đăng xuất</button></div>}
      </div>
    </header>
    <main className="my-card-main">
      <div className="my-card-heading"><h1>Thiệp cưới của bạn</h1><div className="my-card-divider"><Heart size={14} fill="currentColor" /></div><p>Mọi thông tin cho ngày vui, trong một không gian.</p></div>
      {error && <div className="my-card-alert" role="alert">{error}<button onClick={load}><RefreshCw size={16} /> Thử lại</button></div>}
      {!user ? <section className="my-card-empty"><Heart size={36} /><h2>Lưu giữ ngày vui của bạn</h2><p>Đăng nhập để quản lý thiệp và mẫu đã mua.</p><button className="primary" onClick={onOpenAuthModal}>Đăng nhập</button></section> : loading ? <div className="my-card-empty" role="status">Đang tải thiệp của bạn…</div> : <>
        {account.primary_selection_pending && <section className="my-card-selection"><h2>Chọn thiệp chính của bạn</h2><p>Bạn có nhiều thiệp từ trước. Chọn một URL sử dụng lâu dài; các thiệp còn lại được lưu trữ, giữ nguyên dữ liệu. Lựa chọn này chỉ thực hiện một lần.</p><select aria-label="Thiệp chính" value={primaryId} onChange={event => setPrimaryId(event.target.value)}>{account.legacy_cards.map(item => <option key={item.id} value={item.id}>{item.card_data?.title || item.slug} — /v/{item.slug}</option>)}</select><button className="primary" disabled={busy || !primaryId} onClick={() => window.confirm('Giữ URL của thiệp này làm URL cố định?') && mutate('/api/user/cards/select-primary', { card_id: Number(primaryId) })}>Chọn thiệp chính</button></section>}
        {card ? <article className="my-card-feature">
          <div className="my-card-cover"><img src={card.card_data?.heroImage || card.template?.thumbnail || logo} onError={event => { event.currentTarget.src = logo; }} alt={`Ảnh bìa ${title}`} /><a href={active && card.is_published ? url : undefined} aria-disabled={!active || !card.is_published} target="_blank" rel="noopener noreferrer">{active && card.is_published ? <>Xem thiệp hoàn chỉnh <ExternalLink size={15} /></> : 'Thiệp hiện đang khóa hoặc được ẩn'}</a></div>
          <div className="my-card-details">
            <div className="my-card-status-row"><span className={`my-card-status ${active ? 'active' : 'locked'}`}>{active ? <><span />{card.is_published ? 'Đang hiển thị' : 'Đang ẩn'}</> : <><LockKeyhole size={14} /> Đã khóa</>}</span><button className="my-card-refresh" aria-label="Tải lại trạng thái thiệp" onClick={load}><RefreshCw size={18} /></button></div>
            <h2>{title}</h2><p className="my-card-event">Lễ thành hôn <span>•</span> {card.card_data?.weddingDate || 'Chưa cập nhật ngày cưới'}</p>
            <div className="my-card-stats"><span><Eye size={24} /> {Number(card.views_count || 0).toLocaleString('vi-VN')} lượt xem</span><span><Heart size={23} /> {card.template?.name || 'Mẫu thiệp'}</span></div>
            <div className="my-card-license"><strong>{active ? `Sử dụng đến ${date(card.access.expires_at)}` : 'Cần mua hoặc gia hạn mẫu để mở lại thiệp'}</strong><span>Mỗi lần thanh toán mở quyền dùng mẫu trong 6 tháng.</span></div>
            <div className="my-card-actions"><button className="primary" disabled={busy || account.primary_selection_pending} onClick={() => active ? onGoToEditor(null, 'pro', card) : renew()}>{active ? <Pencil size={21} /> : <LockKeyhole size={21} />}{active ? 'Chỉnh sửa thiệp' : 'Mua / gia hạn mẫu'}</button><a className="outline" href={active && card.is_published ? url : undefined} aria-disabled={!active || !card.is_published} target="_blank" rel="noopener noreferrer"><Eye size={23} /> Xem trước</a></div>
            <div className="my-card-share"><h3>Chia sẻ ngày vui</h3><p>{active ? 'Gửi liên kết này đến người thân và bạn bè.' : 'Liên kết được giữ nguyên và sẽ mở lại khi mẫu được kích hoạt.'}</p><div className="my-card-link"><input aria-label="Liên kết thiệp cố định" readOnly value={url} /><button onClick={copy}>{copied ? <Check size={20} /> : <Copy size={20} />}{copied ? 'Đã sao chép' : 'Sao chép'}</button></div><div className="my-card-share-actions"><button className="outline" disabled={!active || !card.is_published} onClick={share}><Share2 size={20} /> Chia sẻ</button><button className="outline" disabled={!active || !card.is_published} onClick={downloadQr}><QrCode size={21} /> Tải mã QR</button></div></div>
            <div className="my-card-management"><button disabled={busy} onClick={() => setShowTemplates(!showTemplates)}>Đổi mẫu thiệp</button>{active && <button disabled={busy} onClick={() => mutate('/api/user/cards/visibility', { is_published: !card.is_published }, 'PATCH')}>{card.is_published ? 'Ẩn thiệp' : 'Hiển thị thiệp'}</button>}</div>
          </div>
        </article> : <section className="my-card-empty"><Heart size={36} /><h2>Ngày vui bắt đầu từ một tấm thiệp</h2><p>Chọn mẫu và mua quyền sử dụng 6 tháng. Khi lưu lần đầu, bạn có một URL cố định cho tài khoản.</p><button className="primary" onClick={() => setShowTemplates(true)}>Chọn mẫu thiệp</button></section>}
        {showTemplates && <section className="my-card-catalog">
          <h2>{card ? 'Chọn mẫu cho cùng một URL' : 'Chọn mẫu thiệp đầu tiên'}</h2>
          <p>Mẫu mới cần mua riêng. Mẫu đã sở hữu còn hạn có thể dùng lại; hết hạn cần gia hạn.</p>
          <div>{templates.map(template => {
            const license = account.licenses.find(item => item.template_code === template.id);
            const owned = license && new Date(license.expires_at) > new Date();
            return <article key={template.id}>
              <img src={template.thumbnail} alt={template.name} />
              <h3>{template.name}</h3>
              <p>{owned ? `Đã sở hữu · đến ${date(license.expires_at)}` : license ? 'Đã hết hạn' : 'Chưa sở hữu'}</p>
              <button className={owned ? 'outline' : 'primary'} disabled={busy || account.primary_selection_pending} onClick={() => activateTemplate(template)}>{owned ? 'Sử dụng mẫu' : license ? 'Gia hạn 6 tháng' : 'Mua mẫu · 6 tháng'}</button>
            </article>;
          })}</div>
        </section>}
        <div className="my-card-help"><section><Heart size={30} /><div><h3>Một liên kết cho ngày vui</h3><p>Đổi mẫu vẫn giữ nguyên URL và thông tin thiệp.</p></div></section><a href="/#how-it-works"><Mail size={30} /><div><h3>Cần một chút hướng dẫn?</h3><p>Cách gửi thiệp và cập nhật thông tin.</p></div><span>Xem hướng dẫn →</span></a></div>
        {account.archived_count > 0 && <p className="my-card-archive-note">{account.archived_count} thiệp cũ được lưu trữ; dữ liệu vẫn được giữ nguyên.</p>}
      </>}
      <footer className="my-card-footer"><span>© {new Date().getFullYear()} WeddingSaaS. Thiệp cưới online thông minh.</span><div>{settings.terms_url && <a href={settings.terms_url}>Điều khoản sử dụng</a>}{settings.privacy_url && <a href={settings.privacy_url}>Chính sách bảo mật</a>}<a href="/#faq">Liên hệ</a></div></footer>
    </main>
    <PurchaseModal isOpen={!!purchase} token={token} templateCode={purchase?.id} templateName={purchase?.name} onClose={() => setPurchase(null)} onPurchaseSuccess={async () => { setPurchase(null); await load(); setShowTemplates(true); }} />
  </div>;
}
