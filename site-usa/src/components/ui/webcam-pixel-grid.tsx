"use client";

import { useEffect, useRef } from "react";

interface WebcamPixelGridProps {
  gridCols?: number;
  gridRows?: number;
  maxElevation?: number;
  motionSensitivity?: number;
  elevationSmoothing?: number;
  colorMode?: "webcam" | "monochrome";
  backgroundColor?: string;
  mirror?: boolean;
  gapRatio?: number;
  invertColors?: boolean;
  darken?: number;
  borderColor?: string;
  borderOpacity?: number;
  className?: string;
  onWebcamReady?: () => void;
  onWebcamError?: (err: string) => void;
}

// Seeded PRNG for deterministic patterns
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Simplex-like noise for smooth veining across tiles
function smoothNoise(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 43758.5453) * 43758.5453;
  return n - Math.floor(n);
}

// Calacatta vein pattern - generates continuous diagonal veins
function calacattaVein(nx: number, ny: number, seed: number): number {
  const angle = 0.6 + smoothNoise(0, 0, seed) * 0.8;
  const projected = nx * Math.cos(angle) + ny * Math.sin(angle);
  const wave = Math.sin(projected * 8 + smoothNoise(nx * 3, ny * 3, seed + 1) * 2) * 0.5 +
    Math.sin(projected * 15 + smoothNoise(nx * 5, ny * 7, seed + 2) * 3) * 0.25 +
    Math.sin(projected * 25 + smoothNoise(nx * 8, ny * 4, seed + 3) * 4) * 0.1;
  const thickness = 0.03 + smoothNoise(nx * 2, ny * 2, seed + 4) * 0.04;
  return Math.max(0, 1 - Math.abs(wave) / thickness);
}

// Crystal facet pattern for onyx effect
function crystalFacet(nx: number, ny: number, seed: number): { facet: number; edge: number } {
  let minDist = 1;
  let secondDist = 1;
  for (let i = 0; i < 6; i++) {
    const cx = smoothNoise(i * 1.5, 0, seed + 10);
    const cy = smoothNoise(0, i * 1.5, seed + 20);
    const dist = Math.sqrt((nx - cx) ** 2 + (ny - cy) ** 2);
    if (dist < minDist) { secondDist = minDist; minDist = dist; }
    else if (dist < secondDist) { secondDist = dist; }
  }
  const edge = 1 - Math.min(1, (secondDist - minDist) / 0.05);
  return { facet: minDist, edge };
}

