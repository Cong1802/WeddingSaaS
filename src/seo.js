export const landingSeo = {
  url: 'https://weddingsaas.online/',
  title: 'Tạo thiệp cưới online đẹp, dễ tùy chỉnh | WeddingSaaS',
  description: 'Tạo thiệp cưới online với mẫu thiệp đẹp, tùy chỉnh ảnh và lời mời. Chia sẻ qua Zalo, Facebook, hỗ trợ RSVP và mã QR theo gói tại WeddingSaaS.',
};

export function updateSeo(page, guest, settings = {}) {
  const url = document.head.querySelector('meta[name="seo-base-url"]')?.content || landingSeo.url;
  const landingTitle = document.head.querySelector('meta[name="seo-landing-title"]')?.content || landingSeo.title;
  const description = settings.site_description && settings.site_description !== 'Nền tảng tạo thiệp cưới online cao cấp, thiết kế đẹp mắt, nhận mừng cưới tự động VietQR, gửi lời chúc & album ảnh cưới.' ? settings.site_description : landingSeo.description;
  const home = page === 'landing' && !guest && !new URLSearchParams(window.location.search).has('reset_token');
  const title = home ? landingTitle : page === 'templates' ? 'Mẫu thiệp cưới online | WeddingSaaS' : 'WeddingSaaS';
  document.title = title;
  const meta = (name, content, property = false) => {
    const attribute = property ? 'property' : 'name';
    let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    element.content = content;
  };
  meta('description', description);
  meta('robots', home ? 'index, follow, max-image-preview:large' : 'noindex, follow');
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (home) {
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
    meta('og:title', title, true);
    meta('og:description', description, true);
    meta('og:url', url, true);
    meta('og:type', 'website', true);
    meta('og:locale', 'vi_VN', true);
    meta('og:site_name', 'WeddingSaaS', true);
    meta('og:image', `${url}seo/thiep-cuoi-online.jpg`, true);
    meta('twitter:card', 'summary_large_image');
    meta('twitter:title', title);
    meta('twitter:description', description);
    meta('twitter:image', `${url}seo/thiep-cuoi-online.jpg`);
  } else {
    canonical?.remove();
    document.head.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(element => element.remove());
  }
  const schema = document.getElementById('landing-schema');
  if (schema) schema.type = home ? 'application/ld+json' : 'application/json';
  if (settings.site_favicon) document.head.querySelector('link[rel="icon"]').href = settings.site_favicon;
}
