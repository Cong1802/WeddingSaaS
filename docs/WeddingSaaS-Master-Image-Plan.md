# WeddingSaaS --- Master Image Production Plan

> **Status:** LOCKED MASTER PLAN\
> **Works with:** `docs/WeddingSaaS-Design-System.md`\
> **Purpose:** Define **every image asset for all 9 landing-page
> sections**, including shared decorations, section-specific visuals,
> content assets, exact filenames, folders, generation order, prompts,
> reuse rules, and implementation notes.
>
> **Important:** This file replaces the previous image plan. From now
> on, generated images must follow the filenames and folders in this
> document exactly.

------------------------------------------------------------------------

# 0. Core Rule

WeddingSaaS has **9 sections but 1 visual system**.

Assets are split into 3 layers:

1.  **Shared decoration** --- reusable flowers, petals, ribbon, wax
    seal.
2.  **Section-specific visual** --- major visual made specifically for a
    section.
3.  **Content/UI assets** --- invitation previews, product UI screens,
    avatars, etc.

### Storage rule

-   Used in **2+ sections** → `images/shared/...`
-   Used in **one section only** → that section's folder.
-   Do not duplicate the same asset into multiple section folders.
-   Never rename a generated file after implementation without updating
    this document and code together.

------------------------------------------------------------------------

# 1. Final Folder Structure

``` text
wedding-card-saas/
│
├── docs/
│   ├── WeddingSaaS-Design-System.md
│   └── WeddingSaaS-Master-Image-Plan.md
│
└── images/
    │
    ├── shared/
    │   ├── florals/
    │   │   ├── shared-floral-branch-left.png
    │   │   ├── shared-floral-branch-right.png
    │   │   ├── shared-floral-cluster-small.png
    │   │   └── shared-floral-sprig.png
    │   │
    │   ├── petals/
    │   │   ├── shared-petal-01.png
    │   │   ├── shared-petal-02.png
    │   │   ├── shared-petal-03.png
    │   │   ├── shared-petal-04.png
    │   │   └── shared-petal-05.png
    │   │
    │   └── accents/
    │       ├── shared-ribbon-coral.png
    │       └── shared-wax-seal.png
    │
    ├── section-01-hero/
    │   ├── s01-hero-product.png
    │   ├── s01-floral-left.png
    │   └── s01-floral-right.png
    │
    ├── section-02-why-us/
    │   └── s02-stationery-accent.png
    │
    ├── section-03-templates/
    │   ├── s03-template-romantic.png
    │   ├── s03-template-minimal.png
    │   ├── s03-template-floral.png
    │   ├── s03-template-modern.png
    │   ├── s03-template-classic.png
    │   └── s03-template-elegant.png
    │
    ├── section-04-how-it-works/
    │   └── s04-process-phone.png
    │
    ├── section-05-features/
    │   ├── s05-feature-product.png
    │   └── s05-feature-floral.png
    │
    ├── section-06-pricing/
    │   └── s06-pricing-accent.png
    │
    ├── section-07-testimonials/
    │   ├── s07-avatar-01.png
    │   ├── s07-avatar-02.png
    │   └── s07-avatar-03.png
    │
    ├── section-08-final-cta/
    │   ├── s08-cta-stationery.png
    │   └── s08-cta-floral-frame.png
    │
    └── section-09-footer/
        └── s09-footer-floral.png
```

------------------------------------------------------------------------

# 2. Total Image Count

## Shared assets --- 11

``` text
01 shared-floral-branch-left.png
02 shared-floral-branch-right.png
03 shared-floral-cluster-small.png
04 shared-floral-sprig.png
05 shared-petal-01.png
06 shared-petal-02.png
07 shared-petal-03.png
08 shared-petal-04.png
09 shared-petal-05.png
10 shared-ribbon-coral.png
11 shared-wax-seal.png
```

## Section assets --- 23

``` text
SECTION 01 — Hero             3
SECTION 02 — Why Us           1
SECTION 03 — Templates        6
SECTION 04 — How It Works     1
SECTION 05 — Features         2
SECTION 06 — Pricing          1
SECTION 07 — Testimonials     3
SECTION 08 — Final CTA        2
SECTION 09 — Footer           1
```

## Grand total

``` text
11 shared
23 section-specific/content
----------------------------
34 planned image files
```

This is the **maximum planned production inventory**.

If real application content already provides template thumbnails or real
testimonial avatars, replace the corresponding generated placeholders
instead of creating duplicates.

------------------------------------------------------------------------

# 3. Naming Standard

