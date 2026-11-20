import { useLayoutEffect, useRef, useState } from 'react';

// True when the element is already on screen as the page opens. Scroll-reveal
// components use it to show first-screen content straight away (a quick fade on
// load) instead of waiting for a scroll that never needs to happen.
export function useFirstScreen() {
  const ref = useRef(null);
  const [first, setFirst] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) setFirst(true);
  }, []);
  return [ref, first];
}
