import { Gift, Headphones, Heart, LayoutGrid, Users } from 'lucide-react';
import background from '../../images/section-02-why-us/why-us-background-v2.png';
import showcase from '../../images/section-02-why-us/why-us-product-no-base-matched.png';
import './WhyUsSection.css';

const features = [
  { icon: LayoutGrid, title: 'Đa dạng mẫu thiệp', description: 'Hàng trăm mẫu thiệp thiết kế hiện đại, dễ dàng tùy chỉnh theo phong cách của bạn.' },
  { icon: Users, title: 'Quản lý khách mời', description: 'Tính năng RSVP thông minh, dễ dàng theo dõi và quản lý danh sách khách mời.' },
  { icon: Gift, title: 'Mừng cưới QR', description: 'Tích hợp mã QR mừng cưới, thuận tiện, an toàn và hiện đại.' },
  { icon: Headphones, title: 'Tự động 24/7', description: 'Hệ thống hoạt động ổn định, hỗ trợ bạn mọi lúc, mọi nơi.' },
];

export default function WhyUsSection() {
  return (
    <section id="whyus" className="why-us" aria-labelledby="why-us-title" style={{ '--section-artwork': `url(${background})`, '--section-artwork-opacity': 1 }}>
      <div className="why-us__inner">
        <div className="why-us__visual">
          <img className="why-us__showcase" src={showcase} alt="Bộ thiệp cưới Minh Quân và Thảo Vy cùng phong bì hồng, dấu sáp và thiệp online trên điện thoại" loading="lazy" width="1536" height="1024" />
        </div>
        <div className="why-us__content">
          <header className="why-us__heading">
            <span className="why-us__badge"><Heart size={16} />Vì sao chọn WeddingSaaS?</span>
            <h2 id="why-us-title">Vì sao<em>WeddingSaaS?</em></h2>
            <p>Biến câu chuyện tình yêu của bạn thành những tấm thiệp cưới online đẹp mắt, tinh tế và đầy cảm xúc. WeddingSaaS giúp bạn tiết kiệm thời gian, chi phí nhưng vẫn đảm bảo sự sang trọng và khác biệt.</p>
          </header>
          <div className="why-us__features">
            {features.map(({ icon: Icon, title, description }) => (
              <article className="why-us__feature" key={title}>
                <span className="why-us__icon"><Icon size={34} strokeWidth={1.8} /></span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
          <div className="why-us__divider" aria-hidden="true"><span /><Heart size={20} /><span /></div>
        </div>
      </div>
    </section>
  );
}
