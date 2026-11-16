'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 500, damping: 32 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 32 });

  // Lagging trail 
  const t1x = useSpring(mouseX, { stiffness: 90, damping: 22 });
  const t1y = useSpring(mouseY, { stiffness: 90, damping: 22 });
  const t2x = useSpring(mouseX, { stiffness: 55, damping: 20 });
  const t2y = useSpring(mouseY, { stiffness: 55, damping: 20 });
  const t3x = useSpring(mouseX, { stiffness: 35, damping: 18 });
  const t3y = useSpring(mouseY, { stiffness: 35, damping: 18 });
  const t4x = useSpring(mouseX, { stiffness: 22, damping: 16 });
  const t4y = useSpring(mouseY, { stiffness: 22, damping: 16 });

  const trail = [
    { x: t1x, y: t1y, size: 9, opacity: 0.32 },
    { x: t2x, y: t2y, size: 7, opacity: 0.24 },
    { x: t3x, y: t3y, size: 5, opacity: 0.16 },
    { x: t4x, y: t4y, size: 4, opacity: 0.1 },
  ];

  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="link"]')) setHovering(true);
    };

    const handleMouseOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="link"]')) setHovering(false);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [mouseX, mouseY]);

  const rgb = '243,66,19';
  const ring = `rgba(${rgb},1)`;

  return (
    <>
      {trail.map(({ x, y, size, opacity }, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 z-[9997] rounded-full pointer-events-none"
          animate={{ opacity: hovering ? 0 : opacity }}
          transition={{ duration: 0.2 }}
          style={{
            x,
            y,
            translateX: '-50%',
            translateY: '-50%',
            width: size,
            height: size,
            backgroundColor: `rgba(${rgb},1)`,
          }}
        />
      ))}

      <motion.div
        className="fixed top-0 left-0 z-[9999] rounded-full border-2 pointer-events-none"
        animate={{
          width: hovering ? 48 : 18,
          height: hovering ? 48 : 18,
          borderColor: ring,
          backgroundColor: hovering ? `rgba(${rgb},0.12)` : 'rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
};

export default CustomCursor;
