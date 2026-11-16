'use client';

import { logo } from '@/assets';
import Image from 'next/image';
import React from 'react';
import navLinks, { isNavActive } from './navLinks';
import { ThemeToggle } from '@/components';
import { useContactScroll, useHash, useSmoothNavigate } from '@/hooks';

interface DesktopNavProps {
  pathname: string;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ pathname }) => {
  const hash = useHash();
  const goToContact = useContactScroll();
  const { goHome, goTo } = useSmoothNavigate();

  return (
    <nav className="hidden lg:block fixed top-0 z-50 left-1/2 transform -translate-x-1/2 w-[90%] xl:w-full max-w-[1232px] px-3 py-4 mt-6 rounded-xl bg-background-default/65 dark:bg-surface-subdued/75 backdrop-filter backdrop-blur-md border border-transparent dark:border-border-default text-text-default">
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={goHome}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-default rounded-sm"
          aria-label="Home"
        >
          <Image src={logo} alt="Muqtadirat" className="dark:invert" />
        </button>
        <div className="flex items-center gap-x-10 xl:gap-x-17.5">
          <ul className="flex gap-x-10 xl:gap-x-17.5 font-display text-sm uppercase tracking-[0.12em]">
            {navLinks.map(({ title, href }) => {
              const active = isNavActive(href, pathname, hash);
              const className = `hover:text-accent underline-offset-4 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-default rounded-sm ${
                active ? 'text-accent underline' : 'no-underline'
              }`;

              if (href === '#contact') {
                return (
                  <li key={title}>
                    <button
                      type="button"
                      onClick={goToContact}
                      className={className}
                    >
                      {title}
                    </button>
                  </li>
                );
              }

              return (
                <li key={title}>
                  <button
                    type="button"
                    onClick={() => goTo(href)}
                    className={className}
                  >
                    {title}
                  </button>
                </li>
              );
            })}
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default DesktopNav;
