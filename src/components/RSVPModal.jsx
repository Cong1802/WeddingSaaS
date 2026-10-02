import React, { useState } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';

export default function RSVPModal({ isOpen, onClose, telegramBotToken, telegramChatId }) {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState('yes');
  const [guestCount, setGuestCount] = useState('1');
  const [wish, setWish] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    const text = `💌 *PHẢN HỒI THAM DỰ LỄ CƯỚI*\n\n👤 *Họ tên:* ${name}\n✨ *Tham dự:* ${attendance === 'yes' ? '✅ CÓ THAM DỰ' : '❌ RẤT TIẾC KHÔNG THỂ THAM DỰ'}\n👥 *Số người đi cùng:* ${guestCount}\n💬 *Lời chúc:* ${wish || 'Chúc hai bạn trăm năm hạnh phúc!'}`;

    try {
      if (telegramBotToken && telegramChatId) {
        await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: text,
            parse_mode: 'Markdown'
          })
        });
      }
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      console.error('Error sending Telegram notification:', err);
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    }
  };

  return (
    <div 
      className="app-modal-overlay animate-fade-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.8)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        cursor: 'pointer'
      }}
    >
      <div 
        className="app-modal-container"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '28px',
          color: '#1a1a1a',
          position: 'relative',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          cursor: 'default'
        }}
      >
        {/* Mobile Drag Handle */}
        <div className="mobile-only" style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: '#cbd5e1', margin: '-10px auto 16px auto', flexShrink: 0 }} />
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: '#666666'
          }}
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', color: '#10b981', fontWeight: '700' }}>
              Cảm ơn lời chúc của bạn!
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
              Phản hồi đã được tự động gửi tới Cô Dâu & Chú Rể qua Telegram Bot 💌
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: '18px', color: '#7d0101', fontWeight: '700', marginBottom: '4px', textAlign: 'center' }}>
              💌 Xác Nhận Tham Dự & Lời Chúc
            </h3>
            <p style={{ fontSize: '12px', color: '#666666', marginBottom: '20px', textAlign: 'center' }}>
              Vui lòng để lại thông tin để gia đình chuẩn bị đón tiếp chu đáo nhất
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Họ và tên của bạn (*)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nhập tên của bạn"
                  style={inputModalStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Bạn có thể đến tham dự không?</label>
                <select
                  value={attendance}
                  onChange={e => setAttendance(e.target.value)}
                  style={inputModalStyle}
                >
                  <option value="yes">✅ Có! Tôi sẽ tham dự</option>
                  <option value="no">❌ Rất tiếc, tôi không thể đến</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Số người đi cùng (bao gồm bạn)</label>
                <select
                  value={guestCount}
                  onChange={e => setGuestCount(e.target.value)}
                  style={inputModalStyle}
                >
                  <option value="1">1 người</option>
                  <option value="2">2 người</option>
                  <option value="3">3 người</option>
                  <option value="4+">4 người trở lên</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Lời chúc gửi tới Cô Dâu & Chú Rể</label>
                <textarea
                  rows="3"
                  value={wish}
                  onChange={e => setWish(e.target.value)}
                  placeholder="Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long..."
                  style={{ ...inputModalStyle, resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#7d0101',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Send size={16} /> {isSubmitting ? 'Đang gửi...' : 'Gửi Phản Hồi'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: '12px',
  color: '#334155',
  fontWeight: '600',
  marginBottom: '4px',
  display: 'block'
};

const inputModalStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  backgroundColor: '#f8fafc',
  fontSize: '12px',
  color: '#0f172a',
  outline: 'none'
};