Every section-specific image begins with its section code:

``` text
s01-...
s02-...
...
s09-...
```

Shared assets always begin with:

``` text
shared-...
```

Use:

``` text
lowercase
kebab-case
English semantic names
.png for generated transparent assets
```

Correct:

``` text
s05-feature-product.png
shared-floral-sprig.png
```

Wrong:

``` text
image1.png
hoa.png
anh-2.png
final-final.png
feature_new.png
```

### Sequence number vs filename

The production numbers `01–34` in this document describe **generation
order** only.

Do not put production sequence numbers into filenames unless they are
part of a section code or petal/avatar number.

------------------------------------------------------------------------

# 4. Global Image Generation Standard

## Visual style

**Modern Romantic Wedding SaaS**

All assets must feel like one collection:

-   bright
-   airy
-   premium
-   modern
-   soft editorial lighting
-   sophisticated wedding stationery
-   coral / blush / peach / ivory / sage
-   clean commercial product presentation
-   not vintage-heavy
-   not dark
-   not overdecorated

## Palette

``` text
Coral              #F04468
Rose               #D95B70
Soft blush         #FFF0F1
Peach              #F6B59D
Warm ivory         #FFF9F6
Sage               #9EAD8D
Soft sage          #DDE5D7
Muted gold         #D5A66C
Heading brown      #4F3033
```

## Floral family

Prefer:

-   blush garden roses
-   small coral roses
-   warm ivory roses
-   tiny peach blossoms
-   white baby's breath
-   muted sage leaves
-   fine elegant stems

Avoid:

-   strong red roses
-   purple-dominant flowers
-   blue flowers
-   neon pink
-   dark tropical leaves
-   sunflower/yellow-heavy palettes

------------------------------------------------------------------------

# 5. Transparency Standard

Unless explicitly stated otherwise, generated decorative/product
compositions must have:

``` text
REAL transparent alpha
```

Never accept:

-   checkerboard baked into image
-   white rectangular background
-   cream rectangular background
-   fake transparent pattern
-   obvious image canvas edge

Prefer CSS for broad glow effects.

------------------------------------------------------------------------

# 6. Universal Negative Prompt

Apply this intent to every generated asset:

``` text
No watermark.
No brand logo.
No checkerboard pattern.
No fake transparency.
No visible rectangular background.
No neon colors.
No dark dramatic lighting.
No vintage sepia.
No purple-dominant palette.
No giant flower wall.
No excessive petals.
No random text.
No illegible text blocks.
No hard crop through the main object.
No heavy black shadow.
No unrelated props.
Keep the premium modern WeddingSaaS visual language.
```

For transparent assets add:

``` text
Isolated object only on a real transparent alpha background.
```

------------------------------------------------------------------------

# 7. MASTER PRODUCTION ORDER

Generate and approve assets in this order.

## Phase A --- Shared DNA

``` text
01 shared-floral-branch-left.png
02 shared-floral-branch-right.png
03 shared-floral-cluster-small.png
04 shared-floral-sprig.png

05 shared-petal-01.png
06 shared-petal-02.png
07 shared-petal-03.png
08 shared-petal-04.png
09 shared-petal-05.png

10 shared-ribbon-coral.png
11 shared-wax-seal.png
```

**Approval gate:** verify all four floral assets belong to the same
family before continuing.

## Phase B --- Section 01 Hero

``` text
12 s01-hero-product.png
13 s01-floral-left.png
14 s01-floral-right.png
```

## Phase C --- Section 02 Why Us

``` text
15 s02-stationery-accent.png
```

## Phase D --- Section 03 Templates

``` text
16 s03-template-romantic.png
17 s03-template-minimal.png
18 s03-template-floral.png
19 s03-template-modern.png
20 s03-template-classic.png
21 s03-template-elegant.png
```

## Phase E --- Section 04 How It Works

``` text
22 s04-process-phone.png
```

## Phase F --- Section 05 Features

``` text
23 s05-feature-product.png
24 s05-feature-floral.png
```

## Phase G --- Section 06 Pricing

``` text
25 s06-pricing-accent.png
```

## Phase H --- Section 07 Testimonials

``` text
26 s07-avatar-01.png
27 s07-avatar-02.png
28 s07-avatar-03.png
```

## Phase I --- Section 08 Final CTA

``` text
29 s08-cta-stationery.png
30 s08-cta-floral-frame.png
```

## Phase J --- Section 09 Footer

``` text
31 s09-footer-floral.png
```

### Reserved / optional

