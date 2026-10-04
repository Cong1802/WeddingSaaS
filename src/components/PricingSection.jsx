import { ArrowRight, Check, Crown, Gift, Headphones, Heart, Settings, ShieldCheck, X } from 'lucide-react';
import ornaments from '../../images/section-06-pricing/pricing-ornaments.png';
import './PricingSection.css';

const plans = [
  { id: 'trial', name: 'Gói Thử Nghiệm', subtitle: 'Trải nghiệm miễn phí', price: '0đ', description: 'Dành cho bạn mới bắt đầu', action: 'Tạo Thiệp Miễn Phí', features: [
    ['Xem & trải nghiệm mẫu thiệp', true], ['Tự do tạo thiệp với mẫu cơ bản', true], ['Xuất file HTML để chia sẻ', true], ['Có logo WeddingSaaS', true], ['Tùy chỉnh tên miền riêng', false], ['Không hỗ trợ quản lý khách mời', false],
  ] },
  { id: 'basic', name: 'Gói Cơ Bản', subtitle: 'Phù hợp cho cá nhân', price: '49.000đ', description: 'Giải pháp tiết kiệm, đầy đủ tính năng cơ bản', action: 'Chọn Gói Cơ Bản', features: [
    ['Sử dụng toàn bộ mẫu thiệp đẹp', true], ['Tùy chỉnh nội dung, hình ảnh, màu sắc', true], ['Xuất link chia sẻ không logo', true], ['Tùy chỉnh tên miền phụ (vd: tenban.weddingsaas.vn)', true], ['Nhạc nền lãng mạn', true], ['Thông báo khi có khách mời RSVP', true], ['Quản lý khách mời nâng cao', false], ['Không hỗ trợ mã QR tùy chỉnh', false],
  ] },
  { id: 'pro', name: 'Gói Pro Nổi Bật', subtitle: 'Lựa chọn hoàn hảo cho đám cưới', price: '99.000đ', description: 'Đầy đủ tính năng cao cấp, dễ dàng quản lý', action: 'Chọn Gói Pro Ngay', features: [
    ['Sử dụng toàn bộ mẫu thiệp cao cấp', true], ['Tùy chỉnh giao diện chuyên nghiệp', true], ['Tên miền riêng (vd: tenban.com)', true], ['Nhạc nền theo sở thích', true], ['Quản lý khách mời thông minh', true], ['Gửi thông báo tự động (Email/SMS/Telegram)', true], ['Mã QR mừng cưới & chỉ đường', true], ['Thống kê lượt xem, xác nhận tham dự', true], ['Hỗ trợ 24/7 qua chat', true],
  ] },
  { id: 'vip', name: 'Gói VIP Đặc Biệt', subtitle: 'Dành cho tiệc cưới lớn & cao cấp', price: '199.000đ', description: 'Trải nghiệm trọn vẹn, chuyên nghiệp và khác biệt', action: 'Đăng Ký Gói VIP', features: [
    ['Tất cả tính năng của Gói Pro', true], ['Thiết kế giao diện theo yêu cầu', true], ['Tên miền riêng .com/.vn', true], ['Mời khách qua Email/SMS/Telegram', true], ['Tích hợp bản đồ, chỉ đường, lịch trình', true], ['Mã QR mừng cưới tùy chỉnh', true], ['Thống kê chi tiết & xuất danh sách khách mời', true], ['Hỗ trợ kỹ thuật 1:1 trong suốt thời gian sử dụng', true], ['Tư vấn thiết kế miễn phí', true],
  ] },
];

export default function PricingSection({ onGoToEditor }) {
  return (
    <section id="pricing" className="wedding-pricing" aria-labelledby="wedding-pricing-title">
      <div className="wedding-pricing__inner">
        <header className="wedding-pricing__heading">
          <span className="wedding-pricing__eyebrow">BẢNG GIÁ DỊCH VỤ</span>
          <h2 id="wedding-pricing-title">Chọn Gói Phù Hợp Với <em>Ngày Trọng Đại</em></h2>
          <div className="wedding-pricing__divider" aria-hidden="true"><span /><Heart size={12} fill="currentColor" /><span /></div>
          <p>Tạo thiệp cưới online đẹp mắt, tiện lợi với chi phí hợp lý. Nhiều lựa chọn phù hợp cho mọi nhu cầu.</p>
        </header>
        <div className="wedding-pricing__grid">
          {plans.map((plan, index) => (
            <article className={`wedding-pricing__card wedding-pricing__card--${plan.id}`} key={plan.id} aria-labelledby={`pricing-${plan.id}`}>
              {plan.id === 'pro' && <span className="wedding-pricing__popular"><Crown size={17} />PHỔ BIẾN NHẤT</span>}
              <div className="wedding-pricing__ornament" aria-hidden="true" style={{ backgroundImage: `url(${ornaments})`, backgroundPosition: `${index * 100 / 3}% center` }} />
              <div className="wedding-pricing__intro"><h3 id={`pricing-${plan.id}`}>{plan.name}</h3><p className="wedding-pricing__subtitle">{plan.subtitle}</p></div>
              <p className="wedding-pricing__price">{plan.price}{plan.id !== 'trial' && <span>/thiệp</span>}</p>
              <p className="wedding-pricing__description">{plan.description}</p>
              <ul className="wedding-pricing__features">
                {plan.features.map(([label, included]) => <li key={label} className={included ? '' : 'is-unavailable'}>{included ? <Check size={19} strokeWidth={2.8} aria-hidden="true" /> : <X size={19} strokeWidth={2.8} aria-hidden="true" />}<span>{label}</span></li>)}
              </ul>
              <button type="button" className="wedding-pricing__choose" onClick={() => plan.id === 'trial' || plan.id === 'basic' ? onGoToEditor() : onGoToEditor(null, plan.id)}>{plan.action}<ArrowRight size={18} /></button>
            </article>
          ))}
        </div>
        <ul className="wedding-pricing__benefits" aria-label="Tiện ích dịch vụ">
          <li><Gift /><span>Nhiều mẫu thiệp đẹp,<br />cập nhật liên tục</span></li>
          <li><Settings /><span>Dễ dàng tùy chỉnh,<br />không cần biết lập trình</span></li>
          <li><ShieldCheck /><span>Bảo mật thông tin<br />của bạn và khách mời</span></li>
          <li><Headphones /><span>Hỗ trợ 24/7<br />luôn đồng hành cùng bạn</span></li>
        </ul>
      </div>
    </section>
  );
}
