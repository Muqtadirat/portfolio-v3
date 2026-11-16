'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from 'framer-motion';

import {
  arrowDown,
  arrowUpRight,
  cssColored,
  cssIcon,
  cypressColored,
  cypressIcon,
  framerColored,
  framerIcon,
  htmlColored,
  htmlIcon,
  nextJsColored,
  nextJsIcon,
  reactColored,
  reactIcon,
  reactQueryColored,
  reactQueryIcon,
  reduxColored,
  reduxIcon,
  tailwindColored,
  tailwindIcon,
} from '@/assets';
import { useTheme } from '@/components';

import WorkHistory from './History';
import RippleField from './RippleField';
import SoundWave from './SoundWave';
import Work from '../work/Index';

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0 },
};

const staggerIcons = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const iconVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const techIcons = [
  { mono: htmlIcon, color: htmlColored, alt: 'HTML' },
  { mono: reactIcon, color: reactColored, alt: 'React' },
  {
    mono: nextJsIcon,
    color: nextJsColored,
    alt: 'Next Js',
    invertInDark: true,
  },
  { mono: cssIcon, color: cssColored, alt: 'CSS3' },
  { mono: tailwindIcon, color: tailwindColored, alt: 'Tailwind' },
  { mono: framerIcon, color: framerColored, alt: 'Framer motion' },
  { mono: reduxIcon, color: reduxColored, alt: 'Redux' },
  { mono: reactQueryIcon, color: reactQueryColored, alt: 'React query' },
  { mono: cypressIcon, color: cypressColored, alt: 'Cypress' },
] as const;

const locations = [
  '{the internet}',
  '{somewhere, on earth}',
  '{03°22′N, 06°27′E}',
];

const STATEMENT =
  'I make things for the web that feel good to use. Considered, sharp, and made to last';

const statementWords = STATEMENT.split(' ').map((word, wi, arr) => {
  const prior = arr.slice(0, wi).join('').length;
  return {
    word,
    chars: word.split('').map((char, ci) => ({ char, index: prior + ci })),
  };
});
const totalChars = STATEMENT.replace(/\s/g, '').length;

const Char = ({
  char,
  index,
  progress,
  dim,
  lit,
}: {
  char: string;
  index: number;
  progress: MotionValue<number>;
  dim: string;
  lit: string;
}) => {
  const start = (index / totalChars) * 0.82;
  const mid = start + 0.05;
  const end = start + 0.14;
  const color = useTransform(
    progress,
    [start, mid, end],
    [dim, '#f34213', lit],
  );
  const isM = char === 'M' || char === 'm';

  return (
    <motion.span
      style={{ color }}
      className={`inline-block ${isM ? 'unique-m' : ''}`}
    >
      {isM ? 'M' : char}
    </motion.span>
  );
};

const Statement = () => {
  const ref = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const dim = isDark ? 'rgba(232,232,232,0.18)' : 'rgba(15,15,15,0.14)';
  const lit = isDark ? '#e8e8e8' : '#0f0f0f';

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.35'],
  });

  return (
    <>
      <section
        ref={ref}
        className="lg:snap-start lg:min-h-[100svh] flex flex-col lg:justify-center pt-8 pb-4 lg:py-12"
      >
        <p className="font-inconsolata text-xs uppercase tracking-[0.25em] text-accent mb-4 lg:mb-8">
          About
        </p>
        <h2 className="font-display font-bold uppercase tracking-tight text-[clamp(2rem,8vw,7.25rem)] leading-[0.95] w-full break-words">
          {statementWords.map(({ word, chars }, wi) => (
            <span key={`${word}-${wi}`}>
              <span className="inline sm:inline-block sm:whitespace-nowrap">
                {chars.map(({ char, index }) => (
                  <Char
                    key={index}
                    char={char}
                    index={index}
                    progress={scrollYProgress}
                    dim={dim}
                    lit={lit}
                  />
                ))}
              </span>
              {wi < statementWords.length - 1 ? ' ' : null}
            </span>
          ))}
        </h2>
      </section>

      <div className="grid lg:grid-cols-[120px_1fr] gap-3 lg:gap-12 border-t border-border-default pt-6 lg:pt-8 mb-4 lg:mb-8">
        <p className="font-inconsolata text-xs uppercase tracking-[0.2em] text-text-subdued">
          Because
        </p>
        <div className="space-y-4 max-w-2xl">
          <p className="text-base lg:text-xl text-text-secondary leading-relaxed">
            Four years mostly in small teams and startups across fintech and
            SaaS. Pixel-perfect where it matters, clean architecture where it
            lasts.
          </p>
          <p className="text-base lg:text-xl leading-relaxed">
            Interfaces where the detail work shows, interactions that feel
            considered, layouts that just make sense, and code that holds up as
            the product grows.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 mt-4 text-sm font-display uppercase tracking-[0.15em] text-accent hover:opacity-70 transition-opacity"
          >
            More about me
            <Image src={arrowUpRight} alt="" className="dark:invert w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
};

