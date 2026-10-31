# Royal butterflies — burgundy and antique gold

- Final GIF: `laravel-backend/public/templates/mau-thiep-8/assets/royal-butterflies-burgundy-gold-v1.gif`
- Animated WebP: `laravel-backend/public/templates/mau-thiep-8/assets/royal-butterflies-burgundy-gold-v1.webp`
- Color reference PNG: `laravel-backend/public/templates/mau-thiep-8/assets/royal-butterflies-burgundy-gold-reference-v1.png`
- Final animated assets are also copied into `public/templates/mau-thiep-8/assets` and `laravel-backend/public/dist/templates/mau-thiep-8/assets`.
- Final animation: 768 × 432 px, 156 frames, 5,200 ms, transparent background, infinite loop. The original frame timings and butterfly movement are preserved.
- Source: `laravel-backend/public/templates/mau-thiep-2/w.ladicdn.com/644bd195fdccd700206206ea/imgi_8_thiet-ke-chua-co-ten-1-20260614052835-lwso_-20260827085346-mytm-.gif` (unchanged).

## Creation method

Built-in imagegen created the transparent burgundy/gold color-reference artwork from the first source frame. The final animated assets retain the original butterfly geometry and motion, with their GIF color table recolored from the generated reference palette. Sharp then resizes and encodes the output GIF and animated WebP, preserving frame delays and transparency.

Generator and verification: `tmp/gif-reference/create-royal-butterflies.mjs`.

## Exact imagegen prompt

Use case: precise-object-edit. Asset type: transparent watercolor butterfly art used as a color reference for recoloring an existing wedding GIF. Edit ONLY the colors of the two butterflies in the supplied transparent 1536x864 reference image. Preserve the EXACT number (two), left/right positions, sizes, orientations, silhouettes, wing shapes, antennae, fine watercolor grain and delicate wing veins; preserve all transparent negative space. Change sage green wings into elegant deep burgundy / dark wine red (#7a1f26, #a8323b, #650e17), with restrained warm antique-gold (#c9a24a) veins and champagne/ivory highlights (#ece4d8). Both butterflies should read as burgundy-red butterflies accented with gold, matching a royal burgundy and ivory Vietnamese wedding invitation. Keep the airy watercolor character and translucent-looking delicate wings, not metallic, not plastic or solid silhouettes. No new objects, no extra butterflies, no flowers, no lettering, no glitter or particles, no background scene, no checkerboard painted into the image, no black or white background. The canvas must have real alpha transparency.
