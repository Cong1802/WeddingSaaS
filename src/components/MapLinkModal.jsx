import React, { useState, useEffect } from 'react';
import { MapPin, Check } from 'lucide-react';

export default function MapLinkModal({ 
  isOpen, 
  onClose, 
  currentUrl, 
  onSave,
  targetName = 'Tiệc Nhà Trai' 
}) {
  const [url, setUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setUrl(currentUrl || '');
    setSavedSuccess(false);
  }, [currentUrl, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSave(url.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div 
      className="app-modal-overlay animate-fade-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(3, 7, 18, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        cursor: 'pointer'
      }}
    >
      <div 
        className="app-modal-container"
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFDF7',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '20px',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.3), 0 0 0 2px #D4AF37, 0 0 0 6px rgba(212, 175, 55, 0.2)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "var(--font-sans), 'Plus Jakarta Sans', sans-serif",
          cursor: 'default'
        }}
      >
        {/* Mobile Drag Handle */}
        <div className="mobile-only" style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: 'rgba(212, 175, 55, 0.6)', margin: '8px auto 4px auto', flexShrink: 0 }} />
        {/* Header Ribbon - Royal Crimson & Gold Theme */}
        <div style={{
          background: 'linear-gradient(135deg, #7D0101 0%, #a81c1c 50%, #6b0101 100%)',
          padding: '20px 24px 16px',
          color: '#ffffff',
          textAlign: 'center',
          position: 'relative',
          borderBottom: '2px solid #D4AF37'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.6)',
              color: '#ffffff',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            ✕
          </button>

          <div style={{
            width: '42px',
            height: '42px',
            margin: '0 auto 8px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid #D4AF37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={22} color="#fef08a" />
          </div>

          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#ffffff',
            margin: 0,
            letterSpacing: '0.5px',
            fontFamily: "var(--font-serif), 'Playfair Display', Georgia, serif"
          }}>
            Cấu Hình Link Google Maps
          </h3>
          <p style={{
            fontSize: '11px',
            color: '#fef08a',
            margin: '4px 0 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: '600',
            fontFamily: "var(--font-sans), 'Plus Jakarta Sans', sans-serif"
          }}>
            {targetName}
          </p>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSave} style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ 
              fontSize: '12px', 
              color: '#374151', 
              marginBottom: '8px', 
              display: 'block', 
              fontWeight: '700',
              fontFamily: "var(--font-sans), 'Plus Jakarta Sans', sans-serif"
            }}>
              🔗 Đường dẫn Google Maps (URL)
            </label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1.5px solid #d4af37',
                backgroundColor: '#ffffff',
                color: '#111827',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: "var(--font-sans), 'Plus Jakarta Sans', sans-serif"
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: "var(--font-sans), 'Plus Jakarta Sans', sans-serif"
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #D4AF37',
                background: 'linear-gradient(135deg, #7D0101 0%, #a81c1c 50%, #6b0101 100%)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(125, 1, 1, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontFamily: "var(--font-sans), 'Plus Jakarta Sans', sans-serif"
              }}
            >
              {savedSuccess ? (
                <>
                  <Check size={16} color="#ffffff" /> Đã lưu thành công!
                </>
              ) : (
                'Lưu Cấu Hình Map'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
