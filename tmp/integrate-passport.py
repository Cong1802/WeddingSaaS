from pathlib import Path
for filename, data, setter in [('WeddingCardPreview.jsx','cardData',', setCardData'),('GuestCardViewer.jsx','card_data','')]:
 p=Path('src/components')/filename
 s=p.read_text(encoding='utf-8-sig')
 s="import { syncPassportTemplate } from '../templates/passportTemplate';\n"+s
 marker='      // Template 01 & Standard Selectors'
 s=s.replace(marker,f'      syncPassportTemplate(doc, {data}{setter});\n\n'+marker,1)
 p.write_text(s,encoding='utf-8')
