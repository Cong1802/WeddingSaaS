import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard } from 'swiper/modules';
import 'swiper/css';
import { ArrowRight, ChevronLeft, ChevronRight, Crown, Flower2, Gem, Heart, Image, LayoutGrid, Leaf } from 'lucide-react';
import { TEMPLATES } from '../templates/templateRegistry';
import background from '../../images/section-02-why-us/why-us-background-hero-matched.png';
import modern from '../../images/section-03-templates/modern.png';
import minimal from '../../images/section-03-templates/minimal.png';
import traditional from '../../images/section-03-templates/traditional.png';
import luxury from '../../images/section-03-templates/luxury.png';
import vintage from '../../images/section-03-templates/vintage.png';
import './TemplateGallery.css';

const categories = [
  { id: 'all', label: 'Tất cả', icon: LayoutGrid },
  { id: 'modern', label: 'Hiện đại', icon: Leaf },
  { id: 'traditional', label: 'Truyền thống', icon: Flower2 },
  { id: 'minimal', label: 'Tối giản', icon: Gem },
  { id: 'luxury', label: 'Sang trọng', icon: Crown },
  { id: 'vintage', label: 'Vintage', icon: Image },
];
const previews = [
  ['template_01', 'modern', modern],
  ['template_03', 'minimal', minimal],
  ['template_02', 'traditional', traditional],
  ['template_07', 'luxury', luxury],
  ['template_04', 'vintage', vintage],
  ['template_06', 'modern'],
  ['template_05', 'modern'],
  ['template_08', 'modern'],
].map(([id, category, image]) => {
  const template = TEMPLATES.find(t => t.id === id);
  return { ...template, category, image: image || template.thumbnail };
});

export default function TemplateGallery({ onGoToEditor }) {
  const [category, setCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const slider = useRef(null);
  const [edges, setEdges] = useState({ beginning: true, end: false, locked: false });
  const cards = previews.filter(card => category === 'all' || card.category === category);
  const changeCategory = (id) => {
    setCategory(id);
  };
  const updateEdges = (swiper) => setEdges({ beginning: swiper.isBeginning, end: swiper.isEnd, locked: swiper.isLocked });
  const move = (direction) => direction < 0 ? slider.current?.slidePrev() : slider.current?.slideNext();
  const toggleFavorite = (id) => setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const renderCard = (card) => (
    <article className="template-gallery__card">
      <button type="button" className="template-gallery__preview" onClick={() => onGoToEditor(card.id)} aria-label={`Dùng mẫu ${card.name}`}><img src={card.image} alt={`Ảnh minh họa mẫu ${card.name}`} loading="lazy" /></button>
      <button type="button" className={`template-gallery__favorite${favorites.includes(card.id) ? ' is-favorite' : ''}`} aria-label={`${favorites.includes(card.id) ? 'Bỏ yêu thích' : 'Yêu thích'} ${card.name}`} aria-pressed={favorites.includes(card.id)} onClick={() => toggleFavorite(card.id)}><Heart size={23} fill={favorites.includes(card.id) ? 'currentColor' : 'none'} /></button>
      <span className="template-gallery__label">{categories.find(item => item.id === card.category).label}</span>
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
          {!expanded && !edges.locked && cards.length > 1 && <button type="button" className="template-gallery__arrow template-gallery__arrow--left" aria-label="Mẫu trước" disabled={edges.beginning} onClick={() => move(-1)}><ChevronLeft size={23} /></button>}
          {expanded ? <div className="template-gallery__track is-expanded">{cards.map(card => <div key={card.id}>{renderCard(card)}</div>)}</div> : (
            <Swiper key={category} className="template-gallery__slider" modules={[A11y, Keyboard]} slidesPerView={1.3} spaceBetween={14} speed={window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450} keyboard={{ enabled: true, onlyInViewport: true }} watchOverflow onSwiper={swiper => { slider.current = swiper; updateEdges(swiper); }} onSlideChange={updateEdges} onResize={updateEdges} onLock={updateEdges} onUnlock={updateEdges} breakpoints={{ 641: { slidesPerView: 3, spaceBetween: 18 }, 1101: { slidesPerView: 5, spaceBetween: 28 } }} a11y={{ containerMessage: 'Kho mẫu thiệp cưới', itemRoleDescriptionMessage: 'Mẫu thiệp', slideLabelMessage: 'Mẫu {{index}} trên {{slidesLength}}' }}>
              {cards.map(card => <SwiperSlide key={card.id}>{renderCard(card)}</SwiperSlide>)}
            </Swiper>
          )}
          {!expanded && !edges.locked && cards.length > 1 && <button type="button" className="template-gallery__arrow template-gallery__arrow--right" aria-label="Mẫu tiếp theo" disabled={edges.end} onClick={() => move(1)}><ChevronRight size={23} /></button>}
        </div>
        <button type="button" className="template-gallery__cta" onClick={() => { setCategory('all'); setExpanded(current => !current); }}>{expanded ? 'Thu gọn mẫu thiệp' : 'Xem tất cả mẫu thiệp'}<ArrowRight size={19} /></button>
      </div>
    </section>
  );
}