Production inventory supports three optional replacements if real
content is missing:

``` text
32 optional template detail visual
33 optional feature screen variant
34 optional testimonial avatar replacement
```

Do not generate 32--34 unless implementation proves they are necessary.

------------------------------------------------------------------------

# 8. SHARED ASSETS

## 01 --- `images/shared/florals/shared-floral-branch-left.png`

### Used in

Hero → Why Us transition, Pricing/Testimonials transition, other
left-edge transitions.

### Prompt

``` text
Create a long delicate wedding floral branch for the LEFT edge of a
premium modern romantic WeddingSaaS landing page.

Real transparent alpha background.

Slender vertical-diagonal silhouette designed to extend across website
section boundaries. Approximately 70 percent fine muted sage foliage
and stems, 30 percent small flowers.

Flowers:
small blush garden roses,
small coral accents,
warm ivory blossoms,
tiny peach blossoms,
white baby's breath.

Palette:
#F04468 coral,
#D95B70 rose,
#F6B59D peach,
#FFF9F6 ivory,
#9EAD8D sage.

Bright airy editorial lighting.
Elegant natural taper at both ends.
Sparse inner-facing edge.
Not a bouquet.
No vase.
No ribbon.
No text.
Real alpha transparency.
```

Suggested ratio: `1:3` tall.

------------------------------------------------------------------------

## 02 --- `images/shared/florals/shared-floral-branch-right.png`

### Used in

Templates → Steps transition, Features surroundings, other right-edge
transitions.

### Prompt

``` text
Create a long delicate wedding floral branch for the RIGHT edge of the
same premium WeddingSaaS collection.

Real transparent alpha.

Use a complementary natural curve, not a mirrored duplicate.

Approximately 70 percent fine sage foliage and stems,
30 percent small blush, coral, peach, ivory flowers and baby's breath.

Long airy silhouette.
Natural tapered ends.
Sparse toward the website content area.
Same lighting, realism and palette as shared-floral-branch-left.

No bouquet.
No vase.
No ribbon.
No text.
No background.
```

------------------------------------------------------------------------

## 03 --- `images/shared/florals/shared-floral-cluster-small.png`

### Used in

Templates, Pricing, responsive accents.

### Prompt

``` text
Create a small premium wedding floral accent cluster on real transparent
alpha.

One small blush garden rose,
one small coral flower,
tiny peach blossoms,
white baby's breath,
two or three muted sage leaves.

Compact but airy.
Natural irregular silhouette.
Modern editorial wedding styling.
Same exact WeddingSaaS botanical family.

Not a bridal bouquet.
No ribbon.
No vase.
No text.
No background.
```

------------------------------------------------------------------------

## 04 --- `images/shared/florals/shared-floral-sprig.png`

### Used in

Why Us, How It Works, Testimonials, Footer.

### Prompt

``` text
Create one minimal elegant wedding botanical sprig,
isolated on real transparent alpha.

Thin curved sage stem,
several small muted sage leaves,
two tiny blush/peach blossoms,
a few baby's breath buds.

Very minimal with generous negative space.
Premium modern wedding stationery style.
Same WeddingSaaS botanical family.

No bouquet.
No text.
No background.
```

------------------------------------------------------------------------

# 9. SHARED PETALS

## 05 --- `shared-petal-01.png`

``` text
One isolated soft blush rose petal, gently curved, natural delicate
texture, soft blush-coral gradient, premium wedding aesthetic,
real transparent alpha, no background, no flower, no stem.
```

## 06 --- `shared-petal-02.png`

``` text
One isolated elongated peach-blush flower petal, slightly twisted in air,
different silhouette from petal 01, subtle realistic translucency,
real transparent alpha, no background.
```

## 07 --- `shared-petal-03.png`

``` text
One small coral-pink rose petal viewed at a slight angle,
natural irregular edge, elegant soft lighting,
real transparent alpha, no background.
```

## 08 --- `shared-petal-04.png`

``` text
Two very small blush petals drifting near each other,
different rotation and size, minimal composition,
large transparent area around them, real alpha transparency.
```

## 09 --- `shared-petal-05.png`

``` text
One pale ivory-peach translucent petal,
soft organic silhouette with a subtle warm blush edge,
isolated on real transparent alpha.
```

------------------------------------------------------------------------

# 10. SHARED ACCENTS

## 10 --- `shared-ribbon-coral.png`

