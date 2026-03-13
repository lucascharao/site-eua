"use client";

import { Hero } from "@/components/sections/Hero";
import { Gallery } from "@/components/sections/Gallery";
import { ValueProposition } from "@/components/sections/ValueProposition";
import { Services } from "@/components/sections/Services";
import { BathroomConfigurator } from "@/components/sections/BathroomConfigurator";
import { ShowcaseStrip } from "@/components/sections/ShowcaseStrip";
import { Certifications } from "@/components/sections/Certifications";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { FollowUs } from "@/components/sections/FollowUs";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { Footer } from "@/components/sections/Footer";
import { MagicCursor } from "@/components/ui/magic-cursor";
import { GoldParticles } from "@/components/ui/gold-particles";
import { FilmGrain } from "@/components/ui/film-grain";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SectionReveal } from "@/components/ui/section-reveal";

export default function Home() {
  return (
    <main>
      <MagicCursor />
      <GoldParticles count={40} />
      <FilmGrain />
      <ScrollProgress />
      <Hero />
      <SectionReveal direction="up">
        <Gallery />
      </SectionReveal>
      <SectionReveal direction="left" delay={0.1}>
        <ValueProposition />
      </SectionReveal>
      <SectionReveal direction="right" delay={0.1}>
        <Services />
      </SectionReveal>
      <ShowcaseStrip />
      <SectionReveal direction="center" delay={0.1}>
        <BathroomConfigurator />
      </SectionReveal>
      <SectionReveal direction="up" delay={0.1}>
        <Certifications />
      </SectionReveal>
      <SectionReveal direction="left" delay={0.1}>
        <ServiceAreas />
      </SectionReveal>
      <FollowUs />
      <SectionReveal direction="center" delay={0.1}>
        <CTAFinal />
      </SectionReveal>
      <Footer />
    </main>
  );
}
