"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";

interface TextDecodeProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  trigger?: "view" | "immediate";
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

export function TextDecode({
  text,
  className = "",
  delay = 0,
  speed = 30,
  trigger = "view",
}: TextDecodeProps) {
  const [displayText, setDisplayText] = useState(text.replace(/[^ ]/g, " "));
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const decode = useCallback(() => {
    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      iteration += 1 / 3;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  useEffect(() => {
    if (hasTriggered) return;

    const shouldTrigger = trigger === "immediate" || (trigger === "view" && isInView);
    if (!shouldTrigger) return;

    setHasTriggered(true);

    const timeout = setTimeout(() => {
      decode();
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, trigger, delay, decode, hasTriggered]);

  return (
    <motion.span
      ref={ref}
      className={`inline-block font-mono ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.3, delay: delay / 1000 }}
    >
      {displayText}
    </motion.span>
  );
}
