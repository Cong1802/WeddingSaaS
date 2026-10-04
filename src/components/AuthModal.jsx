import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Eye, EyeOff, Heart, LockKeyhole, Mail, UserRound, X } from 'lucide-react';
import artwork from '../assets/auth-wedding-panel.png';
import flowers from '../../images/section-05-features/features-sprig.png';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [recovery, setRecovery] = useState(null);
  const [resetToken, setResetToken] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dialogRef = useRef(null);
  const recoveryLink = useRef(null);
  const initializedOpen = useRef(false);

  useEffect(() => {
    if (!isOpen) { initializedOpen.current = false; return; }
    if (!initializedOpen.current) {
      const params = new URLSearchParams(window.location.search);
      const link = recoveryLink.current || { token: params.get('reset_token'), email: params.get('reset_email') };
      recoveryLink.current = link;
      setRecovery(link.token ? 'reset' : null);
      setResetToken(link.token || '');
      setFormData({ name: '', email: link.email || '', password: '', password_confirmation: '' });
      if (link.token) {
        params.delete('reset_token');
        params.delete('reset_email');
        window.history.replaceState({}, '', `${window.location.pathname}${params.size ? `?${params}` : ''}${window.location.hash}`);
      }
      initializedOpen.current = true;
    }
    setError('');
    setSuccessMsg('');
    setShowPassword(false);
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = requestAnimationFrame(() => dialogRef.current?.querySelector('input')?.focus());
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const elements = [...(dialogRef.current?.querySelectorAll('button:not(:disabled), input, a[href]') || [])].filter(element => element.getClientRects().length);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    fetch('/api/auth/config')
      .then(res => res.json())
      .then(data => {
        if (data.google_client_id) {
          setGoogleClientId(data.google_client_id);
          loadGoogleSDK(data.google_client_id);
        }
      })
      .catch(() => {});
  }, []);

  const loadGoogleSDK = (clientId) => {
    if (document.getElementById('google-jssdk')) return;
    const script = document.createElement('script');
    script.id = 'google-jssdk';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
        });
      }
    };
    document.body.appendChild(script);
  };

  const handleGoogleCredentialResponse = async (response) => {
    if (!response.credential) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Đăng nhập Google thất bại');
      }

      setSuccessMsg('Đăng nhập Google thành công!');
      localStorage.setItem('auth_token', data.token);
      onAuthSuccess(data.user, data.token);
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e, credentials = formData, login = isLogin) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const endpoint = recovery ? `/api/auth/${recovery === 'forgot' ? 'forgot-password' : 'reset-password'}` : login ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(recovery === 'reset' ? { ...credentials, token: resetToken } : credentials),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(Object.values(data.errors || {}).flat()[0] || data.message || 'Đã xảy ra lỗi, vui lòng thử lại.');
      }

      setSuccessMsg(data.message);
      if (recovery === 'reset') {
        recoveryLink.current = null;
        localStorage.removeItem('auth_token');
        onAuthSuccess(null, null);
        setResetToken(''); setRecovery(null); setIsLogin(true);
        setFormData({ name: '', email: credentials.email, password: '' });
      }
      if (data.token && data.user) {
        localStorage.setItem('auth_token', data.token);
        onAuthSuccess(data.user, data.token);
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (googleClientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
      return;
    }

    setError('Đăng nhập Google chưa sẵn sàng. Vui lòng dùng email và mật khẩu.');
  };

  const changeTab = (login) => { setRecovery(null); setIsLogin(login); setError(''); setSuccessMsg(''); setShowPassword(false); };
  return (
    <div className="auth-modal-overlay animate-fade-in" onClick={onClose}>
      <div className="auth-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" onClick={event => event.stopPropagation()}>
        <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Đóng đăng nhập"><X size={20} /></button>
        <aside className="auth-modal__art" style={{ backgroundImage: `url(${artwork})` }} aria-label="Thiệp cưới hoa hồng">
          <div className="auth-modal__brand">
            <span className="auth-modal__hearts" aria-hidden="true"><Heart size={39} /><Heart size={32} /></span>
            <h2>Thiệp Cưới SaaS</h2>
            <p>Tạo thiệp cưới đẹp – Dễ dàng –<br />Chỉ trong vài phút</p>
          </div>
        </aside>
        <div className="auth-modal__body">
          <header className="auth-modal__heading">
            <h2 id="auth-modal-title">{recovery ? 'Đặt lại mật khẩu' : isLogin ? 'Chào mừng bạn!' : 'Bắt đầu cùng chúng mình!'}</h2>
            <p>{isLogin ? 'Đăng nhập để lưu và quản lý thiệp cưới của bạn' : 'Tạo tài khoản để lưu thiệp cho ngày trọng đại'}</p>
          </header>
          <div className="auth-modal__tabs" aria-label="Chọn đăng nhập hoặc đăng ký">
            <button type="button" className={isLogin ? 'is-active' : ''} aria-pressed={isLogin} onClick={() => changeTab(true)}>Đăng Nhập</button>
            <button type="button" className={!isLogin ? 'is-active' : ''} aria-pressed={!isLogin} onClick={() => changeTab(false)}>Đăng Ký Mới</button>
          </div>
          {error && <div className="auth-modal__message auth-modal__message--error" role="alert">{error}</div>}
          {successMsg && <div className="auth-modal__message auth-modal__message--success" role="status">{successMsg}</div>}
          <form className="auth-modal__form" onSubmit={handleSubmit} autoComplete="off">
            {/* Dummy inputs to prevent browser autofill */}
            <input type="text" name="fake_email_prevent_autofill" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
            <input type="password" name="fake_password_prevent_autofill" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

            {!isLogin && !recovery && <div className="auth-modal__field">
              <label htmlFor="auth-name">Họ & Tên</label>
              <div className="auth-modal__input"><UserRound size={19} aria-hidden="true" /><input id="auth-name" name="name" autoComplete="off" required value={formData.name} onChange={handleChange} placeholder="Nhập họ và tên của bạn" /></div>
            </div>}
            <div className="auth-modal__field">
              <label htmlFor="auth-email">{recovery ? 'Email' : 'Email hoặc Số điện thoại'}</label>
              <div className="auth-modal__input"><Mail size={19} aria-hidden="true" /><input id="auth-email" name="email" type={recovery ? 'email' : 'text'} autoComplete="username" required maxLength={255} value={formData.email} onChange={handleChange} placeholder={recovery ? 'Nhập email đã đăng ký' : 'Nhập email hoặc số điện thoại'} /></div>
            </div>
            {recovery !== 'forgot' && <div className="auth-modal__field">
              <label htmlFor="auth-password">Mật khẩu</label>
              <div className="auth-modal__input"><LockKeyhole size={19} aria-hidden="true" /><input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={isLogin && !recovery ? 'current-password' : 'new-password'} required minLength={isLogin && !recovery ? 1 : 12} maxLength={128} value={formData.password} onChange={handleChange} placeholder="Nhập mật khẩu" /><button type="button" className="auth-modal__password-toggle" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={showPassword}>{showPassword ? <Eye size={18} /> : <EyeOff size={18} />}</button></div>
            </div>}
            {recovery === 'reset' && <div className="auth-modal__field">
              <label htmlFor="auth-confirm-password">Nhập lại mật khẩu mới</label>
              <div className="auth-modal__input"><LockKeyhole size={19} /><input id="auth-confirm-password" name="password_confirmation" type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={formData.password_confirmation || ''} onChange={handleChange} /></div>
            </div>}
            {(!isLogin || recovery === 'reset') && <p>Mật khẩu cần ít nhất 12 ký tự, gồm chữ và số.</p>}
            {isLogin && !recovery && <button type="button" className="auth-modal__forgot" onClick={() => { setRecovery('forgot'); setError(''); setSuccessMsg(''); }}>Quên mật khẩu?</button>}
            <button type="submit" className="auth-modal__submit" disabled={loading}>{loading ? 'Đang xử lý...' : recovery === 'forgot' ? 'Gửi hướng dẫn' : recovery === 'reset' ? 'Lưu mật khẩu mới' : isLogin ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}<span aria-hidden="true"><ChevronRight size={20} /></span></button>
          </form>
          <div className="auth-modal__divider"><span />hoặc<span /></div>
          <button type="button" className="auth-modal__google" onClick={handleGoogleLogin} disabled={loading}>
            <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Đăng nhập với Google</span>
          </button>
          <img className="auth-modal__flower" src={flowers} alt="" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
