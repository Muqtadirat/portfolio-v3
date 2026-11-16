'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/components';

const COLS = 12;
const ROWS = 12;
const MAX_INFLUENCE = 100;

const RippleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: -9999, y: -9999, active: false });
  const raf = useRef(0);
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
    let dots: { x: number; y: number }[] = [];
    let staticDrawn = false;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
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

      const pad = Math.min(width, height) * 0.08;
      dots = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          dots.push({
            x: pad + (c / (COLS - 1)) * (width - pad * 2),
            y: pad + (r / (ROWS - 1)) * (height - pad * 2),
          });
        }
      }
      staticDrawn = false;
    };

    const setPointer = (e: PointerEvent, active: boolean) => {
      const rect = wrap.getBoundingClientRect();
      pointer.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active,
      };
    };

    const onDown = (e: PointerEvent) => {
      wrap.setPointerCapture(e.pointerId);
      setPointer(e, true);
    };

    const onMove = (e: PointerEvent) => {
      if (!pointer.current.active && e.pointerType !== 'mouse') return;
      if (e.pointerType !== 'mouse' && !wrap.hasPointerCapture(e.pointerId)) {
        return;
      }
      setPointer(e, true);
    };

    const onUp = (e: PointerEvent) => {
      if (wrap.hasPointerCapture(e.pointerId)) {
        wrap.releasePointerCapture(e.pointerId);
      }
      pointer.current.active = false;
    };

    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') pointer.current.active = false;
    };

    const drawFrame = (time: number, animate: boolean) => {
      ctx.clearRect(0, 0, width, height);

      const base = isDark ? [232, 232, 232] : [15, 15, 15];
      const accent = [243, 66, 19];
      const px = pointer.current.x;
      const py = pointer.current.y;
      const active = pointer.current.active;

      for (let i = 0; i < dots.length; i++) {
        const { x, y } = dots[i];
        const dx = x - px;
        const dy = y - py;
        const dist = Math.hypot(dx, dy);
        const influence = active
          ? Math.max(0, 1 - dist / MAX_INFLUENCE)
          : 0;
        const t = influence * influence;

        const breathe = animate
          ? 0.55 +
            0.45 *
              Math.sin(time * 0.0014 + x * 0.04 + y * 0.03 + i * 0.12)
          : 0.7;

        const r = base[0] + (accent[0] - base[0]) * t;
        const g = base[1] + (accent[1] - base[1]) * t;
        const b = base[2] + (accent[2] - base[2]) * t;

        const radius = 1.6 + breathe * 1.2 + t * 3.8;
        const alpha = 0.28 + breathe * 0.22 + t * 0.5;

        const push = t * 10;
        const angle = Math.atan2(dy, dx);
        const drawX = x + Math.cos(angle) * push;
        const drawY = y + Math.sin(angle) * push;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha})`;
        ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
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

    wrap.addEventListener('pointerdown', onDown);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerup', onUp);
    wrap.addEventListener('pointercancel', onUp);
    wrap.addEventListener('lostpointercapture', onUp);
    wrap.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      io.disconnect();
      mq.removeEventListener('change', onMotionChange);
      wrap.removeEventListener('pointerdown', onDown);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerup', onUp);
      wrap.removeEventListener('pointercancel', onUp);
      wrap.removeEventListener('lostpointercapture', onUp);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, [isDark]);

  return (
    <div
      ref={wrapRef}
      className="relative aspect-square w-full touch-none select-none"
      aria-hidden
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};

export default RippleField;
