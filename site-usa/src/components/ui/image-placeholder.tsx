"use client";

interface ImagePlaceholderProps {
  className?: string;
  variant?: "warm" | "cool" | "gold" | "dark";
}

const gradients = {
  warm: "linear-gradient(135deg, #1a1510 0%, #1f1a12 25%, #2a2015 50%, #1f1a12 75%, #1a1510 100%)",
  cool: "linear-gradient(135deg, #10141a 0%, #121a1f 25%, #152028 50%, #121a1f 75%, #10141a 100%)",
  gold: "linear-gradient(135deg, #1a1710 0%, #252012 25%, #2a2515 50%, #252012 75%, #1a1710 100%)",
  dark: "linear-gradient(135deg, #0e0e0e 0%, #151515 25%, #1a1a1a 50%, #151515 75%, #0e0e0e 100%)",
};

export function ImagePlaceholder({ className = "", variant = "warm" }: ImagePlaceholderProps) {
  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{ background: gradients[variant] }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, rgba(197,165,90,0.15) 0%, transparent 50%),
                           radial-gradient(circle at 70% 60%, rgba(197,165,90,0.1) 0%, transparent 40%)`,
        }}
      />
    </div>
  );
}
