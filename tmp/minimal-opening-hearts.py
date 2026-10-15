from pathlib import Path
for root in ['public/templates/minimalism_red','laravel-backend/public/templates/minimalism_red']:
 p=Path(root)/'opening.js';s=p.read_text(encoding='utf-8-sig').replace('  let opened = false;', '''  let opened = false;
  for (let index = 0; index < 14; index++) {
    const heart = document.createElement('span');
    heart.className = 'minimal-opening-heart';heart.textContent = '♥';
    heart.setAttribute('aria-hidden', 'true');
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDelay = -Math.random() * 12 + 's';
    heart.style.color = index % 3 ? '#b12732' : '#f8efe6';
    gate.appendChild(heart);
  }''');p.write_text(s,encoding='utf-8')
 p=Path(root)/'opening.css';s=p.read_text(encoding='utf-8-sig');s+='\n.minimal-opening-card{z-index:2}.minimal-opening-heart{position:absolute;top:-30px;font-size:18px;opacity:.8;pointer-events:none;animation:minimal-heart-fall 12s linear infinite}@keyframes minimal-heart-fall{from{transform:translateY(-30px) rotate(0)}to{transform:translateY(110vh) rotate(60deg)}}\n';p.write_text(s,encoding='utf-8')
