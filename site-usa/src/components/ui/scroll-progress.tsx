"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[9999] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #A88B3D 0%, #C5A55A 30%, #FFD700 50%, #C5A55A 70%, #A88B3D 100%)",
        boxShadow: "0 0 10px rgba(197,165,90,0.5), 0 0 30px rgba(197,165,90,0.2)",
      }}
    />
  );
}
