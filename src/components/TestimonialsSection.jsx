import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard } from 'swiper/modules';
import 'swiper/css';
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Quote, Star } from 'lucide-react';
import background from '../../images/section-07-testimonials/background.png';
import couple01 from '../../images/section-07-testimonials/couple-01.png';
import couple02 from '../../images/section-07-testimonials/couple-02.png';
import couple03 from '../../images/section-07-testimonials/couple-03.png';
import './TestimonialsSection.css';

// Illustrative content supplied by the design reference; replace with verified reviews when available.
const reviews = [
  { id: 'ngoc-anh', avatar: couple01, names: 'Ngọc Anh & Hoàng Nam', date: '12.10.2024', comment: 'Rất dễ sử dụng, mẫu thiệp đẹp và sang trọng. Chúng mình chỉ mất vài phút là đã có thiệp cưới ưng ý. Khách mời ai cũng khen!' },
  { id: 'minh-quan', avatar: couple02, names: 'Minh Quân & Thảo Vy', date: '24.11.2024', comment: 'Giao diện rất đẹp, nhiều mẫu hiện đại và dễ tùy chỉnh. Tính năng RSVP giúp chúng mình quản lý khách mời cực thuận tiện. Rất hài lòng!' },
  { id: 'duc-huy', avatar: couple03, names: 'Đức Huy & Phương Linh', date: '05.10.2024', comment: 'Thiệp cưới online thật sự là giải pháp tiện lợi và tiết kiệm. Mẫu mã đa dạng, hình ảnh sắc nét, gửi cho khách chỉ trong vài giây.' },
];
const Stars = () => <span className="wedding-reviews__stars" role="img" aria-label="5 trên 5 sao">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={17} fill="currentColor" strokeWidth={1} />)}</span>;

export default function TestimonialsSection({ onCreate }) {
  const [active, setActive] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const slider = useRef(null);
  const move = direction => direction < 0 ? slider.current?.slidePrev() : slider.current?.slideNext();
  // Six slides give Swiper enough room to loop with three visible cards.
  const slides = [...reviews, ...reviews];
  const toggleFavorite = id => setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);

  return (
    <section id="testimonials" className="wedding-reviews" aria-labelledby="wedding-reviews-title" style={{ '--section-artwork': `url(${background})`, '--section-artwork-opacity': 1 }}>
      <div className="wedding-reviews__inner">
        <header className="wedding-reviews__heading">
          <span className="wedding-reviews__badge"><Heart size={16} />Cảm nhận từ khách hàng</span>
          <h2 id="wedding-reviews-title">Hơn 10.000+ Cặp Đôi Đã Tin Chọn<em>WeddingSaaS</em></h2>
          <div className="wedding-reviews__divider" aria-hidden="true"><span /><Heart size={17} /><span /></div>
          <p>Những câu chuyện hạnh phúc và cảm nhận chân thật từ các cặp đôi<br className="wedding-reviews__desktop-break" /> đã sử dụng WeddingSaaS để tạo nên tấm thiệp cưới ý nghĩa.</p>
        </header>
        <div className="wedding-reviews__carousel" aria-roledescription="carousel" aria-label="Cảm nhận khách hàng">
          <button type="button" className="wedding-reviews__arrow wedding-reviews__arrow--left" aria-label="Cảm nhận trước" onClick={() => move(-1)}><ChevronLeft size={24} /></button>
          <Swiper 
            className="wedding-reviews__slider" 
            modules={[A11y, Keyboard]} 
            loop 
            centeredSlides 
            initialSlide={1} 
            slidesPerView={1} 
            spaceBetween={18} 
            speed={500} 
            grabCursor={true}
            preventClicks={true}
            preventClicksPropagation={true}
            touchStartPreventDefault={false}
            keyboard={{ enabled: true, onlyInViewport: true }} 
            onSwiper={swiper => { slider.current = swiper; }} 
            onSlideChange={swiper => setActive(swiper.realIndex % reviews.length)} 
            breakpoints={{ 1001: { slidesPerView: 3 } }} 
            a11y={{ containerMessage: 'Cảm nhận khách hàng', itemRoleDescriptionMessage: 'Cảm nhận' }}>
            {slides.map((review, index) => <SwiperSlide key={`${review.id}-${index}`}><article className="wedding-reviews__card">
              <div className="wedding-reviews__card-top"><img src={review.avatar} alt="Ảnh cặp đôi minh họa" width="82" height="82" loading="lazy" /><Stars /><Quote className="wedding-reviews__quote" size={38} fill="currentColor" strokeWidth={0} aria-hidden="true" /></div>
              <blockquote>“{review.comment}”</blockquote>
              <div className="wedding-reviews__card-bottom"><div><h3>{review.names}</h3><time dateTime={review.date.split('.').reverse().join('-')}>{review.date}</time></div><button type="button" aria-label={`${favorites.includes(review.id) ? 'Bỏ yêu thích' : 'Yêu thích'} cảm nhận của ${review.names}`} aria-pressed={favorites.includes(review.id)} onClick={() => toggleFavorite(review.id)}><Heart size={20} fill={favorites.includes(review.id) ? 'currentColor' : 'none'} /></button></div>
            </article></SwiperSlide>)}
          </Swiper>
          <button type="button" className="wedding-reviews__arrow wedding-reviews__arrow--right" aria-label="Cảm nhận tiếp theo" onClick={() => move(1)}><ChevronRight size={24} /></button>
        </div>
        <div className="wedding-reviews__dots" aria-label="Chọn cảm nhận">{reviews.map((review, index) => <button type="button" key={review.id} aria-label={`Xem cảm nhận của ${review.names}`} aria-pressed={active === index} className={active === index ? 'is-active' : ''} onClick={() => slider.current?.slideToLoop(index)} />)}</div>
        <div className="wedding-reviews__action"><button type="button" onClick={onCreate}>Tham gia cùng hàng ngàn cặp đôi<ArrowRight size={19} /></button><div className="wedding-reviews__proof"><div className="wedding-reviews__avatars" aria-hidden="true">{reviews.map(review => <img src={review.avatar} alt="" key={review.id} width="32" height="32" loading="lazy" />)}</div><span>10.000+ cặp đôi đã tin chọn</span><Stars /></div></div>
      </div>
    </section>
  );
}
