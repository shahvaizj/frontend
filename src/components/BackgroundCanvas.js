import { useEffect, useRef } from 'react';

// Softer, calmer hues than the old network — the whole scene slowly tints
// toward the section you're viewing.
const SECTION_COLORS = {
  dark: {
    home:         [56,  189, 248],   // sky
    projects:     [129, 140, 248],   // indigo
    skills:       [236,  72, 153],   // pink
    testimonials: [251, 191,  36],   // amber
    contact:      [52,  211, 153],   // emerald
  },
  light: {
    home:         [14,  165, 233],
    projects:     [99,  102, 241],
    skills:       [219,  39, 119],
    testimonials: [217, 119,   6],
    contact:      [16,  185, 129],
  },
};

const COLOR_LERP = 0.03;

export default function BackgroundCanvas({ theme, currentSection }) {
  const canvasRef = useRef(null);
  const targetRef = useRef([56, 189, 248]);
  const colorRef  = useRef([56, 189, 248]);

  useEffect(() => {
    const map = theme === 'light' ? SECTION_COLORS.light : SECTION_COLORS.dark;
    targetRef.current = [...(map[currentSection] ?? map.home)];
  }, [currentSection, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let raf;

    const map = theme === 'light' ? SECTION_COLORS.light : SECTION_COLORS.dark;
    colorRef.current  = [...(map[currentSection] ?? map.home)];
    targetRef.current = [...colorRef.current];

    const alphaMax = theme === 'light' ? 0.10 : 0.16;

    // A few large, slow, heavily-feathered clouds. Positions are seeded as
    // viewport fractions, then tracked in pixels so they drift and bounce.
    const blobs = [
      { x: 0.22, y: 0.28, vx:  0.10, vy:  0.07, r: 0.55, a: 1.0 },
      { x: 0.80, y: 0.20, vx: -0.09, vy:  0.10, r: 0.50, a: 0.8 },
      { x: 0.72, y: 0.80, vx:  0.08, vy: -0.09, r: 0.62, a: 0.9 },
      { x: 0.30, y: 0.76, vx: -0.11, vy: -0.06, r: 0.46, a: 0.7 },
    ].map((b) => ({ ...b, x: b.x * window.innerWidth, y: b.y * window.innerHeight }));

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Gentle mouse parallax for a touch of depth.
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      mouse.tx = e.clientX / window.innerWidth  - 0.5;
      mouse.ty = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMove);

    const tick = () => {
      const W = canvas.width;
      const H = canvas.height;
      const minD = Math.min(W, H);
      ctx.clearRect(0, 0, W, H);

      const c = colorRef.current;
      const t = targetRef.current;
      c[0] += (t[0] - c[0]) * COLOR_LERP;
      c[1] += (t[1] - c[1]) * COLOR_LERP;
      c[2] += (t[2] - c[2]) * COLOR_LERP;
      const R = c[0] | 0;
      const G = c[1] | 0;
      const B = c[2] | 0;

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const px = mouse.x * 40;
      const py = mouse.y * 40;

      for (const b of blobs) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < 0 || b.x > W) b.vx *= -1;
        if (b.y < 0 || b.y > H) b.vy *= -1;

        const rad = b.r * minD;
        const gx = b.x + px;
        const gy = b.y + py;
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, rad);
        g.addColorStop(0,   `rgba(${R},${G},${B},${alphaMax * b.a})`);
        g.addColorStop(0.6, `rgba(${R},${G},${B},${alphaMax * b.a * 0.35})`);
        g.addColorStop(1,   `rgba(${R},${G},${B},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, [theme]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
