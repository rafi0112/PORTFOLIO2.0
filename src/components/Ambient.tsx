import { useEffect, useRef } from "react";
import { getTheme, prefersReducedMotion, type AmbientKind } from "../themes";

interface Particle {
  x: number;
  y: number;
  z: number; // depth 0.3..1 — nearer particles are bigger and move more
  vx: number;
  vy: number;
  r: number;
  rot: number;
  vr: number;
  phase: number;
  color: number; // index into the palette
}

interface Palette {
  colors: string[];
  glows: HTMLCanvasElement[];
}

const DENSITY: Record<AmbientKind, number> = {
  dust: 16000,
  stars: 9000,
  leaves: 52000,
  motes: 20000,
  fireflies: 36000,
  flecks: 20000,
  petals: 46000,
};

function readVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function makeGlow(color: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, color);
  grad.addColorStop(0.25, color);
  grad.addColorStop(1, "transparent");
  g.globalAlpha = 1;
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

function paletteFor(kind: AmbientKind): Palette {
  const ink = readVar("--ink");
  const acc = readVar("--acc");
  const acc2 = readVar("--acc2");
  const acc3 = readVar("--acc3");
  const byKind: Record<AmbientKind, string[]> = {
    dust: [ink, ink, acc],
    stars: [ink, ink, acc3],
    leaves: [acc2, acc3, acc2],
    motes: [acc3, acc],
    fireflies: [acc3, acc],
    flecks: [acc, acc3],
    petals: [acc3, acc, acc3],
  };
  const colors = byKind[kind];
  return { colors, glows: colors.map(makeGlow) };
}

function spawn(kind: AmbientKind, w: number, h: number, nColors: number): Particle {
  const z = 0.3 + Math.random() * 0.7;
  const p: Particle = {
    x: Math.random() * w,
    y: Math.random() * h,
    z,
    vx: 0,
    vy: 0,
    r: 1,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.02,
    phase: Math.random() * Math.PI * 2,
    color: Math.floor(Math.random() * nColors),
  };
  switch (kind) {
    case "dust":
      p.r = (0.5 + Math.random() * 1.4) * z;
      p.vx = 0.06 * z;
      p.vy = -0.05 * z;
      break;
    case "stars":
      p.r = (0.4 + Math.random() * 1.2) * z;
      break;
    case "leaves":
    case "petals":
      p.r = (kind === "leaves" ? 5 : 4) + Math.random() * 4 * z;
      p.vy = (0.25 + Math.random() * 0.35) * z;
      p.vr = (Math.random() - 0.5) * 0.03;
      break;
    case "motes":
      p.r = (1 + Math.random() * 2.2) * z;
      p.vy = -(0.08 + Math.random() * 0.15) * z;
      break;
    case "fireflies":
      p.r = 2 + Math.random() * 2.5 * z;
      break;
    case "flecks":
      p.r = (1.2 + Math.random() * 2.4) * z;
      p.vy = 0.05 * z;
      p.vr = (Math.random() - 0.5) * 0.015;
      break;
  }
  return p;
}

interface Shooter {
  x: number;
  y: number;
  life: number;
}

