'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { scrollToContact } from '@/hooks/scrollToContact';


const HashScroll = () => {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash !== '#contact') return;

    let cancelled = false;
    requestAnimationFrame(() => {
      if (cancelled) return;
      scrollToContact(lenis);
    });

    return () => {
      cancelled = true;
      document.documentElement.classList.remove('programmatic-scroll');
    };
  }, [pathname, lenis]);

  return null;
};

export default HashScroll;
