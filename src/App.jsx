import React, { useState } from 'react';
import Header from './components/Header';
import EditorSidebar from './components/EditorSidebar';
import WeddingCardPreview from './components/WeddingCardPreview';
import VietQRModal from './components/VietQRModal';
import RSVPModal from './components/RSVPModal';
import TemplateSelectorModal from './components/TemplateSelectorModal';
import DatePickerModal from './components/DatePickerModal';
import MapLinkModal from './components/MapLinkModal';
import MusicSelectorModal from './components/MusicSelectorModal';
import ShareModal from './components/ShareModal';
import GuestCardViewer from './components/GuestCardViewer';
import MobileBottomBar from './components/MobileBottomBar';
import MobileTopActionPills from './components/MobileTopActionPills';
import AuthModal from './components/AuthModal';
import AdminCMS from './components/AdminCMS';
import MyCardsModal from './components/MyCardsModal';
import PurchaseModal from './components/PurchaseModal';
import LandingPage from './components/LandingPage';
import { TEMPLATES } from './templates/templateRegistry';

export default function App() {
  const getInitialPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (page === 'admin' || urlParams.has('admin') || path === '/admin' || hash.includes('admin')) {
      return 'admin';
    }
    return 'landing';
  };
  const [currentPage, setCurrentPage] = useState(getInitialPage); // 'landing' | 'editor' | 'admin'

  React.useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get('page');
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (page === 'admin' || urlParams.has('admin') || path === '/admin' || hash.includes('admin')) {
        setCurrentPage('admin');
      }
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);
  const [pendingTemplate, setPendingTemplate] = useState(null);
  const [isPendingEditorAccess, setIsPendingEditorAccess] = useState(false);

  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'desktop'
  const [activeSidebarTab, setActiveSidebarTab] = useState('couple'); // 'couple' | 'event' | 'album' | 'vietqr' | 'setting'
  const [activeMobileTab, setActiveMobileTab] = useState('preview'); // 'preview' | 'couple' | 'event' | 'album' | 'vietqr'
  const [isVietQROpen, setIsVietQROpen] = useState(false);
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isMyCardsModalOpen, setIsMyCardsModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchasePackage, setPurchasePackage] = useState('pro');
  
  const [mapTargetSection, setMapTargetSection] = useState('groom');
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);

  // Auth User & Token State
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState(null);

  // Card Data State (Declared at top level to satisfy React Rules of Hooks)
  const [cardData, setCardData] = useState({
    title: 'Thanh Thu & Bá Công',
    invitationQuote: 'Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi!',
    groomName: 'Dương Quang Tuấn',
    groomParents: 'Ông Dương Văn A - Bà Nguyễn Thị B',
    groomRole: 'Trưởng Nam',
    brideName: 'Vũ Thị Huy Hoàng',
    brideParents: 'Ông Vũ Văn C - Bà Trần Thị D',
    brideRole: 'Trưởng Nữ',
    weddingDate: '20 . 09 . 2026',
    groomAddress: 'Nhà hàng Tiệc cưới Diamond Plaza, Q.4, TP. Hồ Chí Minh',
    groomMapUrl: 'https://maps.google.com',
    groomTime: '09:00 AM - 20/09/2026',
    brideAddress: 'Nhà hàng Tiệc cưới Riverside Center, Q.7, TP. Hồ Chí Minh',
    brideMapUrl: 'https://maps.google.com',
    brideTime: '11:30 AM - 20/09/2026',
    heroImage: 'https://static.ladipage.net/644bd195fdccd700206206ea/1784694207141_5878546174374599182_g6112929478382919247_d4a720c5583655cc94927ee40b98547d-20260722043050-kosnr.jpg',
    groomPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bridePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    groomBank: {
      bankName: 'MB',
      accountNo: '0987654321',
      accountHolder: 'DUONG QUANG TUAN'
    },
    brideBank: {
      bankName: 'VPB',
      accountNo: '1234567890',
      accountHolder: 'VU THI HUY HOANG'
    },
    telegramBotToken: '',
    telegramChatId: '',
    musicUrl: 'https://cdn.jsdelivr.net/gh/saygoodbyethe3-bit/music-hosting/50 Năm Về Sau.mp3'
  });

  // Check if guest viewer mode is active via URL (/v/slug or ?v=slug or /slug)
  const getGuestSlugFromUrl = () => {
    const pathname = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    if (pathname.startsWith('/v/')) {
      const s = pathname.replace('/v/', '').replace(/\/$/, '');
      if (s) return s;
    }
    if (urlParams.get('v')) return urlParams.get('v');
    if (pathname !== '/' && !pathname.startsWith('/api') && !pathname.startsWith('/admin') && !pathname.startsWith('/dist') && !pathname.includes('.')) {
      const cleanPath = pathname.replace(/^\//, '').replace(/\/$/, '');
      if (cleanPath) return cleanPath;
    }
    return null;
  };
  const guestSlugParam = getGuestSlugFromUrl();

  // Dynamic System Settings & SEO Title/Favicon
  const [publicSettings, setPublicSettings] = useState({});

  React.useEffect(() => {
    fetch('/api/public/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setPublicSettings(data.settings);
          if (data.settings.site_title) {
            document.title = data.settings.site_title;
          }
          if (data.settings.site_description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              metaDesc = document.createElement('meta');
              metaDesc.name = 'description';
              document.head.appendChild(metaDesc);
            }
            metaDesc.content = data.settings.site_description;
          }
          if (data.settings.site_favicon) {
            let favicon = document.querySelector('link[rel="icon"]');
            if (!favicon) {
              favicon = document.createElement('link');
              favicon.rel = 'icon';
              document.head.appendChild(favicon);
            }
            favicon.href = data.settings.site_favicon;
          }
        }
      })
      .catch(err => console.error("Error loading public settings:", err));
  }, []);

  // Tải thông tin người dùng từ Backend nếu có Token
  React.useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          // Token không hợp lệ hoặc hết hạn
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      });
    }
  }, [token]);

  // Continuously remove LadiPage watermark elements injected into parent document.body
  React.useEffect(() => {
    const removeParentWatermark = () => {
      const els = document.querySelectorAll('[class*="_NOYF"], [class*="NOYF"], body > div[style*="1000000000"], body > div[style*="ladipage.svg"], div[style*="ladipage.svg"], a[href*="ladipage"]');
      els.forEach(el => el.remove());
    };
    removeParentWatermark();
    const interval = setInterval(removeParentWatermark, 300);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }).catch(() => {});
    }
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    setCurrentPage('landing');
  };

  const handleGoToEditor = (template = null, packageType = 'pro') => {
    if (template) {
      setSelectedTemplate(template);
    }
    setPurchasePackage(packageType);

    // 1. MANDATORY LOGIN GUARD: Only logged-in users can enter Editor
    if (!token && !user) {
      setIsPendingEditorAccess(true);
      if (template) setPendingTemplate(template);
      setIsAuthModalOpen(true);
      return;
    }

    // 2. Go to Editor
    setCurrentPage('editor');

    // 3. Unlocked! Go to Editor
    setCurrentPage('editor');
  };

  const [targetFieldId, setTargetFieldId] = useState(null);
  const [targetPreviewSelector, setTargetPreviewSelector] = useState(null);

  const handleOpenEditSection = (sectionId, fieldId = null) => {
    let tabId = sectionId;
    if (sectionId === 'couple' || sectionId === 'event' || sectionId === 'content') tabId = 'content';
    else if (sectionId === 'album') tabId = 'album';
    else if (sectionId === 'vietqr' || sectionId === 'setting') tabId = 'vietqr';

    setActiveSidebarTab(tabId);
    setActiveMobileTab(tabId);
    if (fieldId) setTargetFieldId(fieldId);
  };

  const handleExportHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thư Mời Lễ Cưới - ${cardData.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; padding: 0; font-family: 'Playfair Display', serif; background-color: #0b0f17; color: #222; }
    .card-container { max-width: 460px; margin: 0 auto; background: #fff; min-height: 100vh; }
    .hero { height: 460px; background: linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url('${cardData.heroImage}') center/cover; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; padding: 30px; text-align: center; color: #fff; }
    .title { font-family: 'Great Vibes', cursive; font-size: 40px; margin: 10px 0; }
    .couple-sec { padding: 40px 20px; text-align: center; background: #fcfbf7; }
    .avatar { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid #d4af37; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="card-container">
    <div class="hero">
      <p style="letter-spacing: 3px; font-size: 12px; color: #fef08a;">SAVE THE DATE</p>
      <h1 class="title">${cardData.title}</h1>
      <p>${cardData.weddingDate}</p>
    </div>
    <div class="couple-sec">
      <h2 style="color: #7d0101; font-size: 20px;">THƯ MỜI LỄ CƯỚI</h2>
      <div style="display: flex; gap: 15px; margin-top: 25px;">
        <div style="flex: 1;">
          <img src="${cardData.groomPhoto}" class="avatar" />
          <h3 style="font-size: 16px;">${cardData.groomName}</h3>
          <p style="font-size: 11px; color: #777;">${cardData.groomParents}</p>
        </div>
        <div style="flex: 1;">
          <img src="${cardData.bridePhoto}" class="avatar" style="border-color: #e07a5f;" />
          <h3 style="font-size: 16px;">${cardData.brideName}</h3>
          <p style="font-size: 11px; color: #777;">${cardData.brideParents}</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Thieu_Moi_Le_Cuoi_${cardData.groomName}_${cardData.brideName}.html`;
    a.click();
  };

  const handleOpenAdmin = () => {
    setCurrentPage('admin');
  };

  if (guestSlugParam) {
    return <GuestCardViewer slug={guestSlugParam} />;
  }

  if (currentPage === 'admin') {
    return (
      <AdminCMS
        user={user}
        token={token}
        onLogout={handleLogout}
        onBackToSite={() => setCurrentPage('landing')}
        onAuthSuccess={(userData, userToken) => {
          setUser(userData);
          setToken(userToken);
          localStorage.setItem('auth_token', userToken);
        }}
      />
    );
  }

  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage publicSettings={publicSettings}
          onGoToEditor={handleGoToEditor}
          onOpenAuthModal={() => {
            setIsPendingEditorAccess(false);
            setIsAuthModalOpen(true);
          }}
          user={user}
          onLogout={handleLogout}
          onOpenMyCards={() => setIsMyCardsModalOpen(true)}
          onOpenAdmin={handleOpenAdmin}
          onOpenPurchase={() => setIsPurchaseModalOpen(true)}
        />
        
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => {
            setIsAuthModalOpen(false);
            setIsPendingEditorAccess(false);
          }}
          onAuthSuccess={(userData, userToken) => {
            setUser(userData);
            setToken(userToken);
            if (userData.role === 'admin') {
              setIsPendingEditorAccess(false);
              setCurrentPage('admin');
            } else if (isPendingEditorAccess) {
              if (pendingTemplate) {
                setSelectedTemplate(pendingTemplate);
                setPendingTemplate(null);
              }

              setIsPendingEditorAccess(false);
              setCurrentPage('editor');
            }
          }}
        />

        <MyCardsModal
          isOpen={isMyCardsModalOpen}
          onClose={() => setIsMyCardsModalOpen(false)}
          token={token}
          onSelectCardToEdit={(card) => {
            if (card.card_data) {
              setCardData(card.card_data);
            }
            const t = TEMPLATES.find(t => t.id === card.template_id);
            if (t) setSelectedTemplate(t);
            setCurrentPage('editor');
          }}
        />

        <PurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => {
            setIsPurchaseModalOpen(false);
            setIsPendingEditorAccess(false);
          }}
          user={user}
          token={token}
          initialPackage={purchasePackage}
          onSuccess={(updatedUser) => {
            if (updatedUser) setUser(updatedUser);
            setIsPurchaseModalOpen(false);
            setIsPendingEditorAccess(false);
            setCurrentPage('editor');
          }}
        />
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        onExportHTML={handleExportHTML}
        onOpenVietQRDemo={() => setIsVietQROpen(true)}
        onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        selectedTemplateName={selectedTemplate.name}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenMyCardsModal={() => setIsMyCardsModalOpen(true)}
        onOpenAdminModal={handleOpenAdmin}
        onOpenPurchaseModal={() => setIsPurchaseModalOpen(true)}
        onLogout={handleLogout}
        onGoToLandingPage={() => setCurrentPage('landing')}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Desktop Sidebar */}
        <div className="desktop-only" style={{ height: '100%' }}>
          <EditorSidebar
            cardData={cardData}
            setCardData={setCardData}
            activeTab={activeSidebarTab}
            setActiveTab={setActiveSidebarTab}
            targetFieldId={targetFieldId}
            onFocusPreviewElement={(selector) => setTargetPreviewSelector(selector)}
            onOpenVietQR={() => setIsVietQROpen(true)}
            onOpenRSVP={() => setIsRSVPOpen(true)}
            onOpenDatePicker={() => setIsDatePickerOpen(true)}
          />
        </div>

        {/* Card Preview */}
        <WeddingCardPreview
          cardData={cardData}
          setCardData={setCardData}
          viewMode={viewMode}
          selectedTemplate={selectedTemplate}
          onOpenEditSection={handleOpenEditSection}
          targetPreviewSelector={targetPreviewSelector}
          onOpenVietQR={() => setIsVietQROpen(true)}
          onOpenRSVP={() => setIsRSVPOpen(true)}
          onOpenDatePicker={() => setIsDatePickerOpen(true)}
          onOpenMapModal={(targetSection = 'groom') => {
            setMapTargetSection(targetSection);
            setIsMapModalOpen(true);
          }}
          activeMobileTab={activeMobileTab}
        />
      </div>

      {/* iOS Floating Bottom Bar for Mobile users with Mẫu, Nhạc & Xuất Thiệp buttons */}
      <MobileBottomBar
        activeMobileTab={activeMobileTab}
        setActiveMobileTab={setActiveMobileTab}
        cardData={cardData}
        setCardData={setCardData}
        onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
        onOpenMusicModal={() => setIsMusicModalOpen(true)}
        onOpenVietQRModal={() => setIsVietQROpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onExportHTML={handleExportHTML}
      />

      {/* MODALS */}
      <MapLinkModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        currentUrl={mapTargetSection === 'groom' ? cardData.groomMapUrl : cardData.brideMapUrl}
        addressText={mapTargetSection === 'groom' ? cardData.groomAddress : cardData.brideAddress}
        targetName={mapTargetSection === 'groom' ? 'Tiệc Nhà Trai' : 'Tiệc Nhà Gái'}
        onSave={(data) => {
          const newUrl = typeof data === 'object' ? data.url : data;
          const newAddress = typeof data === 'object' ? data.address : null;

          if (mapTargetSection === 'groom') {
            setCardData(prev => ({
              ...prev,
              groomMapUrl: newUrl,
              ...(newAddress ? { groomAddress: newAddress } : {})
            }));
          } else {
            setCardData(prev => ({
              ...prev,
              brideMapUrl: newUrl,
              ...(newAddress ? { brideAddress: newAddress } : {})
            }));
          }
        }}
      />

      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        currentDateStr={cardData.weddingDate}
        onSelectDate={(formatted) => setCardData(prev => ({ ...prev, weddingDate: formatted }))}
      />

      <VietQRModal
        isOpen={isVietQROpen}
        onClose={() => setIsVietQROpen(false)}
        groomBank={cardData.groomBank}
        brideBank={cardData.brideBank}
      />

      <RSVPModal
        isOpen={isRSVPOpen}
        onClose={() => setIsRSVPOpen(false)}
        telegramBotToken={cardData.telegramBotToken}
        telegramChatId={cardData.telegramChatId}
      />

      <TemplateSelectorModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        selectedTemplateId={selectedTemplate.id}
        onSelectTemplate={setSelectedTemplate}
      />

      <MusicSelectorModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
        currentMusicUrl={cardData.musicUrl}
        onSelectMusic={(url) => setCardData(prev => ({ ...prev, musicUrl: url }))}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        cardData={cardData}
        selectedTemplateId={selectedTemplate.id}
        token={token}
        onExportHTML={handleExportHTML}
      />

      {/* NEW AUTH & ADMIN & PURCHASE MODALS */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setIsPendingEditorAccess(false);
        }}
        onAuthSuccess={(userData, userToken) => {
          setUser(userData);
          setToken(userToken);
          if (userData.role === 'admin') {
            setIsPendingEditorAccess(false);
            setCurrentPage('admin');
          } else {
            if (pendingTemplate) {
              setSelectedTemplate(pendingTemplate);
              setPendingTemplate(null);
            }
            setIsPendingEditorAccess(false);
            setCurrentPage('editor');
          }
        }}
      />

      <MyCardsModal
        isOpen={isMyCardsModalOpen}
        onClose={() => setIsMyCardsModalOpen(false)}
        token={token}
        onSelectCardToEdit={(card) => {
          if (card.card_data) {
            setCardData(card.card_data);
          }
          const t = TEMPLATES.find(t => t.id === card.template_id);
          if (t) setSelectedTemplate(t);
          setCurrentPage('editor');
        }}
      />

      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          setIsPurchaseModalOpen(false);
          setIsPendingEditorAccess(false);
        }}
        user={user}
        token={token}
        initialPackage={purchasePackage}
        onSuccess={(updatedUser) => {
          if (updatedUser) setUser(updatedUser);
          setIsPurchaseModalOpen(false);
          setIsPendingEditorAccess(false);
          setCurrentPage('editor');
        }}
      />
    </div>
  );
}
