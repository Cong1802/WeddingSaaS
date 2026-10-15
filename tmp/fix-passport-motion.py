from pathlib import Path
for root in ['public/templates/passport','laravel-backend/public/templates/passport']:
 p=Path(root)/'assets/passport.js';s=p.read_text(encoding='utf-8');s=s.replace("  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;\n  if (!reducedMotion) {", "  // This invitation explicitly enables the visual effects requested for this design.\n  {")
 p.write_text(s,encoding='utf-8')
 p=Path(root)/'index.html';s=p.read_text(encoding='utf-8');s=s.replace('@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}','').replace('@media(prefers-reduced-motion:reduce){#passport-IMAGE103{display:none}}','').replace('@media(prefers-reduced-motion:reduce){.passport-particles{display:none}#passport-IMAGE6{animation:none}}','');s=s.replace('./assets/passport.js"','./assets/passport.js?v=20261014-effects-3"');p.write_text(s,encoding='utf-8')
p=Path('tmp/verify-passport.mjs');s=p.read_text(encoding='utf-8-sig').replace("url.slice(2)","url.split('?')[0].slice(2)");p.write_text(s,encoding='utf-8')
p=Path('tmp/verify-passport-effects.mjs');s=p.read_text(encoding='utf-8-sig').replace('window.innerWidth=420;','window.innerWidth=420; window.matchMedia = () => ({matches:true});');p.write_text(s,encoding='utf-8')
