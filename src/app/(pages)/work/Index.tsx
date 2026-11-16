'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { arrowUpRight } from '@/assets';
import ProjectDetails from './ProjectDetails';
import projects from './constants/projects';
import { motion, AnimatePresence } from 'framer-motion';

const filters = [
  'All',
  'Fintech',
  'E-commerce',
  'SaaS',
  'Marketing Website',
];

const Work = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const toggleDetails = (projectTitle: string) => {
    setIsOpen(!isOpen);
    setSelectedProject(projectTitle);
  };

  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const filteredProjects = projects.filter((p) =>
    activeFilter === 'All' ? true : p.category.includes(activeFilter),
  );

  const visibleProjects = isHomePage ? projects.slice(0, 4) : filteredProjects;

  return (
    <div>
      {!isHomePage && (
        <>
          <header className="mb-10 lg:mb-14">
            <p className="font-inconsolata text-xs uppercase tracking-[0.25em] text-accent mb-3">
              Archive
            </p>
            <h1 className="font-display font-bold uppercase tracking-tight text-5xl lg:text-7xl xl:text-8xl leading-[0.9]">
              Work
            </h1>
          </header>

          <div className="flex gap-2 flex-wrap mb-10 lg:mb-14">
            {filters.map((filter) => {
              const active = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
                    active
                      ? 'border-accent text-accent bg-accent/10'
                      : 'border-border-default text-text-secondary hover:border-text-subdued hover:text-text-default'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </>
      )}

      {isHomePage ? (
        <div className="flex flex-col gap-16 lg:gap-28 mb-16 lg:mb-40 mt-8 lg:mt-14">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map(
              ({ title, image, description, category }, index) => {
                const reverse = index % 2 === 1;
                const indexLabel = String(index + 1).padStart(2, '0');
                return (
                  <motion.article
                    key={title}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center cursor-pointer group"
                    onClick={() => toggleDetails(title)}
                  >
                    <div
                      className={`lg:col-span-7 ${reverse ? 'lg:order-2' : ''}`}
                    >
                      <div className="relative h-[260px] sm:h-[340px] lg:h-[420px] xl:h-[480px] overflow-hidden rounded-sm border border-border-default bg-surface-subdued">
                        <Image
                          src={image}
                          alt={title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          priority={index < 2}
                        />
                      </div>
                    </div>

                    <div
                      className={`lg:col-span-5 space-y-5 ${reverse ? 'lg:order-1 lg:text-right' : ''}`}
                    >
                      <p
                        className={`font-inconsolata text-xs uppercase tracking-[0.2em] text-text-subdued ${reverse ? 'lg:text-right' : ''}`}
                      >
                        <span className="text-accent">{indexLabel}</span>
                        <span className="mx-2 text-border-default">/</span>
                        {category.join('  ·  ')}
                      </p>
                      <div
                        className={`flex items-start gap-3 ${reverse ? 'lg:flex-row-reverse' : ''}`}
                      >
                        <h3 className="font-display font-bold uppercase tracking-tight text-2xl lg:text-4xl xl:text-5xl leading-[1.05]">
                          {title}
                        </h3>
                        <Image
                          src={arrowUpRight}
                          alt=""
                          className="dark:invert shrink-0 mt-1.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                        />
                      </div>
                      <p className="text-text-secondary text-sm lg:text-base leading-relaxed max-w-md lg:max-w-none">
                        {description}
                      </p>
                      <p className="font-inconsolata text-xs uppercase tracking-[0.18em] text-text-subdued group-hover:text-accent transition-colors">
                        View project
                      </p>
                    </div>
                  </motion.article>
                );
              },
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border-default mb-16 lg:mb-40">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map(
              ({ title, image, description, category }, index) => (
                <motion.article
                  key={title}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="grid lg:grid-cols-12 gap-6 lg:gap-10 py-8 lg:py-12 cursor-pointer group items-center"
                  onClick={() => toggleDetails(title)}
                >
                  <div className="lg:col-span-5 space-y-3 order-2 lg:order-1">
                    <p className="font-inconsolata text-xs uppercase tracking-[0.2em] text-text-subdued">
                      <span className="text-accent">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="mx-2 text-border-default">/</span>
                      {category.join(' · ')}
                    </p>
                    <div className="flex items-start gap-3">
                      <h3 className="font-display font-bold uppercase tracking-tight text-2xl lg:text-4xl leading-[1.05]">
                        {title}
                      </h3>
                      <Image
                        src={arrowUpRight}
                        alt=""
                        className="dark:invert shrink-0 mt-1.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      />
                    </div>
                    <p className="text-text-secondary text-sm lg:text-base leading-relaxed max-w-md">
                      {description}
                    </p>
                  </div>

                  <div className="lg:col-span-7 order-1 lg:order-2">
                    <div className="relative h-[220px] sm:h-[300px] lg:h-[360px] overflow-hidden rounded-sm bg-surface-subdued">
                      <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 100vw, 58vw"
                      />
                    </div>
                  </div>
                </motion.article>
              ),
            )}
          </AnimatePresence>
        </div>
      )}

      {selectedProject && (
        <ProjectDetails
          isOpen={isOpen}
          toggleDetails={() => toggleDetails(selectedProject!)}
          selectedProject={selectedProject}
        />
      )}
    </div>
  );
};

export default Work;
