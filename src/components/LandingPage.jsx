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

import TemplateGallery from './TemplateGallery';
import WhyUsSection from './WhyUsSection';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
import SiteFooter from './SiteFooter';
import TestimonialsSection from './TestimonialsSection';
import FaqSection from './FaqSection';
import './LandingPage.css';
import heroBannerImg from '../assets/hero-banner.png';
import heroBanner2Img from '../assets/hero-banner-2.png';
import heroBgImg from '../assets/hero-bg.png';
import logoImg from '../assets/logo.png';
import whyUsCoupleImg from '../assets/why-us-couple.png';
import FeaturesSection from './FeaturesSection';
import PricingSection from './PricingSection';

// Master Plan Image Assets
import introBackground from '../../images/section-01-hero/hero-why-us-continuous.png';
import s01HeroProduct from '../../images/section-01-hero/s01-hero-product.png';
import faqBackground from '../../images/section-09-faq/background.png';

import s02FloralLeftBottom from '../../images/section-01-hero/s02-floral-left-bottom.png';
import sharedBranchLeft from '../../images/shared/florals/shared-floral-branch-left.png';
import sharedBranchRight from '../../images/shared/florals/shared-floral-branch-right.png';
import sharedClusterSmall from '../../images/shared/florals/shared-floral-cluster-small.png';
import sharedSprig from '../../images/shared/florals/shared-floral-sprig.png';
import sharedRibbon from '../../images/shared/accents/shared-ribbon-coral.png';
import sharedWaxSeal from '../../images/shared/accents/shared-wax-seal.png';
import sharedPetal01 from '../../images/shared/petals/shared-petal-01.png';
import sharedPetal02 from '../../images/shared/petals/shared-petal-02.png';
import sharedPetal03 from '../../images/shared/petals/shared-petal-03.png';
import sharedPetal04 from '../../images/shared/petals/shared-petal-04.png';
import sharedPetal05 from '../../images/shared/petals/shared-petal-05.png';

