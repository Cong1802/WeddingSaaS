/**
 * Wedding Card SaaS API Service
 * Supports saving & fetching card data from Laravel Backend API (/api/cards/...)
 * with LocalStorage fallback.
 */

export const saveCardToApi = async (rawSlug, templateId, cardData, token = null) => {
  const cleanSlug = (rawSlug || 'thiep-cuoi')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const payload = {
    slug: cleanSlug,
    template_id: templateId,
    card_data: cardData,
    updated_at: new Date().toISOString()
  };

  // 1. Always save to LocalStorage DB for instant offline availability
  try {
    const existingDb = JSON.parse(localStorage.getItem('wedding_cards_db') || '{}');
    existingDb[cleanSlug] = payload;
    localStorage.setItem('wedding_cards_db', JSON.stringify(existingDb));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }

  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch('/api/cards/save', { method: 'POST', headers, body: JSON.stringify(payload) });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(Object.values(data.errors || {}).flat()[0] || data.message || 'Could not save the card. Please sign in and try again.');
  }
  return { success: true, slug: data.slug || cleanSlug, card_url: data.card_url, isBackendSaved: true };
};

export const getCardBySlug = async (slug) => {
  if (!slug) return null;

  // 1. Try fetching from Laravel REST API backend
  try {
    const response = await fetch(`/api/cards/view/${slug}`);
    if (response.status === 410) {
      const data = await response.json();
      return { locked: true, message: data.message };
    }
    if (response.status === 404) return null;
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.card_data) {
        return {
          template_id: data.template_id,
          template: data.template,
          card_data: data.card_data,
          slug: slug
        };
      }
    }
  } catch (err) {
    console.warn('Unable to verify public card access:', err);
  }

  return null;
};
