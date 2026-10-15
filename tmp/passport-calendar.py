from pathlib import Path
p=Path('src/templates/passportTemplate.js');s=p.read_text(encoding='utf-8');s=s.replace("(data.weddingDate || '').match(/(\\d{1,2})[./-](\\d{1,2})[./-](\\d{4})/)","(data.weddingDate || '').replace(/\\s/g, '').match(/(\\d{1,2})[./-](\\d{1,2})[./-](\\d{4})/)");p.write_text(s,encoding='utf-8')
for root in ['public/templates/passport','laravel-backend/public/templates/passport']:
 p=Path(root)/'assets/passport.js';s=p.read_text(encoding='utf-8-sig')
 s=s.replace("const match = text.match", "const match = text.replace(/\\s/g, '').match")
 s=s.replace("    const seconds =", """    const calendar = byId('SECTION2')?.querySelector('.ladi-container');
    if (calendar && date && calendar.dataset.date !== text) {
      calendar.dataset.date = text;
      const year = date.getFullYear(), month = date.getMonth();
      const offset = (new Date(year, month, 1).getDay() + 6) % 7;
      const days = new Date(year, month + 1, 0).getDate();
      calendar.innerHTML = `<div style="padding:30px 28px;color:#735b33;text-align:center"><h3 style="font-size:26px;margin:0 0 24px">Tháng ${month + 1} - ${year}</h3><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:12px;font-size:16px">${['T2','T3','T4','T5','T6','T7','CN'].map(day => `<b>${day}</b>`).join('')}${'<span></span>'.repeat(offset)}${Array.from({length:days}, (_,i) => `<span style="padding:8px 0;${i+1 === date.getDate() ? 'background:#a78950;color:white;border-radius:50%' : ''}">${i+1}</span>`).join('')}</div></div>`;
    }
    const seconds =""")
 p.write_text(s,encoding='utf-8')
