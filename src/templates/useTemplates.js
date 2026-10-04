import { useEffect, useState } from 'react';

export const normalizeTemplate = template => ({
  ...template,
  databaseId: template.id,
  id: template.code,
  fileUrl: template.file_url || '/template.html',
});

export default function useTemplates() {
  const [templates, setTemplates] = useState([]);
  useEffect(() => {
    let active = true;
    const load = () => fetch('/api/public/templates', { headers: { Accept: 'application/json' } })
      .then(response => { if (!response.ok) throw new Error('Unable to load templates'); return response.json(); })
      .then(data => { if (active && data.success) setTemplates(data.templates.map(normalizeTemplate)); })
      .catch(error => console.error(error));
    load();
    window.addEventListener('templates-updated', load);
    return () => { active = false; window.removeEventListener('templates-updated', load); };
  }, []);
  return templates;
}
