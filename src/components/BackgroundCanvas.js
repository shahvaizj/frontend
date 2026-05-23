import { useEffect, useRef } from 'react';

const CONNECT_DIST = 140;
const BASE_SPEED   = 0.32;

export default function BackgroundCanvas({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const mouse  = { x: -9999, y: -9999 };
    let raf;

    const isDark       = theme !== 'light';
    const [aR, aG, aB] = isDark ? [45, 212, 191] : [13, 148, 136];

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

      if (now > nextPulse) {
        particles[Math.floor(Math.random() * COUNT)].pulse = 1;
        nextPulse = now + 2000 + Math.random() * 2000;
      }

      // ── Update & draw particles ──────────────────────────────────────────
      for (const p of particles) {
        p.phase += 0.018;

        // Mouse attraction
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < 200 * 200 && md2 > 1) {
          const md = Math.sqrt(md2);
          p.vx += (mdx / md) * 0.015;
          p.vy += (mdy / md) * 0.015;
        }

        // Speed cap
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 1.2) { p.vx *= 0.95; p.vy *= 0.95; }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if      (p.x < -10)               p.x = canvas.width  + 10;
        else if (p.x > canvas.width  + 10) p.x = -10;
        if      (p.y < -10)               p.y = canvas.height + 10;
        else if (p.y > canvas.height + 10) p.y = -10;

        if (p.pulse > 0) p.pulse = Math.max(0, p.pulse - 0.022);

        // Core dot
        const flicker = 0.5 + 0.5 * Math.sin(p.phase);
        const alpha   = Math.min(0.28 + flicker * 0.42 + p.pulse * 0.55, 1);
        const radius  = p.r + flicker * 0.4 + p.pulse * 4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${aR},${aG},${aB},${alpha})`;
        ctx.fill();

        // Halo on pulse
        if (p.pulse > 0.05) {
          const g = ctx.createRadialGradient(p.x, p.y, radius, p.x, p.y, radius + 18);
          g.addColorStop(0, `rgba(${aR},${aG},${aB},${p.pulse * 0.5})`);
          g.addColorStop(1, `rgba(${aR},${aG},${aB},0)`);
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
            ctx.strokeStyle = `rgba(${aR},${aG},${aB},${Math.min(fade * 0.13 + boost, 0.65)})`;
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
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
