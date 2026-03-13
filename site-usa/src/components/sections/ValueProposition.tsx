"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Wrench, Award, UserCheck } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";

const differentiators = [
  { icon: UserCheck, label: "Owner Does the Work", description: "The person you talk to is the person tiling your bathroom. No middlemen. No day laborers. No surprises." },
  { icon: Wrench, label: "15+ Years Hands-On", description: "Over 500 bathrooms completed in Tampa Bay. Guest bathrooms, master bathrooms. That is all we do." },
  { icon: Award, label: "Schluter Certified", description: "Certified installer of Schluter waterproofing systems. Your shower will not leak in 5 years. Guaranteed." },
  { icon: Shield, label: "NTCA Compliant", description: "We follow National Tile Contractor Association standards. Not because we have to. Because cutting corners costs you more later." },
];

export function ValueProposition() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6" style={{ perspective: "1200px" }}>
      {/* Background orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold/3 rounded-full blur-[200px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading with 3D entrance */}
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 30 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold mb-6">
            Why 9 Out of 10 Tampa Homeowners{" "}
            <span className="gold-gradient-text">Pick the Wrong Contractor</span>
          </h2>
          <p className="text-lg md:text-xl text-[#999] max-w-3xl mx-auto font-[family-name:var(--font-cormorant)]">
            Most contractors in Tampa are project managers who never touch a tile. They hire the cheapest labor they can find.
            You pay premium. You get subcontractor roulette. Here is what we do differently.
          </p>
        </motion.div>

        {/* 3D Tilt Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {differentiators.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 50, rotateY: -20 }}
              animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              <TiltCard className="h-full" tiltDegrees={20}>
                <div className="relative p-8 rounded-2xl bg-surface border border-border-subtle h-full">
                  {/* Gold accent line */}
                  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

                  {/* 3D floating icon */}
                  <motion.div
                    animate={{ y: [0, -8, 0], rotateY: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                    className="mb-5 w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/20"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <item.icon className="w-8 h-8 text-gold" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-3 text-white">
                    {item.label}
                  </h3>
                  <p className="text-sm text-[#888] leading-relaxed">{item.description}</p>

                  {/* Bottom gold reflection */}
                  <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
