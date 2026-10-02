import React from 'react';
import { Eye, CreditCard, LayoutGrid, Music, Share2 } from 'lucide-react';

export default function MobileBottomBar({ 
  activeMobileTab, 
  setActiveMobileTab, 
  onOpenTemplateModal,
  onOpenMusicModal,
  onOpenVietQRModal,
  onOpenShareModal,
  onExportHTML
}) {
  const isPreviewActive = activeMobileTab === 'preview';
  const isVietQRActive = activeMobileTab === 'vietqr';

  const navItems = [
    {
      id: 'preview',
      label: 'Thiệp',
      icon: Eye,
      isActive: isPreviewActive,
      onClick: () => setActiveMobileTab('preview')
    },
    {
      id: 'vietqr',
      label: 'VietQR',
      icon: CreditCard,
      isActive: isVietQRActive,
      onClick: onOpenVietQRModal || (() => setActiveMobileTab('vietqr'))
    },
    {
      id: 'template',
      label: 'Mẫu',
      icon: LayoutGrid,
      isActive: false,
      onClick: onOpenTemplateModal
    },
    {
      id: 'music',
      label: 'Nhạc',
      icon: Music,
      isActive: false,
      onClick: onOpenMusicModal
    },
    {
      id: 'export',
      label: 'Lưu & Link',
      icon: Share2,
      isActive: false,
      onClick: onOpenShareModal || onExportHTML,
      isPrimary: true
    }
  ];

  return (
    <div className="mobile-only">
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: '100%',
        margin: '0 auto',
        height: '64px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        alignItems: 'center',
        zIndex: 9999,
        padding: '0 4px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              style={{
                height: '100%',
                background: 'transparent',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                color: active ? '#e11d48' : item.isPrimary ? '#e11d48' : '#64748b',
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              <div style={{
                padding: '4px 10px',
                borderRadius: '12px',
                background: active 
                  ? '#fff1f2' 
                  : item.isPrimary 
                    ? 'rgba(244, 63, 94, 0.12)' 
                    : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}>
                <Icon 
                  size={19} 
                  strokeWidth={active || item.isPrimary ? 2.4 : 1.8} 
                  color={active ? '#e11d48' : item.isPrimary ? '#e11d48' : '#64748b'} 
                />
              </div>
              <span style={{ 
                fontSize: '10.5px', 
                fontWeight: active || item.isPrimary ? '700' : '500',
                color: active ? '#e11d48' : item.isPrimary ? '#e11d48' : '#475569'
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
