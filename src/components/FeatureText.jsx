import { createElement } from 'react';

// Render only basic inline formatting, including for legacy unsanitized records.
export default function FeatureText({ text }) {
  const document = new DOMParser().parseFromString(String(text), 'text/html');
  const allowed = new Set(['strong', 'b', 'em', 'i', 'u', 's', 'br']);
  const render = (node, key) => {
    if (node.nodeType === 3) return node.textContent;
    const tag = node.nodeName.toLowerCase();
    if (['script', 'style', 'iframe', 'object'].includes(tag)) return null;
    const children = [...node.childNodes].map((child, index) => render(child, `${key}-${index}`));
    if (!allowed.has(tag)) return children;
    return createElement(tag, { key }, tag === 'br' ? undefined : children);
  };
  return [...document.body.childNodes].map((node, index) => render(node, index));
}
