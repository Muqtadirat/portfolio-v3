'use client';

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { scrollToContact } from './scrollToContact';

const useContactScroll = () => {
  const pathname = usePathname();
  const lenis = useLenis();

  const goToContact = useCallback(() => {
    const path = pathname || '/';
    // Footer #contact exists on every page — stay on current route
    window.history.replaceState(null, '', `${path}#contact`);
    window.dispatchEvent(new Event('hashchange'));
    scrollToContact(lenis);
  }, [pathname, lenis]);

  return goToContact;
};

export default useContactScroll;
