'use client';

import { logo } from '@/assets';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import navLinks from './navLinks';
import Hamburger from 'hamburger-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ThemeToggle, useTheme } from '@/components';

interface MobileNavProps {
  pathname: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ pathname }) => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const lenis = useLenis();

  const handleLinkClick = (href: string) => {
    setShowMenu(false);
    router.push(href);
  };

  useEffect(() => {
    if (!showMenu) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lenis?.stop();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMenu(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prev;
      lenis?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [showMenu, lenis]);

  return (
    <nav className="block lg:hidden fixed top-0 z-50 left-1/2 transform -translate-x-1/2 w-full max-w-[1232px] px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 rounded-sm bg-background-default text-text-default">
      <div className="flex justify-between items-center">
        <Image src={logo} alt="Muqtadirat" className="dark:invert" />

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Hamburger
            toggled={showMenu}
            toggle={setShowMenu}
            rounded
            size={26}
            color={resolvedTheme === 'dark' ? '#e8e8e8' : '#333'}
            duration={0.6}
            label={showMenu ? 'Close menu' : 'Show menu'}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: showMenu ? 1 : 0, y: showMenu ? 0 : -20 }}
          transition={{ duration: 0.4 }}
          className="absolute top-full left-0 right-0 py-6 px-4 h-[100dvh] overflow-y-auto bg-background-default text-sm text-text-default font-semibold z-50 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          style={{ pointerEvents: showMenu ? 'auto' : 'none' }}
          aria-hidden={!showMenu}
        >
          <ul className="space-y-10">
            {navLinks.map(({ title, href }) => (
              <li key={title}>
                <button
                  type="button"
                  onClick={() => handleLinkClick(href)}
                  className={`hover:underline underline-offset-4 transition-all duration-500 ease-in-out cursor-pointer text-left ${pathname === href ? 'underline hover:no-underline' : 'no-underline'}`}
                >
                  {title}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </nav>
  );
};

export default MobileNav;
