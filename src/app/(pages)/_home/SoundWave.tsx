'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/components';

const BAR_COUNT = 28;
const MAX_INFLUENCE = 160;

const SoundWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: -9999, y: -9999, active: false, sx: -9999 });
  const heights = useRef<Float32Array>(new Float32Array(BAR_COUNT));
  const raf = useRef(0);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let barXs: number[] = [];
    let barWidth = 12;
    let gap = 6;

    const layout = () => {
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const padX = 4;
      const usable = width - padX * 2;
      gap = Math.max(4, usable * 0.012);
      barWidth = (usable - gap * (BAR_COUNT - 1)) / BAR_COUNT;
      barXs = Array.from(
        { length: BAR_COUNT },
        (_, i) => padX + i * (barWidth + gap) + barWidth / 2
      );
    };

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointer.current.x = e.clientX - rect.left;
      pointer.current.y = e.clientY - rect.top;
      pointer.current.active = true;
    };

    const onLeave = () => {
      pointer.current.active = false;
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const base = isDark ? [232, 232, 232] : [15, 15, 15];
      const accent = [243, 66, 19];
      const t = time * 0.001;

      // Soft follow so the peak trails the pointer instead of snapping
      const targetX = pointer.current.active
        ? pointer.current.x
        : width * 0.5;
      pointer.current.sx += (targetX - pointer.current.sx) * 0.12;
      const px = pointer.current.sx;
      const active = pointer.current.active;

      // Keep bars inside the canvas so pill ends never clip
      const radius = barWidth / 2;
      const inset = radius + 2;
      const minH = Math.max(height * 0.16, radius * 2);
      const maxH = height - inset * 2;

      for (let i = 0; i < BAR_COUNT; i++) {
        const x = barXs[i];

        // v2 twist: shared 2s cycle, staggered delay (discrete bars, not a sheet)
        const twist = 0.5 + 0.5 * Math.sin((t - i * 0.08) * Math.PI);

        // Extra EQ energy per bar — phase by index so neighbors don't form a flag wave
        const pulse =
          0.5 +
          0.35 * Math.sin(t * 2.6 + i * 1.9) +
          0.15 * Math.sin(t * 4.1 + i * 2.7);

        let level = Math.min(1, Math.max(0.1, twist * 0.65 + pulse * 0.35));

        if (active) {
          const dist = Math.abs(x - px);
          const influence = Math.max(0, 1 - dist / MAX_INFLUENCE);
          const bump = influence * influence;
          // Lift nearby bars, but stay within the safe max height
          level = level * (1 - bump * 0.35) + bump * 0.82;
        }

        const targetH = minH + (maxH - minH) * level;
        heights.current[i] += (targetH - heights.current[i]) * 0.18;
        const h = Math.min(Math.max(heights.current[i] || targetH, minH), maxH);
        heights.current[i] = h;
        const y = (height - h) / 2;
        const corner = Math.min(radius, h / 2);

        const isAccent = i % 7 === 0;
        let mix = isAccent ? 0.85 : 0;
        if (active) {
          const dist = Math.abs(x - px);
          const near = Math.max(0, 1 - dist / MAX_INFLUENCE);
          mix = Math.max(mix, near * near);
        }

        const r = base[0] + (accent[0] - base[0]) * mix;
        const g = base[1] + (accent[1] - base[1]) * mix;
        const b = base[2] + (accent[2] - base[2]) * mix;

        ctx.beginPath();
        ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
        ctx.roundRect(x - barWidth / 2, y, barWidth, h, corner);
        ctx.fill();
      }

      raf.current = requestAnimationFrame(draw);
    };

    layout();
    // Seed resting heights so first frame isn't flat
    for (let i = 0; i < BAR_COUNT; i++) {
      heights.current[i] = height * (0.3 + 0.35 * Math.sin(i * 0.45));
    }
    raf.current = requestAnimationFrame(draw);

    const ro = new ResizeObserver(layout);
    ro.observe(wrap);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    wrap.addEventListener('pointerenter', onMove);

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      wrap.removeEventListener('pointerenter', onMove);
    };
  }, [isDark]);

  return (
    <div
      ref={wrapRef}
      className="relative hidden lg:block w-full h-[240px] xl:h-[300px] max-w-[640px] cursor-none"
      aria-hidden
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};

export default SoundWave;
