import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Calendar, 
  Image as ImageIcon, 
  CreditCard, 
  Bot,
  Upload,
  Trash2,
  FileText,
  MapPin,
  Music,
  Send,
  Play,
  Pause,
  Disc,
  Check,
  Link
} from 'lucide-react';

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

function WordPressImageControl({ id, label, value, onChange, onRemove, onFocusField }) {
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        onChange(evt.target.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div id={id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {label && <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>{label}</label>}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
      {value ? (
        <div 
          onClick={onFocusField}
          style={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #fecdd3',
            backgroundColor: '#fff8f9',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{
            height: '130px',
            width: '100%',
            borderRadius: '8px',
            backgroundImage: `url("${value}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid #fee2e2'
          }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => {
                if (onFocusField) onFocusField();
                fileInputRef.current?.click();
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #fecdd3',
                backgroundColor: '#fff1f2',
                color: '#e11d48',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
            >
              <Upload size={13} /> Thay đổi ảnh
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #fca5a5',
                  backgroundColor: '#fef2f2',
                  color: '#ef4444',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Trash2 size={13} /> Xóa
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            if (onFocusField) onFocusField();
            fileInputRef.current?.click();
          }}
          style={{
            border: '2px dashed #fecdd3',
            borderRadius: '12px',
            padding: '24px 16px',
            textAlign: 'center',
            backgroundColor: '#fffdfd',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Upload size={24} color="#e11d48" />
          <span style={{ fontSize: '12px', color: '#e11d48', fontWeight: '700' }}>Chọn ảnh từ máy tính</span>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>Hỗ trợ JPG, PNG, WEBP</span>
        </div>
      )}
    </div>
  );
}

export default function EditorSidebar({ 
  cardData, 
  setCardData,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  targetFieldId,
  onFocusPreviewElement,
  onOpenVietQR,
  onOpenRSVP,
  onOpenDatePicker
}) {
  const [localActiveTab, setLocalActiveTab] = useState('content');
  const [playingUrl, setPlayingUrl] = useState(null);
  const [customMusicUrl, setCustomMusicUrl] = useState('');
  const audioRef = useRef(null);

  const activeTab = propActiveTab || localActiveTab;
  const setActiveTab = propSetActiveTab || setLocalActiveTab;

  const updateField = (field, value) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (category, field, value) => {
    setCardData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleTogglePlayMusic = (e, url) => {
    e.stopPropagation();
    if (playingUrl === url) {
      if (audioRef.current) audioRef.current.pause();
      setPlayingUrl(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(url);
      audioRef.current.play().catch(err => console.error("Audio play error:", err));
      audioRef.current.onended = () => setPlayingUrl(null);
      setPlayingUrl(url);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Focus Sidebar Field when targetFieldId is updated from Preview Click
  useEffect(() => {
    if (targetFieldId) {
      setTimeout(() => {
        const el = document.getElementById(targetFieldId);
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.style.boxShadow = '0 0 0 3px rgba(225, 29, 72, 0.4)';
          setTimeout(() => {
            el.style.boxShadow = 'none';
          }, 2000);
        }
      }, 150);
    }
  }, [targetFieldId, activeTab]);

  // 3 Clean Tabs: Content, Music Selection, VietQR
  const tabs = [
    { id: 'content', label: 'Nội Dung Thiệp', icon: FileText },
    { id: 'music', label: 'Chọn Nhạc', icon: Music },
    { id: 'vietqr', label: 'VietQR Mừng Cưới', icon: CreditCard }
  ];

  return (
    <aside style={{
      width: '380px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #fee2e2',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      boxShadow: '4px 0 20px rgba(225, 29, 72, 0.04)'
    }}>
      {/* Tab Navigation (Icon-Only Compact Tabs to optimize space) */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #fee2e2',
        backgroundColor: '#fff8f9'
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (activeTab === 'couple' && tab.id === 'content') || (activeTab === 'event' && tab.id === 'content') || (activeTab === 'setting' && tab.id === 'vietqr');
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              style={{
                flex: 1,
                padding: '12px 8px',
                border: 'none',
                background: isActive ? '#fff1f2' : 'transparent',
                color: isActive ? '#e11d48' : '#64748b',
                borderBottom: isActive ? '3px solid #e11d48' : '3px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={18} color={isActive ? '#e11d48' : '#64748b'} />
            </button>
          );
        })}
      </div>

      {/* Tab Form Content (Arranged strictly top-to-bottom matching Preview order) */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}>
        {/* TAB 1: NỘI DUNG THIỆP & ẢNH BÌA/CẶP ĐÔI */}
        {(activeTab === 'content' || activeTab === 'couple' || activeTab === 'event') && (
          <>
            {/* 1. TOP HERO SECTION: TITLE, DATE & COVER IMAGE */}
            <div style={{ padding: '14px', background: '#fffdfd', borderRadius: '12px', border: '1px solid #fee2e2', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                1. Tiêu Đề & Ảnh Bìa Chính (Trang Đầu)
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px', display: 'block' }}>Tiêu đề thiệp ngắn</label>
                  <input
                    id="field-title"
                    type="text"
                    value={cardData.title}
                    onFocus={() => onFocusPreviewElement && onFocusPreviewElement('#HEADLINE3')}
                    onChange={e => updateField('title', e.target.value)}
                    placeholder="VD: Thanh Thu & Bá Công"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px', display: 'block' }}>Ngày thành hôn</label>
                  <input
                    id="field-weddingDate"
                    type="text"
                    value={cardData.weddingDate}
                    onFocus={() => onFocusPreviewElement && onFocusPreviewElement('#PARAGRAPH2')}
                    onChange={e => updateField('weddingDate', e.target.value)}
                    placeholder="VD: 20 . 09 . 2026"
                    style={inputStyle}
                  />
                </div>

                <WordPressImageControl
                  id="field-heroImage"
                  label="Ảnh Banner Bìa Chính"
                  value={cardData.heroImage}
                  onFocusField={() => onFocusPreviewElement && onFocusPreviewElement('#SECTION1')}
                  onChange={url => updateField('heroImage', url)}
                  onRemove={() => updateField('heroImage', '')}
                />
              </div>
            </div>

            {/* 2. SECTION 2: CHÚ RỂ & CÔ DÂU (NHÀ TRAI & NHÀ GÁI + CHÂN DUNG) */}
            <div style={{ padding: '14px', background: '#fff5f7', borderRadius: '12px', border: '1px solid #fecdd3', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                2. Thông Tin & Ảnh Cặp Đôi
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Groom */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#e11d48' }}>Họ & Tên Chú Rể (Nhà Trai)</label>
                  <input
                    id="field-groomName"
                    type="text"
                    value={cardData.groomName}
                    onFocus={() => onFocusPreviewElement && onFocusPreviewElement('#PARAGRAPH3')}
                    onChange={e => updateField('groomName', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>Họ Tên Bố Mẹ Chú Rể</label>
                  <input
                    id="field-groomParents"
                    type="text"
                    value={cardData.groomParents}
                    onFocus={() => onFocusPreviewElement && onFocusPreviewElement('#PARAGRAPH8')}
                    onChange={e => updateField('groomParents', e.target.value)}
                    placeholder="VD: Ông Dương Văn A - Bà Nguyễn Thị B"
                    style={inputStyle}
                  />
                </div>
                <WordPressImageControl
                  id="field-groomPhoto"
                  label="Ảnh Chú Rể"
                  value={cardData.groomPhoto}
                  onFocusField={() => onFocusPreviewElement && onFocusPreviewElement('#IMAGE50')}
                  onChange={url => updateField('groomPhoto', url)}
                  onRemove={() => updateField('groomPhoto', '')}
                />

                {/* Bride */}
                <div style={{ paddingTop: '8px', borderTop: '1px dashed #fecdd3' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#db2777' }}>Họ & Tên Cô Dâu (Nhà Gái)</label>
                  <input
                    id="field-brideName"
                    type="text"
                    value={cardData.brideName}
                    onFocus={() => onFocusPreviewElement && onFocusPreviewElement('#PARAGRAPH5')}
                    onChange={e => updateField('brideName', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>Họ Tên Bố Mẹ Cô Dâu</label>
                  <input
                    id="field-brideParents"
                    type="text"
                    value={cardData.brideParents}
                    onFocus={() => onFocusPreviewElement && onFocusPreviewElement('#PARAGRAPH9')}
                    onChange={e => updateField('brideParents', e.target.value)}
                    placeholder="VD: Ông Vũ Văn C - Bà Trần Thị D"
                    style={inputStyle}
                  />
                </div>
                <WordPressImageControl
                  id="field-bridePhoto"
                  label="Ảnh Cô Dâu"
                  value={cardData.bridePhoto}
                  onFocusField={() => onFocusPreviewElement && onFocusPreviewElement('#IMAGE49')}
                  onChange={url => updateField('bridePhoto', url)}
                  onRemove={() => updateField('bridePhoto', '')}
                />
              </div>
            </div>

            {/* 3. SECTION 5: ĐỊA ĐIỂM & BẢN ĐỒ CƯỚI */}
            <div style={{ padding: '14px', background: '#fff5f7', borderRadius: '12px', border: '1px solid #fecdd3' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px 0' }}>
                3. Địa Điểm & Bản Đồ Tiệc Cưới
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Groom Event */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#e11d48' }}>Địa chỉ Tiệc Nhà Trai</label>
                  <input
                    id="field-groomAddress"
                    type="text"
                    value={cardData.groomAddress}
                    onFocus={() => onFocusPreviewElement && onFocusPreviewElement('#PARAGRAPH6')}
                    onChange={e => updateField('groomAddress', e.target.value)}
                    placeholder="Địa chỉ nhà trai"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>Google Maps Nhà Trai</label>
                  <input
                    id="field-groomMapUrl"
                    type="text"
                    value={cardData.groomMapUrl}
                    onFocus={() => onFocusPreviewElement && onFocusPreviewElement('#SECTION5')}
                    onChange={e => updateField('groomMapUrl', e.target.value)}
                    placeholder="Link Google Maps chỉ đường"
                    style={inputStyle}
                  />
                </div>

                {/* Bride Event */}
                <div style={{ paddingTop: '8px', borderTop: '1px dashed #fecdd3' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#db2777' }}>Địa chỉ Tiệc Nhà Gái</label>
                  <input
                    id="field-brideAddress"
                    type="text"
                    value={cardData.brideAddress}
                    onFocus={() => onFocusPreviewElement && onFocusPreviewElement('#PARAGRAPH10')}
                    onChange={e => updateField('brideAddress', e.target.value)}
                    placeholder="Địa chỉ nhà gái"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>Google Maps Nhà Gái</label>
                  <input
                    id="field-brideMapUrl"
                    type="text"
                    value={cardData.brideMapUrl}
                    onFocus={() => onFocusPreviewElement && onFocusPreviewElement('#SECTION5')}
                    onChange={e => updateField('brideMapUrl', e.target.value)}
                    placeholder="Link Google Maps chỉ đường"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: CHỌN NHẠC NỀN THIỆP CƯỚI */}
        {(activeTab === 'music' || activeTab === 'album') && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Music size={15} color="#e11d48" />
              <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                Chọn Nhạc Nền Thiệp Cưới
              </h3>
            </div>

            {/* Custom MP3 Input */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: '#fffdfd',
              border: '1px solid #fee2e2',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Link size={13} color="#475569" />
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155' }}>
                  Dán Link Nhạc MP3 Tùy Chỉnh:
                </label>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="https://.../nhac-cuoi.mp3"
                  value={customMusicUrl || (PRESET_SONGS.some(s => s.url === cardData.musicUrl) ? '' : cardData.musicUrl)}
                  onChange={(e) => setCustomMusicUrl(e.target.value)}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customMusicUrl.trim()) {
                      updateField('musicUrl', customMusicUrl.trim());
                    }
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#e11d48',
                    color: '#fff',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Áp Dụng
                </button>
              </div>
            </div>

            {/* Preset Songs List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PRESET_SONGS.map((song) => {
                const isSelected = cardData.musicUrl === song.url;
                const isPlayingThis = playingUrl === song.url;

                return (
                  <div
                    key={song.id}
                    onClick={() => updateField('musicUrl', song.url)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? '#fff1f2' : '#ffffff',
                      border: isSelected ? '1.5px solid #e11d48' : '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: isPlayingThis ? '#e11d48' : isSelected ? '#e11d48' : '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Disc 
                          size={16} 
                          color={isPlayingThis || isSelected ? '#ffffff' : '#64748b'} 
                        />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ 
                          fontSize: '13px', 
                          fontWeight: '700', 
                          color: isSelected ? '#e11d48' : '#0f172a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {song.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {song.artist}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={(e) => handleTogglePlayMusic(e, song.url)}
                        title={isPlayingThis ? 'Tạm dừng' : 'Nghe thử'}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '14px',
                          border: isPlayingThis ? '1px solid #fecdd3' : '1px solid #cbd5e1',
                          background: isPlayingThis ? '#fff1f2' : '#f8fafc',
                          color: isPlayingThis ? '#e11d48' : '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        {isPlayingThis ? <Pause size={12} color="#e11d48" /> : <Play size={12} color="#334155" />}
                        <span>{isPlayingThis ? 'Phát' : 'Nghe'}</span>
                      </button>

                      {isSelected && (
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: '#e11d48',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Check size={12} color="#ffffff" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* TAB 3: VIETQR & CẤU HÌNH RSVP */}
        {(activeTab === 'vietqr' || activeTab === 'setting') && (
          <>
            <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Ngân Hàng VietQR & Thông Báo RSVP
            </h3>

            <div style={{ padding: '14px', background: '#fff5f7', borderRadius: '12px', border: '1px solid #fecdd3' }}>
              <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#e11d48', marginBottom: '8px' }}>Mừng Cưới Chú Rể (VietQR)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  id="field-groomBankName"
                  type="text"
                  value={cardData.groomBank.bankName}
                  onFocus={() => onFocusPreviewElement && onFocusPreviewElement('#POPUP2')}
                  onChange={e => updateNestedField('groomBank', 'bankName', e.target.value)}
                  placeholder="Mã Ngân hàng (VD: MB, VCB, VPB)"
                  style={inputStyle}
                />
                <input
                  id="field-groomAccountNo"
                  type="text"
                  value={cardData.groomBank.accountNo}
                  onFocus={() => onFocusPreviewElement && onFocusPreviewElement('#POPUP2')}
                  onChange={e => updateNestedField('groomBank', 'accountNo', e.target.value)}
                  placeholder="Số Tài Khoản"
                  style={inputStyle}
                />
                <input
                  id="field-groomAccountHolder"
                  type="text"
                  value={cardData.groomBank.accountHolder}
                  onFocus={() => onFocusPreviewElement && onFocusPreviewElement('#POPUP2')}
                  onChange={e => updateNestedField('groomBank', 'accountHolder', e.target.value)}
                  placeholder="Tên Chủ Tài Khoản"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ padding: '14px', background: '#fff5f7', borderRadius: '12px', border: '1px solid #fecdd3' }}>
              <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#db2777', marginBottom: '8px' }}>Mừng Cưới Cô Dâu (VietQR)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  id="field-brideBankName"
                  type="text"
                  value={cardData.brideBank.bankName}
                  onFocus={() => onFocusPreviewElement && onFocusPreviewElement('#POPUP2')}
                  onChange={e => updateNestedField('brideBank', 'bankName', e.target.value)}
                  placeholder="Mã Ngân hàng (VD: VCB, BIDV, VPB)"
                  style={inputStyle}
                />
                <input
                  id="field-brideAccountNo"
                  type="text"
                  value={cardData.brideBank.accountNo}
                  onFocus={() => onFocusPreviewElement && onFocusPreviewElement('#POPUP2')}
                  onChange={e => updateNestedField('brideBank', 'accountNo', e.target.value)}
                  placeholder="Số Tài Khoản"
                  style={inputStyle}
                />
                <input
                  id="field-brideAccountHolder"
                  type="text"
                  value={cardData.brideBank.accountHolder}
                  onFocus={() => onFocusPreviewElement && onFocusPreviewElement('#POPUP2')}
                  onChange={e => updateNestedField('brideBank', 'accountHolder', e.target.value)}
                  placeholder="Tên Chủ Tài Khoản"
                  style={inputStyle}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

const inputStyle = {
  width: '100%',
  padding: '9px 14px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc',
  color: '#0f172a',
  fontSize: '12px',
  fontWeight: '500',
  outline: 'none',
  transition: 'all 0.2s ease'
};
