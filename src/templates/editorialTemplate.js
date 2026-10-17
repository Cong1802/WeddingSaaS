/** Synchronize the editable fields of template 6 in both editor and guest views. */
export function syncEditorialTemplate(doc, data, setData) {
  if (doc.documentElement.dataset.template !== 'editorial-burgundy') return;
  doc.querySelectorAll('[data-card-field]').forEach(element => {
    const field = element.dataset.cardField;
    if (data[field] && doc.activeElement !== element && element.textContent !== data[field]) {
      element.textContent = data[field];
    }
    if (setData) {
      element.contentEditable = 'true';
      element.oninput = () => setData(previous => ({ ...previous, [field]: element.innerText }));
    }
  });
  const hero = doc.querySelector('#IMAGE3');
  if (hero && data.heroImage) hero.src = data.heroImage;
  const map = doc.querySelector('[data-card-link="groomMapUrl"]');
  if (map) {
    map.href = data.groomMapUrl && data.groomMapUrl !== 'https://maps.google.com'
      ? data.groomMapUrl
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.groomAddress || '')}`;
  }
}