export function WebcamPixelGrid({
  gridCols = 60,
  gridRows = 40,
  maxElevation = 50,
  motionSensitivity = 0.25,
  elevationSmoothing = 0.2,
  colorMode = "webcam",
  backgroundColor = "#1a1a18",
  mirror = true,
  gapRatio = 0.12,
  invertColors = false,
  darken = 0.6,
  borderColor = "#ffffff",
  borderOpacity = 0.06,
  className = "",
  onWebcamReady,
  onWebcamError,
}: WebcamPixelGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elevationRef = useRef<Float32Array | null>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  // Pre-generate tile seed values for deterministic patterns
  const tileSeedsRef = useRef<Float32Array | null>(null);
  useEffect(() => {
    const seeds = new Float32Array(gridCols * gridRows);
    for (let i = 0; i < seeds.length; i++) {
      const rng = seededRandom(i * 7919 + 1013);
      seeds[i] = rng() * 10000;
    }
    tileSeedsRef.current = seeds;
  }, [gridCols, gridRows]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const totalCells = gridCols * gridRows;
    if (!elevationRef.current || elevationRef.current.length !== totalCells) {
      elevationRef.current = new Float32Array(totalCells);
    }

    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      // Grout/rejunte background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      const cellW = w / gridCols;
      const cellH = h / gridRows;
      const gap = Math.min(cellW, cellH) * gapRatio;
      const blockW = cellW - gap;
      const blockH = cellH - gap;

      const elevations = elevationRef.current!;
      const tileSeeds = tileSeedsRef.current;

      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const idx = row * gridCols + col;
          const seed = tileSeeds ? tileSeeds[idx] : idx;

          // Normalized position across entire grid (for continuous veining)
          const gnx = col / gridCols;
          const gny = row / gridRows;

          // Ocean wave animation (no webcam)
          const t = (Date.now() - startTimeRef.current) / 1000;
          const wave1 = Math.sin(gnx * 6 + t * 0.6) * Math.cos(gny * 3 + t * 0.4);
          const wave2 = Math.sin((gnx + gny) * 4 + t * 0.35) * 0.5;
          const wave3 = Math.cos(gnx * 8 - t * 0.5 + gny * 2) * 0.3;
          const ripple = Math.sin(Math.sqrt((gnx - 0.5) ** 2 + (gny - 0.5) ** 2) * 12 - t * 1.2) * 0.4;
          const motion = Math.abs(wave1 + wave2 + wave3 + ripple) * 8;

          const targetElevation = Math.min(motion * motionSensitivity, 1) * maxElevation;
          elevations[idx] += (targetElevation - elevations[idx]) * elevationSmoothing;
          const elev = elevations[idx];

          const x = col * cellW + gap / 2;
          const y = row * cellH + gap / 2 - elev * 0.3;

          // === CALACATTA + ONYX PORCELAIN TILE RENDERING ===

          // 1. Base: White/cream porcelain base
          const warmth = smoothNoise(gnx * 4, gny * 4, seed) * 0.08;
          let baseR = 240 + warmth * 15;
          let baseG = 235 + warmth * 12;
          let baseB = 228 + warmth * 8;

          // Apply darken
          const d = 1 - darken;
          baseR = Math.round(baseR * d);
          baseG = Math.round(baseG * d);
          baseB = Math.round(baseB * d);

          // Elevation brightness boost
          const brightness = 1 + elev / maxElevation * 0.4;
          baseR = Math.min(255, Math.round(baseR * brightness));
          baseG = Math.min(255, Math.round(baseG * brightness));
          baseB = Math.min(255, Math.round(baseB * brightness));

          // Fill base tile
          ctx.fillStyle = `rgb(${baseR},${baseG},${baseB})`;
          ctx.fillRect(x, y, blockW, blockH);

          // 2. Calacatta marble veining (continuous across tiles)
          const veinIntensity = calacattaVein(gnx, gny, seed % 100);
          if (veinIntensity > 0.01) {
            // Primary vein: gray with slight gold/brown tint
            const veinAlpha = veinIntensity * 0.35;
            ctx.fillStyle = `rgba(160,148,130,${veinAlpha})`;
            ctx.fillRect(x, y, blockW, blockH);

            // Vein core: darker and thinner
            if (veinIntensity > 0.5) {
              const coreAlpha = (veinIntensity - 0.5) * 0.4;
              ctx.fillStyle = `rgba(120,108,90,${coreAlpha})`;
              ctx.fillRect(x, y, blockW, blockH);
            }
          }

          // Secondary thinner vein at different angle
          const vein2 = calacattaVein(gnx * 1.3, gny * 0.8, seed % 100 + 50);
          if (vein2 > 0.02) {
            const v2Alpha = vein2 * 0.2;
            ctx.fillStyle = `rgba(180,170,155,${v2Alpha})`;
            ctx.fillRect(x, y, blockW, blockH);
          }

          // 3. Crystal/onyx facet effect (subtle translucent patches)
          const crystal = crystalFacet(gnx, gny, seed % 50);
          // Subtle facet shading - some areas slightly lighter/darker
          const facetShade = smoothNoise(crystal.facet * 10, gnx * 5, seed + 30) * 0.06;
          if (facetShade > 0.02) {
            ctx.fillStyle = `rgba(255,255,255,${facetShade})`;
            ctx.fillRect(x, y, blockW, blockH);
          }
          // Crystal edges - very subtle white lines between facets
          if (crystal.edge > 0.3) {
            const edgeAlpha = crystal.edge * 0.08;
            ctx.fillStyle = `rgba(255,255,255,${edgeAlpha})`;
            ctx.fillRect(x, y, blockW, blockH);
          }

          // 4. Glossy highlight (polished porcelain reflection)
          const glossGrad = ctx.createLinearGradient(x, y, x + blockW * 0.5, y + blockH * 0.5);
          glossGrad.addColorStop(0, "rgba(255,255,255,0.18)");
          glossGrad.addColorStop(0.3, "rgba(255,255,255,0.06)");
          glossGrad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = glossGrad;
          ctx.fillRect(x, y, blockW, blockH);

          // 5. Bevel edges (3D tile effect — polished porcelain)
          ctx.fillStyle = "rgba(255,255,255,0.2)";
          ctx.fillRect(x, y, blockW, 1);
          ctx.fillRect(x, y, 1, blockH);
          ctx.fillStyle = "rgba(0,0,0,0.12)";
          ctx.fillRect(x, y + blockH - 1, blockW, 1);
          ctx.fillRect(x + blockW - 1, y, 1, blockH);

          // 6. Inner shadow for depth
          ctx.fillStyle = "rgba(0,0,0,0.03)";
          ctx.fillRect(x + 1, y + blockH - 2, blockW - 2, 1);
          ctx.fillRect(x + blockW - 2, y + 1, 1, blockH - 2);

          // 7. Optional border
          if (borderOpacity > 0) {
            ctx.strokeStyle = `${borderColor}${Math.round(borderOpacity * 255).toString(16).padStart(2, "0")}`;
            ctx.lineWidth = 0.3;
            ctx.strokeRect(x, y, blockW, blockH);
          }
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [gridCols, gridRows, maxElevation, motionSensitivity, elevationSmoothing, backgroundColor, gapRatio, darken, borderColor, borderOpacity]);

  return <canvas ref={canvasRef} className={className} style={{ width: "100%", height: "100%" }} />;
}
