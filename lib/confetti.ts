// Lightweight canvas confetti — no dependencies. Gold + evergreen palette so a
// completed milestone reads as "dividends raining in". Respects reduced motion.

interface ConfettiOptions {
  /** Origin in viewport pixels. Defaults to top-center. */
  x?: number;
  y?: number;
  count?: number;
  spread?: number;
  power?: number;
}

const COLORS = ["#C9A227", "#1A6B4F", "#6FBF9A", "#E9DFA8", "#0E2A22"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vrot: number;
  color: string;
  life: number;
}

export function fireConfetti(options: ConfettiOptions = {}) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const {
    x = window.innerWidth / 2,
    y = window.innerHeight * 0.18,
    count = 90,
    spread = 1,
    power = 1,
  } = options;

  const canvas = document.createElement("canvas");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;";
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  const particles: Particle[] = Array.from({ length: count }, () => {
    const angle = (-Math.PI / 2) + (Math.random() - 0.5) * (Math.PI * spread);
    const speed = (6 + Math.random() * 7) * power;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
      vy: Math.sin(angle) * speed,
      size: 5 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vrot: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 0,
    };
  });

  const gravity = 0.28;
  const drag = 0.992;
  const maxLife = 240;
  let raf = 0;

  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    for (const p of particles) {
      p.vy += gravity;
      p.vx *= drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      p.life += 1;

      const fade = Math.max(0, 1 - p.life / maxLife);
      if (fade > 0 && p.y < window.innerHeight + 40) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = fade;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        ctx.restore();
      }
    }

    if (alive) {
      raf = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(raf);
      canvas.remove();
    }
  };

  raf = requestAnimationFrame(tick);
}
