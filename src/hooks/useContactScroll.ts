'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLenis } from 'lenis/react';

const useContactScroll = () => {
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();

  const goToContact = useCallback(() => {
    if (pathname === '/') {
      window.history.replaceState(null, '', '/#contact');
      window.dispatchEvent(new Event('hashchange'));
      if (lenis) {
        lenis.scrollTo('#contact', { offset: -24 });
      } else {
        document
          .getElementById('contact')
          ?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    router.push('/#contact');
  }, [pathname, router, lenis]);

  return goToContact;
};

export default useContactScroll;
