"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Check, Sparkles } from "lucide-react";

const tileOptions = [
  {
    id: "carrara-marble",
    name: "Carrara White Marble",
    description: "Classic Italian Carrara marble, white with soft grey veining. 12x24 polished finish. The most popular luxury tile in South Florida bathrooms.",
    preview: "#e8e4e0",
    previewPattern: "linear-gradient(135deg, #e8e4e0 0%, #d8d4ce 30%, #eae6e2 50%, #d0ccc6 70%, #e8e4e0 100%)",
    generatedImage: "/generated-tiles/carrara-marble.png",
  },
  {
    id: "white-subway-3x6",
    name: "White Subway 3x6",
    description: "Classic white ceramic subway tile 3x6 inches with white grout lines. Glossy finish, timeless American bathroom staple available at Floor & Decor and Home Depot.",
    preview: "#f5f2ee",
    previewPattern: "linear-gradient(0deg, #e8e5e0 1px, transparent 1px), linear-gradient(90deg, #e8e5e0 1px, #f5f2ee 1px)",
    generatedImage: "/generated-tiles/white-subway-3x6.png",
  },
  {
    id: "large-format-white",
    name: "Large Format Porcelain 24x48",
    description: "Modern large format white porcelain tile 24x48 inches. Minimal grout lines, polished surface. Popular in contemporary Florida luxury condos. Similar to MSI Aria Ice.",
    preview: "#f0eee9",
    previewPattern: "linear-gradient(180deg, #f0eee9 0%, #e6e3de 100%)",
    generatedImage: "/generated-tiles/large-format-white.png",
  },
  {
    id: "travertine-ivory",
    name: "Ivory Travertine",
    description: "Natural ivory travertine stone tile, honed and filled finish. Warm beige tones with natural pitting. Very popular in Mediterranean-style Florida homes. 18x18 format.",
    preview: "#d4c9b5",
    previewPattern: "linear-gradient(135deg, #d4c9b5 0%, #c8bda8 40%, #ddd2bf 60%, #c5b9a4 100%)",
    generatedImage: "/generated-tiles/travertine-ivory.png",
  },
  {
    id: "hexagon-marble-mosaic",
    name: "Hexagon Marble Mosaic",
    description: "White Carrara marble hexagon mosaic tile with gold brass inlay accents. 2-inch hexagons. Premium decorative tile from Daltile and Jeffrey Court collections.",
    preview: "#e2ddd6",
    previewPattern: "radial-gradient(circle at 50% 50%, #e8e4e0 40%, #d4cfc9 40%, #d4cfc9 50%, #e8e4e0 50%)",
    generatedImage: "/generated-tiles/hexagon-marble-mosaic.png",
  },
  {
    id: "zellige-blue",
    name: "Zellige Blue",
    description: "Handmade Moroccan zellige tile in ocean blue. Irregular glossy surface with charming imperfections. 4x4 square format. Trending in high-end Florida bathroom designs. Similar to Cle Tile collection.",
    preview: "#3a6b8a",
    previewPattern: "linear-gradient(135deg, #3a6b8a 0%, #2f5a78 50%, #4578a0 100%)",
    generatedImage: "/generated-tiles/zellige-blue.png",
  },
  {
    id: "herringbone-calacatta",
    name: "Herringbone Calacatta",
    description: "Calacatta gold marble in herringbone pattern. White marble with dramatic gold and grey veining laid in a chevron/herringbone pattern. Premium option from TileBar and Marble Systems.",
    preview: "#ece7df",
    previewPattern: "linear-gradient(45deg, #ece7df 25%, transparent 25%, transparent 75%, #ece7df 75%), linear-gradient(-45deg, #ece7df 25%, #e0dbd3 25%, #e0dbd3 75%, #ece7df 75%)",
    generatedImage: "/generated-tiles/herringbone-calacatta.png",
  },
  {
    id: "wood-look-porcelain",
    name: "Wood-Look Porcelain Plank",
    description: "Wood-look porcelain plank tile in warm oak finish. 8x48 format. Waterproof alternative to real wood. Extremely popular in Florida bathrooms. Similar to Daltile Season Wood or MSI Botanica.",
    preview: "#8b7355",
    previewPattern: "repeating-linear-gradient(90deg, #8b7355 0px, #9a8265 4px, #7d6548 8px)",
    generatedImage: "/generated-tiles/wood-look-porcelain.png",
  },
];

