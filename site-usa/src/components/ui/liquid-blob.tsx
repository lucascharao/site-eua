"use client";

import { motion } from "framer-motion";

interface LiquidBlobProps {
  className?: string;
  color?: string;
  size?: number;
  duration?: number;
  delay?: number;
}

export function LiquidBlob({
  className = "",
  color = "rgba(197, 165, 90, 0.08)",
  size = 400,
  duration = 20,
  delay = 0,
}: LiquidBlobProps) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 70%)`,
        filter: `blur(${size * 0.15}px)`,
      }}
      animate={{
        borderRadius: [
          "60% 40% 30% 70% / 60% 30% 70% 40%",
          "30% 60% 70% 40% / 50% 60% 30% 60%",
          "40% 60% 50% 50% / 35% 45% 55% 65%",
          "50% 50% 40% 60% / 60% 40% 60% 40%",
          "60% 40% 30% 70% / 60% 30% 70% 40%",
        ],
        scale: [1, 1.1, 0.95, 1.05, 1],
        rotate: [0, 90, 180, 270, 360],
        x: [0, 30, -20, 15, 0],
        y: [0, -25, 20, -10, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
