"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const showcaseImages = [
  { src: "/images/bathrooms/bathroom-1.webp", alt: "Master bathroom with freestanding tub and glass shower", label: "Master Bathroom" },
  { src: "/images/bathrooms/bathroom-2.webp", alt: "Luxury bathroom with gold fixtures and marble", label: "Gold & Marble" },
  { src: "/images/bathrooms/bathroom-3.webp", alt: "Classic white bathroom with dual vanity", label: "Classic White" },
  { src: "/images/bathrooms/bathroom-4.webp", alt: "Modern bathroom with gold accents and LED lighting", label: "Modern Luxury" },
];

export function ShowcaseStrip() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="relative py-4 md:py-6 overflow-hidden">
      {/* Gold accent lines */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-1.5 max-w-[100vw]">
        {showcaseImages.map((img, i) => (
          <motion.div
            key={img.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group relative aspect-[4/3] md:aspect-[16/10] overflow-hidden cursor-pointer"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-500" />
            {/* Gold border on hover */}
            <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 transition-all duration-500" />
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-gold text-xs md:text-sm font-semibold uppercase tracking-wider">{img.label}</span>
              <div className="mt-1 w-8 h-0.5 bg-gradient-to-r from-gold to-transparent" />
            </div>
            {/* Corner accents on hover */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-gold/0 group-hover:border-gold/50 transition-all duration-500" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-gold/0 group-hover:border-gold/50 transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