const Home = () => {
  const [locIndex, setLocIndex] = React.useState(0);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const id = setInterval(() => {
      setLocIndex((i) => (i + 1) % locations.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <div className="lg:snap-y lg:snap-mandatory">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex gap-3 items-center text-text-default"
      >
        <div className="rounded-sm h-10 w-10 bg-accent" />
        <div>
          <p className="uppercase font-display font-semibold tracking-[0.08em] text-sm lg:text-base">
            Muqtadirat Yussuff
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={locIndex}
              className="font-inconsolata text-text-secondary"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              {locations[locIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      <header className="mt-6 lg:mt-12.5 flex flex-col lg:flex-row gap-5 lg:gap-6 xl:gap-0 justify-between lg:snap-start">
        <div className="order-2 lg:order-1 lg:space-y-45 lg:w-1/2 lg:pr-8">
          {isDesktop ? <SoundWave /> : <RippleField />}

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <Image
              src={arrowDown}
              alt="Down arrow"
              className="hidden lg:block dark:invert"
            />
          </motion.div>
        </div>

        <div className="order-1 lg:order-2 lg:w-1/2 lg:mt-[5.313rem]">
          <motion.p
            className="font-inconsolata text-xs uppercase tracking-[0.2em] text-accent mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Portfolio 2026
          </motion.p>
          <motion.h1
            className="font-display font-bold uppercase tracking-tight text-4xl sm:text-5xl lg:text-7xl xl:text-[7.5rem] lg:leading-[0.9]"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Frontend
            <br />
            Developer
          </motion.h1>

          <motion.div
            className="mt-5 lg:mt-8"
            variants={staggerIcons}
            initial="hidden"
            animate="show"
          >
            <div className="flex flex-wrap gap-2 lg:gap-4">
              {techIcons.map(({ mono, color, alt, ...rest }) => {
                const invertInDark =
                  'invertInDark' in rest && rest.invertInDark;
                return (
                  <motion.div
                    key={alt}
                    variants={iconVariant}
                    whileHover={{ scale: 1.15, rotate: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={isDark ? color : mono}
                      alt={alt}
                      className={isDark && invertInDark ? 'invert' : undefined}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </header>

      <Statement />

      <WorkHistory />

      <div className="mt-16 lg:mt-28 space-y-2 lg:snap-start">
        <motion.div
          className="flex items-end justify-between gap-4 border-y border-border-default py-4 lg:py-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h4 className="font-display font-bold uppercase tracking-tight text-4xl lg:text-[6rem] xl:text-[8rem] leading-none">
            Selected
            <span className="text-accent"> work</span>
          </h4>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 font-inconsolata text-xs sm:text-sm text-text-secondary hover:text-accent transition-colors shrink-0 mb-1 lg:mb-2"
          >
            View all
            <Image
              src={arrowUpRight}
              alt=""
              className="dark:invert w-3.5 h-3.5"
            />
          </Link>
        </motion.div>
        <Work />
      </div>
    </div>
  );
};

export default Home;
