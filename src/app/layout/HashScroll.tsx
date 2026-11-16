'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';

/** Scroll to hash targets (e.g. /#contact) after client navigation. */
const HashScroll = () => {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.slice(1);
    const timer = window.setTimeout(() => {
      if (lenis) {
        lenis.scrollTo(hash, { offset: -24 });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 80);

    return () => window.clearTimeout(timer);
  }, [pathname, lenis]);

  return null;
};

export default HashScroll;
