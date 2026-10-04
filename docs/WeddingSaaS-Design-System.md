# WeddingSaaS --- Landing Page Design System

> **Core principle:** **9 sections, 1 continuous canvas.** Do not design
> each section as a separate mini-site.

## 1. Art Direction

**Style:** Modern Romantic SaaS.

Keywords: bright, romantic, elegant, modern, airy, premium, wedding
stationery, SaaS clarity.

Avoid: heavy vintage styling, dark backgrounds, excessive pink, flowers
in every empty space, wave dividers, hard section separators,
card-inside-card layouts, and separate full-width background images for
every section.

The landing page should feel like one long wedding canvas. Section
boundaries come from spacing, content rhythm and subtle color
transitions.

## 2. Page Structure --- 9 Sections

  \#   Section            Purpose                         Decoration
  ---- ------------------ ------------------------------- ------------
  01   Hero               Product introduction + CTA      100%
  02   Why WeddingSaaS    4 core benefits                 20%
  03   Template Gallery   Showcase invitation templates   30%
  04   How It Works       4-step process                  10%
  05   Feature Showcase   Product experience              70%
  06   Pricing            3 plans                         20%
  07   Testimonials       Social proof                    10%
  08   Final CTA          Conversion close                80%
  09   Footer             Navigation + contact            30%

Navbar belongs to Hero.

## 3. Color Tokens

``` css
:root {
  --brand-primary: #F04468;
  --brand-primary-hover: #DC3659;
  --brand-rose: #D95B70;
  --brand-soft: #FFF0F1;

  --peach: #F6B59D;
  --sage: #9EAD8D;
  --sage-soft: #DDE5D7;
  --gold: #D5A66C;

  --bg-page: #FFFDFC;
  --bg-cream: #FFF9F6;
  --bg-blush: #FFF5F2;
  --bg-soft-rose: #FFF0F1;

  --text-heading: #4F3033;
  --text-body: #765B5E;
  --text-muted: #9A7D80;

  --border-soft: rgba(217, 91, 112, .12);
  --shadow-soft: rgba(102, 61, 67, .08);

  --radius-button: 12px;
  --radius-card: 18px;
}
```

### Color ratio

-   65--70% ivory / cream
-   12--15% blush
-   8--10% coral / rose
-   \~5% sage
-   2--3% peach / gold

Coral is an accent, not a large section background. Do not use pure
black for normal typography.

## 4. Continuous Page Background

Prefer one page-level canvas:

``` css
.landing-page {
  position: relative;
  overflow-x: clip;
  background: linear-gradient(
    180deg,
    #FFFDFC 0%,
    #FFF7F4 20%,
    #FFF9F6 35%,
    #FFFDFC 48%,
    #FFF5F2 68%,
    #FFF9F6 84%,
    #FFF5F2 100%
  );
}

.landing-page section {
  position: relative;
  background: transparent;
}
```

Color rhythm:

``` text
Hero          #FFFDFC → #FFF7F4
Why Us        #FFF7F4 → #FFF9F6
Templates     #FFF9F6 → #FFFDFC
How It Works  #FFFDFC
Features      #FFFDFC → #FFF5F2
Pricing       #FFF5F2 → #FFF9F6
Testimonials  #FFF9F6
Final CTA     #FFF3F1
Footer        #FFF3F1 → #FFF9F6
```

Never create a visible horizontal color cut between sections.

## 5. Typography

Use two personalities only.

### Headings

Elegant editorial serif: - Hero H1: 56--72px desktop - Section H2:
40--52px - Section H3: 24--30px - weight: 600--700 - color: `#4F3033` -
letter-spacing: around `-0.02em`

`WeddingSaaS` or one short phrase may use `#D95B70` / `#F04468`.

Do not use script font for an entire heading.

### UI / body

Modern sans-serif: - Body: 16--18px - Small: 13--15px - Buttons:
15--16px / 600 - Navigation: 14--16px / 500--600

Text colors: - Heading `#4F3033` - Body `#765B5E` - Muted `#9A7D80` -
Accent `#F04468`

## 6. Spacing

Desktop target:

``` text
Hero             780–900px min-height
Why Us           120px 0
Templates        130px 0
How It Works     120px 0
Features         140px 0
Pricing          130px 0
Testimonials     120px 0
Final CTA        120px 0
Footer           90px top minimum
```

