import { useEffect, useRef } from 'react';

const CONNECT_DIST = 140;
const BASE_SPEED   = 0.32;
const COLOR_LERP   = 0.04;

// Vivid, clearly distinct hues per section
const SECTION_COLORS = {
  dark: {
    home:         [45,  212, 191],   // cyan-teal
    projects:     [139,  92, 246],   // violet
    skills:       [236,  72, 153],   // hot pink
    testimonials: [245, 158,  11],   // amber-gold
    contact:      [34,  197,  94],   // bright green
  },
  light: {
    home:         [13,  148, 136],
    projects:     [109,  40, 217],
    skills:       [190,  24, 107],
    testimonials: [180,  83,   9],
    contact:      [5,   150,  69],
  },
};

export default function BackgroundCanvas({ theme, currentSection }) {
  const canvasRef = useRef(null);
  const targetRef = useRef([45, 212, 191]);
  const colorRef  = useRef([45, 212, 191]);

  useEffect(() => {
    const map = theme === 'light' ? SECTION_COLORS.light : SECTION_COLORS.dark;
    targetRef.current = [...(map[currentSection] ?? map.home)];
  }, [currentSection, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const mouse  = { x: -9999, y: -9999 };
    let raf;

    const map = theme === 'light' ? SECTION_COLORS.light : SECTION_COLORS.dark;
    colorRef.current  = [...(map[currentSection] ?? map.home)];
    targetRef.current = [...colorRef.current];

    const COUNT = window.innerWidth < 768 ? 45 : 80;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove  = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = ()  => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    const particles = Array.from({ length: COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = BASE_SPEED * (0.5 + Math.random());
      return {
        x:     Math.random() * window.innerWidth,
        y:     Math.random() * window.innerHeight,
        vx:    Math.cos(angle) * speed,
        vy:    Math.sin(angle) * speed,
        r:     1 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        pulse: 0,
      };
    });

    let nextPulse = performance.now() + 1800 + Math.random() * 2200;

    const tick = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── Lerp color ───────────────────────────────────────────────────────
      const c = colorRef.current;
      const t = targetRef.current;
      c[0] += (t[0] - c[0]) * COLOR_LERP;
      c[1] += (t[1] - c[1]) * COLOR_LERP;
      c[2] += (t[2] - c[2]) * COLOR_LERP;
      const R = c[0] | 0;
      const G = c[1] | 0;
      const B = c[2] | 0;

      // ── Edge wash — the big visible shift on the sides ───────────────────
      const washW = Math.min(340, canvas.width * 0.28);

      const leftWash = ctx.createLinearGradient(0, 0, washW, 0);
      leftWash.addColorStop(0, `rgba(${R},${G},${B},0.18)`);
      leftWash.addColorStop(1, `rgba(${R},${G},${B},0)`);
      ctx.fillStyle = leftWash;
      ctx.fillRect(0, 0, washW, canvas.height);

      const rightWash = ctx.createLinearGradient(canvas.width, 0, canvas.width - washW, 0);
      rightWash.addColorStop(0, `rgba(${R},${G},${B},0.18)`);
      rightWash.addColorStop(1, `rgba(${R},${G},${B},0)`);
      ctx.fillStyle = rightWash;
      ctx.fillRect(canvas.width - washW, 0, washW, canvas.height);

      // Subtle top-center glow
      const topGlow = ctx.createRadialGradient(canvas.width / 2, 0, 0, canvas.width / 2, 0, canvas.width * 0.55);
      topGlow.addColorStop(0, `rgba(${R},${G},${B},0.07)`);
      topGlow.addColorStop(1, `rgba(${R},${G},${B},0)`);
      ctx.fillStyle = topGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.4);

      // ── Pulse trigger ─────────────────────────────────────────────────────
      if (now > nextPulse) {
        particles[Math.floor(Math.random() * COUNT)].pulse = 1;
        nextPulse = now + 2000 + Math.random() * 2000;
      }

      // ── Particles ────────────────────────────────────────────────────────
      for (const p of particles) {
        p.phase += 0.018;

        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < 200 * 200 && md2 > 1) {
          const md = Math.sqrt(md2);
          p.vx += (mdx / md) * 0.015;
          p.vy += (mdy / md) * 0.015;
        }

        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 1.2) { p.vx *= 0.95; p.vy *= 0.95; }

        p.x += p.vx;
        p.y += p.vy;

        if      (p.x < -10)                p.x = canvas.width  + 10;
        else if (p.x > canvas.width  + 10) p.x = -10;
        if      (p.y < -10)                p.y = canvas.height + 10;
        else if (p.y > canvas.height + 10) p.y = -10;

        if (p.pulse > 0) p.pulse = Math.max(0, p.pulse - 0.022);

        const flicker = 0.5 + 0.5 * Math.sin(p.phase);
        const alpha   = Math.min(0.4 + flicker * 0.45 + p.pulse * 0.55, 1);
        const radius  = p.r + flicker * 0.4 + p.pulse * 4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${R},${G},${B},${alpha})`;
        ctx.fill();

        if (p.pulse > 0.05) {
          const g = ctx.createRadialGradient(p.x, p.y, radius, p.x, p.y, radius + 18);
          g.addColorStop(0, `rgba(${R},${G},${B},${p.pulse * 0.55})`);
          g.addColorStop(1, `rgba(${R},${G},${B},0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius + 18, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }
      }

      // ── Connections ──────────────────────────────────────────────────────
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < CONNECT_DIST * CONNECT_DIST) {
            const d     = Math.sqrt(d2);
            const fade  = 1 - d / CONNECT_DIST;
            const boost = (particles[i].pulse + particles[j].pulse) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${R},${G},${B},${Math.min(fade * 0.22 + boost, 0.75)})`;
            ctx.lineWidth   = 0.8 + boost * 2;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [theme]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
