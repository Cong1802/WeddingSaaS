import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  Smartphone, 
  CreditCard, 
  Heart, 
  Star, 
  LayoutGrid, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Gift, 
  Headphones, 
  ShieldCheck, 
  Lock, 
  Sliders, 
  Share2, 
  ChevronDown, 
  FolderHeart, 
  Shield, 
  LogOut, 
  Mail, 
  Send,
  Globe,
  Award,
  Eye,
  FileText,
  Palette
} from 'lucide-react';
import { TEMPLATES } from '../templates/templateRegistry';
import heroBannerImg from '../assets/hero-banner.png';
import heroBanner2Img from '../assets/hero-banner-2.png';
import heroBgImg from '../assets/hero-bg.png';
import logoImg from '../assets/logo.png';
import whyUsCoupleImg from '../assets/why-us-couple.png';
import promoMobileCardImg from '../assets/promo-mobile-card.png';

export default function LandingPage({ 
  onGoToEditor, 
  onOpenAuthModal, 
  user, 
  onLogout, 
  onOpenMyCards, 
  onOpenAdmin, 
  onOpenPurchase 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroBanners = [heroBannerImg, heroBanner2Img];

  React.useEffect(() => {
    if (isBannerHovered) return;
    const timer = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % heroBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isBannerHovered]);

  // Template categories matching mockup
  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'modern', label: 'Hiện đại' },
    { id: 'classic', label: 'Cổ điển' },
    { id: 'minimal', label: 'Tối giản' },
    { id: 'vintage', label: 'Vintage' },
    { id: 'luxury', label: 'Sang trọng' },
    { id: 'korean', label: 'Hàn Quốc' },
  ];

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'modern' && (t.category?.includes('Hiện Đại') || t.name.includes('Hiện đại'))) ||
      (selectedCategory === 'classic' && (t.category?.includes('Cổ Điển') || t.name.includes('Cổ điển'))) ||
      (selectedCategory === 'minimal' && (t.category?.includes('Tối Giản') || t.name.includes('Tối giản'))) ||
      (selectedCategory === 'vintage' && (t.category?.includes('Vintage') || t.name.includes('Vintage'))) ||
      (selectedCategory === 'luxury' && (t.category?.includes('Sang Trọng') || t.name.includes('Sang trọng'))) ||
      (selectedCategory === 'korean' && (t.category?.includes('Hàn Quốc') || t.name.includes('Hàn Quốc')));
    
    const matchesSearch = searchQuery === '' || t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const testimonials = [
    {
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      names: 'Ngọc Anh & Minh Quân',
      date: '20.09.2026',
      rating: 5,
      comment: 'Thiệp cưới đẹp, dễ tạo, nhiều mẫu rất hiện đại. Chỉ mất 5 phút là xong. Khách mời ai cũng khen nhiều lắm!'
    },
    {
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      names: 'Thu Hà & Quốc Bảo',
      date: '12.10.2026',
      rating: 5,
      comment: 'Tính năng nhận tiền mừng cưới online rất tiện, giúp túi mình quản lý dễ dàng. Dịch vụ hỗ trợ cũng rất nhiệt tình!'
    },
    {
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      names: 'Lan Anh & Tuấn Kiệt',
      date: '05.11.2026',
      rating: 5,
      comment: 'Giao diện đẹp, dễ sử dụng, giá cả hợp lý. Mình rất hài lòng và sẽ giới thiệu cho bạn bè!'
    }
  ];

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* ----------------------------------------------------
          1. HEADER & HERO SEAMLESS WRAPPER
      ---------------------------------------------------- */}
      <div style={{
        width: '100%',
        backgroundColor: '#fffdfd',
        backgroundImage: `url(${heroBgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}>
        <header style={{
          position: 'relative',
          zIndex: 50,
          backgroundColor: 'transparent',
          borderBottom: 'none',
          boxShadow: 'none',
          width: '100%'
        }}>
        <div style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          height: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box'
        }}>
          {/* Logo image from asset */}
          <div 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
            onClick={() => {
              setActiveNav('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img 
              src={logoImg} 
              alt="WeddingSaaS - Thiệp cưới Online Thông Minh" 
              style={{ height: '48px', width: 'auto', objectFit: 'contain' }} 
            />
          </div>

          {/* Navigation Menu (Desktop) matching sample */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-only">
            {[
              { id: 'home', label: 'Trang chủ' },
              { id: 'templates', label: 'Mẫu thiệp' },
              { id: 'features', label: 'Tính năng' },
              { id: 'pricing', label: 'Bảng giá' },
              { id: 'steps', label: 'Hướng dẫn' },
              { id: 'testimonials', label: 'Liên hệ' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveNav(item.id);
                  const el = document.getElementById(item.id);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else if (item.id === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                style={{
                  position: 'relative',
                  color: activeNav === item.id ? '#e11d48' : '#334155',
                  fontSize: '14px',
                  fontWeight: activeNav === item.id ? '700' : '600',
                  textDecoration: 'none',
                  padding: '6px 0',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {item.label}
                {activeNav === item.id && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      width: '24px',
                      height: '3px',
                      backgroundColor: '#e11d48',
                      borderRadius: '3px',
                      boxShadow: '0 2px 6px rgba(225, 29, 72, 0.4)'
                    }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Right Action Icons & User Menu matching sample */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              onClick={() => {
                setActiveNav('templates');
                const el = document.getElementById('templates');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#334155',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Tìm kiếm mẫu thiệp"
            >
              <Search size={18} />
            </button>

            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsUserMenuOpen(prev => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#fff1f2',
                    padding: '8px 18px',
                    borderRadius: '24px',
                    border: '1px solid #fecdd3',
                    color: '#e11d48',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '13px'
                  }}
                >
                  <span style={{ maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                  <ChevronDown size={14} color="#e11d48" style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </button>

                {isUserMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '210px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #fee2e2',
                    borderRadius: '16px',
                    padding: '8px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{user.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                    </div>

                    {user.role === 'admin' ? (
                      <button
                        onClick={() => { setIsUserMenuOpen(false); if (onOpenAdmin) onOpenAdmin(); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '10px', border: 'none', backgroundColor: 'transparent', color: '#d97706', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                      >
                        <Shield size={16} color="#d97706" /> <span>Quản Trị Admin</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => { setIsUserMenuOpen(false); if (onOpenMyCards) onOpenMyCards(); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '10px', border: 'none', backgroundColor: 'transparent', color: '#334155', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                      >
                        <FolderHeart size={16} color="#e11d48" /> <span>Thiệp Của Tôi</span>
                      </button>
                    )}

                    <button
                      onClick={() => { setIsUserMenuOpen(false); if (onLogout) onLogout(); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '10px', border: 'none', backgroundColor: 'transparent', color: '#ef4444', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', width: '100%', borderTop: '1px solid #f1f5f9', marginTop: '4px' }}
                    >
                      <LogOut size={16} color="#ef4444" /> <span>Đăng Xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                style={{
                  padding: '8px 22px',
                  color: '#1e293b',
                  fontSize: '13px',
                  fontWeight: '600',
                  backgroundColor: '#ffffff',
                  border: '1px solid #fee2e2',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
                }}
              >
                Đăng nhập
              </button>
            )}

            <button
              onClick={() => {
                if (user?.role === 'admin') {
                  if (onOpenAdmin) onOpenAdmin();
                } else {
                  onGoToEditor();
                }
              }}
              style={{
                padding: '9px 24px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #db2777 100%)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(244, 63, 94, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{user?.role === 'admin' ? 'Trang Quản Trị' : 'Đăng ký'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ----------------------------------------------------
          2. HERO BANNER SECTION
      ---------------------------------------------------- */}
      <section id="home" style={{
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '30px 24px 80px 24px',
          boxSizing: 'border-box',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          
          {/* Left Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Pill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '24px',
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              color: '#e11d48',
              fontSize: '13px',
              fontWeight: '700',
              width: 'fit-content',
              boxShadow: '0 2px 8px rgba(244, 63, 94, 0.08)'
            }}>
              <Heart size={14} color="#f43f5e" fill="#f43f5e" />
              Tạo thiệp cưới online chỉ trong 5 phút
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(36px, 4.5vw, 54px)',
              fontFamily: "'Playfair Display', serif",
              fontWeight: '800',
              color: '#0f172a',
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
              margin: 0
            }}>
              Tạo Thiệp Cưới Online <br />
              <span style={{
                color: '#e11d48',
                fontStyle: 'italic',
                fontWeight: '700',
                display: 'inline-block',
                marginTop: '4px'
              }}>
                Đẹp - Hiện Đại - Dễ Dàng
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: 1.7,
              margin: 0,
              maxWidth: '560px'
            }}>
              Thể hiện câu chuyện tình yêu của bạn theo cách riêng với những mẫu thiệp cưới online sang trọng, tinh tế và độc đáo.
            </p>

            {/* 4 Feature Badges Horizontal Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '14px',
              maxWidth: '540px',
              paddingTop: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', flexShrink: 0 }}>
                  <LayoutGrid size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>Đa dạng mẫu thiệp</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Hiện đại, sang trọng</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', flexShrink: 0 }}>
                  <Users size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>Quản lý khách mời</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Thông minh</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', flexShrink: 0 }}>
                  <Gift size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>Nhận tiền mừng cưới</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Trực tuyến</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', flexShrink: 0 }}>
                  <Headphones size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>Hỗ trợ 24/7</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Tận tâm</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', paddingTop: '12px' }}>
              <button
                onClick={() => {
                  if (user?.role === 'admin') {
                    if (onOpenAdmin) onOpenAdmin();
                  } else {
                    onGoToEditor();
                  }
                }}
                style={{
                  padding: '16px 32px',
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #db2777 100%)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 12px 28px rgba(244, 63, 94, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'transform 0.15s ease'
                }}
              >
                <span>Bắt Đầu Tạo Thiệp Miễn Phí</span>
                <ArrowRight size={18} />
              </button>

              <a
                href="#templates"
                style={{
                  padding: '16px 28px',
                  borderRadius: '30px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #fecdd3',
                  color: '#e11d48',
                  fontSize: '15px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(225, 29, 72, 0.08)'
                }}
              >
                <Eye size={18} color="#e11d48" />
                <span>Xem Kho Mẫu Thiệp</span>
              </a>
            </div>

          </div>

          {/* Right Hero Graphic Mockup with Dual-Banner Smooth Crossfade */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            width: '100%',
            paddingTop: '20px',
            paddingBottom: '20px'
          }}>
            <div 
              onMouseEnter={() => setIsBannerHovered(true)}
              onMouseLeave={() => setIsBannerHovered(false)}
              style={{
                width: '100%',
                maxWidth: '900px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Image 1 */}
              <img
                src={heroBanners[0]}
                alt="Thiệp cưới điện tử Online - WeddingSaaS Mockup 1"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  transform: currentBannerIndex === 0 ? 'scale(1.25)' : 'scale(1.20)',
                  transformOrigin: 'center center',
                  opacity: currentBannerIndex === 0 ? 1 : 0,
                  transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
                  filter: 'drop-shadow(0 30px 60px rgba(225, 29, 72, 0.22))',
                  position: 'relative',
                  pointerEvents: currentBannerIndex === 0 ? 'auto' : 'none'
                }}
              />

              {/* Image 2 */}
              <img
                src={heroBanners[1]}
                alt="Thiệp cưới điện tử Online - WeddingSaaS Mockup 2"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  transform: currentBannerIndex === 1 ? 'scale(1.25)' : 'scale(1.20)',
                  transformOrigin: 'center center',
                  opacity: currentBannerIndex === 1 ? 1 : 0,
                  transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
                  filter: 'drop-shadow(0 30px 60px rgba(225, 29, 72, 0.22))',
                  pointerEvents: currentBannerIndex === 1 ? 'auto' : 'none'
                }}
              />

              {/* Arrow Prev Button */}
              <button
                onClick={() => setCurrentBannerIndex(prev => (prev === 0 ? 1 : 0))}
                style={{
                  position: 'absolute',
                  left: '-16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #fecdd3',
                  color: '#e11d48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(225, 29, 72, 0.2)',
                  zIndex: 20,
                  opacity: isBannerHovered ? 1 : 0.4,
                  transition: 'all 0.2s ease'
                }}
                title="Ảnh trước"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Arrow Next Button */}
              <button
                onClick={() => setCurrentBannerIndex(prev => (prev === 1 ? 0 : 1))}
                style={{
                  position: 'absolute',
                  right: '-16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #fecdd3',
                  color: '#e11d48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(225, 29, 72, 0.2)',
                  zIndex: 20,
                  opacity: isBannerHovered ? 1 : 0.4,
                  transition: 'all 0.2s ease'
                }}
                title="Ảnh tiếp theo"
              >
                <ChevronRight size={20} />
              </button>

              {/* Dots Pagination Indicators */}
              <div style={{
                position: 'absolute',
                bottom: '-24px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 20
              }}>
                {heroBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBannerIndex(idx)}
                    style={{
                      width: currentBannerIndex === idx ? '28px' : '10px',
                      height: '10px',
                      borderRadius: '5px',
                      backgroundColor: currentBannerIndex === idx ? '#e11d48' : '#fecdd3',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: currentBannerIndex === idx ? '0 2px 8px rgba(225, 29, 72, 0.4)' : 'none'
                    }}
                    title={`Xem mẫu ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
      </div>

      {/* ----------------------------------------------------
          2. SECTION 2: VÌ SAO NÊN CHỌN WEDDINGSAAS? (Seamless Cream/Blush Upgrade)
      ---------------------------------------------------- */}
      <section id="why-us" style={{
        width: '100%',
        position: 'relative',
        background: 'linear-gradient(180deg, #fffdfd 0%, #fff7f8 50%, #fff1f3 100%)',
        padding: '60px 0 70px 0',
        overflow: 'hidden'
      }}>

        <div style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}>
            {/* Left Content Column */}
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 14px',
                borderRadius: '20px',
                backgroundColor: '#ffe4e6',
                color: '#e11d48',
                fontSize: '12px',
                fontWeight: '700',
                width: 'fit-content',
                marginBottom: '16px'
              }}>
                <Sparkles size={13} color="#f43f5e" />
                <span>Giải Pháp Đột Phá</span>
              </div>

              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 42px)',
                fontFamily: "'Playfair Display', serif",
                fontWeight: '700',
                color: '#0f172a',
                lineHeight: 1.25,
                margin: '0 0 16px 0',
                letterSpacing: '-0.3px'
              }}>
                Vì sao nên chọn <span style={{ color: '#e11d48', fontWeight: '800' }}>WeddingSaaS?</span>
              </h2>

              <p style={{
                fontSize: '15px',
                color: '#475569',
                lineHeight: 1.7,
                margin: '0 0 32px 0',
                maxWidth: '520px',
                fontWeight: '500'
              }}>
                Chúng tôi mang đến giải pháp thiệp cưới online toàn diện, giúp bạn thể hiện dấu ấn cá nhân và gửi trao yêu thương một cách hiện đại, tinh tế nhất.
              </p>

              {/* 4 Feature Items Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px'
              }}>
                {/* Feature 1 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(8px)',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid #fecdd3',
                  boxShadow: '0 4px 15px rgba(244, 63, 94, 0.05)',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#e11d48',
                    flexShrink: 0
                  }}>
                    <Gift size={20} color="#f43f5e" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '2px' }}>Chuyên nghiệp</div>
                    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>Giao diện tinh tế, thao tác cực dễ</div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(8px)',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid #fecdd3',
                  boxShadow: '0 4px 15px rgba(244, 63, 94, 0.05)',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#e11d48',
                    flexShrink: 0
                  }}>
                    <CreditCard size={20} color="#f43f5e" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '2px' }}>Tối ưu chi phí</div>
                    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>Tiết kiệm đến 80% so với thiệp in</div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(8px)',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid #fecdd3',
                  boxShadow: '0 4px 15px rgba(244, 63, 94, 0.05)',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#e11d48',
                    flexShrink: 0
                  }}>
                    <Palette size={20} color="#f43f5e" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '2px' }}>Cá nhân hóa</div>
                    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>Tự do phối màu & album ảnh kỷ niệm</div>
                  </div>
                </div>

                {/* Feature 4 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(8px)',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid #fecdd3',
                  boxShadow: '0 4px 15px rgba(244, 63, 94, 0.05)',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#e11d48',
                    flexShrink: 0
                  }}>
                    <Headphones size={20} color="#f43f5e" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '2px' }}>Hỗ trợ 24/7</div>
                    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>Đội ngũ tận tâm tư vấn 1-1</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image Column Seamless Blended Visual */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(254, 205, 211, 0.5) 0%, rgba(255, 241, 243, 0) 70%)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
                pointerEvents: 'none'
              }} />
              <img 
                src={whyUsCoupleImg} 
                alt="Thiệp cưới online WeddingSaaS" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '440px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 40px rgba(225, 29, 72, 0.12))',
                  position: 'relative',
                  zIndex: 2,
                  transition: 'transform 0.3s ease'
                }} 
              />
            </div>

          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          3. STATS & METRICS BAR
      ---------------------------------------------------- */}
      <section style={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #fee2e2',
        borderBottom: '1px solid #fee2e2',
        padding: '36px 24px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', flexShrink: 0 }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', fontFamily: "'Playfair Display', serif" }}>50.000+</div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Bộ thiệp đã được tạo</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', flexShrink: 0 }}>
              <Star size={24} color="#e11d48" />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', fontFamily: "'Playfair Display', serif" }}>100+</div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Mẫu thiệp cưới đẹp nhất</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', flexShrink: 0 }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', fontFamily: "'Playfair Display', serif" }}>99.9%</div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Tỷ lệ hài lòng của khách hàng</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', flexShrink: 0 }}>
              <Headphones size={24} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', fontFamily: "'Playfair Display', serif" }}>24/7</div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Hỗ trợ nhanh chóng</div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          4. KHO MẪU THIỆP (SHOWCASE & CATEGORIES)
      ---------------------------------------------------- */}
      <section id="templates" style={{
        width: '100%',
        backgroundColor: '#fffdfd',
        padding: '70px 0 90px 0',
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          boxSizing: 'border-box'
        }}>
          {/* Section Header */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '8px',
            marginBottom: '36px'
          }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              color: '#e11d48',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ height: '1px', width: '28px', backgroundColor: '#fecdd3' }}></span>
              Bộ sưu tập mẫu thiệp cưới
              <span style={{ height: '1px', width: '28px', backgroundColor: '#fecdd3' }}></span>
            </div>

            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontFamily: "'Playfair Display', serif",
              fontWeight: '800',
              color: '#0f172a',
              margin: '4px 0 8px 0',
              letterSpacing: '-0.3px'
            }}>
              Đa dạng phong cách - Phù hợp mọi cá tính
            </h2>

            <p style={{
              fontSize: '15px',
              color: '#64748b',
              maxWidth: '680px',
              lineHeight: 1.6,
              margin: 0
            }}>
              Hàng trăm mẫu thiệp cưới được thiết kế bởi đội ngũ chuyên nghiệp, từ cổ điển, hiện đại đến tối giản, giúp bạn dễ dàng tìm được phong cách ưng ý.
            </p>

            {/* Category Filter Pills */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '20px'
            }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '8px 22px',
                    borderRadius: '24px',
                    fontSize: '13px',
                    fontWeight: '700',
                    border: selectedCategory === cat.id ? 'none' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    backgroundColor: selectedCategory === cat.id ? '#e11d48' : '#ffffff',
                    color: selectedCategory === cat.id ? '#ffffff' : '#64748b',
                    boxShadow: selectedCategory === cat.id ? '0 4px 14px rgba(225, 29, 72, 0.3)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main 2-Column Showcase Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px',
            alignItems: 'start'
          }}>
            {/* Left 8 Template Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px',
              gridColumn: 'span 3'
            }}>
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => onGoToEditor(template)}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '18px',
                    border: '1px solid #fee2e2',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 8px 24px rgba(225, 29, 72, 0.05)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, boxShadow 0.2s ease'
                  }}
                >
                  {/* Thumbnail Image */}
                  <div style={{
                    width: '100%',
                    height: '240px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#fff1f2',
                    position: 'relative'
                  }}>
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top'
                      }}
                    />
                  </div>

                  {/* Title & Link */}
                  <div style={{ padding: '10px 4px 4px 4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
                      {template.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#e11d48',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '2px'
                    }}>
                      <span>Xem chi tiết</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Promo Card ("THIẾT KẾ THIỆP CƯỚI THEO PHONG CÁCH CỦA BẠN") */}
            <div style={{
              backgroundColor: '#fff1f2',
              borderRadius: '24px',
              border: '1px solid #fecdd3',
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 12px 30px rgba(244, 63, 94, 0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '28px',
                color: '#e11d48',
                marginBottom: '2px'
              }}>
                Thiết kế thiệp cưới
              </div>

              <h3 style={{
                fontSize: '18px',
                fontWeight: '800',
                color: '#0f172a',
                letterSpacing: '0.5px',
                margin: '0 0 12px 0',
                lineHeight: 1.3
              }}>
                THEO PHONG CÁCH CỦA BẠN
              </h3>

              <p style={{
                fontSize: '12px',
                color: '#64748b',
                lineHeight: 1.5,
                margin: '0 0 20px 0',
                maxWidth: '220px'
              }}>
                Tùy chỉnh màu sắc, font chữ, hình ảnh, thông điệp... hoàn toàn miễn phí.
              </p>

              <button
                onClick={() => onGoToEditor()}
                style={{
                  padding: '9px 22px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(244, 63, 94, 0.35)',
                  marginBottom: '24px'
                }}
              >
                Thiết kế ngay →
              </button>

              {/* Promo Mobile Card Image */}
              <div style={{
                width: '100%',
                maxHeight: '280px',
                borderRadius: '16px',
                overflow: 'hidden',
                marginTop: 'auto'
              }}>
                <img 
                  src={promoMobileCardImg} 
                  alt="Thiết kế thiệp cưới online theo phong cách riêng" 
                  style={{
                    width: '100%',
                    height: '100%',
                    maxHeight: '280px',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          5. 4 SIMPLE STEPS SECTION
      ---------------------------------------------------- */}
      <section id="steps" style={{
        width: '100%',
        backgroundColor: '#fff8f9',
        borderTop: '1px solid #fee2e2',
        borderBottom: '1px solid #fee2e2',
        padding: '80px 24px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          {/* Left Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '24px',
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              color: '#e11d48',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              width: 'fit-content'
            }}>
              <FileText size={14} color="#f43f5e" />
              CHỈ 3 BƯỚC ĐƠN GIẢN
            </div>

            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontFamily: "'Playfair Display', serif",
              fontWeight: '800',
              color: '#0f172a',
              lineHeight: 1.25,
              margin: 0
            }}>
              Tạo Thiệp Cưới Online <br />
              <span style={{ color: '#e11d48' }}>Dễ Dàng Chỉ Trong 5 Phút</span>
            </h2>

            <p style={{
              fontSize: '15px',
              color: '#64748b',
              lineHeight: 1.7,
              margin: 0
            }}>
              Không cần kỹ năng thiết kế, chỉ với vài thao tác đơn giản, bạn đã có ngay thiệp cưới đẹp như ý.
            </p>

            <div style={{ paddingTop: '8px' }}>
              <button
                onClick={() => onGoToEditor()}
                style={{
                  padding: '14px 32px',
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(244, 63, 94, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Bắt Đầu Ngay</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right 4 Step Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px'
          }}>
            {/* Step 1 */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '20px',
              border: '1px solid #fee2e2',
              boxShadow: '0 4px 16px rgba(225, 29, 72, 0.05)',
              position: 'relative'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#e11d48',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>1</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Chọn mẫu thiệp</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>Lựa chọn từ hàng trăm mẫu thiệp có sẵn</p>
            </div>

            {/* Step 2 */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '20px',
              border: '1px solid #fee2e2',
              boxShadow: '0 4px 16px rgba(225, 29, 72, 0.05)',
              position: 'relative'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#e11d48',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>2</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Tùy chỉnh nội dung</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>Thêm thông tin, hình ảnh, logo theo ý muốn</p>
            </div>

            {/* Step 3 */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '20px',
              border: '1px solid #fee2e2',
              boxShadow: '0 4px 16px rgba(225, 29, 72, 0.05)',
              position: 'relative'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#e11d48',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>3</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Chia sẻ thiệp</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>Gửi link qua Zalo, Facebook, Email hoặc in mã QR</p>
            </div>

            {/* Step 4 */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '20px',
              border: '1px solid #fee2e2',
              boxShadow: '0 4px 16px rgba(225, 29, 72, 0.05)',
              position: 'relative'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#e11d48',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>4</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Quản lý khách mời</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>Theo dõi xác nhận, nhận tiền mừng online</p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          6. DARK FEATURE HIGHLIGHT BANNER (Khoảnh Khắc Đáng Nhớ)
      ---------------------------------------------------- */}
      <section id="features" style={{
        width: '100%',
        backgroundColor: '#171324',
        backgroundImage: 'radial-gradient(circle at 80% 30%, rgba(225, 29, 72, 0.2) 0%, rgba(23, 19, 36, 0) 60%)',
        color: '#ffffff',
        padding: '80px 24px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          {/* Left Text Box over Background */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#fb7185', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              TẠO THIỆP CƯỚI ONLINE
            </span>

            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontFamily: "'Playfair Display', serif",
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: 1.2,
              margin: 0
            }}>
              Khoảnh Khắc Đáng Nhớ
            </h2>

            <p style={{
              fontSize: '15px',
              color: '#cbd5e1',
              lineHeight: 1.7,
              margin: 0
            }}>
              Không chỉ là một tấm thiệp, mà là lời mời chứa đựng cả tình yêu, sự trân trọng và những cảm xúc chân thành nhất.
            </p>

            <div style={{ paddingTop: '8px' }}>
              <button
                onClick={() => onGoToEditor()}
                style={{
                  padding: '14px 28px',
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(244, 63, 94, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Khám Phá Tính Năng</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* 6 Grid Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px'
          }}>
            {/* Box 1 */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Sliders size={18} color="#fff" />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Thiết kế theo phong cách riêng</h4>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Cá nhân hóa mọi chi tiết</p>
            </div>

            {/* Box 2 */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <LayoutGrid size={18} color="#fff" />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Tùy chỉnh linh hoạt</h4>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Thay đổi bố cục, hình ảnh, màu sắc</p>
            </div>

            {/* Box 3 */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Gift size={18} color="#fff" />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Nhận tiền mừng cưới online</h4>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>An toàn, tiện lợi</p>
            </div>

            {/* Box 4 */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Share2 size={18} color="#fff" />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Tích hợp đa nền tảng</h4>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Chia sẻ dễ dàng qua mọi kênh</p>
            </div>

            {/* Box 5 */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Lock size={18} color="#fff" />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Bảo mật tuyệt đối</h4>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Dữ liệu được mã hóa an toàn</p>
            </div>

            {/* Box 6 */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Headphones size={18} color="#fff" />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Hỗ trợ 24/7</h4>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Luôn đồng hành cùng bạn</p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          7. CUSTOMER TESTIMONIALS SECTION
      ---------------------------------------------------- */}
      <section id="testimonials" style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '80px 24px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '12px',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '24px',
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#e11d48',
            fontSize: '12px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <Heart size={14} color="#f43f5e" fill="#f43f5e" />
            KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            fontFamily: "'Playfair Display', serif",
            fontWeight: '800',
            color: '#0f172a',
            margin: 0
          }}>
            Những Khoảnh Khắc Đáng Nhớ
          </h2>

          <p style={{
            fontSize: '15px',
            color: '#64748b',
            maxWidth: '640px',
            lineHeight: 1.6,
            margin: 0
          }}>
            Cùng lắng nghe những chia sẻ từ các cặp đôi đã trải nghiệm WeddingSaaS.
          </p>
        </div>

        {/* Testimonial Cards Slider / Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                border: '1px solid #fee2e2',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 8px 24px rgba(225, 29, 72, 0.05)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={item.avatar}
                  alt={item.names}
                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px 0' }}>{item.names}</h4>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{item.date}</span>
                </div>
              </div>

              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                "{item.comment}"
              </p>

              <div style={{ display: 'flex', gap: '4px', marginTop: 'auto' }}>
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={16} color="#f59e0b" fill="#f59e0b" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------
          8. PRICING PLANS SECTION
      ---------------------------------------------------- */}
      <section id="pricing" style={{
        width: '100%',
        backgroundColor: '#fff8f9',
        borderTop: '1px solid #fee2e2',
        borderBottom: '1px solid #fee2e2',
        padding: '80px 24px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', marginBottom: '48px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1px', color: '#e11d48', textTransform: 'uppercase' }}>BẢNG GIÁ DỊCH VỤ</span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontFamily: "'Playfair Display', serif", fontWeight: '800', color: '#0f172a', marginTop: '8px' }}>
              Chi Phí Hợp Lý - Giá Trị Vĩnh Cửu
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', marginTop: '8px' }}>
              Không chi phí ẩn. Thanh toán 1 lần duy nhất dùng trọn đời cho ngày trọng đại
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            width: '100%'
          }}>
            {/* Plan 1 */}
            <div style={{ padding: '32px', backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#475569', margin: 0 }}>Gói Thử Nghiệm</h3>
                <div style={{ fontSize: '36px', fontFamily: "'Playfair Display', serif", fontWeight: '800', color: '#0f172a', margin: '12px 0' }}>0đ</div>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Trải nghiệm tự do tất cả tính năng trình chỉnh sửa thiệp</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Tự do xem thử & chỉnh sửa</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Xuất file HTML tải về</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}><span>✕</span> Không có đường dẫn tĩnh riêng</div>
                </div>
              </div>
              <button onClick={() => onGoToEditor()} style={{ marginTop: '32px', padding: '14px', borderRadius: '24px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Tạo Thử Miễn Phí</button>
            </div>

            {/* Plan 2 (Highlighted Pro Plan) */}
            <div style={{ padding: '32px', backgroundColor: '#ffffff', borderRadius: '24px', border: '2px solid #e11d48', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 16px 36px rgba(225, 29, 72, 0.12)' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#e11d48', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '4px 16px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>KHUYÊN DÙNG</div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#e11d48', margin: 0 }}>Gói Pro Nổi Bật</h3>
                <div style={{ fontSize: '36px', fontFamily: "'Playfair Display', serif", fontWeight: '800', color: '#0f172a', margin: '12px 0' }}>99.000đ <span style={{ fontSize: '13px', fontFamily: 'sans-serif', color: '#64748b' }}>/thiệp</span></div>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Đầy đủ tính năng cao cấp & đường dẫn riêng chuẩn SaaS</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#e11d48" /> <strong>Link tĩnh riêng biệt 12 tháng</strong></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#e11d48" /> Tự động mừng cưới VietQR</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#e11d48" /> Thông báo RSVP về Telegram</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#e11d48" /> Nhạc nền lãng mạn tự chọn</div>
                </div>
              </div>
              <button onClick={() => onGoToEditor(null, 'pro')} style={{ marginTop: '32px', padding: '14px', borderRadius: '24px', background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(244, 63, 94, 0.4)' }}>Chọn Gói Pro Ngay</button>
            </div>

            {/* Plan 3 */}
            <div style={{ padding: '32px', backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#d97706', margin: 0 }}>Gói VIP Đặc Biệt</h3>
                <div style={{ fontSize: '36px', fontFamily: "'Playfair Display', serif", fontWeight: '800', color: '#0f172a', margin: '12px 0' }}>199.000đ <span style={{ fontSize: '13px', fontFamily: 'sans-serif', color: '#64748b' }}>/thiệp</span></div>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Dành cho cặp đôi muốn hỗ trợ thiết kế riêng trọn gói</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#d97706" /> Bao gồm toàn bộ tính năng Gói Pro</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#d97706" /> Hỗ trợ nhập liệu thông tin 24/7</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#d97706" /> Tặng kèm Mã QR in lên thiệp giấy</div>
                </div>
              </div>
              <button onClick={() => onGoToEditor(null, 'vip')} style={{ marginTop: '32px', padding: '14px', borderRadius: '24px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Đăng Ký Gói VIP</button>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          9. FOOTER
      ---------------------------------------------------- */}
      <footer style={{
        width: '100%',
        backgroundColor: '#0a0e17',
        color: '#94a3b8',
        padding: '60px 24px 30px 24px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Col 1: Logo & Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={18} color="#fff" fill="#fff" />
              </div>
              <span style={{ fontSize: '18px', fontWeight: '800', fontFamily: "'Playfair Display', serif", color: '#ffffff' }}>WeddingSaaS</span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
              Thiệp cưới Online Thông Minh. Giải pháp tạo thiệp cưới điện tử hiện đại, tiện lợi hàng đầu Việt Nam.
            </p>
            <div style={{ fontSize: '12px', color: '#475569' }}>
              © 2026 WeddingSaaS. All rights reserved.
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '16px' }}>Liên kết nhanh</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <a href="#home" style={{ color: '#94a3b8', textDecoration: 'none' }}>Trang chủ</a>
              <a href="#templates" style={{ color: '#94a3b8', textDecoration: 'none' }}>Mẫu thiệp</a>
              <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none' }}>Tính năng</a>
              <a href="#pricing" style={{ color: '#94a3b8', textDecoration: 'none' }}>Bảng giá</a>
              <a href="#steps" style={{ color: '#94a3b8', textDecoration: 'none' }}>Hướng dẫn</a>
              <a href="#testimonials" style={{ color: '#94a3b8', textDecoration: 'none' }}>Liên hệ</a>
            </div>
          </div>

          {/* Col 3: Newsletter Subscription Box */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>Đăng ký nhận ưu đãi</h4>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
              Nhận thông tin khuyến mãi và mẫu thiệp mới nhất.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '20px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
              <button style={{
                padding: '10px 18px',
                borderRadius: '20px',
                backgroundColor: '#e11d48',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer'
              }}>
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '12px',
          color: '#475569'
        }}>
          <div>© 2026 WeddingSaaS. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Chính sách bảo mật</a>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Điều khoản sử dụng</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
