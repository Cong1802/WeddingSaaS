import { ArrowRight, Heart, Zap, ShieldCheck } from 'lucide-react';
import background from '../../images/section-01-hero/hero-pastel-curtain-bg3.png';
import stepArtwork from '../../images/section-04-how-it-works/steps-illustrations.png';
import './HowItWorksSection.css';

const steps = [
  { title: 'Chọn Mẫu Thiệp', description: 'Lựa chọn từ kho mẫu thiệp đa dạng phong cách phù hợp với đám cưới của bạn.' },
  { title: 'Tùy Chỉnh Nội Dung', description: 'Nhập thông tin cô dâu, chú rể, thời gian, địa điểm và tải lên album ảnh cưới.' },
  { title: 'Cá Nhân Hóa Thiết Kế', description: 'Thêm ảnh, chọn hiệu ứng, điều chỉnh bố cục và các chi tiết để tấm thiệp thật tinh tế và mang dấu ấn riêng.' },
  { title: 'Lưu & Chia Sẻ', description: 'Nhận đường dẫn thiệp riêng biệt và gửi tới người thân, bạn bè qua Zalo/Facebook.' },
];

export default function HowItWorksSection({ onCreate }) {
  return (
    <section id="steps" className="wedding-steps" aria-labelledby="wedding-steps-title" style={{ '--section-artwork': `url(${background})`, '--section-artwork-opacity': 1 }}>
      <div className="wedding-steps__inner">
        <header className="wedding-steps__heading">
          <span className="wedding-steps__badge"><Zap size={16} fill="currentColor" />4 bước đơn giản</span>
          <h2 id="wedding-steps-title">Tạo Thiệp Cưới Online<em>Chỉ Trong 5 Phút</em></h2>
          <p>Từ ý tưởng đến tấm thiệp hoàn hảo — dễ dàng tạo thiệp cưới đẹp mang dấu ấn riêng của hai bạn.</p>
        </header>
        <ol className="wedding-steps__list">
          {steps.map(({ title, description }, index) => (
            <li className="wedding-steps__card" key={title}>
              <div className="wedding-steps__visual" aria-hidden="true">
                <span className="wedding-steps__number">0{index + 1}</span>
                <div className="wedding-steps__artwork" style={{ backgroundImage: `url(${stepArtwork})`, backgroundPosition: `${index * 100 / 3}% center` }} />
              </div>
              <h3>{title}</h3><p>{description}</p>
              {index < steps.length - 1 && <span className="wedding-steps__connector" aria-hidden="true"><svg viewBox="0 0 200 70" preserveAspectRatio="none"><path d="M0 45 C45 5 65 5 100 30 S160 65 200 25" /></svg><Heart size={13} fill="currentColor" /></span>}
            </li>
          ))}
        </ol>
        <div className="wedding-steps__action">
          <button type="button" onClick={onCreate}>Bắt Đầu Tạo Thiệp Miễn Phí<ArrowRight size={19} /></button>
          <p><ShieldCheck size={15} fill="currentColor" />Miễn phí trải nghiệm, tùy chỉnh theo phong cách của bạn</p>
        </div>
      </div>
    </section>
  );
}
