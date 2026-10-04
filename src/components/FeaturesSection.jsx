import { ArrowRight, Brush, ChartColumn, Gift, Headphones, Mail, Settings, ShieldCheck, Sparkles, Users, Zap } from 'lucide-react';
import preview from '../../images/section-05-features/features-product.png';
import flowers from '../../images/section-05-features/features-sprig.png';
import background from '../../images/section-05-features/features-background-no-arch.png';
import './FeaturesSection.css';

const features = [
  { icon: Brush, title: 'Thiết kế theo ý bạn', detail: 'Đa dạng mẫu thiệp đẹp, từ phong cách hiện đại đến truyền thống.' },
  { icon: Users, title: 'Quản lý khách mời', detail: 'Tạo danh sách khách mời, gửi thiệp và theo dõi phản hồi RSVP.' },
  { icon: Mail, title: 'Gửi lời mời online', detail: 'Chia sẻ dễ dàng qua link, QR code hoặc email, tiện lợi và nhanh chóng.' },
  { icon: ChartColumn, title: 'Theo dõi phản hồi', detail: 'Biết khách mời nào đã xác nhận tham dự để chuẩn bị chu đáo.' },
  { icon: Settings, title: 'Tùy chỉnh linh hoạt', detail: 'Dễ dàng thay đổi màu sắc, font chữ, hình ảnh theo phong cách của bạn.' },
  { icon: ShieldCheck, title: 'Riêng tư & an toàn', detail: 'Chủ động quản lý thông tin thiệp và danh sách khách mời của bạn.' },
];

export default function FeaturesSection({ onCreate }) {
  return (
    <section id="features" className="wedding-features" aria-labelledby="wedding-features-title" style={{ '--features-artwork': `url(${background})` }}>
      <div className="wedding-features__inner">
        <div className="wedding-features__content">
          <header className="wedding-features__heading">
            <span className="wedding-features__badge"><Sparkles size={18} />Tính năng nổi bật</span>
            <h2 id="wedding-features-title">Trải Nghiệm Thiệp Cưới<em>Điện Tử Thông Minh</em></h2>
            <p>Từ thiết kế đến gửi lời mời, mọi chi tiết đều được tối ưu để giúp bạn chuẩn bị ngày cưới dễ dàng, nhanh chóng và trọn vẹn hơn.</p>
          </header>
          <div className="wedding-features__grid">
            {features.map(({ icon: Icon, title, detail }, index) => (
              <article className="wedding-features__card" key={title}>
                <div className="wedding-features__ornament">
                  <span className="wedding-features__icon"><Icon size={30} strokeWidth={1.6} /></span>
                </div>
                <div className="wedding-features__card-copy"><span className="wedding-features__number">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{detail}</p></div>
                <img className="wedding-features__flowers" src={flowers} alt="" aria-hidden="true" loading="lazy" />
              </article>
            ))}
          </div>
        </div>
        <figure className="wedding-features__visual">
          <img src={preview} alt="Điện thoại hiển thị thiệp cưới Minh Quân và Thảo Vy bên thiệp giấy và hoa hồng" loading="lazy" />
        </figure>
        <div className="wedding-features__footer">
          <button className="wedding-features__create" type="button" onClick={onCreate}>Tạo Thiệp Của Bạn Ngay<ArrowRight size={18} /></button>
          <ul className="wedding-features__benefits" aria-label="Tiện ích trải nghiệm">
            <li><Gift size={23} />Miễn phí trải nghiệm</li><li><Zap size={23} />Thiết kế nhanh chóng</li><li><Headphones size={23} />Hỗ trợ tận tâm</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
