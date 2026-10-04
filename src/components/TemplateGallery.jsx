import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard } from 'swiper/modules';
import 'swiper/css';
import { ArrowRight, ChevronLeft, ChevronRight, Crown, Flower2, Gem, Heart, Image, LayoutGrid, Leaf } from 'lucide-react';
import useTemplates from '../templates/useTemplates';
import background from '../../images/section-02-why-us/why-us-background-hero-matched.png';
import './TemplateGallery.css';

const categories = [
  { id: 'all', label: 'Tất cả', icon: LayoutGrid },
  { id: 'modern', label: 'Hiện đại', icon: Leaf },
  { id: 'traditional', label: 'Truyền thống', icon: Flower2 },
  { id: 'minimal', label: 'Tối giản', icon: Gem },
  { id: 'luxury', label: 'Sang trọng', icon: Crown },
  { id: 'vintage', label: 'Vintage', icon: Image },
];


export default function TemplateGallery({ onGoToEditor }) {
  const templates = useTemplates();
  const previews = templates.map(template => {
    const categoryMap = { 'Hiện Đại': 'modern', 'Hiện đại': 'modern', 'Truyền Thống': 'traditional', 'Cổ Điển': 'traditional', 'Tối Giản': 'minimal', 'Sang Trọng': 'luxury', 'Vintage': 'vintage' };
    return { ...template, categoryLabel: template.category, category: categoryMap[template.category] || 'modern', image: template.thumbnail };
  });
  const [category, setCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const slider = useRef(null);
  const dragStartPosRef = useRef(null);
  const isMovedRef = useRef(false);
  const [edges, setEdges] = useState({ beginning: true, end: false, locked: false });
  const cards = previews.filter(card => category === 'all' || card.category === category);
  const slides = cards.length > 1 ? [...cards, ...cards] : cards;
  const changeCategory = (id) => {
    setCategory(id);
  };
  const updateEdges = (swiper) => setEdges({ beginning: swiper.isBeginning, end: swiper.isEnd, locked: swiper.isLocked });
  const move = (direction) => direction < 0 ? slider.current?.slidePrev() : slider.current?.slideNext();
  const toggleFavorite = (id) => setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);

  const handlePointerDown = (e) => {
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    dragStartPosRef.current = { x: clientX, y: clientY };
    isMovedRef.current = false;
  };

  const handlePointerMove = (e) => {
    if (!dragStartPosRef.current) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    const dist = Math.hypot(clientX - dragStartPosRef.current.x, clientY - dragStartPosRef.current.y);
    if (dist > 6) {
      isMovedRef.current = true;
    }
  };

  const handleCardClick = (cardId) => {
    if (isMovedRef.current) return;
    onGoToEditor(cardId);
  };

  const renderCard = (card, keyPrefix = '') => (
    <article 
      className="template-gallery__card"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      <button type="button" className="template-gallery__preview" onClick={() => handleCardClick(card.id)} aria-label={`Dùng mẫu ${card.name}`}><img src={card.image} alt={`Ảnh minh họa mẫu ${card.name}`} loading="lazy" /></button>
      <button type="button" className={`template-gallery__favorite${favorites.includes(card.id) ? ' is-favorite' : ''}`} aria-label={`${favorites.includes(card.id) ? 'Bỏ yêu thích' : 'Yêu thích'} ${card.name}`} aria-pressed={favorites.includes(card.id)} onClick={(e) => { e.stopPropagation(); toggleFavorite(card.id); }}><Heart size={23} fill={favorites.includes(card.id) ? 'currentColor' : 'none'} /></button>
      <span className="template-gallery__label">{card.categoryLabel}</span>
    </article>
  );

  return (
    <section id="templates" className="template-gallery" style={{ '--section-artwork': `url(${background})`, '--section-artwork-opacity': 1 }}>
      <div className="template-gallery__inner">
        <header className="template-gallery__heading">
          <span className="template-gallery__badge"><Flower2 size={16} /> Kho mẫu thiệp đẹp</span>
          <h2>Kho Mẫu Thiệp Cưới <em>Đa Dạng &amp; Tinh Tế</em></h2>
          <p>Hàng trăm mẫu thiệp cưới được thiết kế sẵn, phù hợp với nhiều phong cách<br className="template-gallery__desktop-break" /> từ hiện đại, tối giản đến sang trọng, truyền thống.</p>
        </header>
        <div className="template-gallery__filters" aria-label="Lọc phong cách thiệp">
          {categories.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" className={category === id ? 'is-active' : ''} aria-pressed={category === id} onClick={() => changeCategory(id)}><Icon size={20} />{label}</button>
          ))}
        </div>
        <div className="template-gallery__carousel">
          {!expanded && !edges.locked && cards.length > 1 && <button type="button" className="template-gallery__arrow template-gallery__arrow--left" aria-label="Mẫu trước" onClick={() => move(-1)}><ChevronLeft size={23} /></button>}
          {expanded ? <div className="template-gallery__track is-expanded">{cards.map(card => <div key={card.id}>{renderCard(card)}</div>)}</div> : (
            <Swiper 
              key={category} 
              className="template-gallery__slider" 
              modules={[A11y, Keyboard]} 
              loop={cards.length > 1}
              slidesPerView={1.3} 
              spaceBetween={14} 
              speed={450} 
              grabCursor={true}
              keyboard={{ enabled: true, onlyInViewport: true }} 
              watchOverflow 
              onSwiper={swiper => { slider.current = swiper; updateEdges(swiper); }} 
              onSlideChange={updateEdges} 
              onResize={updateEdges} 
              onLock={updateEdges} 
              onUnlock={updateEdges} 
              breakpoints={{ 641: { slidesPerView: 3, spaceBetween: 18 }, 1101: { slidesPerView: 5, spaceBetween: 28 } }} 
              a11y={{ containerMessage: 'Kho mẫu thiệp cưới', itemRoleDescriptionMessage: 'Mẫu thiệp', slideLabelMessage: 'Mẫu {{index}} trên {{slidesLength}}' }}>
              {slides.map((card, idx) => <SwiperSlide key={`${card.id}-${idx}`}>{renderCard(card)}</SwiperSlide>)}
            </Swiper>
          )}
          {!expanded && !edges.locked && cards.length > 1 && <button type="button" className="template-gallery__arrow template-gallery__arrow--right" aria-label="Mẫu tiếp theo" onClick={() => move(1)}><ChevronRight size={23} /></button>}
        </div>
        <button type="button" className="template-gallery__cta" onClick={() => { setCategory('all'); setExpanded(current => !current); }}>{expanded ? 'Thu gọn mẫu thiệp' : 'Xem tất cả mẫu thiệp'}<ArrowRight size={19} /></button>
      </div>
    </section>
  );
}
