import React, { useState, useEffect } from 'react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');

  useEffect(() => {
    fetch('/api/public/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings?.google_client_id) {
          setGoogleClientId(data.settings.google_client_id);
          loadGoogleSDK(data.settings.google_client_id);
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
      // Decode JWT token payload from Google
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      const payload = JSON.parse(jsonPayload);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          google_id: payload.sub,
          email: payload.email,
          name: payload.name || payload.email.split('@')[0],
          avatar: payload.picture,
        }),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Đã xảy ra lỗi, vui lòng thử lại.');
      }

      setSuccessMsg(data.message);
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

    // Fallback demo simulation if Client ID is not configured yet in Admin CMS
    setLoading(true);
    setError('');

    const mockGoogleId = 'google_id_' + Math.floor(Math.random() * 1000000);
    const mockEmail = `user.${Math.floor(Math.random() * 1000)}@gmail.com`;
    const mockName = 'Khách Google User';
    const mockAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockGoogleId}`;

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          google_id: mockGoogleId,
          email: mockEmail,
          name: mockName,
          avatar: mockAvatar,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
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

  return (
    <div 
      className="app-modal-overlay animate-fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(3, 7, 18, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }} 
      onClick={onClose}
    >
      <div 
        className="app-modal-container"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          color: '#0f172a'
        }}
      >
        {/* Mobile Drag Handle */}
        <div className="mobile-only" style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: 'rgba(255, 255, 255, 0.3)', margin: '10px auto 4px auto', flexShrink: 0 }} />
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #8b5cf6 100%)',
          padding: '24px 20px',
          textAlign: 'center',
          color: '#ffffff',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#ffffff',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
          
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 8px auto',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            backdropFilter: 'blur(6px)'
          }}>
            💌
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', fontFamily: "'Playfair Display', serif", margin: 0 }}>Thiệp Cưới SaaS</h2>
          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)', margin: '4px 0 0 0' }}>Đăng nhập để lưu & quản lý thiệp cưới của bạn</p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '20px' }}>
          
          {/* Tabs switch */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            padding: '4px',
            borderRadius: '14px',
            marginBottom: '16px'
          }}>
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 0',
                fontSize: '13px',
                fontWeight: '700',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isLogin ? '#ffffff' : 'transparent',
                color: isLogin ? '#f43f5e' : '#64748b',
                boxShadow: isLogin ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 0',
                fontSize: '13px',
                fontWeight: '700',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: !isLogin ? '#ffffff' : 'transparent',
                color: !isLogin ? '#f43f5e' : '#64748b',
                boxShadow: !isLogin ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Đăng Ký Mới
            </button>
          </div>

          {/* Alert Messages */}
          {error && (
            <div style={{
              padding: '10px 12px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '12px',
              borderRadius: '12px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚠️</span>
              <span style={{ flex: 1 }}>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              padding: '10px 12px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#059669',
              fontSize: '12px',
              borderRadius: '12px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>🎉</span>
              <span style={{ flex: 1 }}>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Họ & Tên</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                Email hoặc Số điện thoại
              </label>
              <input
                type="text"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com hoặc 0962998721"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#f8fafc',
                  color: '#0f172a',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Mật khẩu</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#f8fafc',
                  color: '#0f172a',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '4px',
                background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '700',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(244, 63, 94, 0.3)',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Đang xử lý...' : isLogin ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '16px 0',
            position: 'relative'
          }}>
            <div style={{ width: '100%', height: '1px', backgroundColor: '#e2e8f0' }}></div>
            <span style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#ffffff',
              padding: '0 12px',
              fontSize: '12px',
              color: '#94a3b8',
              fontWeight: '500'
            }}>hoặc</span>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxSizing: 'border-box'
            }}
          >
            <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Đăng nhập với Google</span>
          </button>

          {/* Demo Admin Quick Login Button */}
          <button
            type="button"
            onClick={() => {
              setFormData({ email: 'admin@example.com', password: 'password123', name: 'Quản Trị Viên' });
              setTimeout(() => {
                const fakeEvent = { preventDefault: () => {} };
                handleSubmit(fakeEvent);
              }, 100);
            }}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 16px',
              marginTop: '8px',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              backgroundColor: 'rgba(254, 243, 199, 0.5)',
              color: '#d97706',
              fontSize: '13px',
              fontWeight: '700',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxSizing: 'border-box'
            }}
          >
            <span>👑 Đăng Nhập Nhanh Quản Trị (Demo Admin)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
