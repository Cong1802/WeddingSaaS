import React, { useState, useRef, useEffect } from 'react';
import { X, Music, Check, Play, Pause, Disc, ArrowLeft } from 'lucide-react';

const PRESET_SONGS = [
  {
    id: '50-nam',
    title: '50 Năm Về Sau',
    artist: 'Bùi Anh Tuấn',
    url: 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/50 Năm Về Sau.mp3'
  },
  {
    id: 'hon-ca-yeu',
    title: 'Hơn Cả Yêu',
    artist: 'Đức Phúc',
    url: 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Hon-Ca-Yeu.mp3'
  },
  {
    id: 'cau-hon',
    title: 'Cầu Hôn',
    artist: 'Văn Mai Hương',
    url: 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Cau-Hon.mp3'
  },
  {
    id: 'ngay-dau-tien',
    title: 'Ngày Đầu Tiên',
    artist: 'Đức Phúc',
    url: 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Ngay-Dau-Tien.mp3'
  },
  {
    id: 'anh-nang-cua-anh',
    title: 'Ánh Nắng Của Anh',
    artist: 'Đức Phúc',
    url: 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Anh-Nang-Cua-Anh.mp3'
  },
  {
    id: 'ta-la-cua-nhau',
    title: 'Ta Là Của Nhau',
    artist: 'Đông Nhi & Ông Cao Thắng',
    url: 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/Ta-La-Cua-Nhau.mp3'
  }
];

export default function MusicSelectorModal({ isOpen, onClose, currentMusicUrl, onSelectMusic }) {
  const [playingUrl, setPlayingUrl] = useState(null);
  const [tracks, setTracks] = useState(PRESET_SONGS);
  const [customUrl, setCustomUrl] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/public/music')
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.music) && data.music.length > 0) {
            setTracks(data.music);
          }
        })
        .catch(err => console.error("Error fetching public music:", err));
    } else if (audioRef.current) {
      audioRef.current.pause();
      setPlayingUrl(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTogglePlay = (e, url) => {
    e.stopPropagation();

    if (playingUrl === url) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingUrl(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(url);
      audioRef.current.play().catch(err => console.error("Audio play error:", err));
      audioRef.current.onended = () => setPlayingUrl(null);
      setPlayingUrl(url);
    }
  };

  const handleSelectSong = (url) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingUrl(null);
    onSelectMusic(url);
    onClose();
  };

  const handleCloseModal = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingUrl(null);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: '#ffffff',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        color: '#1e293b',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Navigation Header Bar */}
      <div style={{
        height: '52px',
        padding: '0 12px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleCloseModal}
            style={{
              border: 'none',
              background: 'transparent',
              padding: '4px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
            Chọn Nhạc
          </h3>
        </div>

        <button
          onClick={handleCloseModal}
          style={{
            border: 'none',
            background: '#f1f5f9',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Full screen scrollable Songs List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {/* Custom MP3 URL Input Section */}
        <div style={{
          padding: '12px 14px',
          borderRadius: '10px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>
            🔗 Dán URL nhạc MP3 tùy chỉnh:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="https://.../nhac-cuoi.mp3"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none',
                color: '#0f172a',
                backgroundColor: '#ffffff'
              }}
            />
            <button
              onClick={() => {
                if (customUrl.trim()) {
                  handleSelectSong(customUrl.trim());
                }
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                fontWeight: '700',
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              Áp Dụng
            </button>
          </div>
        </div>

        {(tracks || []).map((song) => {
          const isSelected = currentMusicUrl === song.url;
          const isPlayingThis = playingUrl === song.url;

          return (
            <div
              key={song.id || song.url}
              onClick={() => handleSelectSong(song.url)}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                border: isSelected ? '1.5px solid #3b82f6' : '1px solid #e2e8f0',
                boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.12)' : '0 2px 4px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Song info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: isPlayingThis ? '#ec4899' : isSelected ? '#2563eb' : '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Disc 
                    size={18} 
                    color={isPlayingThis || isSelected ? '#ffffff' : '#64748b'} 
                    style={{ animation: isPlayingThis ? 'spin 3s linear infinite' : 'none' }}
                  />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '700', 
                    color: isSelected ? '#1d4ed8' : '#0f172a',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {song.title}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                    {song.artist}
                  </div>
                </div>
              </div>

              {/* Right controls: Play Preview + Select indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {/* Nghe thử button */}
                <button
                  onClick={(e) => handleTogglePlay(e, song.url)}
                  title={isPlayingThis ? 'Tạm dừng' : 'Nghe thử'}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    border: isPlayingThis ? '1px solid #f472b6' : '1px solid #cbd5e1',
                    background: isPlayingThis ? '#fce7f3' : '#f8fafc',
                    color: isPlayingThis ? '#db2777' : '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isPlayingThis ? <Pause size={13} color="#db2777" /> : <Play size={13} color="#334155" />}
                  <span>{isPlayingThis ? 'Đang phát' : 'Nghe thử'}</span>
                </button>

                {/* Selection indicator */}
                {isSelected && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={14} color="#ffffff" strokeWidth={2.5} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
