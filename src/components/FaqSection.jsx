import { useState } from 'react';
import { ArrowRight, ChevronDown, Mail, MessageCircle, Users } from 'lucide-react';
import background from '../../images/section-09-faq/background.png';
import couple from '../../images/section-09-faq/couple.png';
import flowers from '../../images/shared/florals/shared-floral-branch-left.png';
import './FaqSection.css';

const questions = [
  { question: 'Tạo thiệp cưới online có mất phí không?', answer: 'Bạn có thể tạo và xem thử thiệp miễn phí. Các gói trả phí bổ sung tính năng như đường dẫn riêng, RSVP và mã QR mừng cưới. Xem bảng giá để chọn gói phù hợp với nhu cầu của bạn.' },
  { question: 'Tôi có thể tùy chỉnh nội dung và hình ảnh không?', answer: 'Có. Bạn có thể chỉnh tên cô dâu, chú rể, thời gian, địa điểm, nội dung lời mời và hình ảnh. Trình chỉnh sửa cũng hỗ trợ thay đổi màu sắc, phông chữ và nhạc nền theo mẫu thiệp bạn chọn.' },
  { question: 'Sau khi tạo xong, tôi gửi thiệp cho khách bằng cách nào?', answer: 'Sau khi lưu thiệp, bạn có thể sao chép đường dẫn và gửi cho khách qua Zalo, Facebook hoặc các ứng dụng nhắn tin. Khách mở đường dẫn để xem thiệp trực tiếp trên trình duyệt.' },
  { question: 'Thiệp cưới có hiển thị tốt trên điện thoại không?', answer: 'Thiệp được thiết kế để sử dụng trên điện thoại và máy tính. Bạn có thể xem trước trong trình chỉnh sửa để kiểm tra hình ảnh, nội dung và bố cục trước khi gửi lời mời.' },
  { question: 'Dữ liệu thiệp cưới của tôi có được bảo mật không?', answer: 'Tài khoản giúp bạn quản lý các thiệp đã lưu. Thiệp đã chia sẻ có thể được xem bởi người có đường dẫn, vì vậy bạn hãy chọn nội dung phù hợp để gửi tới khách mời. Nếu cần hỗ trợ về dữ liệu tài khoản, hãy liên hệ đội ngũ WeddingSaaS.' },
];

export default function FaqSection({ settings = {} }) {
  const [open, setOpen] = useState(0);
  const zalo = typeof settings.social_zalo === 'string' && /^https?:\/\//i.test(settings.social_zalo.trim()) ? settings.social_zalo.trim() : null;
  const contact = zalo || (settings.contact_email ? `mailto:${settings.contact_email}` : settings.contact_phone ? `tel:${settings.contact_phone}` : '#footer-contact');
  return (
    <section id="faq" className="wedding-faq" aria-labelledby="wedding-faq-title" style={{ '--section-artwork': `url(${background})`, '--section-artwork-opacity': 1 }}>
      <div className="wedding-faq__inner">
        <div className="wedding-faq__content">
          <header className="wedding-faq__heading"><span className="wedding-faq__badge"><MessageCircle size={16} />Câu hỏi thường gặp</span><h2 id="wedding-faq-title">Giải Đáp Thắc Mắc<em>Về WeddingSaaS</em></h2><p>Tổng hợp những câu hỏi phổ biến nhất để giúp bạn hiểu rõ hơn và dễ dàng bắt đầu tạo thiệp cưới online.</p></header>
          <div className="wedding-faq__questions">
            {questions.map(({ question, answer }, index) => <article className={`wedding-faq__item${open === index ? ' is-open' : ''}`} key={question}>
              <h3><button type="button" id={`faq-question-${index}`} aria-expanded={open === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(current => current === index ? null : index)}><span className="wedding-faq__number">0{index + 1}</span><span>{question}</span><span className="wedding-faq__chevron"><ChevronDown size={21} /></span></button></h3>
              <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} aria-hidden={open !== index} inert={open !== index} className="wedding-faq__answer"><div className="wedding-faq__answer-clip"><div className="wedding-faq__answer-content"><p>{answer}{index === 0 && <> <a href="#pricing">Xem bảng giá →</a></>}</p></div></div></div>
            </article>)}
          </div>
        </div>
        <div className="wedding-faq__visual">
          <img className="wedding-faq__couple" src={couple} alt="Cặp đôi trong trang phục cưới cùng bó hoa hồng pastel" width="1206" height="1305" loading="lazy" />
          <aside className="wedding-faq__support" aria-label="Liên hệ hỗ trợ">
            <img className="wedding-faq__flowers wedding-faq__flowers--left" src={flowers} alt="" aria-hidden="true" loading="lazy" /><img className="wedding-faq__flowers wedding-faq__flowers--right" src={flowers} alt="" aria-hidden="true" loading="lazy" />
            <span className="wedding-faq__mail" aria-hidden="true"><Mail size={30} /></span><h3>Vẫn còn thắc mắc?</h3><p>Đội ngũ WeddingSaaS luôn sẵn sàng<br />hỗ trợ bạn 24/7.</p><a href={contact} {...(zalo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><Users size={17} />Liên hệ với chúng tôi<ArrowRight size={18} /></a>
          </aside>
        </div>
      </div>
    </section>
  );
}
