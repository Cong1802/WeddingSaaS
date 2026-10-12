import { Plus, Clock3, Link, Home, ChevronRight, FileHeart, Pencil, Share2 } from 'lucide-react';
import flowers from '../../images/shared/florals/shared-floral-sprig.png';
import petal from '../../images/shared/petals/shared-petal-01.png';
import './MyCardsEmpty.css';

export default function MyCardsEmpty({ onChooseTemplate }) {
  return <>
    <div className="my-card-breadcrumb"><a href="/" aria-label="Trang chủ"><Home size={17} /></a><ChevronRight size={14} /><span>Tài khoản</span><span>/</span><strong>Thiệp cưới của bạn</strong></div>
    <section className="my-card-welcome">
      <div className="my-card-envelope-art" aria-hidden="true">
        <div className="my-card-art-halo" />
        <div className="my-card-envelope-back" />
        <div className="my-card-invitation"><span>Our<br />Wedding</span><i>♥</i></div>
        <img className="my-card-envelope-flowers" src={flowers} alt="" />
        <div className="my-card-envelope-front" /><div className="my-card-envelope-seal">♡</div>
        <img className="my-card-envelope-petal" src={petal} alt="" />
        <span className="my-card-art-heart heart-one">♥</span><span className="my-card-art-heart heart-two">♥</span>
      </div>
      <div className="my-card-welcome-copy">
        <div className="my-card-welcome-eyebrow">THIỆP CƯỚI CỦA BẠN<span /></div>
        <h1>Ngày vui bắt đầu<br />từ một tấm thiệp</h1>
        <p>Chọn mẫu yêu thích để tạo lời mời của riêng bạn.</p>
        <div className="my-card-welcome-actions"><button className="primary" onClick={onChooseTemplate}><Plus size={24} />Chọn mẫu thiệp</button><a href="/#how-it-works">Xem hướng dẫn →</a></div>
        <div className="my-card-welcome-duration"><Clock3 size={19} />Sử dụng 6 tháng từ khi thanh toán được duyệt</div>
      </div>
    </section>
    <ol className="my-card-welcome-steps">
      {[['Chọn mẫu', 'Khám phá các mẫu thiệp đẹp và chọn phong cách bạn yêu thích.'], ['Điền thông tin', 'Thêm thông tin cô dâu, chú rể, ngày giờ, địa điểm và lời mời.'], ['Chia sẻ', 'Gửi thiệp đến người thân, bạn bè chỉ với một liên kết duy nhất.']].map(([title, description], index) => { const Icon = [FileHeart, Pencil, Share2][index]; return <li key={title}><span><Icon size={21} /></span><div><h2>{title}</h2><p>{description}</p></div></li>; })}
    </ol>
    <aside className="my-card-welcome-link"><span><Link size={25} /></span><div><h2>Một liên kết cho ngày vui</h2><p>Đổi mẫu vẫn giữ nguyên liên kết và thông tin thiệp.</p></div></aside>
  </>;
}