Typical section rhythm:

``` text
Eyebrow
  ↓ 12–16px
Heading
  ↓ 20–28px
Description
  ↓ 48–64px
Main content
  ↓ 100–140px
Next section
```

Do not compress desktop transitions to 30--50px.

## 7. Container

``` css
.page-container {
  width: min(1280px, calc(100% - 48px));
  margin-inline: auto;
}
```

## 8. Buttons

Primary:

``` css
background: #F04468;
color: #FFF;
border-radius: 12px;
min-height: 50px;
padding: 0 26px;
font-weight: 600;
box-shadow: 0 10px 26px rgba(240,68,104,.20);
```

Hover: `#DC3659`.

Secondary:

``` css
background: rgba(255,255,255,.68);
border: 1px solid rgba(217,91,112,.16);
color: #D95B70;
border-radius: 12px;
```

## 9. Cards

Use cards only where functionally useful: - templates - pricing -
testimonials - forms

Do not put Why Us benefits or How It Works steps into large cards.

``` css
.card {
  background: rgba(255,255,255,.78);
  border: 1px solid rgba(217,91,112,.10);
  border-radius: 18px;
  box-shadow: 0 14px 40px rgba(102,61,67,.08);
}
```

## 10. Floral / Decorative Rules

Decorative assets should normally be absolute:

``` css
.decorative-asset {
  position: absolute;
  pointer-events: none;
  user-select: none;
}
```

Use `aria-hidden="true"` when decorative.

**Normal layout content:** phone mockups, invitation previews, actual
template previews.

**Absolute decoration:** floral corners, branches, ribbon, petals,
watercolor/glow.

Do not use flowers as a separate full-section background.

## 11. Floral Continuity

Do not restart a floral composition in every section. Decorations may
cross section boundaries.

Use flowers to connect Hero → Why Us, Templates → Steps, CTA → Footer.

No wave dividers, SVG waves, heavy horizontal rules, or repeated
bouquets at every boundary.

## 12. Decoration Density

-   **Hero --- 100%:** strongest visual; phone/invitation + floral
    composition + subtle petals.
-   **Why Us --- 20%:** 2--4 petals and perhaps one inherited branch. No
    bouquet.
-   **Templates --- 30%:** one small floral edge/corner; templates are
    already visual.
-   **How It Works --- 10%:** visual rest area; almost no flowers.
-   **Features --- 70%:** second strongest visual; phone mockups + one
    floral composition.
-   **Pricing --- 20%:** one corner maximum; no flowers behind each
    card.
-   **Testimonials --- 10%:** mostly clean.
-   **Final CTA --- 80%:** strong wedding mood; florals frame CTA.
-   **Footer --- 30%:** continue CTA florals into footer; do not
    introduce a new style.

## 13. Petals

Petals require real alpha transparency.

Prefer reusable individual assets:

``` text
shared/petals/
  petal-01.png
  petal-02.png
  petal-03.png
  petal-04.png
  petal-05.png
```

Typical desktop size: `18–55px`. Typical opacity: `0.18–0.38`.

Do not use a giant PNG containing dozens of petals across the viewport.

## 14. Asset Architecture

``` text
images/
├── shared/
│   ├── florals/
│   │   ├── floral-corner-left.png
│   │   ├── floral-corner-right.png
│   │   ├── floral-branch.png
│   │   └── floral-small.png
│   ├── petals/
│   │   ├── petal-01.png
│   │   ├── petal-02.png
│   │   ├── petal-03.png
│   │   ├── petal-04.png
│   │   └── petal-05.png
│   └── textures/
├── hero/
│   └── hero-product.png
├── templates/
├── features/
│   └── feature-product.png
└── cta/
    └── cta-stationery.png
```

Reuse shared florals/petals across sections to create consistency.

## 15. Section Specs

### 01 --- Hero

45--48% copy / 52--55% visual on desktop. Hero is the strongest visual
moment. Use eyebrow, H1, short copy, two CTAs and compact benefits.
Product visual uses phone + invitation/envelope. No divider before Why
Us.

### 02 --- Why WeddingSaaS

