import React, { useState } from 'react';
import { X, ArrowLeft, Copy, Check } from 'lucide-react';

export default function VietQRModal({ isOpen, onClose, groomBank, brideBank }) {
  const [activeTab, setActiveTab] = useState('groom');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentBank = activeTab === 'groom' ? groomBank : brideBank;
  const qrUrl = `https://img.vietqr.io/image/${currentBank.bankName}-${currentBank.accountNo}-compact2.png?accountName=${encodeURIComponent(currentBank.accountHolder)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentBank.accountNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        zIndex: 100005,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Top Navigation Header Bar */}
      <div style={{
        height: '56px',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        flexShrink: 0
      }}>
        <button
          onClick={onClose}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1e293b'
          }}
          title="Quay lại"
        >
          <ArrowLeft size={22} />
        </button>

        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
          Mừng Cưới VietQR
        </h3>

        <button
          onClick={onClose}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#f1f5f9',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Đóng"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Content Area - Full Width Mobile Scrollable Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 16px',
        maxWidth: '100%',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', textAlign: 'center' }}>
          Mã VietQR quét chuyển khoản mừng cưới trực tiếp cho Chú Rể & Cô Dâu
        </p>

        {/* Tab Selection */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderRadius: '12px',
          padding: '4px',
          width: '100%',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setActiveTab('groom')}
            style={{
              flex: 1,
              padding: '10px 8px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              background: activeTab === 'groom' ? '#ffffff' : 'transparent',
              color: activeTab === 'groom' ? '#2563eb' : '#64748b',
              boxShadow: activeTab === 'groom' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Mừng Chú Rể
          </button>
          <button
            onClick={() => setActiveTab('bride')}
            style={{
              flex: 1,
              padding: '10px 8px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              background: activeTab === 'bride' ? '#ffffff' : 'transparent',
              color: activeTab === 'bride' ? '#ec4899' : '#64748b',
              boxShadow: activeTab === 'bride' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Mừng Cô Dâu
          </button>
        </div>

        {/* QR Code Container */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '16px',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img
            src={qrUrl}
            alt="Mã VietQR"
            style={{
              width: '220px',
              height: '220px',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Bank Details Box */}
        <div style={{
          width: '100%',
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#64748b' }}>Ngân hàng:</span>
            <span style={{ fontWeight: '700', color: '#0f172a' }}>{currentBank.bankName}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#64748b' }}>Chủ tài khoản:</span>
            <span style={{ fontWeight: '700', color: '#0f172a' }}>{currentBank.accountHolder}</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            paddingTop: '8px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <span style={{ color: '#64748b' }}>Số tài khoản:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '800', color: '#2563eb', fontSize: '15px' }}>{currentBank.accountNo}</span>
              <button
                onClick={handleCopy}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