export default function Ambient({ themeId }: { themeId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const kind = getTheme(themeId).ambient;
    const reduced = prefersReducedMotion();
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    // The theme's CSS variables may still be mid view-transition; read them
    // on the next frame so the palette matches the new theme.
    let pal: Palette = { colors: [], glows: [] };
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let t = 0;
    const mouse = { x: -9999, y: -9999 };
    let shooter: Shooter | null = null;
    let nextShooter = 240;

    const resize = () => {
      // Mobile URL bars resize the viewport while scrolling; only respawn
      // when the width changes so particles don't jump.
      const widthChanged = window.innerWidth !== w;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!widthChanged && particles.length) return;
      const mobileScale = w < 760 ? 0.6 : 1;
      const n = Math.min(140, Math.round(((w * h) / DENSITY[kind]) * mobileScale));
      particles = Array.from({ length: n }, () => spawn(kind, w, h, pal.colors.length || 1));
    };

    const drawParticle = (p: Particle, x: number, y: number, alpha: number) => {
      const color = pal.colors[p.color % pal.colors.length];
      ctx.globalAlpha = alpha;
      switch (kind) {
        case "dust":
        case "stars": {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, p.r, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case "motes":
        case "fireflies": {
          const s = p.r * (kind === "fireflies" ? 7 : 5);
          ctx.drawImage(pal.glows[p.color % pal.glows.length], x - s / 2, y - s / 2, s, s);
          break;
        }
        case "flecks": {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(p.rot);
          ctx.fillStyle = color;
          ctx.fillRect(-p.r, -p.r * 0.35, p.r * 2, p.r * 0.7);
          ctx.restore();
          break;
        }
        case "leaves": {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(p.rot);
          ctx.scale(1, 0.55 + 0.45 * Math.sin(p.phase + t * 0.03));
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(-p.r, 0);
          ctx.quadraticCurveTo(0, -p.r * 0.7, p.r, 0);
          ctx.quadraticCurveTo(0, p.r * 0.7, -p.r, 0);
          ctx.fill();
          ctx.restore();
          break;
        }
        case "petals": {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(p.rot);
          ctx.scale(1, 0.6 + 0.4 * Math.sin(p.phase + t * 0.025));
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(0, -p.r);
          ctx.bezierCurveTo(p.r, -p.r * 0.6, p.r * 0.7, p.r * 0.8, 0, p.r);
          ctx.bezierCurveTo(-p.r * 0.7, p.r * 0.8, -p.r, -p.r * 0.6, 0, -p.r);
          ctx.fill();
          ctx.restore();
          break;
        }
      }
    };

    const baseAlpha: Record<AmbientKind, number> = {
      dust: 0.22,
      stars: 0.75,
      leaves: 0.3,
      motes: 0.35,
      fireflies: 0.85,
      flecks: 0.45,
      petals: 0.38,
    };

    const frame = () => {
      t++;
      ctx.clearRect(0, 0, w, h);
      const scroll = window.scrollY;
      for (const p of particles) {
        if (!reduced) {
          p.phase += 0.01;
          p.rot += p.vr;
          if (kind === "fireflies") {
            p.vx += (Math.random() - 0.5) * 0.04;
            p.vy += (Math.random() - 0.5) * 0.04;
            p.vx *= 0.97;
            p.vy *= 0.97;
          }
          const sway = kind === "leaves" || kind === "petals" ? Math.sin(p.phase * 1.3) * 0.35 * p.z : 0;
          p.x += p.vx + sway;
          p.y += p.vy;

          // Gentle push away from the cursor.
          const py = (((p.y - scroll * p.z * 0.25) % h) + h) % h;
          const dx = p.x - mouse.x;
          const dy = py - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120 && d2 > 1) {
            const f = (1 - Math.sqrt(d2) / 120) * 1.6 * p.z;
            const d = Math.sqrt(d2);
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
          if (p.x < -20) p.x += w + 40;
          if (p.x > w + 20) p.x -= w + 40;
        }
        const x = p.x;
        const y = (((p.y - scroll * p.z * 0.25) % (h + 40)) + h + 40) % (h + 40) - 20;
        let a = baseAlpha[kind] * (0.45 + 0.55 * p.z);
        if (kind === "stars") a *= 0.5 + 0.5 * Math.sin(p.phase * 3 + t * 0.02);
        if (kind === "fireflies") a *= 0.35 + 0.65 * Math.max(0, Math.sin(p.phase * 2.2));
        if (kind === "flecks") a *= 0.4 + 0.6 * Math.abs(Math.cos(p.rot * 2));
        drawParticle(p, x, y, a);
      }

      // Shooting stars on the night themes.
      if ((kind === "stars" || kind === "fireflies") && !reduced) {
        if (!shooter && --nextShooter <= 0) {
          shooter = { x: w * (0.3 + Math.random() * 0.6), y: h * Math.random() * 0.35, life: 0 };
          nextShooter = 400 + Math.random() * 500;
        }
        if (shooter) {
          shooter.life++;
          const len = 110;
          const sx = shooter.x - shooter.life * 9;
          const sy = shooter.y + shooter.life * 4.5;
          const grad = ctx.createLinearGradient(sx, sy, sx + len, sy - len / 2);
          grad.addColorStop(0, pal.colors[pal.colors.length - 1]);
          grad.addColorStop(1, "transparent");
          ctx.globalAlpha = Math.max(0, 1 - shooter.life / 45);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + len, sy - len / 2);
          ctx.stroke();
          if (shooter.life > 45) shooter = null;
        }
      }
      ctx.globalAlpha = 1;
      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };

    const startRaf = requestAnimationFrame(() => {
      pal = paletteFor(kind);
      resize();
      frame();
    });
    const onResize = () => {
      resize();
      if (reduced) frame(); // resizing clears the canvas; redraw the still frame
    };
    window.addEventListener("resize", onResize);
    if (finePointer) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(startRaf);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [themeId]);

  return <canvas id="ambient" ref={canvasRef} aria-hidden />;
}
