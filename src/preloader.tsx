import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const SESSION_KEY = 'pm-preloader-shown';

// Entrance sequence (drawn via CSS animation-delay, see index.css) finishes
// around 1.35s; HOLD_MS gives it a short pause before the exit begins.
// Total runtime lands at ~2.1s, inside the 1.8–2.3s target.
const HOLD_MS = 1550;
const REVEAL_MS = 650;
const REDUCED_MOTION_MS = 300;

function readShouldShow() {
  if (typeof window === 'undefined') return false;
  return !sessionStorage.getItem(SESSION_KEY);
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type Particle = { left: number; top: number; size: number; delay: number; duration: number };

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    left: 28 + Math.random() * 44,
    top: 18 + Math.random() * 64,
    size: 2 + Math.random() * 2.5,
    delay: Math.random() * 1.2,
    duration: 3 + Math.random() * 2,
  }));
}

export function Preloader() {
  const [shouldRender] = useState(readShouldShow);
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const particles = useMemo(() => makeParticles(7), []);

  // Lock scroll + pause the hero's own entrance animations for the duration of
  // the preloader. Re-running when `done` flips true removes the class via the
  // cleanup below, restoring scroll exactly when the preloader disappears.
  useLayoutEffect(() => {
    if (!shouldRender || done) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    document.body.classList.add('preloader-active');
    return () => {
      document.body.classList.remove('preloader-active');
    };
  }, [shouldRender, done]);

  // Schedule the exit after the entrance has had time to play out.
  useEffect(() => {
    if (!shouldRender) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = window.setTimeout(() => setExiting(true), reducedMotion ? REDUCED_MOTION_MS : HOLD_MS);
    return () => clearTimeout(id);
  }, [shouldRender]);

  // Drive the circular reveal mask: the backdrop gets a growing transparent
  // hole at its center until it exceeds the viewport diagonal, unveiling the
  // page underneath. Reduced motion skips the mask and just fades the overlay
  // (handled purely in CSS via the prefers-reduced-motion block).
  useEffect(() => {
    if (!exiting) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const backdrop = backdropRef.current;

    if (reducedMotion || !backdrop) {
      const id = window.setTimeout(() => setDone(true), REDUCED_MOTION_MS);
      return () => clearTimeout(id);
    }

    const maxRadius = Math.hypot(window.innerWidth, window.innerHeight);
    const start = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / REVEAL_MS, 1);
      const radius = easeInOutCubic(progress) * maxRadius;
      const mask = `radial-gradient(circle at 50% 50%, transparent ${radius}px, #000 ${radius + 1}px)`;
      backdrop.style.setProperty('mask-image', mask);
      backdrop.style.setProperty('-webkit-mask-image', mask);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [exiting]);

  if (!shouldRender || done) return null;

  return (
    <div className={`preloader ${exiting ? 'preloader--exiting' : ''}`} role="status" aria-label="Chargement">
      <div ref={backdropRef} className="preloader__backdrop">
        <div className="preloader__texture" />
      </div>

      <div className="preloader__content">
        <div className="preloader__badge">
          <svg className="preloader__ring" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="92" pathLength={100} />
          </svg>
          <div className="preloader__orbit">
            <span className="preloader__glow" />
          </div>
          <p className="preloader__monogram">PM</p>
        </div>

        <div className="preloader__brand">
          <span className="preloader__brand-line" />
          <div className="preloader__brand-text">
            <p>PALAIS MAURICIEN</p>
            <p>LE PORT · LA RÉUNION</p>
          </div>
          <span className="preloader__brand-line" />
        </div>

        <div className="preloader__particles">
          {particles.map((p, i) => (
            <span
              key={i}
              className="preloader__particle"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
