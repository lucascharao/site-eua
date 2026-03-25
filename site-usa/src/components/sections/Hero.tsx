"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Phone } from "lucide-react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Boxes } from "@/components/ui/background-boxes";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { TextDecode } from "@/components/ui/text-decode";
import { LiquidBlob } from "@/components/ui/liquid-blob";
import { WebcamPixelGrid } from "@/components/ui/webcam-pixel-grid";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-8deg", "8deg"]);
  const parallaxX = useTransform(springX, [-0.5, 0.5], ["-30px", "30px"]);
  const parallaxY = useTransform(springY, [-0.5, 0.5], ["-30px", "30px"]);
  const parallaxX2 = useTransform(springX, [-0.5, 0.5], ["20px", "-20px"]);
  const parallaxY2 = useTransform(springY, [-0.5, 0.5], ["20px", "-20px"]);

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
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-24 md:py-32 flex items-center justify-center overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0d0b06] to-[#0A0A0A]" />

      {/* Aurora Borealis Effect */}
      <AuroraBackground />

      {/* Liquid Blobs */}
      <LiquidBlob className="top-[10%] left-[5%]" size={500} duration={25} color="rgba(197, 165, 90, 0.06)" />
      <LiquidBlob className="bottom-[10%] right-[5%]" size={350} duration={18} delay={5} color="rgba(212, 185, 110, 0.05)" />
      <LiquidBlob className="top-[40%] right-[20%]" size={250} duration={22} delay={8} color="rgba(255, 215, 0, 0.04)" />

      {/* Interactive grid background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-[2]">
        <Boxes />
        <div className="absolute inset-0 w-full h-full bg-[#0A0A0A]/80 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] pointer-events-none" />
      </div>

      {/* Floating 3D gold geometric shapes - Layer 1 */}
      <motion.div
        style={{ x: parallaxX, y: parallaxY }}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.div
          animate={{ rotateZ: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-[10%] w-32 h-32 border border-gold/20 rotate-45"
        />
        <motion.div
          animate={{ rotateZ: [360, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 right-[15%] w-20 h-20 border border-gold/15 rotate-12"
        />
        <motion.div
          animate={{ rotateZ: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-32 left-[20%] w-24 h-24 border-2 border-gold/10"
        />
        <motion.div
          animate={{ rotateZ: [360, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-[25%] w-16 h-16 bg-gold/5 rotate-45"
        />
      </motion.div>

      {/* Floating 3D shapes - Layer 2 (counter-parallax) */}
      <motion.div
        style={{ x: parallaxX2, y: parallaxY2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, -30, 0], rotateX: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-[5%] w-12 h-12 border border-gold/20"
          style={{ transformStyle: "preserve-3d" }}
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotateY: [0, 180, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[8%] w-16 h-16 border border-gold/10"
          style={{ transformStyle: "preserve-3d" }}
        />
        <motion.div
          animate={{ y: [0, -25, 0], rotateZ: [0, 90, 180, 270, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[40%] right-[12%] w-10 h-10 bg-gold/8"
          style={{ transformStyle: "preserve-3d" }}
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60%] left-[15%] w-8 h-8 rounded-full bg-gold/10"
        />
      </motion.div>

      {/* Gold gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold/3 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/3 rounded-full blur-[200px]" />

      {/* Content with 3D tilt */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Logo with 3D spinning effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-8 flex justify-center [perspective:1000px]"
          style={{ transform: "translateZ(80px)" }}
        >
          <div className="relative w-36 h-36 md:w-48 md:h-48">
            {/* Container 3D que gira */}
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="relative w-full h-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Face frontal */}
              <Image
                src="/logos/logo-3d.png"
                alt="Grout & About"
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(197,165,90,0.5)]"
                style={{ backfaceVisibility: "hidden" }}
                priority
              />
              {/* Face traseira (espelhada) */}
              <Image
                src="/logos/logo-3d.png"
                alt=""
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(197,165,90,0.5)]"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
                aria-hidden="true"
              />
            </motion.div>
            {/* Sombra no chão que acompanha a rotação */}
            <motion.div
              animate={{
                scaleX: [0.6, 1, 0.6],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-gold/20 rounded-full blur-lg"
            />
          </div>
        </motion.div>

        {/* Headline with 3D depth */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ transform: "translateZ(60px)" }}
        >
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <TextDecode text="Stop Showering in a Bathroom" className="font-[family-name:var(--font-playfair)] !font-bold" speed={25} />{" "}
            <span className="gold-gradient-text">
              <TextDecode text="You're Embarrassed By" className="font-[family-name:var(--font-playfair)] !font-bold gold-gradient-text" speed={25} delay={600} />
            </span>
          </h1>
        </motion.div>

        {/* Subtitle with shimmer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ transform: "translateZ(40px)" }}
          className="mb-10"
        >
          <TextShimmer
            as="p"
            className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl max-w-2xl mx-auto [--base-color:#d4d4d8] [--base-gradient-color:#F5E6B8] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            duration={3}
          >
            The owner does the work. Not a subcontractor. Not a day laborer. 500+ bathrooms. 15+ years. Schluter certified. Tampa Bay only.
          </TextShimmer>
        </motion.div>

        {/* CTAs with 3D pop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          style={{ transform: "translateZ(50px)" }}
        >
          <MagneticButton
            href="#contact"
            magnetStrength={0.3}
            className="group relative px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-[#0A0A0A] font-semibold text-lg rounded-lg overflow-hidden transition-all duration-300 gold-glow cursor-pointer"
          >
            <span className="relative z-10">Claim Your Free $500 Estimate</span>
          </MagneticButton>
          <MagneticButton
            href="tel:8133899868"
            magnetStrength={0.3}
            className="flex items-center gap-2 px-8 py-4 border border-gold/30 text-gold font-medium rounded-lg transition-all duration-300 hover:border-gold/60 hover:bg-gold/5 cursor-pointer"
          >
            <Phone className="w-5 h-5" />
            (813) 389-9868
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Webcam Pixel Grid Background */}
      <div className="absolute inset-0 z-[1]">
        <WebcamPixelGrid
          gridCols={32}
          gridRows={20}
          maxElevation={30}
          motionSensitivity={0.2}
          elevationSmoothing={0.15}
          colorMode="webcam"
          backgroundColor="#2a2520"
          mirror={true}
          gapRatio={0.08}
          invertColors={false}
          darken={0.45}
          borderColor="#c5a55a"
          borderOpacity={0.03}
          className="w-full h-full"
        />
      </div>
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/60 via-black/40 to-black/70 pointer-events-none" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10" />
    </section>
  );
}
