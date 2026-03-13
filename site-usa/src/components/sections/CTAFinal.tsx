"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Phone, Mail, Clock } from "lucide-react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { TextDecode } from "@/components/ui/text-decode";
import { LiquidBlob } from "@/components/ui/liquid-blob";

export function CTAFinal() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-5deg", "5deg"]);

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      id="contact"
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Background with bathroom image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-12"
          style={{ backgroundImage: "url(/images/bathrooms/bathroom-4.webp)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/95 to-[#0A0A0A]" />
      </div>

      {/* Gold orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[200px] bg-gold/3 rounded-full blur-[120px]" />

      {/* Liquid Blobs */}
      <LiquidBlob className="top-[20%] left-[10%]" size={300} duration={20} color="rgba(197, 165, 90, 0.06)" />
      <LiquidBlob className="bottom-[15%] right-[10%]" size={250} duration={16} delay={3} color="rgba(212, 185, 110, 0.05)" />

      {/* Floating 3D geometric shapes */}
      <motion.div
        animate={{ rotateZ: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-[10%] w-20 h-20 border border-gold/10"
      />
      <motion.div
        animate={{ rotateZ: [360, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-[10%] w-16 h-16 border border-gold/10 rotate-45"
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 30 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1 }}
          style={{ transform: "translateZ(40px)" }}
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            <TextDecode text="Your New Bathroom" className="font-[family-name:var(--font-playfair)] !font-bold" speed={25} />{" "}
            <span className="gold-gradient-text">
              <TextDecode text="Starts Here" className="font-[family-name:var(--font-playfair)] !font-bold gold-gradient-text" speed={25} delay={400} />
            </span>
          </h2>
          <div className="mb-10">
            <TextShimmer
              as="p"
              className="text-xl font-[family-name:var(--font-cormorant)]"
              duration={3}
            >
              Free estimate. No pressure. We show up, measure, and give you an honest number.
            </TextShimmer>
          </div>
        </motion.div>

        {/* CTA Button with 3D */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
          className="mb-12"
          style={{ transform: "translateZ(60px)" }}
        >
          <MagneticButton
            href="tel:8133899868"
            magnetStrength={0.4}
            className="inline-block relative px-12 py-5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-[#0A0A0A] font-bold text-xl rounded-xl gold-glow overflow-hidden cursor-pointer"
          >
            <span className="relative z-10">Yes, I Want My Free Estimate</span>
          </MagneticButton>
        </motion.div>

        {/* Contact info with 3D entrance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 text-[#999]"
          style={{ transform: "translateZ(30px)" }}
        >
          <motion.a
            href="tel:8133899868"
            whileHover={{ scale: 1.05, y: -3 }}
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <Phone className="w-5 h-5 text-gold/70" />
            (813) 389-9868
          </motion.a>
          <motion.a
            href="mailto:Info@groutaboutbathroom.com"
            whileHover={{ scale: 1.05, y: -3 }}
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <Mail className="w-5 h-5 text-gold/70" />
            Info@groutaboutbathroom.com
          </motion.a>
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            className="flex items-center gap-2"
          >
            <Clock className="w-5 h-5 text-gold/70" />
            Mon-Sat, 8am-6pm
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