Four benefits: - Chuyên nghiệp --- Thiết kế chỉn chu - Cá nhân hóa ---
Theo phong cách riêng - Tiết kiệm chi phí --- Nhanh hơn, tối ưu hơn - Hỗ
trợ 24/7 --- Đồng hành khi bạn cần

Use 4 columns or 2×2. No large cards.

### 03 --- Template Gallery

Eyebrow + heading + copy + filter chips + template grid/carousel + CTA.
Template cards use consistent ratios and soft surfaces. Do not wrap the
entire gallery in another card.

### 04 --- How It Works

1.  Chọn mẫu thiệp
2.  Tùy chỉnh nội dung
3.  Xem trước & điều chỉnh
4.  Lưu & chia sẻ

Use icon + number + title + short description. No large cards.

### 05 --- Feature Showcase

Second strongest visual section. Product visual on one side; copy on the
other. Use 1--2 phone mockups, invitation and one floral cluster.
Highlight customization, maps, timeline, RSVP, QR, sharing and
responsive design.

### 06 --- Pricing

Three plans: Cơ bản, Nâng cao, Cao cấp. Same dimensions and hierarchy.
Recommended plan can use a subtle coral border/badge. Keep it SaaS-like.

### 07 --- Testimonials

Three clean cards desktop with avatar, short quote, names, location and
optional stars. Minimal decoration.

### 08 --- Final CTA

Suggested: `Tạo thiệp cưới của riêng bạn` with a short supporting line
and `[Tạo thiệp ngay]`.

Frame with florals on opposite corners. Do not put the CTA inside a
floating white card.

### 09 --- Footer

Stay in the same ivory/blush canvas. Include logo/description, About,
Product, Support, Contact, social icons and copyright. Continue floral
decoration from Final CTA into Footer.

## 16. Radius & Shadows

``` text
Button        12px
Input         10–12px
Chip          999px
Template      16px
Card          18px
Large visual  20–24px
```

Only two shadow strengths:

``` css
--shadow-soft: 0 14px 40px rgba(102,61,67,.08);
--shadow-action: 0 10px 26px rgba(240,68,104,.20);
```

## 17. Responsive

Tablet: - reduce section spacing \~20% - Hero may remain two columns -
reduce decorative florals before reducing content - templates 2--3
columns

Mobile: - Hero: Navbar → Text → CTA → Product visual - H1: 36--44px -
H2: 30--38px - body: 16px - section spacing: 72--96px - pricing stacks
vertically - florals reduce 40--60% - hide nonessential decoration -
petal opacity \~0.15--0.25 - no horizontal scrolling at 375px

Use `overflow-x: clip` on the correct wrapper.

## 18. Motion

Keep motion subtle: - button hover - card lift 1--3px - gentle reveal -
slow petal float

Petal motion: `translateY(4–8px)`, 7--12 seconds, ease-in-out.

Respect `prefers-reduced-motion`.

## 19. React / Tailwind Rules

1.  Reuse current project architecture.
2.  Do not alter routing/auth/backend for visual work.
3.  Prefer existing Tailwind setup.
4.  Reuse design tokens instead of arbitrary values.
5.  Decorative images: pointer-events none + select none.
6.  Do not create a different palette per section.
7.  Do not add dependencies just for decoration.
8.  Remove unused imports.
9.  Verify production build.
10. Check desktop, tablet and 375px mobile.
11. Check horizontal overflow.
12. Keep page background continuous.
13. Do not convert every content group into a card.

## 20. Non-Negotiable Rules

**DO** - 1 continuous page canvas - generous whitespace - alternate rich
and quiet sections - reuse floral assets - absolute positioning for
decoration - normal layout for product visuals - coral only as accent -
Hero and Features carry most visual weight - visually connect Final CTA
and Footer

**DO NOT** - wave separators - independent background per section -
bouquet in every section - dozens of petals everywhere - checkerboard
baked into PNG - non-transparent decorative PNG - flowers over important
text - every component as a white card - excessive pink - excessive
shadows - compressed vertical spacing - corporate-looking disconnected
footer

## 21. Final Principle

> **WeddingSaaS = Wedding emotion + SaaS clarity.**

The landing page is one story, not nine independent designs:

`Discover → Understand → Explore → Learn → Experience → Choose → Trust → Convert → Footer`

Use whitespace and hierarchy first. Use flowers to connect the story ---
not to fill empty space.
