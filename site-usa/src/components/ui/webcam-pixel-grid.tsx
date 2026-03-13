"use client";

import { useEffect, useRef, useCallback, useState } from "react";

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevFrameRef = useRef<Uint8ClampedArray | null>(null);
  const elevationRef = useRef<Float32Array | null>(null);
  const animationRef = useRef<number>(0);
  const veinPatternsRef = useRef<Array<Array<{ x1: number; y1: number; x2: number; y2: number; opacity: number }>>>([]);
  const startTimeRef = useRef<number>(Date.now());
  const [hasWebcam, setHasWebcam] = useState(false);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: "user" },
      });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.playsInline = true;
      video.muted = true;
      await video.play();
      videoRef.current = video;
      setHasWebcam(true);
      onWebcamReady?.();
    } catch {
      onWebcamError?.("Webcam not available");
      setHasWebcam(false);
    }
  }, [onWebcamReady, onWebcamError]);

  useEffect(() => {
    startWebcam();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
    };
  }, [startWebcam]);

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

    const offscreen = document.createElement("canvas");
    offscreen.width = gridCols;
    offscreen.height = gridRows;
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true });

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

      let currentFrame: Uint8ClampedArray | null = null;

      if (hasWebcam && videoRef.current && offCtx) {
        if (mirror) {
          offCtx.save();
          offCtx.scale(-1, 1);
          offCtx.drawImage(videoRef.current, -gridCols, 0, gridCols, gridRows);
          offCtx.restore();
        } else {
          offCtx.drawImage(videoRef.current, 0, 0, gridCols, gridRows);
        }
        currentFrame = offCtx.getImageData(0, 0, gridCols, gridRows).data;
      }

      const elevations = elevationRef.current!;
      const prevFrame = prevFrameRef.current;
      const tileSeeds = tileSeedsRef.current;

      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const idx = row * gridCols + col;
          const pixIdx = idx * 4;
          const seed = tileSeeds ? tileSeeds[idx] : idx;

          // Normalized position across entire grid (for continuous veining)
          const gnx = col / gridCols;
          const gny = row / gridRows;

          let webcamR = 0, webcamG = 0, webcamB = 0;
          let motion = 0;
          let hasColor = false;

          if (currentFrame) {
            webcamR = currentFrame[pixIdx];
            webcamG = currentFrame[pixIdx + 1];
            webcamB = currentFrame[pixIdx + 2];
            hasColor = true;

            if (prevFrame) {
              const dr = Math.abs(webcamR - prevFrame[pixIdx]);
              const dg = Math.abs(webcamG - prevFrame[pixIdx + 1]);
              const db = Math.abs(webcamB - prevFrame[pixIdx + 2]);
              motion = (dr + dg + db) / 3;
            }
          } else {
            // Gentle animated fallback for elevation
            const t = (Date.now() - startTimeRef.current) / 1000;
            motion = Math.abs(Math.sin(gnx * 5 + t * 0.8) * Math.cos(gny * 4 + t * 0.5)) * 12;
          }

          const targetElevation = Math.min(motion * motionSensitivity, 1) * maxElevation;
          elevations[idx] += (targetElevation - elevations[idx]) * elevationSmoothing;
          const elev = elevations[idx];

          const x = col * cellW + gap / 2;
          const y = row * cellH + gap / 2 - elev * 0.3;

          // === CALACATTA + ONYX PORCELAIN TILE RENDERING ===

          // 1. Base: White/cream porcelain base
          // Subtle warm variation per tile
          const warmth = smoothNoise(gnx * 4, gny * 4, seed) * 0.08;
          let baseR = 240 + warmth * 15;
          let baseG = 235 + warmth * 12;
          let baseB = 228 + warmth * 8;

          // If webcam active, subtly tint the base with webcam color (very subtle)
          if (hasColor) {
            const tintStrength = 0.15;
            const webcamLum = (webcamR + webcamG + webcamB) / 3;
            // Darken based on webcam luminance
            const lumFactor = 0.7 + (webcamLum / 255) * 0.3;
            baseR = baseR * (1 - tintStrength) + webcamR * tintStrength;
            baseG = baseG * (1 - tintStrength) + webcamG * tintStrength;
            baseB = baseB * (1 - tintStrength) + webcamB * tintStrength;
            baseR *= lumFactor;
            baseG *= lumFactor;
            baseB *= lumFactor;
          }

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

      if (currentFrame) {
        prevFrameRef.current = new Uint8ClampedArray(currentFrame);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [hasWebcam, gridCols, gridRows, maxElevation, motionSensitivity, elevationSmoothing, colorMode, backgroundColor, mirror, gapRatio, invertColors, darken, borderColor, borderOpacity, startTimeRef]);

  return <canvas ref={canvasRef} className={className} style={{ width: "100%", height: "100%" }} />;
}
