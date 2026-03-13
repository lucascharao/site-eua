"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  tiltDegrees?: number;
}

export function TiltCard({
  children,
  className,
  glowColor = "rgba(197, 165, 90, 0.4)",
  tiltDegrees = 15,
}: TiltCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${tiltDegrees}deg`, `-${tiltDegrees}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${tiltDegrees}deg`, `${tiltDegrees}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={cn("relative cursor-pointer", className)}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
    >
      {/* 3D depth content */}
      <motion.div className="relative z-10" style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </motion.div>

      {/* Glow border on hover */}
      {isHovered && (
        <motion.div
          className="absolute -inset-[1px] rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: `linear-gradient(135deg, ${glowColor}, transparent 60%)`,
            boxShadow: `0 0 40px 2px ${glowColor}`,
          }}
        />
      )}
    </motion.div>
  );
}
