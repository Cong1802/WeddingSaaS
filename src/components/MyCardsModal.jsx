import React, { useState, useEffect } from 'react';
import { HeartHandshake, X, Eye, Edit3, Trash2, Copy, Check, RefreshCw, FolderHeart } from 'lucide-react';

export default function MyCardsModal({ isOpen, onClose, token, onSelectCardToEdit }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(null);

  useEffect(() => {
    if (isOpen && token) {
      fetchMyCards();
    }
  }, [isOpen, token]);

  const fetchMyCards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/cards', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCards(data.cards);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách thiệp:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cardId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thiệp cưới này?')) return;
    try {
      const res = await fetch(`/api/user/cards/${cardId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchMyCards();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const copyShareLink = (slug) => {
    const fullUrl = `${window.location.origin}/v/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="app-modal-overlay animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        className="app-modal-container"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #FFE4E6',
          boxShadow: '0 25px 50px -12px rgba(244, 63, 94, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh'
        }}
      >
        {/* Mobile Drag Handle */}
        <div className="mobile-only" style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: '#FECDD3', margin: '10px auto 4px auto', flexShrink: 0 }} />

        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #F04468 0%, #DC3659 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HeartHandshake size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Thiệp Cưới Của Tôi</h2>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>Danh sách các thiệp bạn đã khởi tạo & lưu giữ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: '#FFF8F8' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', color: '#64748B', gap: '10px' }}>
              <RefreshCw size={24} className="animate-spin" color="#F04468" />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Đang tải danh sách thiệp...</span>
            </div>
          ) : cards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                backgroundColor: '#FFF1F2',
                border: '1px solid #FECDD3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FolderHeart size={32} color="#E11D48" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E293B', margin: 0 }}>Chưa có thiệp cưới nào</h3>
              <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '360px', margin: 0, lineHeight: 1.5 }}>
                Hãy chọn một mẫu thiệp và bấm nút "Tạo Thiệp Ngay" để khởi tạo thiệp cưới cá nhân của bạn!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {cards.map((card) => {
                const groom = card.card_data?.groomName || 'Chú rể';
                const bride = card.card_data?.brideName || 'Cô dâu';
                return (
                  <div
                    key={card.id}
                    style={{
                      padding: '18px',
                      borderRadius: '16px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #FFE4E6',
                      boxShadow: '0 4px 16px rgba(244, 63, 94, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '14px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '12px', backgroundColor: '#FFF1F2', border: '1px solid #FECDD3', color: '#E11D48', fontSize: '11px', fontWeight: '700' }}>
                          Mẫu: {card.template_id}
                        </span>
                        <span style={{ fontSize: '12px', color: '#16A34A', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Eye size={13} /> {card.views_count || 0} lượt xem
                        </span>
                      </div>
                      <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E293B', margin: '4px 0' }}>
                        {groom} & {bride}
                      </h4>
                      <div style={{ fontSize: '11px', color: '#E11D48', fontFamily: 'monospace' }}>
                        /v/{card.slug}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', borderTop: '1px solid #FFE4E6' }}>
                      <button
                        onClick={() => {
                          if (onSelectCardToEdit) onSelectCardToEdit(card);
                          onClose();
                        }}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #F04468 0%, #DC3659 100%)',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: '700',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit3 size={13} /> Chỉnh sửa
                      </button>

                      <button
                        onClick={() => copyShareLink(card.slug)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '10px',
                          backgroundColor: '#FFF1F2',
                          border: '1px solid #FECDD3',
                          color: copiedSlug === card.slug ? '#16A34A' : '#E11D48',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {copiedSlug === card.slug ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedSlug === card.slug ? 'Đã chép' : 'Chép link'}</span>
                      </button>

                      <button
                        onClick={() => handleDelete(card.id)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '10px',
                          backgroundColor: '#FEF2F2',
                          border: '1px solid #FCA5A5',
                          color: '#EF4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
