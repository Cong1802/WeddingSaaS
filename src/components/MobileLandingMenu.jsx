import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, FolderHeart, LogOut, Shield, X } from 'lucide-react';
import logo from '../assets/logo.png';

export const landingLinks = [
  { id: 'home', label: 'Trang chủ' },
  { id: 'templates', label: 'Mẫu thiệp' },
  { id: 'features', label: 'Tính năng' },
  { id: 'pricing', label: 'Bảng giá' },
  { id: 'steps', label: 'Hướng dẫn' },
  { id: 'contact', label: 'Liên hệ' },
];

export default function MobileLandingMenu({ isOpen, onClose, activeNav, onNavigate, onCreate, onLogin, user, onMyCards, onAdmin, onLogout }) {
  const panel = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => panel.current?.querySelector('button')?.focus({ preventScroll: true }));
    const closeOnDesktop = () => { if (window.innerWidth > 760) onClose(); };
    const keydown = event => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const items = panel.current?.querySelectorAll('button, a[href]');
      if (!items?.length) return;
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1].focus(); }
      if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0].focus(); }
    };
    window.addEventListener('resize', closeOnDesktop);
    document.addEventListener('keydown', keydown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('resize', closeOnDesktop);
      document.removeEventListener('keydown', keydown);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose]);
  const act = callback => { onClose(); callback?.(); };
  return createPortal(
    <div className={`landing-mobile-menu${isOpen ? ' is-open' : ''}`} aria-hidden={!isOpen} inert={!isOpen ? true : undefined} onClick={onClose}>
      <aside id="landing-mobile-menu" ref={panel} className="landing-mobile-menu__panel" role="dialog" aria-modal="true" aria-label="Menu điều hướng" onClick={event => event.stopPropagation()}>
        <div className="landing-mobile-menu__top"><img src={logo} alt="WeddingSaaS" /><button type="button" onClick={onClose} aria-label="Đóng menu"><X size={22} /></button></div>
        <p className="landing-mobile-menu__intro">Thiệp cưới cho ngày trọng đại</p>
        <nav aria-label="Điều hướng mobile">{landingLinks.map(link => <a key={link.id} href={`#${link.id}`} aria-current={activeNav === link.id ? 'page' : undefined} onClick={event => { event.preventDefault(); act(() => onNavigate(link.id)); }}>{link.label}<ArrowRight size={17} /></a>)}</nav>
        <div className="landing-mobile-menu__actions">
          {user ? <><p className="landing-mobile-menu__user">Xin chào, {user.name}</p><button type="button" onClick={() => act(user.role === 'admin' ? onAdmin : onMyCards)}>{user.role === 'admin' ? <Shield size={18} /> : <FolderHeart size={18} />}{user.role === 'admin' ? 'Trang quản trị' : 'Thiệp của tôi'}</button><button type="button" onClick={() => act(onLogout)}><LogOut size={18} />Đăng xuất</button></> : <button type="button" onClick={() => act(onLogin)}>Đăng nhập / Đăng ký</button>}
          <button type="button" className="landing-mobile-menu__create" onClick={() => act(onCreate)}>{user?.role === 'admin' ? 'Trang quản trị' : 'Tạo thiệp ngay'}<ArrowRight size={18} /></button>
        </div>
      </aside>
    </div>, document.body,
  );
}
