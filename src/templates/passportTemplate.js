/** Keep repeated passport labels synchronized without depending on publisher scripts. */
export function syncPassportTemplate(doc, data, setData) {
  if (doc.documentElement.dataset.template !== 'passport') return;
  doc.querySelectorAll('[data-card-field]').forEach(element => {
    const field = element.dataset.cardField;
    if (data[field] && doc.activeElement !== element) element.textContent = data[field];
    if (setData) {
      element.contentEditable = 'true';
      element.oninput = () => setData(previous => ({ ...previous, [field]: element.innerText }));
    }
  });
  const images = { heroImage: '#IMAGE3', groomPhoto: '#passport-IMAGE49', bridePhoto: '#passport-IMAGE47' };
  Object.entries(images).forEach(([field, selector]) => {
    if (!data[field]) return;
    doc.querySelectorAll(`${selector} .ladi-image-background`).forEach(element => {
      element.style.backgroundImage = `url(${JSON.stringify(data[field])})`;
    });
  });
  const month = doc.querySelector('#passport-PARAGRAPH10 .ladi-paragraph');
  const match = (data.weddingDate || '').replace(/\s/g, '').match(/(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
  if (month && match) month.textContent = `Tháng ${match[2]} - ${match[3]}`;
}

