"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const GOLD_COLORS = [
  "rgba(197, 165, 90, ",
  "rgba(212, 185, 110, ",
  "rgba(255, 215, 0, ",
  "rgba(218, 165, 32, ",
  "rgba(168, 139, 61, ",
];

export function MagicCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let animationId: number;
    let lastX = -1000;
    let lastY = -1000;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const spawnParticles = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 0.5;
        const life = Math.random() * 40 + 20;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 1.5,
          life,
          maxLife: life,
          size: Math.random() * 3 + 1,
          color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 3) {
        const count = Math.min(Math.floor(dist / 5) + 1, 4);
        spawnParticles(mouseX, mouseY, count);
        lastX = mouseX;
        lastY = mouseY;
      }
    };

    const onMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Glow no cursor
      if (mouseX > 0 && mouseY > 0) {
        const glow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 120);
        glow.addColorStop(0, "rgba(197, 165, 90, 0.08)");
        glow.addColorStop(0.5, "rgba(197, 165, 90, 0.03)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(mouseX - 120, mouseY - 120, 240, 240);
      }

      // Partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // gravidade leve
        p.vx *= 0.99;
        p.life--;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = (p.life / p.maxLife) * 0.9;
        const size = p.size * (p.life / p.maxLife);

        // Brilho da partícula
        ctx.beginPath();
        ctx.arc(p.x, p.y, size + 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (alpha * 0.3).toFixed(3) + ")";
        ctx.fill();

        // Partícula central
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + alpha.toFixed(3) + ")";
        ctx.fill();
      }

      // Limitar partículas
      if (particles.length > 200) {
        particles = particles.slice(-200);
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] w-full h-full"
    />
  );
}
