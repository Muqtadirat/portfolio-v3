'use client';

import { useState } from 'react';
import Image from 'next/image';
import hobbies from './constants/hobbies';
import { motion, AnimatePresence } from 'framer-motion';

const Hobbies = () => {
  const [selectedHobby, setSelectedHobby] = useState(hobbies[0]);

  return (
    <motion.section
      className="my-16 lg:my-40"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      viewport={{ once: true, margin: '-10%' }}
    >
      <p className="font-serif italic text-lg lg:text-2xl text-text-secondary max-w-md mb-8 lg:mb-14">
        When I am not writing code, you will find me doing one of these:
      </p>

      <div className="relative flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-24 items-start">
        <ul className="uppercase font-display font-bold tracking-tight text-4xl lg:text-[5.25rem] xl:text-[6rem] leading-[0.95] space-y-3 lg:space-y-6 shrink-0">
          {hobbies.map(({ hobby }, index) => {
            const active = selectedHobby.hobby === hobby;
            return (
              <li
                key={hobby}
                style={{ paddingLeft: `${index * 0.35}rem` }}
                className="lg:odd:pl-0 lg:even:pl-10"
              >
                <button
                  type="button"
                  onClick={() =>
                    setSelectedHobby(hobbies.find((h) => h.hobby === hobby)!)
                  }
                  className={`text-left transition-colors duration-300 cursor-pointer ${
                    active
                      ? 'text-accent'
                      : 'text-text-subdued hover:text-text-secondary'
                  }`}
                >
                  {hobby}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="relative w-full lg:flex-1 lg:max-w-[540px] lg:mt-8 lg:-rotate-1">
          <div className="relative h-[300px] lg:h-[460px] w-full overflow-hidden rounded-[1.75rem] lg:rounded-[2.25rem] bg-surface-subdued">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedHobby.hobby}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0"
              >
                <Image
                  src={selectedHobby.image}
                  alt={`${selectedHobby.hobby} image`}
                  fill
                  className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 540px"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mt-4 font-serif italic text-sm lg:text-base text-text-subdued">
            {selectedHobby.hobby}
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default Hobbies;
