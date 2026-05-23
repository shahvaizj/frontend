import { useEffect, useRef } from 'react';

const CONNECT_DIST = 140;
const BASE_SPEED   = 0.32;
const COLOR_LERP   = 0.04;

// High-saturation, maximum-contrast hues — each section should look clearly different
const SECTION_COLORS = {
  dark: {
    home:         [0,   255, 220],   // bright cyan
    projects:     [160,  40, 255],   // vivid purple
    skills:       [255,  40, 140],   // hot pink
    testimonials: [255, 200,   0],   // bright gold
    contact:      [0,   220,  90],   // vivid green
  },
  light: {
    home:         [0,   180, 160],
    projects:     [110,  20, 200],
    skills:       [210,  10, 100],
    testimonials: [200, 130,   0],
    contact:      [0,   160,  70],
  },
};

export default function BackgroundCanvas({ theme, currentSection }) {
  const canvasRef = useRef(null);
  const targetRef = useRef([0, 255, 220]);
  const colorRef  = useRef([0, 255, 220]);

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
        r:     1.2 + Math.random() * 2,
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

      // ── Full background tint ──────────────────────────────────────────────
      ctx.fillStyle = `rgba(${R},${G},${B},0.02)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ── Side washes ───────────────────────────────────────────────────────
      const washW = Math.min(480, canvas.width * 0.36);

      const leftWash = ctx.createLinearGradient(0, 0, washW, 0);
      leftWash.addColorStop(0,   `rgba(${R},${G},${B},0.28)`);
      leftWash.addColorStop(0.5, `rgba(${R},${G},${B},0.09)`);
      leftWash.addColorStop(1,   `rgba(${R},${G},${B},0)`);
      ctx.fillStyle = leftWash;
      ctx.fillRect(0, 0, washW, canvas.height);

      const rightWash = ctx.createLinearGradient(canvas.width, 0, canvas.width - washW, 0);
      rightWash.addColorStop(0,   `rgba(${R},${G},${B},0.28)`);
      rightWash.addColorStop(0.5, `rgba(${R},${G},${B},0.09)`);
      rightWash.addColorStop(1,   `rgba(${R},${G},${B},0)`);
      ctx.fillStyle = rightWash;
      ctx.fillRect(canvas.width - washW, 0, washW, canvas.height);

      // ── Corner glows ──────────────────────────────────────────────────────
      const cornerGlow = (x, y) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, canvas.width * 0.45);
        g.addColorStop(0, `rgba(${R},${G},${B},0.08)`);
        g.addColorStop(1, `rgba(${R},${G},${B},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };
      cornerGlow(0, 0);
      cornerGlow(canvas.width, canvas.height);

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
        const alpha   = Math.min(0.5 + flicker * 0.45 + p.pulse * 0.55, 1);
        const radius  = p.r + flicker * 0.5 + p.pulse * 5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${R},${G},${B},${alpha})`;
        ctx.fill();

        if (p.pulse > 0.05) {
          const g = ctx.createRadialGradient(p.x, p.y, radius, p.x, p.y, radius + 22);
          g.addColorStop(0, `rgba(${R},${G},${B},${p.pulse * 0.6})`);
          g.addColorStop(1, `rgba(${R},${G},${B},0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius + 22, 0, Math.PI * 2);
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
            ctx.strokeStyle = `rgba(${R},${G},${B},${Math.min(fade * 0.3 + boost, 0.85)})`;
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