``` text
Create one elegant isolated satin wedding ribbon on real transparent
alpha.

Soft coral-peach compatible with #F04468 and #F6B59D.
One graceful loose S-curve.
Premium satin, delicate folds, realistic soft highlights.

Not a bow.
Not tangled.
No flowers.
No text.
No background.
```

## 11 --- `shared-wax-seal.png`

``` text
Create one premium wedding wax seal isolated on real transparent alpha.

Warm dusty coral / muted rose wax.
Round handmade edge.
Subtle embossed heart with a tiny botanical detail.
Elegant front three-quarter view.
Soft realistic depth.

No envelope.
No ribbon.
No text.
No background.
```

------------------------------------------------------------------------

# 11. SECTION 01 --- HERO

## Purpose

First impression + product understanding + conversion.

Hero receives the strongest decoration on the page.

## Folder

``` text
images/section-01-hero/
```

## Assets

``` text
s01-hero-product.png
s01-floral-left.png
s01-floral-right.png
```

Also reuse: - shared petals - optional shared ribbon/wax only if not
already integrated

------------------------------------------------------------------------

## 12 --- `s01-hero-product.png`

### Role

Main product composition on the right side.

### Prompt

``` text
Create the main Hero product composition for a premium modern
WeddingSaaS landing page.

REAL transparent alpha background.

Main object:
one elegant modern smartphone in portrait orientation,
slightly angled but clearly readable as a digital wedding invitation SaaS.

The phone interface should visually suggest:
a beautiful wedding invitation,
couple names represented with elegant short placeholder typography,
wedding date,
small floral details,
clear invitation information,
a refined CTA/action area.

Around and slightly behind the phone:
one warm ivory printed invitation card,
one soft blush envelope,
one smaller RSVP/detail card.

Add restrained details:
a small dusty coral wax seal,
a thin peach-coral satin ribbon,
a few blush/coral flowers,
white baby's breath,
muted sage leaves.

Hierarchy:
1 smartphone
2 stationery
3 floral/decorative details

Premium commercial product photography / polished realistic 3D styling.
Bright soft editorial lighting.
Airy and modern.
Not a bridal bouquet.

WeddingSaaS palette:
#F04468, #D95B70, #F6B59D, #FFF9F6, #9EAD8D.

No full background.
No people.
No logo.
No watermark.
No long readable paragraphs.
Real alpha transparency.
```

Suggested ratio: `4:5`.

------------------------------------------------------------------------

## 13 --- `s01-floral-left.png`

### Role

Hero-specific top-left floral anchor.

### Prompt

``` text
Create a premium modern romantic floral corner specifically for the
TOP-LEFT of the WeddingSaaS Hero.

REAL transparent alpha.

Arrangement enters from outside the top-left viewport and flows
diagonally downward toward the page.

Use blush garden roses, small coral roses, warm ivory flowers,
tiny peach blossoms, baby's breath and muted sage foliage.

Dense only at the extreme outer corner,
then quickly becomes sparse toward the page content.

Long elegant silhouette.
Do not form a round bouquet.
Keep the inner edge airy so it never competes with Hero heading text.

Same WeddingSaaS floral family and palette.
No vase.
No ribbon.
No text.
No background.
```

Suggested ratio: `3:5`.

------------------------------------------------------------------------

## 14 --- `s01-floral-right.png`

### Role

Secondary floral support behind/right of Hero product.

### Prompt

``` text
Create a light premium floral corner for the RIGHT side of the
WeddingSaaS Hero, isolated on real transparent alpha.

Designed to sit partially behind a smartphone/invitation product
composition.

Use the same blush, coral, peach, ivory and muted sage botanical family
as s01-floral-left.

More horizontal and lighter than the left Hero floral.
Airy stems and foliage.
No dense central bouquet.
No phone.
No invitation.
No text.
No background.
```

------------------------------------------------------------------------

# 12. SECTION 02 --- WHY WEDDINGSAAS

## Purpose

Quiet benefit section after the visually strong Hero.

## Folder

``` text
images/section-02-why-us/
```

## Assets

``` text
s02-stationery-accent.png
```

Reuse: - shared-floral-sprig - 1--3 shared petals maximum

------------------------------------------------------------------------

## 15 --- `s02-stationery-accent.png`

### Role

Small editorial stationery detail only. It should NOT become another
Hero.

### Prompt

``` text
Create a small elegant wedding stationery accent for the Why WeddingSaaS
section.

REAL transparent alpha.

Composition:
one partially visible warm ivory invitation card,
one tiny dusty coral wax seal,
a short piece of peach-coral ribbon,
one minimal sage sprig,
two or three tiny blush/peach flowers.

Small, restrained, airy and editorial.
Designed as a supporting detail near the outer edge of a spacious
benefits section.

No phone.
No large envelope.
No bouquet.
No people.
No background.
No logo.
No long readable text.
```

