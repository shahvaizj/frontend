import { useEffect, useRef } from 'react';

const GRID = 72;
const COLOR_LERP = 0.025;

const SECTION_COLORS = {
  dark: {
    home:         [0,   245, 255],
    projects:     [170,   0, 255],
    skills:       [0,   255, 136],
    testimonials: [255,  45, 120],
    contact:      [255, 200,   0],
  },
  light: {
    home:         [0,   220, 240],
    projects:     [150,   0, 230],
    skills:       [0,   220, 110],
    testimonials: [230,  30, 100],
    contact:      [220, 170,   0],
  },
};

export default function BackgroundCanvas({ theme, currentSection }) {
  const canvasRef = useRef(null);
  const targetRef = useRef([0, 245, 255]);
  const colorRef  = useRef([0, 245, 255]);

  useEffect(() => {
    const map = theme === 'light' ? SECTION_COLORS.light : SECTION_COLORS.dark;
    targetRef.current = [...(map[currentSection] ?? map.home)];
  }, [currentSection, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let raf;
    let scanY = 0;

    const map = theme === 'light' ? SECTION_COLORS.light : SECTION_COLORS.dark;
    colorRef.current  = [...(map[currentSection] ?? map.home)];
    targetRef.current = [...colorRef.current];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      buildNodes();
    };

    let nodes = [];
    const buildNodes = () => {
      nodes = [];
      const cols = Math.ceil(canvas.width  / GRID) + 1;
      const rows = Math.ceil(canvas.height / GRID) + 1;
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          nodes.push({
            x:     i * GRID,
            y:     j * GRID,
            pulse: Math.random() < 0.06 ? Math.random() : 0,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const activateInterval = setInterval(() => {
      if (nodes.length) {
        nodes[Math.floor(Math.random() * nodes.length)].pulse = 1;
      }
    }, 500);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lerp color
      const c = colorRef.current;
      const t = targetRef.current;
      c[0] += (t[0] - c[0]) * COLOR_LERP;
      c[1] += (t[1] - c[1]) * COLOR_LERP;
      c[2] += (t[2] - c[2]) * COLOR_LERP;
      const R = c[0] | 0;
      const G = c[1] | 0;
      const B = c[2] | 0;

      // Grid lines
      ctx.save();
      ctx.lineWidth   = 0.5;
      ctx.strokeStyle = `rgba(${R},${G},${B},0.07)`;
      ctx.beginPath();
      const cols = Math.ceil(canvas.width  / GRID) + 1;
      const rows = Math.ceil(canvas.height / GRID) + 1;
      for (let i = 0; i <= cols; i++) {
        ctx.moveTo(i * GRID, 0);
        ctx.lineTo(i * GRID, canvas.height);
      }
      for (let j = 0; j <= rows; j++) {
        ctx.moveTo(0,            j * GRID);
        ctx.lineTo(canvas.width, j * GRID);
      }
      ctx.stroke();
      ctx.restore();

      // Scanline
      scanY = (scanY + 0.45) % (canvas.height + 60);
      const sg = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      sg.addColorStop(0,   `rgba(${R},${G},${B},0)`);
      sg.addColorStop(0.5, `rgba(${R},${G},${B},0.14)`);
      sg.addColorStop(1,   `rgba(${R},${G},${B},0)`);
      ctx.fillStyle = sg;
      ctx.fillRect(0, scanY - 40, canvas.width, 80);

      // Grid nodes
      for (const n of nodes) {
        n.phase += 0.018;
        if (n.pulse > 0) n.pulse = Math.max(0, n.pulse - 0.012);

        const flicker   = 0.35 + 0.65 * Math.sin(n.phase);
        const p         = n.pulse;
        const dotAlpha  = 0.06 + flicker * 0.07 + p * 0.75;
        const dotR      = 1.2 + p * 7;

        if (p > 0.04) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, dotR + 24);
          g.addColorStop(0, `rgba(${R},${G},${B},${p * 0.45})`);
          g.addColorStop(1, `rgba(${R},${G},${B},0)`);
          ctx.beginPath();
          ctx.arc(n.x, n.y, dotR + 24, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(0.5, dotR), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${R},${G},${B},${Math.min(dotAlpha, 1)})`;
        ctx.fill();
      }

      // Side corner glows
      const washW = Math.min(320, canvas.width * 0.22);
      const lw = ctx.createLinearGradient(0, 0, washW, 0);
      lw.addColorStop(0, `rgba(${R},${G},${B},0.16)`);
      lw.addColorStop(1, `rgba(${R},${G},${B},0)`);
      ctx.fillStyle = lw;
      ctx.fillRect(0, 0, washW, canvas.height);

      const rw = ctx.createLinearGradient(canvas.width, 0, canvas.width - washW, 0);
      rw.addColorStop(0, `rgba(${R},${G},${B},0.16)`);
      rw.addColorStop(1, `rgba(${R},${G},${B},0)`);
      ctx.fillStyle = rw;
      ctx.fillRect(canvas.width - washW, 0, washW, canvas.height);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(activateInterval);
      window.removeEventListener('resize', resize);
    };
  }, [theme]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
