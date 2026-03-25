"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Bath, Paintbrush, Wrench } from "lucide-react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

const services = [
  {
    icon: Bath,
    title: "Complete Gut & Rebuild",
    description: "Rip it out. Start fresh. Tile, fixtures, vanity, lighting — one crew, one timeline, one price. No surprise change orders. No 'we forgot to mention' invoices. The bathroom you've been scrolling Pinterest for — built in 10-14 days.",
    image: "/images/bathrooms/bathroom-1.webp",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    icon: Paintbrush,
    title: "Guest Bath That Impresses",
    description: "Stop apologizing for your guest bathroom. New tile, modern vanity, updated fixtures. Your in-laws will think you spent $40K. You didn't.",
    image: "/images/bathrooms/bathroom-2.webp",
    span: "lg:col-span-1 lg:row-span-1",
  },
  {
    icon: Wrench,
    title: "Master Suite You Deserve",
    description: "Walk-in shower, double vanity, premium tile. You've earned a bathroom that feels like a 5-star hotel. Every. Single. Morning.",
    image: "/images/bathrooms/bathroom-3.webp",
    span: "lg:col-span-1 lg:row-span-1",
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  const imageScale = useTransform(mouseXSpring, [-0.5, 0.5], [1.05, 1.15]);

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

  const isLarge = index === 0;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.02 }}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer ${service.span} ${isLarge ? "min-h-[400px] md:min-h-[500px]" : "min-h-[250px]"}`}
    >
      {/* Background Image with parallax */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${service.image})`, scale: imageScale }}
      />

      {/* Dark overlay with gold gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 group-hover:from-black/98 group-hover:via-black/60 transition-all duration-500" />

      {/* Gold border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold/40 transition-all duration-500"
        style={{ boxShadow: "inset 0 0 30px rgba(197, 165, 90, 0)" }}
        whileHover={{ boxShadow: "inset 0 0 30px rgba(197, 165, 90, 0.1)" }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold/0 group-hover:border-gold/40 rounded-tl-2xl transition-all duration-700" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold/0 group-hover:border-gold/40 rounded-br-2xl transition-all duration-700" />

      {/* Content with 3D depth */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8" style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {/* 3D floating icon */}
        <motion.div
          animate={{ y: [0, -6, 0], rotateZ: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mb-4 w-14 h-14 rounded-xl bg-gold/20 backdrop-blur-md flex items-center justify-center border border-gold/30"
          style={{ transform: "translateZ(20px)" }}
        >
          <service.icon className="w-7 h-7 text-gold" />
        </motion.div>
        <h3
          className={`font-[family-name:var(--font-playfair)] font-bold mb-2 text-white ${isLarge ? "text-2xl md:text-3xl" : "text-xl"}`}
          style={{ transform: "translateZ(10px)" }}
        >
          {service.title}
        </h3>
        <p className={`text-[#bbb] ${isLarge ? "text-base max-w-md" : "text-sm"}`}>
          {service.description}
        </p>
      </div>
    </motion.div>
  );
}

export function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/3 rounded-full blur-[200px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 20 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold mb-4">
            Pick Your <span className="gold-gradient-text">Transformation</span>
          </h2>
          <TextShimmer
            as="p"
            className="text-lg font-[family-name:var(--font-cormorant)]"
            duration={4}
          >
            We do bathrooms. That is it. No kitchens, no floors, no additions. 100% focus = 100% quality.
          </TextShimmer>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-4" style={{ perspective: "1200px" }}>
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50, rotateX: 15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className={service.span}
            >
              <ServiceCard service={service} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
