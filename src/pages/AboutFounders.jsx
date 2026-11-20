import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// /about: "About the Founders" (the BNC Global founders site, copied from the
// Universe One onboarding module into public/about-founders). It runs in an
// iframe so its own smooth scrolling, pinned sections and 3D globe keep working.
// Its closing "Continue" button opens /about/company.
export default function AboutFounders() {
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef(null);
  const navigate = useNavigate();

  // show "Continue to About the Company"; "Mark as read" only applies inside onboarding
  function sync() {
    const win = frameRef.current?.contentWindow;
    if (!win) return;
    win.postMessage({ source: 'ob-shell', isRead: false, nextTitle: 'About the Company', hasNext: true }, window.location.origin);
    const read = win.document?.getElementById('obRead');
    if (read) read.style.display = 'none';
  }

  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== window.location.origin || e.source !== frameRef.current?.contentWindow || e.data?.source !== 'ob-founders') return;
      if (e.data.type === 'ready') sync();
      if (e.data.type === 'next') navigate('/about/company');
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [navigate]);

  return (
    <section aria-label="About the Founders" className="relative -mt-20 w-full bg-white">
      <h1 className="sr-only">About the Founders — CA Summit Goyal and CA Gurvinder Pal Singh</h1>
      {!loaded ? (
        <div className="absolute inset-0 grid place-items-center">
          <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#1d1d1f] border-t-transparent" aria-label="Loading" />
        </div>
      ) : null}
      <iframe
        ref={frameRef}
        src="/about-founders/index.html"
        title="About the Founders"
        onLoad={() => { setLoaded(true); sync(); }}
        className={`block h-[100svh] w-full border-0 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </section>
  );
}
