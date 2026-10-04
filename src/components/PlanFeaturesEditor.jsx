import { useEffect, useRef, useState } from 'react';

let scriptPromise;
function loadTinyMCE() {
  if (window.tinymce) return Promise.resolve(window.tinymce);
  if (!scriptPromise) scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.tiny.cloud/1/az09l5hhv4r2bolg5fnhgy1vju0dri2amq12cvtmovqeeb52/tinymce/8/tinymce.min.js';
    script.referrerPolicy = 'origin';
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve(window.tinymce);
    script.onerror = () => { script.remove(); scriptPromise = null; reject(new Error('Không tải được TinyMCE. Bạn có thể nhập tính năng ở ô bên dưới.')); };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export default function PlanFeaturesEditor({ value, onChange }) {
  const target = useRef(null);
  const instance = useRef(null);
  const change = useRef(onChange);
  const initial = useRef(value);
  const [error, setError] = useState('');
  change.current = onChange;

  useEffect(() => {
    let disposed = false;
    loadTinyMCE().then(tiny => {
      if (disposed) return;
      return tiny.init({
        target: target.current,
        height: 280, menubar: false, skin: 'oxide-dark', content_css: 'dark',
        toolbar: 'undo redo | bold italic underline strikethrough | removeformat',
        branding: false, promotion: false,
        valid_elements: 'p,br,strong,b,em,i,u,s',
        placeholder: 'Link tĩnh riêng biệt 12 tháng\nTự động mừng cưới VietQR',
        setup(editor) {
          instance.current = editor;
          editor.on('init', () => {
            if (disposed) { editor.remove(); return; }
            const html = initial.current.split('\n').map(line => {
              const container = document.createElement('div');
              if (/<\/?(?:strong|b|em|i|u|s|br)\b/i.test(line)) container.innerHTML = line;
              else container.textContent = line;
              return `<p>${container.innerHTML || '<br>'}</p>`;
            }).join('');
            editor.setContent(html);
          });
          editor.on('input change undo redo', () => {
            const document = new DOMParser().parseFromString(editor.getContent(), 'text/html');
            const lines = [...document.body.children].map(node => node.innerHTML).filter(line => line.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim());
            change.current(lines.join('\n'));
          });
        },
      });
    }).catch(e => { if (!disposed) setError(e.message); });
    return () => { disposed = true; instance.current?.remove(); instance.current = null; };
  }, []);

  return <div>
    {error && <p role="alert" style={{ color: '#fbbf24', fontSize: 12 }}>{error}</p>}
    <textarea ref={target} aria-label="Danh sách tính năng" defaultValue={value} onChange={event => onChange(event.target.value)} style={{ width: '100%', minHeight: 150, background: '#090d16', color: '#fff', padding: 12, borderRadius: 10 }} />
  </div>;
}
