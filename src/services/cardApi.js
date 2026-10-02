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

  // 2. Attempt to save to Laravel REST API backend
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/cards/save', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        slug: cleanSlug,
        card_url: data.card_url || `${window.location.origin}/v/${cleanSlug}`,
        isBackendSaved: true
      };
    }
  } catch (err) {
    console.log('Laravel Backend API not connected yet, using local URL:', err);
  }

  const baseUrl = window.location.origin;
  return {
    success: true,
    slug: cleanSlug,
    card_url: `${baseUrl}/v/${cleanSlug}`,
    isBackendSaved: false
  };
};

export const getCardBySlug = async (slug) => {
  if (!slug) return null;

  // 1. Try fetching from Laravel REST API backend
  try {
    const response = await fetch(`/api/cards/view/${slug}`);
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.card_data) {
        return {
          template_id: data.template_id,
          card_data: data.card_data,
          slug: slug
        };
      }
    }
  } catch (err) {
    console.log('Backend API fetch fallback to LocalStorage:', err);
  }

  // 2. Fallback to LocalStorage DB
  try {
    const existingDb = JSON.parse(localStorage.getItem('wedding_cards_db') || '{}');
    if (existingDb[slug]) {
      return {
        template_id: existingDb[slug].template_id,
        card_data: existingDb[slug].card_data,
        slug: slug
      };
    }
  } catch (err) {
    console.warn('LocalStorage fetch error:', err);
  }

  return null;
};