Suggested ratio: `4:3`.

------------------------------------------------------------------------

# 13. SECTION 03 --- TEMPLATE GALLERY

## Purpose

Show variety of actual WeddingSaaS invitation styles.

## Folder

``` text
images/section-03-templates/
```

## Assets

``` text
s03-template-romantic.png
s03-template-minimal.png
s03-template-floral.png
s03-template-modern.png
s03-template-classic.png
s03-template-elegant.png
```

These are **content assets**, not decoration.

### Important

If the application already has real usable template screenshots, prefer
those and do not generate fake replacements.

All six previews must use the **same viewport ratio** and presentation
style.

Recommended preview ratio: `3:4` portrait.

------------------------------------------------------------------------

## 16 --- `s03-template-romantic.png`

``` text
Create a polished portrait preview of a Vietnamese digital wedding
invitation template for a modern WeddingSaaS gallery.

Style: romantic blush.
Warm ivory background, subtle blush watercolor flowers, elegant serif
typography hierarchy, coral accents, refined wedding date and invitation
layout.

Show a complete premium invitation-page visual composition suitable as
a template thumbnail.

No device mockup.
No outer background.
No watermark.
Avoid long readable paragraphs.
Portrait 3:4 composition.
```

------------------------------------------------------------------------

## 17 --- `s03-template-minimal.png`

``` text
Create a polished portrait preview of a Vietnamese digital wedding
invitation template.

Style: modern minimal.
Warm ivory and white space, sophisticated dark brown serif heading,
small muted rose accent, very restrained botanical detail,
clean editorial grid.

Premium SaaS template thumbnail.
No device mockup.
No watermark.
No busy florals.
Portrait 3:4 composition.
```

------------------------------------------------------------------------

## 18 --- `s03-template-floral.png`

``` text
Create a polished portrait preview of a Vietnamese digital wedding
invitation template.

Style: botanical floral.
Airy blush, peach and muted sage florals around selected edges,
warm ivory center, elegant serif typography, refined invitation hierarchy.

Floral but not crowded.
Premium modern wedding stationery.
No device mockup.
No watermark.
Portrait 3:4 composition.
```

------------------------------------------------------------------------

## 19 --- `s03-template-modern.png`

``` text
Create a polished portrait preview of a Vietnamese digital wedding
invitation template.

Style: contemporary modern.
Editorial typography, asymmetric layout, coral accent line,
warm ivory background, minimal geometric spacing,
tiny sage botanical accent.

Clean, premium, youthful and digital-first.
No device mockup.
No watermark.
Portrait 3:4 composition.
```

------------------------------------------------------------------------

## 20 --- `s03-template-classic.png`

``` text
Create a polished portrait preview of a Vietnamese digital wedding
invitation template.

Style: timeless classic.
Warm ivory paper feel, refined serif typography,
thin muted gold border accents, tiny blush floral corner details,
balanced symmetrical layout.

Elegant, not vintage-heavy.
No device mockup.
No watermark.
Portrait 3:4 composition.
```

------------------------------------------------------------------------

## 21 --- `s03-template-elegant.png`

``` text
Create a polished portrait preview of a Vietnamese digital wedding
invitation template.

Style: premium elegant.
Ivory background, dusty rose and muted gold accents,
high-end editorial serif typography,
subtle embossed-paper feeling,
one delicate sage/blush botanical detail.

Luxurious but bright and modern.
No device mockup.
No watermark.
Portrait 3:4 composition.
```

------------------------------------------------------------------------

# 14. SECTION 04 --- HOW IT WORKS

## Purpose

Explain four steps while maintaining visual rest.

## Folder

``` text
images/section-04-how-it-works/
```

## Assets

``` text
s04-process-phone.png
```

Reuse: - shared-floral-sprig - maximum 1--2 petals

------------------------------------------------------------------------

## 22 --- `s04-process-phone.png`

### Role

Small supporting product image, not a large composition.

### Prompt

``` text
Create a clean isolated smartphone product visual for the WeddingSaaS
How It Works section.

REAL transparent alpha.

One modern portrait smartphone, mostly front-facing,
showing a simple invitation customization interface:
template preview,
small editable text fields,
color/style controls,
and a clear preview action.

The UI should look elegant, bright and easy to use,
using ivory, blush and coral WeddingSaaS colors.

No flowers attached to the phone.
No envelope.
No stationery pile.
No people.
No background.
No logo.
No watermark.
No long readable text.
```

