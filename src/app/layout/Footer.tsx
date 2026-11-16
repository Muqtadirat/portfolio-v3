'use client';

import { EmailIcon, GithubIcon, LinkedinIcon } from '@/assets';
import { Form, useTheme } from '@/components';

import Link from 'next/link';
import { useState } from 'react';

interface IconProps {
  fill: string;
}

interface SocialsProps {
  href: string;
  label: string;
  Icon: React.FC<IconProps>;
}

const Footer = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();

  const defaultFill = resolvedTheme === 'dark' ? '#e8e8e8' : '#141414';
  const hoverFill = '#f34213';

  const socials: SocialsProps[] = [
    {
      href: 'mailto:muqtadirat.yussuff.it@gmail.com',
      label: 'Email',
      Icon: EmailIcon,
    },
    {
      href: 'https://www.linkedin.com/in/muqtadirat-yussuff',
      label: 'LinkedIn',
      Icon: LinkedinIcon,
    },
    {
      href: 'https://github.com/Muqtadirat',
      label: 'GitHub',
      Icon: GithubIcon,
    },
  ];

  return (
    <footer
      id="contact"
      className="px-6 lg:px-12 pb-12 pt-8 lg:pb-16 xl:pt-12 text-text-default"
    >
      <Form />

      <section className="mt-12 lg:mt-20 xl:mt-28 border-t border-border-default pt-8 lg:pt-10">
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1.5 lg:space-y-2 min-w-0">
            <p className="font-inconsolata text-[10px] lg:text-xs uppercase tracking-[0.22em] text-text-subdued">
              Contact
            </p>
            <h4 className="font-display font-bold uppercase tracking-tight text-2xl sm:text-3xl lg:text-[2rem] xl:text-[2.35rem] leading-[1.05]">
              Muqtadirat Yussuff
            </h4>
            <p className="font-display font-semibold uppercase tracking-tight text-lg sm:text-xl lg:text-[1.65rem] text-accent leading-none">
              Frontend Developer
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-5">
            {socials.map(({ href, label, Icon }, index) => {
              const isEmail = href.startsWith('mailto:');
              const fill = hoveredIndex === index ? hoverFill : defaultFill;
              const className =
                'inline-flex items-center justify-center p-2 -m-2 transition-transform duration-200 hover:scale-110';

              const content = (
                <>
                  <span className="sr-only">{label}</span>
                  <Icon fill={fill} />
                </>
              );

              return isEmail ? (
                <a
                  href={href}
                  key={label}
                  aria-label={label}
                  className={className}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {content}
                </a>
              ) : (
                <Link
                  href={href}
                  key={label}
                  target="_blank"
                  aria-label={label}
                  className={className}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
