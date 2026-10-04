import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Copy, Check, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { saveCardToApi } from '../services/cardApi';
import PurchaseModal from './PurchaseModal';

export default function ShareModal({ isOpen, onClose, cardData, selectedTemplateId, token }) {
  const [slug, setSlug] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [savedUrl, setSavedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [fixedSlug, setFixedSlug] = useState(false);
  const [accessChecking, setAccessChecking] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [accessRevision, setAccessRevision] = useState(0);

  useEffect(() => {
    if (isOpen && cardData) {
      const defaultSlug = `${cardData.groomName || ''}-${cardData.brideName || ''}`
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'thanh-thu-ba-cong-2026';
      setSlug(defaultSlug);
      setIsSaved(false);
      setSavedUrl('');
      setCopied(false);
      setSaveError('');
    }
  }, [isOpen, cardData]);

  useEffect(() => {
    if (!isOpen || !token) return;
    let active = true;
    setAccessChecking(true); setHasAccess(false); setFixedSlug(false);
    fetch('/api/user/cards', { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
      .then(response => { if (!response.ok) throw Error('Không kiểm tra được quyền sử dụng mẫu.'); return response.json(); })
      .then(data => {
        if (!active) return;
        if (data.card_slug) { setSlug(data.card_slug); setFixedSlug(true); }
        setHasAccess(!data.primary_selection_pending && data.licenses.some(license => license.template_code === selectedTemplateId && new Date(license.expires_at) > new Date()));
      }).catch(error => { if (active) setSaveError(error.message); })
      .finally(() => { if (active) setAccessChecking(false); });
    return () => { active = false; };
  }, [isOpen, token, selectedTemplateId, cardData, accessRevision]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!slug.trim()) return;
    setIsSubmitting(true);
    setSaveError('');
    try {
      const result = await saveCardToApi(slug, selectedTemplateId, cardData, token);
      if (result.success) {
        setIsSaved(true);
        setSavedUrl(result.card_url);
      }
    } catch (err) {
      setSaveError(err.message || 'Không lưu được thiệp. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (!savedUrl) return;
    navigator.clipboard.writeText(savedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrImageUrl = savedUrl 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(savedUrl)}`
    : '';

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
        zIndex: 100005,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        className="app-modal-container"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          color: '#0f172a',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Mobile Drag Handle */}
        <div className="mobile-only" style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: '#cbd5e1', margin: '0 auto 12px auto', flexShrink: 0 }} />
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            border: 'none',
            backgroundColor: '#f1f5f9',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Sparkles size={20} color="#2563eb" />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
            Lưu & Tạo Link Chia Sẻ Thiệp
          </h3>
        </div>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          Tạo đường dẫn URL tùy chỉnh để gửi khách mời truy cập xem trực tiếp thiệp cưới online của bạn!
        </p>

        {saveError && <p role="alert" style={{ color: '#dc2626', fontSize: 13 }}>{saveError}</p>}
        {accessChecking && <p role="status">Đang kiểm tra quyền sử dụng mẫu…</p>}
        {!accessChecking && !hasAccess && <div style={{ marginBottom: 16 }}><p>Mẫu chưa được mua hoặc đã hết hạn. Mua / gia hạn để lưu và công khai thiệp trong 6 tháng. Nếu có nhiều thiệp cũ, hãy chọn thiệp chính tại Thiệp của tôi trước.</p><button type="button" onClick={() => setPurchaseOpen(true)}>Mua / gia hạn mẫu · 6 tháng</button></div>}
        {!isSaved ? (
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              Tên đường dẫn riêng (Slug URL):
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '8px 12px',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '12px', color: '#64748b', marginRight: '4px', fontWeight: '500' }}>
                {window.location.host}/v/
              </span>
              <input
                type="text"
                value={slug}
                readOnly={fixedSlug || accessChecking}
                onChange={e => setSlug(e.target.value)}
                placeholder="ten-chu-re-ten-co-dau"
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  flex: 1,
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#1e293b'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleSave}
                disabled={isSubmitting || accessChecking || !hasAccess}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                <LinkIcon size={16} />
                <span>{isSubmitting ? 'Đang lưu thiệp...' : 'Lưu Thiệp & Tạo Link Online'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textAlign: 'left'
            }}>
              <CheckCircle2 size={24} color="#16a34a" />
              <div>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#15803d', margin: 0 }}>
                  Đã tạo đường dẫn thành công!
                </p>
                <p style={{ fontSize: '11px', color: '#166534', margin: 0 }}>
                  Đã lưu dữ liệu thiệp cưới vào hệ thống Database.
                </p>
              </div>
            </div>

            {/* Prominent URL Display Card & Copy Button (2 Rows) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div
                onClick={handleCopyLink}
                title="Click để sao chép đường dẫn"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid #3b82f6',
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  fontSize: '15px',
                  fontWeight: '700',
                  lineHeight: '1.4',
                  wordBreak: 'break-all',
                  textAlign: 'center',
                  cursor: 'pointer',
                  userSelect: 'all',
                  boxSizing: 'border-box',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)'
                }}
              >
                {savedUrl}
              </div>

              <button
                onClick={handleCopyLink}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: copied ? '#16a34a' : '#2563eb',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  boxSizing: 'border-box'
                }}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span>{copied ? 'Đã Sao Chép Link' : 'Sao Chép Link Chia Sẻ'}</span>
              </button>
            </div>

            {/* QR Code Container */}
            {qrImageUrl && (
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <img
                  src={qrImageUrl}
                  alt="Mã QR Thiệp Cưới"
                  style={{ width: '160px', height: '160px', borderRadius: '8px' }}
                />
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                  Quét QR để xem thiệp trên điện thoại
                </p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => window.open(savedUrl, '_blank')}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #2563eb',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <ExternalLink size={16} />
                Mở Giao diện Khách xem trực tiếp
              </button>
            </div>
          </div>
        )}
      </div>
      <PurchaseModal isOpen={purchaseOpen} token={token} templateCode={selectedTemplateId} onClose={() => setPurchaseOpen(false)} onPurchaseSuccess={() => { setPurchaseOpen(false); setAccessRevision(value => value + 1); }} />
    </div>
  );
}
