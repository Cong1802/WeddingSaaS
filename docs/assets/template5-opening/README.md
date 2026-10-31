# Template 5 photographic opening

Created with the built-in `image_gen` tool using the existing `opening-save-the-date.png` as the visual reference. Four independent transparent components were generated; names, dates, ticket lettering and the open button remain HTML.

The exact final prompts are saved in [prompts.json](prompts.json). Original generated PNGs are preserved in this directory.

Runtime assets in `laravel-backend/public/templates/mau-thiep-5/assets/`:

- `opening-envelope-real-v1.webp`: kraft envelope with antique gold interlocked-heart wax seal.
- `opening-card-real-v1.webp`: ivory cotton card, real flax bow, heart charm and airplane tag.
- `opening-flowers-real-v1.webp`: ivory flowers, olive leaves and champagne satin ribbon.
- `opening-ticket-real-v1.webp`: textured warm gold boarding ticket.
- `opening-paper-real-v1.webp`: optimized version of the existing stationery paper background.

Layout and responsive sizing are in `opening-realistic.css`. The paper and composition cover the full phone screen with the open button placed near the bottom. Desktop uses a centered paper column at full viewport height. The scene keeps the cream–gold composition, separate couple photos and editable copy. Opening uses an 850 ms opacity transition. The existing invitation, replay button and ambient effects are preserved.

Validation: Chrome at 393×852, 320×640, 393×640, 1440×900 and 852×393; paper covers the full opening height and full portrait phone width, artwork loads, opening has no scroll, the open button fits and does not overlap the card, intermediate fade frames are visible, opening unlocks the invitation, replay works, and no script exceptions occur.
