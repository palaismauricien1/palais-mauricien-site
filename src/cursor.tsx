import { cloneElement, useEffect, useRef } from 'react';
import type { ReactElement } from 'react';

/**
 * Follower cursor (ring + dot). Ring lags behind the pointer via lerp, dot tracks
 * it 1:1. Disabled on touch devices and when the user prefers reduced motion —
 * in both cases the native cursor is left alone (no `cursor-none` class added).
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isCoarsePointer || prefersReducedMotion) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.body.classList.add('custom-cursor-active');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      ring.style.opacity = '1';
      dot.style.opacity = '1';
    };

    const isHoverTarget = (el: EventTarget | null) =>
      el instanceof HTMLElement && el.closest('a, button, [data-cursor-hover]');

    const onMouseOver = (e: MouseEvent) => {
      if (isHoverTarget(e.target)) ring.classList.add('cursor-ring--hover');
    };
    const onMouseOut = (e: MouseEvent) => {
      if (isHoverTarget(e.target) && !isHoverTarget(e.relatedTarget)) {
        ring.classList.remove('cursor-ring--hover');
      }
    };

    const onWindowLeave = () => {
      ring.style.opacity = '0';
      dot.style.opacity = '0';
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.documentElement.addEventListener('mouseleave', onWindowLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.documentElement.removeEventListener('mouseleave', onWindowLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

/**
 * Wraps a single interactive element (button/link) and pulls it toward the
 * pointer within its own bounds, snapping back on mouse leave. Inert on touch
 * devices since no mousemove fires there.
 */
export function Magnetic({ children, strength = 0.35 }: { children: ReactElement; strength?: number }) {
  const ref = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0px, 0px)';
  };

  // cloneElement's extra-props type depends on the child's own component type,
  // which isn't known generically here.
  return cloneElement(children, {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: {
      ...(children.props as { style?: React.CSSProperties }).style,
      transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
      willChange: 'transform',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
}
