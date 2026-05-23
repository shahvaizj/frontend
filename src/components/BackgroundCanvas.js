import { useEffect, useRef } from 'react';

const CONNECT_DIST = 140;
const BASE_SPEED   = 0.32;
const COLOR_LERP   = 0.025;

const SECTION_COLORS = {
  dark: {
    home:         [45,  212, 191],   // teal
    projects:     [99,  102, 241],   // indigo
    skills:       [168,  85, 247],   // purple
    testimonials: [251, 146,  60],   // amber
    contact:      [52,  211, 153],   // emerald
  },
  light: {
    home:         [13,  148, 136],
    projects:     [67,   56, 202],
    skills:       [126,  34, 206],
    testimonials: [217,  70,   0],
    contact:      [4,   120,  87],
  },
};

export default function BackgroundCanvas({ theme, currentSection }) {
  const canvasRef = useRef(null);
  // Refs so the running RAF loop can read latest values without restarting
  const targetRef = useRef([45, 212, 191]);
  const colorRef  = useRef([45, 212, 191]);

  // Update target whenever section or theme changes
  useEffect(() => {
    const map = theme === 'light' ? SECTION_COLORS.light : SECTION_COLORS.dark;
    targetRef.current = [...(map[currentSection] ?? map.home)];
  }, [currentSection, theme]);

  // Canvas loop — only restarts on theme change
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const mouse  = { x: -9999, y: -9999 };
    let raf;

    // Snap to correct starting color for this theme
    const map = theme === 'light' ? SECTION_COLORS.light : SECTION_COLORS.dark;
    colorRef.current  = [...(map[currentSection] ?? map.home)];
    targetRef.current = [...colorRef.current];

    const COUNT = window.innerWidth < 768 ? 45 : 75;

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

      // ── Lerp color toward target ─────────────────────────────────────────
      const c = colorRef.current;
      const t = targetRef.current;
      c[0] += (t[0] - c[0]) * COLOR_LERP;
      c[1] += (t[1] - c[1]) * COLOR_LERP;
      c[2] += (t[2] - c[2]) * COLOR_LERP;
      const [aR, aG, aB] = c;

      // ── Pulse trigger ─────────────────────────────────────────────────────
      if (now > nextPulse) {
        particles[Math.floor(Math.random() * COUNT)].pulse = 1;
        nextPulse = now + 2000 + Math.random() * 2000;
      }

      // ── Update & draw particles ──────────────────────────────────────────
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
        const alpha   = Math.min(0.28 + flicker * 0.42 + p.pulse * 0.55, 1);
        const radius  = p.r + flicker * 0.4 + p.pulse * 4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${aR|0},${aG|0},${aB|0},${alpha})`;
        ctx.fill();

        if (p.pulse > 0.05) {
          const g = ctx.createRadialGradient(p.x, p.y, radius, p.x, p.y, radius + 18);
          g.addColorStop(0, `rgba(${aR|0},${aG|0},${aB|0},${p.pulse * 0.5})`);
          g.addColorStop(1, `rgba(${aR|0},${aG|0},${aB|0},0)`);
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
            ctx.strokeStyle = `rgba(${aR|0},${aG|0},${aB|0},${Math.min(fade * 0.13 + boost, 0.65)})`;
            ctx.lineWidth   = 0.7 + boost * 2;
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
