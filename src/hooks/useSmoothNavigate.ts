'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { scrollToTop } from './scrollToContact';

const clearHash = () => {
  if (!window.location.hash) return;
  window.history.replaceState(null, '', window.location.pathname);
  window.dispatchEvent(new Event('hashchange'));
};

const useSmoothNavigate = () => {
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();

  const goHome = useCallback(() => {
    if (pathname === '/') {
      scrollToTop(lenis);
      clearHash();
      return;
    }

    scrollToTop(lenis, () => {
      clearHash();
      router.push('/');
    });
  }, [pathname, router, lenis]);

  const goTo = useCallback(
    (href: string) => {
      if (href === '/' || href === '') {
        goHome();
        return;
      }

  
      if (pathname === href) {
        scrollToTop(lenis);
        clearHash();
        return;
      }


      const scrolled =
        (lenis?.scroll ?? window.scrollY) > 80 || window.location.hash === '#contact';

      if (scrolled) {
        scrollToTop(lenis, () => {
          clearHash();
          router.push(href);
        });
        return;
      }

      clearHash();
      router.push(href);
    },
    [goHome, pathname, router, lenis],
  );

  return { goHome, goTo };
};

export default useSmoothNavigate;
