from pathlib import Path
for root in ['public/templates/passport','laravel-backend/public/templates/passport']:
 p=Path(root)/'index.html';s=p.read_text(encoding='utf-8');s=s.replace('<html ', '<html data-passport-state="closed" ',1)
 s=s.replace('</head>', '''<style id="passport-open-gate">
html[data-passport-state="closed"],html[data-passport-state="closed"] body{overflow:hidden!important;overscroll-behavior:none; height:100%}
html[data-passport-state="closed"] .ladi-wraper>.ladi-section:not(#passport-SECTION1){visibility:hidden;pointer-events:none}
html[data-passport-state="closed"] #passport-SECTION1{height:100vh!important;overflow:hidden}
</style></head>''').replace('rsvp-5','open-gate-6');p.write_text(s,encoding='utf-8')
 p=Path(root)/'assets/passport.js';s=p.read_text(encoding='utf-8')
 s=s.replace("  let opened = false;", """  let opened = false;
  document.documentElement.dataset.passportState = 'closed';
  window.scrollTo?.(0, 0);
  const preventClosedScroll = event => {
    if (!opened) event.preventDefault();
  };
  document.addEventListener('wheel', preventClosedScroll, { passive: false });
  document.addEventListener('touchmove', preventClosedScroll, { passive: false });
  const preventClosedKeys = event => {
    if (!opened && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)
      && event.target !== byId('T01')) event.preventDefault();
  };
  document.addEventListener('keydown', preventClosedKeys);
""")
 s=s.replace("    opened = true;", """    opened = true;
    document.documentElement.dataset.passportState = 'open';
    document.removeEventListener('wheel', preventClosedScroll);
    document.removeEventListener('touchmove', preventClosedScroll);
    document.removeEventListener('keydown', preventClosedKeys);
    window.scrollTo?.(0, 0);""")
 p.write_text(s,encoding='utf-8')
