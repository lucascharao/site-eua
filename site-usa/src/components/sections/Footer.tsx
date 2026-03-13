"use client";

import Image from "next/image";
import { Instagram, Facebook } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border-subtle">
      {/* Gold line at top */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Logo + description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative w-20 h-20 mb-4">
              <Image
                src="/logos/logo-3d.png"
                alt="Grout & About"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-[#777] text-sm text-center md:text-left">
              Tampa Bay bathroom remodeling. Guest and master bathrooms.
              Owner-operated. Schluter certified. 500+ bathrooms completed.
            </p>
          </div>

          {/* Navigation */}
          <div className="text-center">
            <h4 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h4>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[#999] hover:text-gold transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social + Contact */}
          <div className="text-center md:text-right">
            <h4 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">Connect</h4>
            <div className="flex justify-center md:justify-end gap-4 mb-4">
              <a
                href="https://instagram.com/groutaboutbathroom"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-[#999] hover:border-gold/40 hover:text-gold transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/groutaboutbathroom"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-[#999] hover:border-gold/40 hover:text-gold transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <p className="text-[#777] text-sm">(813) 389-9868</p>
            <p className="text-[#777] text-sm">Info@groutaboutbathroom.com</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border-subtle text-center space-y-2">
          <p className="text-[#555] text-xs">
            &copy; {new Date().getFullYear()} Grout & About Flooring and Bathroom. All rights reserved.
          </p>
          <p className="text-[#444] text-xs">
            Developed by{" "}
            <a
              href="mailto:lucascharao1@hotmail.com"
              className="text-gold/60 hover:text-gold transition-colors"
            >
              Lucas Char&atilde;o
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
