'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const useHash = () => {
  const pathname = usePathname();
  const [hash, setHash] = useState('');

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [pathname]);

  return hash;
};

export default useHash;