Suggested ratio: `3:5`.

------------------------------------------------------------------------

# 15. SECTION 05 --- FEATURE SHOWCASE

## Purpose

Second strongest visual section after Hero.

## Folder

``` text
images/section-05-features/
```

## Assets

``` text
s05-feature-product.png
s05-feature-floral.png
```

------------------------------------------------------------------------

## 23 --- `s05-feature-product.png`

``` text
Create the main Feature Showcase product composition for the same
WeddingSaaS website.

REAL transparent alpha.

Use TWO elegant modern smartphone mockups.

Front phone:
show a refined digital wedding invitation homepage.

Secondary phone behind:
show another product screen such as RSVP, event information,
wedding gallery, map, timeline or guest interaction.

Add one slim warm ivory detail/invitation card behind the phones.

Use only restrained decoration:
one small dusty coral wax seal,
a few muted sage leaves,
tiny blush/peach flowers.

Do NOT repeat the Hero envelope composition.
Do NOT create a large bouquet.

Hierarchy:
phones first,
product UI second,
decorative wedding details third.

Same WeddingSaaS palette and premium commercial product styling.
Bright soft editorial light.
No people.
No background.
No logo.
No watermark.
Real transparent alpha.
```

Suggested ratio: `4:5`.

------------------------------------------------------------------------

## 24 --- `s05-feature-floral.png`

``` text
Create a medium-width low-profile floral arrangement designed to sit
behind the bottom/side of two WeddingSaaS smartphone mockups.

REAL transparent alpha.

Use blush garden roses, small coral flowers, warm ivory flowers,
peach blossoms, white baby's breath and muted sage leaves.

Horizontal flowing silhouette.
Low height.
Airy outer edges.
Center not excessively dense.

Same exact botanical family as Hero/shared florals.

No phone.
No stationery.
No ribbon.
No text.
No background.
```

Suggested ratio: `16:7`.

------------------------------------------------------------------------

# 16. SECTION 06 --- PRICING

## Purpose

Functional SaaS pricing section. Decoration must be minimal.

## Folder

``` text
images/section-06-pricing/
```

## Assets

``` text
s06-pricing-accent.png
```

------------------------------------------------------------------------

## 25 --- `s06-pricing-accent.png`

### Role

One very restrained corner detail for the whole pricing section.

### Prompt

``` text
Create a very restrained premium wedding corner accent for a SaaS
pricing section.

REAL transparent alpha.

One thin muted sage branch,
one small blush flower,
one tiny coral blossom,
a few baby's breath buds.

Long sparse silhouette with lots of transparent space.

Designed for only one outer corner of the entire pricing section,
not for individual cards.

Same WeddingSaaS visual family.
No bouquet.
No stationery.
No ribbon.
No text.
No background.
```

------------------------------------------------------------------------

# 17. SECTION 07 --- TESTIMONIALS

## Purpose

Human social proof.

## Folder

``` text
images/section-07-testimonials/
```

## Assets

``` text
s07-avatar-01.png
s07-avatar-02.png
s07-avatar-03.png
```

### Important

If real customer photos exist and permission allows their use, use them
instead.

Generated avatars are placeholders only.

They should be consistent in crop, lighting and treatment.

Recommended: square source; display as circular avatar.

------------------------------------------------------------------------

## 26 --- `s07-avatar-01.png`

``` text
Create a tasteful fictional Vietnamese wedding-couple testimonial avatar.

A young adult bride and groom together,
warm natural smiles,
bright soft daylight,
elegant modern wedding attire,
subtle warm ivory/blush environment,
premium editorial wedding photography.

Chest-up portrait suitable for a small circular testimonial avatar.
Natural and believable, not celebrity-like.
No text.
No logo.
Square composition.
```

## 27 --- `s07-avatar-02.png`

``` text
Create a second distinct fictional Vietnamese wedding-couple testimonial
avatar in the same photography style.

Young adult couple,
warm relaxed expression,
modern elegant wedding clothing,
soft natural light,
subtle neutral/blush environment.

Different faces and pose from avatar 01.
Chest-up portrait for circular crop.
No text.
No logo.
Square composition.
```

## 28 --- `s07-avatar-03.png`

