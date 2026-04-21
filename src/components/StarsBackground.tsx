import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  alpha: number;
  twinkle: number;
  twinkleSpeed: number;
}

interface StarsBackgroundProps {
  isDark: boolean;
}

export default function StarsBackground({ isDark }: StarsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const STAR_COUNT = 180;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const mkStar = (): Star => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      baseX: 0,
      baseY: 0,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      alpha: Math.random() * 0.5 + 0.15,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    });

    starsRef.current = Array.from({ length: STAR_COUNT }, () => {
      const s = mkStar();
      s.baseX = s.x;
      s.baseY = s.y;
      return s;
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener("mousemove", handleMouseMove);

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((s) => {
        s.twinkle += s.twinkleSpeed;
        const tw = Math.sin(s.twinkle) * 0.3 + 0.7;

        s.x += s.vx;
        s.y += s.vy;

        const dx = mouseRef.current.x - s.x;
        const dy = mouseRef.current.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const force = ((180 - dist) / 180) * 0.18;
          s.x += (dx / dist) * force;
          s.y += (dy / dist) * force;
        }

        if (s.x < -5) s.x = canvas.width + 5;
        if (s.x > canvas.width + 5) s.x = -5;
        if (s.y < -5) s.y = canvas.height + 5;
        if (s.y > canvas.height + 5) s.y = -5;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        if (isDark) {
          ctx.fillStyle = `rgba(200,240,220,${s.alpha * tw})`;
        } else {
          ctx.fillStyle = `rgba(10,80,50,${s.alpha * tw * 0.45})`;
        }
        ctx.fill();
      });

      requestAnimationFrame(drawStars);
    };
    drawStars();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDark]);

  return <canvas id="stars-canvas" ref={canvasRef}></canvas>;
}
