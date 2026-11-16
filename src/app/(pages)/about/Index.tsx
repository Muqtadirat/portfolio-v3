'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Hobbies from './Hobbies';

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay,
        duration: 1.6,
        ease: [0.76, 0, 0.24, 1],
      },
      opacity: { delay, duration: 0.01 },
    },
  }),
};

const fadeVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay, duration: 0.4, ease: 'backOut' },
  }),
};

const subtitleVariants = {
  hidden: { opacity: 0, letterSpacing: '0.1em' },
  visible: {
    opacity: 0.4,
    letterSpacing: '0.4em',
    transition: { delay: 3, duration: 1, ease: 'easeOut' },
  },
};

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div className="pb-8">
      <div className="relative mb-12 lg:mb-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="font-serif italic text-accent text-xl lg:text-3xl mb-2 lg:mb-0 lg:absolute lg:left-0 lg:top-2"
        >
          about
        </motion.p>

        <div
          ref={ref}
          className="w-full max-w-[831px] mx-auto h-auto text-text-default"
        >
          <svg
            width="100%"
            viewBox="0 0 831 416"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M 100 320 L 100 100 L 240 220 L 380 100 L 380 320"
              fill="none"
              stroke="currentColor"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={pathVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={0.1}
            />

            <motion.circle
              cx="420"
              cy="318"
              r="12"
              className="fill-accent"
              variants={fadeVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={1.6}
            />

            <motion.path
              d="M 500 100 L 630 240 L 760 100 M 630 240 L 630 320"
              fill="none"
              stroke="currentColor"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={pathVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={1.9}
            />

            <motion.text
              x="415"
              y="395"
              textAnchor="middle"
              fontFamily="var(--font-inconsolata, monospace)"
              fontSize="20"
              fill="currentColor"
              className="lg:hidden"
              variants={subtitleVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              MUQTADIRAT YUSSUFF
            </motion.text>

            <motion.text
              x="415"
              y="395"
              textAnchor="middle"
              fontFamily="var(--font-inconsolata, monospace)"
              fontSize="16"
              fill="currentColor"
              className="hidden lg:block"
              variants={subtitleVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              MUQTADIRAT YUSSUFF
            </motion.text>
          </svg>
        </div>
      </div>

      <section className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-start mb-6 lg:mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 font-display font-bold uppercase tracking-tight text-4xl lg:text-[4.5rem] xl:text-[5.25rem] leading-[0.9]"
        >
          Frontend
          <br />
          developer
          <br />
          <span className="text-accent">with a soft</span>
          <br />
          spot for
          <br />
          craft
        </motion.h2>

        <div className="lg:col-span-7 lg:pt-4 space-y-6 lg:space-y-8 lg:pl-6 xl:pl-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="font-serif text-xl lg:text-[1.85rem] leading-[1.4] text-text-default"
          >
            Four years building production apps across fintech, e-commerce, and
            business software. I care about the details: how things look, how
            they feel, and how well they hold up as a product grows.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="font-serif text-base lg:text-lg leading-[1.75] text-text-secondary max-w-[36rem] lg:ml-auto"
          >
            Most of my career has been in small teams and startups, owning
            features end to end and solving problems that go beyond writing
            code. Outside of work I am into art, gaming, anime, and reading,
            which probably explains why I care so much about the experience
            side of what I build.
          </motion.p>
        </div>
      </section>

      <Hobbies />
    </div>
  );
};

export default About;
