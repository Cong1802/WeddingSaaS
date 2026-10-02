import React, { useState } from 'react';
import { Sparkles, Download, CreditCard, LayoutGrid, Smartphone, Monitor, Link as LinkIcon, ChevronDown, FolderHeart, Shield, LogOut, Heart } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Header({ 
  viewMode, 
  setViewMode, 
  onExportHTML, 
  onOpenVietQRDemo,
  onOpenTemplateModal,
  onOpenShareModal,
  selectedTemplateName,
  user,
  onOpenAuthModal,
  onOpenMyCardsModal,
  onOpenAdminModal,
  onLogout,
  onGoToLandingPage
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header 
      style={{
          width: '100%',
          height: '56px',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          borderBottom: '1px solid #fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          zIndex: 100,
          flexShrink: 0,
          boxSizing: 'border-box',
          boxShadow: '0 2px 10px rgba(225, 29, 72, 0.04)'
        }}
      >
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onGoToLandingPage && (
            <button
              onClick={onGoToLandingPage}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid #fecdd3',
                background: '#fff1f2',
                color: '#e11d48',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flexShrink: 0
              }}
            >
              ← <span className="desktop-only">Trang Chủ</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={onGoToLandingPage}>
            <img 
              src={logoImg} 
              alt="WeddingSaaS" 
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }} 
            />
            <span className="desktop-only" style={{ fontSize: '9px', fontStyle: 'normal', color: '#e11d48', fontWeight: '700', padding: '1px 6px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px' }}>Pro</span>
          </div>
        </div>

        {/* Center Controls: Viewport & Template Selector (Desktop Only) */}
        <div className="desktop-only" style={{ alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onOpenTemplateModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #fecdd3',
              background: '#fff1f2',
              color: '#e11d48',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <LayoutGrid size={14} /> Mẫu: <span style={{ color: '#0f172a', fontWeight: '700' }}>{selectedTemplateName || 'Mẫu Hoàng Gia'}</span>
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f1f5f9',
            padding: '3px',
            borderRadius: '20px',
            border: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => setViewMode('mobile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                background: viewMode === 'mobile' ? '#e11d48' : 'transparent',
                color: viewMode === 'mobile' ? '#ffffff' : '#64748b',
                boxShadow: viewMode === 'mobile' ? '0 2px 8px rgba(225, 29, 72, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Smartphone size={13} /> Mobile
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                background: viewMode === 'desktop' ? '#e11d48' : 'transparent',
                color: viewMode === 'desktop' ? '#ffffff' : '#64748b',
                boxShadow: viewMode === 'desktop' ? '0 2px 8px rgba(225, 29, 72, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Monitor size={13} /> Desktop
            </button>
          </div>
        </div>

        {/* Desktop Quick Action Buttons */}
        <div className="desktop-only" style={{ alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onOpenShareModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 16px',
              borderRadius: '20px',
              border: 'none',
              background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(244, 63, 94, 0.35)'
            }}
          >
            <LinkIcon size={14} /> Lưu & Link Chia Sẻ
          </button>

          <button
            onClick={onOpenVietQRDemo}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '20px',
              border: '1px solid #fed7aa',
              background: '#fff7ed',
              color: '#d97706',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <CreditCard size={14} /> VietQR
          </button>
        </div>

        {/* User Auth Menu (Desktop & Mobile) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fff1f2',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid #fecdd3',
                  color: '#e11d48',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '12px', color: '#e11d48', fontWeight: '700', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                </span>
                <ChevronDown size={14} color="#e11d48" style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>

              {isUserMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '210px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #fee2e2',
                    borderRadius: '16px',
                    padding: '8px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                  </div>

                  {user.role === 'admin' ? (
                    <button
                      onClick={() => { setIsUserMenuOpen(false); if (onOpenAdminModal) onOpenAdminModal(); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#d97706',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%'
                      }}
                    >
                      <Shield size={14} color="#d97706" />
                      <span>Quản Trị Admin</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { setIsUserMenuOpen(false); if (onOpenMyCardsModal) onOpenMyCardsModal(); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#334155',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%'
                      }}
                    >
                      <FolderHeart size={14} color="#e11d48" />
                      <span>Thiệp Của Tôi</span>
                    </button>
                  )}

                  <button
                    onClick={() => { setIsUserMenuOpen(false); if (onLogout) onLogout(); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#ef4444',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      borderTop: '1px solid #f1f5f9',
                      marginTop: '4px',
                      paddingTop: '8px'
                    }}
                  >
                    <LogOut size={14} color="#ef4444" />
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 16px',
                borderRadius: '20px',
                border: 'none',
                background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(244, 63, 94, 0.3)'
              }}
            >
              Đăng Nhập
            </button>
          )}
        </div>
      </header>
  );
}
