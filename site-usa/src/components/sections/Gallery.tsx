"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { LiquidBlob } from "@/components/ui/liquid-blob";


const galleryImages = [
  {
    src: "/images/bathrooms/bathroom-1.webp",
    alt: "Dream Master Suite",
    description: "Freestanding tub, marble accent wall & frameless glass. Done in 12 days.",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/images/bathrooms/bathroom-2.webp",
    alt: "Full Marble + Gold Hardware",
    description: "This South Tampa homeowner fired 2 contractors before finding us. Done right.",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/images/bathrooms/bathroom-3.webp",
    alt: "Guest Bath Transformation",
    description: "From 1990s pink tile to this. Guests now ask 'Who did your bathroom?'",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/images/bathrooms/bathroom-4.webp",
    alt: "5-Star Hotel Feel at Home",
    description: "Double vessel sinks, LED backlit mirror. $38K all-in. Zero change orders.",
    span: "md:col-span-2 md:row-span-1",
  },
];

function GalleryCard({ img, index }: { img: (typeof galleryImages)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  function handleMouseMove(e: React.MouseEvent) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      className={`group relative overflow-hidden rounded-2xl h-full w-full cursor-pointer`}
    >
      <Image
        src={img.src}
        alt={img.alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Vignette escura permanente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

      {/* Gold glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/0 via-transparent to-gold/0 group-hover:from-gold/15 group-hover:to-gold/10 transition-all duration-500" />

      {/* Border glow */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/50 rounded-2xl transition-all duration-500" />
      <div className="absolute inset-0 rounded-2xl group-hover:shadow-[inset_0_0_60px_rgba(197,165,90,0.2)] transition-all duration-500" />

      {/* Corner accents */}
      <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-gold/0 group-hover:border-gold/70 transition-all duration-500 delay-100" />
      <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-gold/0 group-hover:border-gold/70 transition-all duration-500 delay-100" />

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <span className="text-gold font-semibold text-sm tracking-wider uppercase drop-shadow-lg">
          {img.alt}
        </span>
        <p className="text-white/80 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 drop-shadow-lg">
          {img.description}
        </p>
        <div className="mt-2 w-0 group-hover:w-16 h-0.5 bg-gradient-to-r from-gold to-transparent transition-all duration-700" />
      </div>
    </motion.div>
  );
}

export function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="gallery" className="relative pt-0 pb-16 md:pb-20 px-6 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/3 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/2 rounded-full blur-[150px]" />

      {/* Liquid Blobs */}
      <LiquidBlob className="top-[5%] right-[15%]" size={350} duration={22} color="rgba(197, 165, 90, 0.05)" />
      <LiquidBlob className="bottom-[10%] left-[10%]" size={280} duration={18} delay={4} color="rgba(168, 139, 61, 0.04)" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Gallery Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 auto-rows-[280px] md:auto-rows-[300px] gap-4"
          style={{ perspective: "1200px" }}
        >
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80, scale: 0.85 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
              className={`${img.span} h-full`}
            >
              <GalleryCard img={img} index={i} />
            </motion.div>
          ))}
        </div>

        {/* CTA below gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <MagneticButton
            href="#contact"
            magnetStrength={0.3}
            className="inline-block px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-[#0A0A0A] font-semibold text-lg rounded-lg gold-glow transition-all duration-300 cursor-pointer"
          >
            I Want a Bathroom Like This
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
