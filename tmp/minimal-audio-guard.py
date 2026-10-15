from pathlib import Path
for root in ['public/templates/minimalism_red','laravel-backend/public/templates/minimalism_red']:
 p=Path(root)/'opening.js';s=p.read_text(encoding='utf-8').replace('audio?.play()?.catch','audio?.play?.()?.catch');p.write_text(s,encoding='utf-8')
