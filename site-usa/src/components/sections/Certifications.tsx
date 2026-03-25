"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Medal } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";

export function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="relative py-20 px-6" style={{ perspective: "1200px" }}>
      {/* Gold line separator */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 15 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12"
        >
          {/* Schluter */}
          <motion.div
            initial={{ opacity: 0, x: -40, rotateY: 20 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <TiltCard tiltDegrees={15}>
              <div className="flex items-center gap-5 p-6 rounded-2xl bg-surface border border-border-subtle">
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-18 h-18 rounded-full border-2 border-gold/40 flex items-center justify-center bg-gold/5"
                  style={{ transformStyle: "preserve-3d", width: "72px", height: "72px" }}
                >
                  <ShieldCheck className="w-9 h-9 text-gold" />
                </motion.div>
                <div>
                  <p className="text-white font-semibold text-lg">Schluter Certified Installer</p>
                  <p className="text-[#888] text-sm">Your shower won&apos;t leak. Guaranteed.</p>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Divider with 3D diamond */}
          <motion.div
            animate={{ rotateZ: [0, 360] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border border-gold/40 rotate-45 hidden md:block"
          />

          {/* NTCA */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -20 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <TiltCard tiltDegrees={15}>
              <div className="flex items-center gap-5 p-6 rounded-2xl bg-surface border border-border-subtle">
                <motion.div
                  animate={{ rotateY: [360, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-18 h-18 rounded-full border-2 border-gold/40 flex items-center justify-center bg-gold/5"
                  style={{ transformStyle: "preserve-3d", width: "72px", height: "72px" }}
                >
                  <Medal className="w-9 h-9 text-gold" />
                </motion.div>
                <div>
                  <p className="text-white font-semibold text-lg">NTCA Compliant</p>
                  <p className="text-[#888] text-sm">Built to the highest industry standard. No shortcuts.</p>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>

        {/* Quote with 3D entrance */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 20 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl text-[#888] italic">
            &ldquo;You can put $15,000 worth of gorgeous tile on top of bad waterproofing — and in 3 years
            you&apos;ll rip it all out and pay twice. We make sure that never happens.&rdquo;
          </p>
        </motion.div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
