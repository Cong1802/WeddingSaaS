import { ArrowRight, Eye, Gift, Headphones, LayoutGrid, ShieldCheck, Sparkles, Users } from 'lucide-react';
import background from '../../images/section-01-hero/hero-pastel-curtain-bg3.png';
import product from '../../images/section-01-hero/hero-reference-product.png';
import './HeroSection.css';

const benefits = [
  { icon: LayoutGrid, title: 'Đa dạng mẫu thiệp', detail: 'Hiện đại & sang trọng' },
  { icon: Users, title: 'Quản lý khách mời', detail: 'RSVP tự động' },
  { icon: Gift, title: 'Mừng cưới QR', detail: 'Tiện lợi & an toàn' },
  { icon: Headphones, title: 'Tự động 24/7', detail: 'Tạo thiệp xong ngay' },
];

export default function HeroSection({ onCreate, onViewTemplates }) {
  return (
    <section id="home" className="landing-hero" aria-labelledby="hero-title" style={{ '--section-artwork': `url(${background})`, '--section-artwork-opacity': 1 }}>
      <div className="landing-hero__inner">
        <div className="landing-hero__copy">
          <span className="landing-hero__badge"><Sparkles size={16} />Nền tảng Tạo Thiệp Cưới Online Hàng Đầu</span>
          <h1 id="hero-title">Tạo Thiệp Cưới Online<em>Đẹp - Sang Trọng - Dễ Dàng</em></h1>
          <p className="landing-hero__description">Thể hiện câu chuyện tình yêu riêng biệt với bộ sưu tập mẫu thiệp cưới điện tử sang trọng. Gửi lời mời tinh tế, nhận phản hồi RSVP và mừng cưới trực tuyến chỉ trong 5 phút.</p>
          <div className="landing-hero__benefits">
            {benefits.map(({ icon: Icon, title, detail }) => <div className="landing-hero__benefit" key={title}><span className="landing-hero__icon"><Icon size={28} strokeWidth={1.8} /></span><h2>{title}</h2><p>{detail}</p></div>)}
          </div>
          <div className="landing-hero__actions">
            <button type="button" className="landing-hero__primary" onClick={onCreate}>Bắt Đầu Tạo Thiệp Miễn Phí<ArrowRight size={19} /></button>
            <button type="button" className="landing-hero__secondary" onClick={onViewTemplates}><Eye size={19} />Xem Mẫu Thiệp</button>
          </div>
          <p className="landing-hero__trust"><ShieldCheck size={22} />Cam kết bảo mật &amp; Trải nghiệm thiệp cưới chất lượng cao</p>
        </div>
        <div className="landing-hero__visual"><img src={product} alt="Thiệp cưới hoa hồng, phong bì hồng với dấu sáp và thiệp online trên điện thoại" width="1536" height="1024" fetchPriority="high" /></div>
      </div>
    </section>
  );
}
