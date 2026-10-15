from pathlib import Path
for root in ['public/templates/passport','laravel-backend/public/templates/passport']:
 p=Path(root)/'assets/passport.js';s=p.read_text(encoding='utf-8')
 s=s.replace("  const open = () => {", """  const plane = byId('IMAGE103');
  if (plane) { plane.style.animation = 'none'; plane.style.visibility = 'hidden'; }
  let opened = false;
  const open = () => {
    if (opened) return;
    opened = true;""")
 s=s.replace("    invitation.classList.add('selected');", """    invitation.classList.add('selected');
    if (plane) {
      plane.style.visibility = 'visible';
      plane.style.animation = 'passport-takeoff 4s ease-in-out forwards';
      plane.addEventListener('animationend', () => { plane.style.visibility = 'hidden'; }, { once: true });
    }""")
 s=s.replace("      calendar.innerHTML =", """      let grid = calendar.querySelector('[data-passport-calendar]');
      if (!grid) {
        // Keep the airplane and decorative images in the original section.
        for (let index = 10; index <= 40; index++) {
          const label = byId('PARAGRAPH' + index);
          if (label) label.style.display = 'none';
        }
        if (byId('IMAGE10')) byId('IMAGE10').style.display = 'none';
        grid = document.createElement('div');
        grid.dataset.passportCalendar = 'true';
        grid.style.cssText = 'position:absolute;top:60px;left:0;width:100%';
        calendar.appendChild(grid);
      }
      grid.innerHTML =""")
 p.write_text(s,encoding='utf-8')
 p=Path(root)/'index.html';s=p.read_text(encoding='utf-8');s=s.replace('</head>', '''<style>
#passport-IMAGE103{z-index:50;pointer-events:none;animation:none;visibility:hidden;will-change:transform}
@keyframes passport-takeoff{0%{transform:translateY(0)}100%{transform:translateY(-2000px)}}
@media(prefers-reduced-motion:reduce){#passport-IMAGE103{display:none}}
</style></head>''');p.write_text(s,encoding='utf-8')
