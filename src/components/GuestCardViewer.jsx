import React, { useState, useEffect, useRef } from 'react';
import { Music, Disc, Volume2, VolumeX } from 'lucide-react';
import { getCardBySlug } from '../services/cardApi';
import { TEMPLATES } from '../templates/templateRegistry';

export default function GuestCardViewer({ slug }) {
  const [loading, setLoading] = useState(true);
  const [cardPayload, setCardPayload] = useState(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchCard = async () => {
      setLoading(true);
      const data = await getCardBySlug(slug);
      setCardPayload(data);
      setLoading(false);
    };
    fetchCard();
  }, [slug]);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0b0f17',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.2)',
          borderTopColor: '#d4af37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ marginTop: '16px', fontSize: '14px', color: '#cbd5e1' }}>Đang nạp thiệp cưới...</p>
      </div>
    );
  }

  if (cardPayload?.locked) {
    return <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', background: '#fff7f8', textAlign: 'center', padding: 24 }}><div><h1>Thiệp hiện đang khóa</h1><p>{cardPayload.message || 'Chủ thiệp cần gia hạn mẫu để tiếp tục sử dụng.'}</p></div></div>;
  }

  if (!cardPayload) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f8fafc',
        color: '#1e293b',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'sans-serif'
      }}>
        <h2 style={{ fontSize: '20px', color: '#7d0101', marginBottom: '8px' }}>Thiệp cưới không tồn tại</h2>
        <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '360px' }}>
          Đường dẫn thiệp cưới không hợp lệ hoặc đã bị ẩn bởi người tạo.
        </p>
      </div>
    );
  }

  const { template_id, card_data } = cardPayload;
  const targetTemplate = cardPayload.template ? { id: cardPayload.template.code, fileUrl: cardPayload.template.file_url || '/template.html' } : TEMPLATES.find(t => t.id === template_id) || TEMPLATES[0];

  const handleIframeLoad = () => {
    if (!iframeRef.current) return;
    try {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      if (!doc) return;

      // Synchronize text
      const updateText = (selector, val) => {
        const el = doc.querySelector(selector);
        if (el && val) el.innerText = val;
      };

      updateText('#HEADLINE3 .ladi-headline', card_data.title);
      updateText('#PARAGRAPH2 .ladi-paragraph', card_data.weddingDate);
      updateText('#PARAGRAPH3 .ladi-paragraph', card_data.groomName);
      updateText('#PARAGRAPH5 .ladi-paragraph', card_data.brideName);
      updateText('#PARAGRAPH6 .ladi-paragraph', card_data.groomAddress);
      if (card_data.groomParents) updateText('#PARAGRAPH8 .ladi-paragraph', card_data.groomParents);
      if (card_data.brideParents) updateText('#PARAGRAPH9 .ladi-paragraph', card_data.brideParents);

      // Disable live-editor-bar in guest view
      const liveEditorBar = doc.querySelector('#live-editor-bar');
      if (liveEditorBar) liveEditorBar.style.display = 'none';

      // Ensure doors open interaction works
      const doorContainer = doc.querySelector('#GROUP88');
      const waxSealStamp = doc.querySelector('#GROUP89');
      if (doorContainer && waxSealStamp) {
        waxSealStamp.style.cursor = 'pointer';
        waxSealStamp.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          doorContainer.classList.add('door-open');
          setTimeout(() => {
            doorContainer.classList.add('door-closed-hidden');
          }, 800);
        };
      }
    } catch(err) {
      console.warn('Guest view iframe load sync error:', err);
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background Audio */}
      {card_data.musicUrl && (
        <audio ref={audioRef} src={card_data.musicUrl} loop />
      )}

      {/* Floating Music Toggle Button */}
      {card_data.musicUrl && (
        <button
          onClick={toggleMusic}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: isPlayingMusic ? '#2563eb' : 'rgba(15, 23, 42, 0.85)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 99999,
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(8px)'
          }}
          title={isPlayingMusic ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
        >
          {isPlayingMusic ? (
            <Volume2 size={22} className="animate-spin" />
          ) : (
            <VolumeX size={22} />
          )}
        </button>
      )}

      {/* Main Fullscreen Iframe Guest Card */}
      <iframe
        ref={iframeRef}
        src={targetTemplate.fileUrl}
        title={`Thiệp Cưới - ${card_data.title}`}
        onLoad={handleIframeLoad}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
      />
    </div>
  );
}
