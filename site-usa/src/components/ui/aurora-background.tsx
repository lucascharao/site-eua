"use client";

import { useEffect, useRef } from "react";

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const waves = [
      { amplitude: 80, frequency: 0.003, speed: 0.008, yOffset: 0.3, color: "197, 165, 90" },
      { amplitude: 60, frequency: 0.005, speed: 0.012, yOffset: 0.4, color: "212, 185, 110" },
      { amplitude: 100, frequency: 0.002, speed: 0.006, yOffset: 0.5, color: "168, 139, 61" },
      { amplitude: 50, frequency: 0.007, speed: 0.015, yOffset: 0.35, color: "255, 215, 0" },
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;

      waves.forEach((wave) => {
        ctx.beginPath();
        const baseY = canvas.height * wave.yOffset;

        for (let x = 0; x <= canvas.width; x += 2) {
          const y =
            baseY +
            Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
            Math.sin(x * wave.frequency * 2.5 + time * wave.speed * 1.5) * (wave.amplitude * 0.3) +
            Math.cos(x * wave.frequency * 0.5 + time * wave.speed * 0.7) * (wave.amplitude * 0.5);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, baseY - wave.amplitude, 0, canvas.height);
        gradient.addColorStop(0, `rgba(${wave.color}, 0.06)`);
        gradient.addColorStop(0.3, `rgba(${wave.color}, 0.03)`);
        gradient.addColorStop(1, `rgba(${wave.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
