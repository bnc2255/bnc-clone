// Adds a stylesheet <link> once, on demand. Used for fonts that only some pages
// need, so they stay off the critical path of every other page.
export function loadStylesheet(href) {
  if (typeof document === 'undefined') return;
  if (document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

export const ARABIC_FONT_CSS = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap';
export const ICON_FONT_CSS = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