export default function LandingPage({ 
  onGoToEditor, 
  onOpenAuthModal, 
  user, 
  onLogout, 
  onOpenMyCards, 
  onOpenAdmin, 
  onOpenPurchase,
  publicSettings = {}
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  const handleNavClick = (id) => {
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page" style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: 'var(--landing-background)',
      color: '#4F3033',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Global Hardware-Accelerated Creative Depth Easing for Swiper */}
      <style>{`
        @keyframes floatPetal {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(6deg); }
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .wedding-fullpage-swiper {
          width: 100%;
          height: 100vh;
        }

        /* Apple Creative Depth Transition Easing */
        .wedding-fullpage-swiper .swiper-wrapper {
          transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1) !important;
        }

        .wedding-fullpage-swiper .swiper-slide {
          height: 100vh !important;
          width: 100% !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          justifyContent: center;
          position: relative;
          box-sizing: border-box;
          padding-top: 0px;
          overflow: hidden;
          will-change: transform, opacity;
          transform: translate3d(0, 0, 0);
        }

        .wedding-fullpage-swiper .swiper-slide-active > div {
          animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Custom Vertical Pagination Dots */
        .wedding-fullpage-swiper .swiper-pagination {
          right: 22px !important;
          z-index: 90 !important;
        }

        .wedding-fullpage-swiper .swiper-pagination-bullet {
          background: #D95B70 !important;
          opacity: 0.3 !important;
          width: 10px !important;
          height: 10px !important;
          margin: 10px 0 !important;
          transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1) !important;
          cursor: pointer !important;
        }

        .wedding-fullpage-swiper .swiper-pagination-bullet-active {
          background: #F04468 !important;
          opacity: 1 !important;
          height: 28px !important;
          border-radius: 14px !important;
          box-shadow: 0 4px 14px rgba(240, 68, 104, 0.45) !important;
        }

        /* Hero Button Design System */
        .hero-btn-primary {
          min-height: 56px;
          padding: 0 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 16px;
          background: linear-gradient(
            90deg,
            #f95b79 0%,
            #f04468 52%,
            #e82f59 100%
          );
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          line-height: 1;
          box-shadow:
            0 12px 28px rgba(240, 68, 104, 0.24),
            0 4px 10px rgba(220, 54, 89, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.35);
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          cursor: pointer;
        }

        .hero-btn-primary:hover {
          background: linear-gradient(
            90deg,
            #ff6b89 0%,
            #f7446b 50%,
            #eb2853 100%
          );
          border-color: rgba(255, 255, 255, 0.65);
          box-shadow:
            0 0 24px rgba(240, 68, 104, 0.55),
            0 16px 36px rgba(240, 68, 104, 0.38),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }

        .hero-btn-primary:active {
          transform: scale(0.98);
          box-shadow:
            0 7px 16px rgba(240, 68, 104, 0.20),
            inset 0 2px 4px rgba(120, 20, 45, 0.10);
        }

        .hero-btn-secondary {
          min-height: 56px;
          padding: 0 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid rgba(240, 68, 104, 0.32);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #f04468;
          font-size: 16px;
          font-weight: 700;
          line-height: 1;
          box-shadow:
            0 8px 20px rgba(102, 61, 67, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          cursor: pointer;
        }

        .hero-btn-secondary:hover {
          background: #ffffff;
          border-color: #f04468;
          color: #e82f59;
          box-shadow:
            0 0 22px rgba(240, 68, 104, 0.38),
            0 12px 30px rgba(240, 68, 104, 0.22),
            inset 0 1px 0 #ffffff;
        }

        .hero-btn-secondary:active {
          transform: scale(0.98);
        }

        .hero-feature-icon-box {
          transition: all 0.3s ease !important;
        }
        .hero-feature-icon-box:hover {
          transform: translateY(-2px) scale(1.06) !important;
          border-color: #F04468 !important;
          box-shadow: 0 8px 22px rgba(240, 68, 104, 0.22) !important;
        }
      `}</style>

      {/* ---------------- HEADER NAVBAR (ABSOLUTE / NOT FIXED) ---------------- */}
      <header className="landing-header" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '80px',
        zIndex: 1000,
        backgroundColor: 'transparent',
        borderBottom: 'none',
        boxShadow: 'none',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box'
        }}>
          {/* Brand Logo */}
          <div 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
            onClick={() => handleNavClick('home')}
          >
            <img 
              src={logoImg} 
              alt="WeddingSaaS - Thiệp cưới Online Thông Minh" 
              style={{ height: '78px', width: 'auto', objectFit: 'contain' }} 
            />
          </div>

          {/* Navigation Menu */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="landing-header__nav">
            {[
              { id: 'home', label: 'Trang chủ' },
              { id: 'templates', label: 'Mẫu thiệp' },
              { id: 'features', label: 'Tính năng' },
              { id: 'pricing', label: 'Bảng giá' },
              { id: 'steps', label: 'Hướng dẫn' },
              { id: 'contact', label: 'Liên hệ' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                style={{
                  position: 'relative',
                  color: activeNav === item.id ? '#F04468' : '#4F3033',
                  fontSize: '18px',
                  fontWeight: activeNav === item.id ? '700' : '600',
                  textDecoration: 'none',
                  padding: '6px 0',
                  transition: 'all 0.25s ease',
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
                      width: '22px',
                      height: '3px',
                      backgroundColor: '#F04468',
                      borderRadius: '3px',
                      boxShadow: '0 2px 6px rgba(240, 68, 104, 0.4)'
                    }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Header Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsUserMenuOpen(prev => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#FFF0F1',
                    padding: '8px 18px',
                    borderRadius: '24px',
                    border: '1px solid rgba(217, 91, 112, 0.2)',
                    color: '#F04468',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '13px'
                  }}
                >
                  <span style={{ maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                  <ChevronDown size={14} color="#F04468" style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </button>

                {isUserMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '210px',
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(217, 91, 112, 0.15)',
                    borderRadius: '16px',
                    padding: '8px',
                    boxShadow: '0 14px 40px rgba(102, 61, 67, 0.12)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#4F3033' }}>{user.name}</div>
                      <div style={{ fontSize: '11px', color: '#765B5E', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
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
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '10px', border: 'none', backgroundColor: 'transparent', color: '#4F3033', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                      >
                        <FolderHeart size={16} color="#F04468" /> <span>Thiệp Của Tôi</span>
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
                  color: '#4F3033',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(217, 91, 112, 0.18)',
                  borderRadius: '24px',
                  cursor: 'pointer'
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
                padding: '10px 24px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #F04468 0%, #DC3659 100%)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 26px rgba(240, 68, 104, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{user?.role === 'admin' ? 'Trang Quản Trị' : 'Tạo thiệp ngay'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- MAIN CONTENT PAGE SCROLL ---------------- */}
      <main className="landing-flow" style={{ width: '100%' }}>
        {/* ==================== SECTION 01: HERO SECTION ==================== */}
        <div className="landing-intro" style={{ '--intro-artwork': `url(${introBackground})` }}>
          <HeroSection onCreate={() => { if (user?.role === 'admin') { onOpenAdmin?.(); } else { onGoToEditor(); } }} onViewTemplates={() => handleNavClick('templates')} />
          <WhyUsSection />
        </div>
        {/* ==================== SECTION 03: TEMPLATES GALLERY ==================== */}
        <TemplateGallery onGoToEditor={onGoToEditor} />

        <div className="landing-experience" style={{ '--experience-artwork': `url(${introBackground})` }}>
        {/* ==================== SECTION 04: HOW IT WORKS ==================== */}
        <HowItWorksSection onCreate={() => { if (user?.role === 'admin') { onOpenAdmin?.(); } else { onGoToEditor(); } }} />

        {/* ==================== SECTION 05: FEATURES SHOWCASE ==================== */}
        <FeaturesSection onCreate={() => { if (user?.role === 'admin') { onOpenAdmin?.(); } else { onGoToEditor(); } }} />

        {/* ==================== SECTION 06: PRICING ==================== */}
        <PricingSection onGoToEditor={onGoToEditor} />

        </div>

        {/* ==================== SECTION 07: TESTIMONIALS ==================== */}
        <TestimonialsSection onCreate={() => { if (user?.role === 'admin') { onOpenAdmin?.(); } else { onGoToEditor(); } }} />

        <div className="landing-finale" style={{ '--finale-artwork': `url(${faqBackground})` }}>
          <FaqSection settings={publicSettings} />
          <section id="contact" className="landing-final-cta" aria-labelledby="landing-final-cta-title">
            <div className="landing-final-cta__inner">
              <h2 id="landing-final-cta-title">Tạo Thiệp Cưới Của Riêng Bạn Ngay Hôm Nay</h2>
              <p>Gửi trao yêu thương theo cách sang trọng, tiện lợi và tiết kiệm nhất cho ngày trọng đại.</p>
              <button onClick={() => { if (user?.role === 'admin') { onOpenAdmin?.(); } else { onGoToEditor(); } }}>
                <span>Tạo Thiệp Cưới Miễn Phí</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter settings={publicSettings} />
    </div>
  );
}