``` text
Create a third distinct fictional Vietnamese wedding-couple testimonial
avatar matching the same WeddingSaaS testimonial photography treatment.

Young adult bride and groom,
gentle happy expression,
modern wedding attire,
bright soft editorial light,
warm neutral wedding environment.

Different faces and pose from avatars 01 and 02.
Chest-up portrait suitable for circular crop.
No text.
No logo.
Square composition.
```

------------------------------------------------------------------------

# 18. SECTION 08 --- FINAL CTA

## Purpose

Bring wedding emotion back strongly and close conversion.

## Folder

``` text
images/section-08-final-cta/
```

## Assets

``` text
s08-cta-stationery.png
s08-cta-floral-frame.png
```

------------------------------------------------------------------------

## 29 --- `s08-cta-stationery.png`

``` text
Create an elegant wedding stationery composition for the final CTA of
the WeddingSaaS landing page.

REAL transparent alpha.

Composition:
one premium warm ivory invitation card,
one partially visible blush envelope,
one small RSVP/detail card,
one dusty coral wax seal,
one graceful thin coral-peach satin ribbon.

Add restrained flowers around lower/side edges:
soft blush roses,
small coral flowers,
peach blossoms,
white baby's breath,
muted sage leaves.

Stationery remains the visual focus.

Bright airy premium editorial wedding photography.
Modern, romantic and refined.
Same WeddingSaaS palette and botanical family.

No phone.
No people.
No full background.
No logo.
No watermark.
Avoid long readable text.
Real transparent alpha.
```

Suggested ratio: `4:5`.

------------------------------------------------------------------------

## 30 --- `s08-cta-floral-frame.png`

``` text
Create a wide airy floral framing asset for the WeddingSaaS Final CTA.

REAL transparent alpha.

Floral growth enters from both lower outer corners,
while the center remains mostly transparent for CTA copy and button.

Left and right sides are related but naturally asymmetric.

Use blush roses, small coral garden roses, warm ivory flowers,
tiny peach blossoms, baby's breath and muted sage foliage.

Do not create a full closed border.
Do not create a dense wedding arch.
Keep the upper center open.

Designed to visually continue downward into the footer.

No text.
No stationery.
No people.
No background.
```

Suggested ratio: `16:6`.

------------------------------------------------------------------------

# 19. SECTION 09 --- FOOTER

## Purpose

Soft continuation of Final CTA, not a separate corporate footer.

## Folder

``` text
images/section-09-footer/
```

## Assets

``` text
s09-footer-floral.png
```

Also visually reuse the lower edge of `s08-cta-floral-frame.png` where
layout permits.

------------------------------------------------------------------------

## 31 --- `s09-footer-floral.png`

``` text
Create a low-density horizontal botanical decoration for the bottom edge
of the WeddingSaaS footer.

REAL transparent alpha.

Use mostly muted sage stems and leaves,
with only a few tiny blush, peach and coral flowers,
plus minimal baby's breath.

Very low profile.
Wide and airy.
Designed to appear as a continuation of the Final CTA floral system.

Do not create a flower border.
Do not make it dense.
Keep large transparent areas.

No text.
No stationery.
No background.
```

Suggested ratio: `16:4`.

------------------------------------------------------------------------

# 20. Section Asset Matrix

  Section             Dedicated files Shared assets             Visual priority
  ----------------- ----------------- ------------------------- -------------------------
  01 Hero                           3 branches/petals/accents   Very high
  02 Why Us                         1 sprig + petals            Low
  03 Templates                      6 small cluster + petals    Medium / content-driven
  04 How It Works                   1 sprig + petals            Low
  05 Features                       2 optional petals           High
  06 Pricing                        1 optional shared sprig     Low
  07 Testimonials                   3 optional sprig            Low
  08 Final CTA                      2 ribbon/wax if needed      High
  09 Footer                         1 continuation from CTA     Low

------------------------------------------------------------------------

# 21. What NOT to Generate

Do not create dedicated large floral backgrounds for:

``` text
Why Us
Templates
How It Works
Pricing
Testimonials
Footer
```

Do not create:

-   a giant full-page petal PNG
-   a separate background JPG for every section
-   flower borders around every card
-   flowers baked into pricing cards
-   flowers baked into testimonial cards
-   duplicated shared flowers under different filenames
-   large watercolor clouds as PNG when CSS can do it

------------------------------------------------------------------------

# 22. Z-Index Standard

``` text
page background          0
large decorative decor   1
floral connectors        2
petals                   3
product/content visual   5
section content          10
navbar                   20
dropdown/modal           50+
```

Flowers and petals must never cover important copy or buttons.

------------------------------------------------------------------------

# 23. Absolute vs Normal Layout

