"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin } from "lucide-react";
import { TextShimmer } from "@/components/ui/text-shimmer";

const areas = [
  "Apollo Beach", "Brandon", "Riverview", "Valrico", "Gibsonton",
  "Ruskin", "Sun City Center", "South Tampa", "Hyde Park", "Davis Island",
];

export function ServiceAreas() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6" style={{ perspective: "1200px" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 25 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold mb-4">
            We Come to <span className="gold-gradient-text">You</span>
          </h2>
          <TextShimmer
            as="p"
            className="text-lg font-[family-name:var(--font-cormorant)]"
            duration={3}
          >
            500+ bathrooms completed across these Tampa Bay communities
          </TextShimmer>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3" style={{ perspective: "800px" }}>
          {areas.map((area, i) => (
            <motion.div
              key={area}
              initial={{ opacity: 0, scale: 0.5, rotateX: 45, rotateY: i % 2 === 0 ? 20 : -20 }}
              animate={isInView ? { opacity: 1, scale: 1, rotateX: 0, rotateY: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.06, type: "spring", stiffness: 150 }}
              whileHover={{
                scale: 1.1,
                rotateY: 10,
                z: 30,
                transition: { duration: 0.3 },
              }}
              className="group flex items-center gap-2 px-6 py-3 rounded-full border border-border-subtle bg-surface hover:border-gold/40 hover:bg-gold/5 cursor-default transition-colors duration-300"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              >
                <MapPin className="w-4 h-4 text-gold/60 group-hover:text-gold transition-colors" />
              </motion.div>
              <span className="text-sm text-[#ccc] group-hover:text-white transition-colors font-medium">{area}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
