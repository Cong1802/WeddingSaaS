import React, { useState } from 'react';
import { Home, Heart, LayoutGrid, UserRound, Search, ArrowRight, Plus, Crown, Bell, ChevronDown, Gem, Leaf, Flower2, Image, CircleDot } from 'lucide-react';
import logo from '../assets/logo.png';
import floralBackdrop from '../../images/section-01-hero/hero-why-us-continuous.png';
import petal from '../../images/shared/petals/shared-petal-01.png';
import './TemplateCatalogPage.css';

export default function TemplateCatalogPage({ templates, user, busy, onHome, onMyCards, onAccount, onSelect, onBlank, accountMenu, error }) {
  const [category, setCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('favorite_templates') || '[]'); } catch { return []; }
  });
  const categories = ['Tất cả', 'Hiện đại', 'Truyền thống', 'Tối giản', 'Sang trọng', 'Vintage', 'Thiên nhiên', 'Bộ sưu tập'];
  const icons = [LayoutGrid, Gem, CircleDot, Leaf, Crown, Image, Flower2, Heart];
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd');
  const filtered = templates.filter(template => (category === 'Tất cả' || (category === 'Bộ sưu tập' ? favorites.includes(template.id) : normalize(template.category || '') === normalize(category === 'Truyền thống' ? 'Cổ Điển' : category))) && normalize(`${template.name} ${template.category}`).includes(normalize(search)));
  const favorite = id => {
    const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    setFavorites(next);
    try { localStorage.setItem('favorite_templates', JSON.stringify(next)); } catch { /* Favorites still work for this visit. */ }
  };
  return <div className="template-catalog-page">
    <header className="template-catalog-top"><button onClick={onHome} className="template-catalog-brand"><img src={logo} alt="WeddingSaaS" /></button><nav><button onClick={onHome}>Trang chủ</button><button aria-current="page">Kho mẫu</button><a href="/#pricing">Bảng giá</a><a href="/#how-it-works">Hướng dẫn</a></nav><label className="template-catalog-search"><Search size={16} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Tìm mẫu theo tên, phong cách…" aria-label="Tìm mẫu thiệp" /></label><a className="template-catalog-upgrade" href="/#pricing"><Crown size={15} />Nâng cấp Pro</a><button className="template-catalog-notifications" aria-label="Trạng thái thiệp của tôi" onClick={onMyCards}><Bell size={20} /></button><button className="template-catalog-account" onClick={onAccount}>{user?.avatar ? <img src={user.avatar} alt="" /> : <UserRound size={20} />}<span>{user?.name || 'Đăng nhập'}</span><ChevronDown size={13} /></button></header>
    <main>
      <section className="template-catalog-hero" style={{ '--catalog-floral': `url(${floralBackdrop})` }}><div><h1>Kho Mẫu Thiệp Cưới</h1><p className="template-catalog-script">Đa Dạng & Tinh Tế</p><p>Hàng trăm mẫu thiệp cưới được thiết kế sẵn, phù hợp với nhiều phong cách<br className="catalog-desktop-break" /> từ hiện đại, tối giản đến sang trọng, truyền thống.</p></div><div className="template-catalog-art" aria-hidden="true">{templates.slice(0, 2).map(template => <img key={template.id} src={template.thumbnail} alt="" />)}<span>Chọn mẫu yêu thích<br />và bắt đầu tạo thiệp<br />ngay hôm nay!</span></div><img className="template-catalog-petal" src={petal} alt="" /></section>
      <section className="template-catalog-browser" aria-label="Kho mẫu thiệp"><nav className="template-catalog-filters" aria-label="Phong cách thiệp">{categories.map((item, index) => { const Icon = icons[index]; return <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}><Icon size={16} />{item}</button>; })}</nav>
      {error && <p role="alert">{error}</p>}
      <div className="template-catalog-grid">{category === 'Tất cả' && !search && <article className="template-catalog-blank"><div><span><Plus size={28} strokeWidth={1.3} /></span><h2>Tạo thiệp từ mẫu trống</h2><p>Tự do sáng tạo theo ý bạn</p></div><button onClick={onBlank}>Bắt đầu ngay <ArrowRight size={15} /></button></article>}{filtered.map(template => <article key={template.id}><div className="template-catalog-image"><img src={template.thumbnail} alt={template.name} loading="lazy" /><button aria-label={`Yêu thích ${template.name}`} aria-pressed={favorites.includes(template.id)} onClick={() => favorite(template.id)}><Heart size={18} fill={favorites.includes(template.id) ? 'currentColor' : 'none'} /></button></div><div className="template-catalog-info"><h2>{template.name}</h2><span><Gem size={10} />{template.category}</span><div><a href={template.fileUrl} target="_blank" rel="noopener noreferrer">Xem mẫu</a><button disabled={busy} onClick={() => onSelect(template)}>Sử dụng</button></div></div></article>)}</div>
      {!filtered.length && <p className="template-catalog-empty">Không có mẫu phù hợp. Hãy thử phong cách hoặc từ khóa khác.</p>}</section>
    </main>
    <nav className="my-card-bottom-nav" aria-label="Điều hướng trên điện thoại"><button onClick={onHome}><Home /><span>Trang chủ</span></button><button aria-current="page" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><LayoutGrid /><span>Mẫu thiệp</span></button><button onClick={onMyCards}><Heart /><span>Thiệp của tôi</span></button><button onClick={onAccount}><UserRound /><span>Tài khoản</span></button></nav>
    {accountMenu}
  </div>;
}