const defaultShowerImage = "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&q=90";

export function BathroomConfigurator() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedTile, setSelectedTile] = useState(tileOptions[0]);
  const [showGenerated, setShowGenerated] = useState(false);

  const handleTileSelect = (tile: typeof tileOptions[0]) => {
    setSelectedTile(tile);
    setShowGenerated(true);
  };

  const currentImage = showGenerated ? selectedTile.generatedImage : defaultShowerImage;

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#080808] to-[#0A0A0A]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gold/3 rounded-full blur-[250px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 25 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 mb-6">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-gold text-xs font-semibold uppercase tracking-wider">AI-Powered Visualization</span>
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold mb-4">
            See Your New Shower <span className="gold-gradient-text">Before You Spend a Dime</span>
          </h2>
          <TextShimmer
            as="p"
            className="text-lg font-[family-name:var(--font-cormorant)]"
            duration={4}
          >
            Most contractors make you guess. We let you see it first. Pick a tile below — real options from Florida suppliers you can buy today.
          </TextShimmer>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Shower Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-2xl">
              {/* Base / Generated image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${currentImage})`,
                  }}
                />
              </AnimatePresence>

              {/* Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 z-10" />

              {/* Gold frame */}
              <div className="absolute inset-0 border-2 border-gold/20 rounded-2xl z-10" />

              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-gold/50 z-10" />
              <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-gold/50 z-10" />
              <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-gold/50 z-10" />
              <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-gold/50 z-10" />

              {/* Current tile label */}
              <motion.div
                key={selectedTile.id + "-label"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-5 left-5 bg-black/70 backdrop-blur-md rounded-lg px-4 py-2 border border-gold/30 z-20"
              >
                <span className="text-gold text-sm font-semibold">{selectedTile.name}</span>
                {showGenerated && (
                  <span className="ml-2 text-gold/50 text-xs">AI Generated</span>
                )}
              </motion.div>
            </div>

            {/* Gold reflection */}
            <div className="mx-auto max-w-[80%] h-6 bg-gradient-to-b from-gold/5 to-transparent rounded-b-full blur-sm" />
          </motion.div>

          {/* Tile Selector Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-5"
          >
            <div className="p-6 rounded-2xl bg-surface border border-border-subtle">
              <h3 className="text-gold font-semibold text-sm uppercase tracking-wider mb-5">Select Wall Tile</h3>
              <div className="grid grid-cols-4 gap-2.5">
                {tileOptions.map((tile) => (
                  <button
                    key={tile.id}
                    onClick={() => handleTileSelect(tile)}
                    className={`group relative rounded-xl overflow-hidden transition-all duration-300 ${
                      selectedTile.id === tile.id
                        ? "ring-2 ring-gold shadow-[0_0_15px_rgba(197,165,90,0.3)] scale-105"
                        : "ring-1 ring-border-subtle hover:ring-gold/40 hover:scale-105"
                    }`}
                  >
                    <div
                      className="w-full aspect-square rounded-xl"
                      style={{
                        background: tile.previewPattern,
                        backgroundSize: "20px 10px",
                      }}
                    />
                    {selectedTile.id === tile.id && (
                      <motion.div
                        layoutId="tile-check"
                        className="absolute inset-0 flex items-center justify-center bg-gold/20 rounded-xl"
                      >
                        <Check className="w-5 h-5 text-gold" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tile details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTile.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-5 rounded-2xl bg-surface border border-border-subtle"
              >
                <h4 className="text-white font-semibold mb-2">{selectedTile.name}</h4>
                <p className="text-[#888] text-sm leading-relaxed">
                  {selectedTile.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* CTA */}
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="block text-center px-6 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-[#0A0A0A] font-semibold rounded-xl gold-glow transition-all"
            >
              Love This? Get a Free Quote in 24 Hours
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
