'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/components';

const MAX_INFLUENCE = 160;

const SoundWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: -9999, y: -9999, active: false, sx: -9999 });
  const heights = useRef<Float32Array>(new Float32Array(32));
  const raf = useRef(0);
  const barCount = useRef(28);
  const reducedMotion = useRef(false);
  const inView = useRef(true);
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
    let staticDrawn = false;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    reducedMotion.current = mq.matches;

    const onMotionChange = () => {
      reducedMotion.current = mq.matches;
      staticDrawn = false;
    };
    mq.addEventListener('change', onMotionChange);

    const layout = () => {
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      barCount.current = width < 420 ? 16 : width < 560 ? 22 : 28;
      if (heights.current.length < barCount.current) {
        heights.current = new Float32Array(barCount.current);
      }

      const padX = 4;
      const count = barCount.current;
      const usable = width - padX * 2;
      gap = Math.max(3, usable * 0.012);
      barWidth = (usable - gap * (count - 1)) / count;
      barXs = Array.from(
        { length: count },
        (_, i) => padX + i * (barWidth + gap) + barWidth / 2
      );
      staticDrawn = false;
    };

    const onMove = (e: PointerEvent) => {
      if (!finePointer.matches && e.pointerType === 'mouse') return;
      const rect = wrap.getBoundingClientRect();
      pointer.current.x = e.clientX - rect.left;
      pointer.current.y = e.clientY - rect.top;
      pointer.current.active = true;
    };

    const onLeave = () => {
      pointer.current.active = false;
    };

    const drawFrame = (time: number, animate: boolean) => {
      ctx.clearRect(0, 0, width, height);

      const base = isDark ? [232, 232, 232] : [15, 15, 15];
      const accent = [243, 66, 19];
      const t = time * 0.001;
      const count = barCount.current;

      const targetX = pointer.current.active
        ? pointer.current.x
        : width * 0.5;
      pointer.current.sx += (targetX - pointer.current.sx) * 0.12;
      const px = pointer.current.sx;
      const active = pointer.current.active && finePointer.matches;

      const radius = barWidth / 2;
      const inset = radius + 2;
      const minH = Math.max(height * 0.16, radius * 2);
      const maxH = height - inset * 2;

      for (let i = 0; i < count; i++) {
        const x = barXs[i];

        let level: number;
        if (!animate) {
          level = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(i * 0.55));
        } else {
          const twist = 0.5 + 0.5 * Math.sin((t - i * 0.08) * Math.PI);
          const pulse =
            0.5 +
            0.35 * Math.sin(t * 2.6 + i * 1.9) +
            0.15 * Math.sin(t * 4.1 + i * 2.7);
          level = Math.min(1, Math.max(0.1, twist * 0.65 + pulse * 0.35));

          if (active) {
            const dist = Math.abs(x - px);
            const influence = Math.max(0, 1 - dist / MAX_INFLUENCE);
            const bump = influence * influence;
            level = level * (1 - bump * 0.35) + bump * 0.82;
          }
        }

        const targetH = minH + (maxH - minH) * level;
        if (animate) {
          heights.current[i] += (targetH - heights.current[i]) * 0.18;
        } else {
          heights.current[i] = targetH;
        }
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
    };

    const tick = (time: number) => {
      const shouldAnimate = !reducedMotion.current && inView.current;

      if (!shouldAnimate) {
        if (!staticDrawn) {
          drawFrame(time, false);
          staticDrawn = true;
        }
        raf.current = requestAnimationFrame(tick);
        return;
      }

      staticDrawn = false;
      drawFrame(time, true);
      raf.current = requestAnimationFrame(tick);
    };

    layout();
    for (let i = 0; i < barCount.current; i++) {
      heights.current[i] = height * (0.3 + 0.35 * Math.sin(i * 0.45));
    }
    raf.current = requestAnimationFrame(tick);

    const ro = new ResizeObserver(layout);
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        staticDrawn = false;
      },
      { threshold: 0.05 }
    );
    io.observe(wrap);

    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    wrap.addEventListener('pointerenter', onMove);
    wrap.addEventListener('pointerdown', onMove);

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      io.disconnect();
      mq.removeEventListener('change', onMotionChange);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      wrap.removeEventListener('pointerenter', onMove);
      wrap.removeEventListener('pointerdown', onMove);
    };
  }, [isDark]);

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-[240px] xl:h-[300px] max-w-[640px] cursor-none"
      aria-hidden
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};

export default SoundWave;