## Use absolute positioning

For:

``` text
shared floral branches
section floral accents
petals
CTA floral frame
footer floral
decorative stationery accent
```

## Keep in normal Grid/Flex layout

For:

``` text
s01-hero-product.png
template previews
s04-process-phone.png
s05-feature-product.png
testimonial avatars
s08-cta-stationery.png when treated as a main CTA visual
```

A major product/content image is content, not decoration.

------------------------------------------------------------------------

# 24. Responsive Image Rules

## Desktop

-   floral branches may extend `40–120px` outside viewport
-   major product visual can occupy \~45--55% of section width
-   petals remain sparse

## Tablet

-   reduce decorative assets by \~20--30%
-   preserve product image readability
-   reduce petal count

## Mobile

Priority:

``` text
content
> product visual
> essential floral accent
> petals
```

Rules:

-   reduce floral scale by 40--60%
-   remove at least half desktop petals
-   hide decorations that collide with content
-   do not use desktop absolute coordinates unchanged
-   never cause horizontal scrolling
-   template previews remain legible
-   product phone should not become tiny merely to preserve flowers

------------------------------------------------------------------------

# 25. Asset Quality Gate

Every generated file must pass:

``` text
[ ] Filename exactly matches this plan
[ ] Saved in exact planned folder
[ ] Same WeddingSaaS palette
[ ] Same visual family
[ ] Real transparency where required
[ ] No checkerboard baked in
[ ] No watermark/logo
[ ] No accidental random text
[ ] Main subject not cropped badly
[ ] Enough transparent/negative space
[ ] No excessive flower density
[ ] Clear purpose in a specific section
[ ] Works on ivory/blush page background
```

If it fails, regenerate before implementation.

------------------------------------------------------------------------

# 26. Review Gates

Do not blindly generate all assets at once.

### Gate A --- after images 01--04

Review floral family.

### Gate B --- after images 12--14

Review full Hero composition.

### Gate C --- after images 16--21

Review template variety and consistency.

### Gate D --- after images 23--24

Review Feature section visual against Hero to ensure it is related but
not duplicated.

### Gate E --- after images 29--31

Review CTA → Footer continuity.

Only then finalize page decoration.

------------------------------------------------------------------------

# 27. Implementation Order

After assets are approved:

``` text
01 global page canvas + design tokens
02 Hero
03 Why WeddingSaaS
04 Template Gallery
05 How It Works
06 Feature Showcase
07 Pricing
08 Testimonials
09 Final CTA
10 Footer
11 cross-section floral connectors
12 petals LAST
13 responsive pass
14 decoration reduction pass
15 production build
```

Petals are intentionally implemented last.

------------------------------------------------------------------------

# 28. Codex Instruction

Use this when handing implementation to Codex:

``` text
Read these files first:

docs/WeddingSaaS-Design-System.md
docs/WeddingSaaS-Master-Image-Plan.md

They are the source of truth.

Do not rename image assets.
Do not move assets between folders without updating the master plan.
Do not create new image filenames when an existing planned asset serves
the same role.

The landing page contains 9 sections but must look like one continuous
visual canvas.

Use section-specific images only in their matching section.
Use shared assets from images/shared for cross-section decoration.

Decorative assets should normally be absolutely positioned.
Product/content visuals should remain in Grid/Flex layout.

Do not add wave separators.
Do not create hard section background changes.
Do not make every section a card collection.
Do not create a new floral style per section.
Do not add colors outside the locked design system without approval.

Preserve routes, authentication, application logic and backend behavior.

After implementation:
- run production build
- check desktop
- check tablet
- check 375px mobile
- verify no horizontal overflow
- report files changed
```

------------------------------------------------------------------------

# 29. Final Summary

Planned system:

``` text
Shared visual system        11 files
Section-specific/content    20 required files
Optional reserve             3 files
--------------------------------------
Maximum planned             34 files
Required before optional    31 files
```

Required section distribution:

``` text
S01 Hero             3
S02 Why Us           1
S03 Templates        6
S04 How It Works     1
S05 Features         2
S06 Pricing          1
S07 Testimonials     3
S08 Final CTA        2
S09 Footer           1
```

The image system must support the design hierarchy:

``` text
Hero             strong
Why Us           quiet
Templates        content-rich
How It Works     quiet
Features         strong
Pricing          clean
Testimonials     human + quiet
Final CTA        strong
Footer           soft continuation
```

**Final rule:** Do not add an image just to fill empty space. Whitespace
is part of the WeddingSaaS design.
