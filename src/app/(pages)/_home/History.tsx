'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import history from './constants/history';

const WorkHistory = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div
      className="mt-16 lg:mt-40"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      viewport={{ once: true, margin: '-10%' }}
    >
      <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-16 border-t border-border-default pt-10 lg:pt-14">
        <div>
          <p className="font-inconsolata text-xs uppercase tracking-[0.25em] text-accent mb-4">
            Experience
          </p>
          <h4 className="font-display font-bold uppercase tracking-tight text-4xl lg:text-[5rem] leading-[0.95]">
            Work
            <br />
            history
          </h4>
        </div>

        <div className="w-full">
          {history.map(({ company, period, role, location, logo }, index) => (
            <section
              key={company}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group"
            >
              <div className="flex justify-between items-center gap-4 py-1">
                <div
                  className={`transition-opacity duration-500 shrink-0 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}
                >
                  {logo && <Image src={logo} alt="" width={64} height={64} />}
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-xl lg:text-[1.75rem] font-display font-semibold uppercase tracking-tight group-hover:text-accent transition-colors">
                    {role}
                  </p>
                  <p className="text-text-secondary text-sm lg:text-base">
                    {company} ({location})
                  </p>
                  <p className="font-inconsolata text-xs uppercase tracking-[0.12em] text-text-subdued">
                    {period}
                  </p>
                </div>
              </div>
              <hr className="my-4 border-border-default group-hover:border-accent/40 transition-colors" />
            </section>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WorkHistory;
