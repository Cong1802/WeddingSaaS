export const ADMIN_MODULES = ['dashboard', 'templates', 'users', 'plans', 'orders', 'cards', 'music', 'settings'];

export function pageFromLocation(location = window.location) {
  const params = new URLSearchParams(location.search);
  if (/^\/admin(?:\/|$)/.test(location.pathname) || params.get('page') === 'admin' || params.has('admin') || /^#admin(?:$|[-/])/.test(location.hash)) return 'admin';
  if (location.pathname === '/editor') return 'editor';
  if (location.pathname === '/my-cards') return 'my-cards';
  return 'landing';
}

export function adminModuleFromLocation(location = window.location) {
  const module = location.pathname.replace(/\/$/, '').split('/')[2];
  if (ADMIN_MODULES.includes(module)) return module;
  const legacy = location.hash.replace(/^#(?:admin[-/])?/, '');
  return ADMIN_MODULES.includes(legacy) ? legacy : 'dashboard';
}

export function pathForPage(page) {
  return ({ admin: '/admin/dashboard', editor: '/editor', 'my-cards': '/my-cards', landing: '/' })[page] || '/';
}
