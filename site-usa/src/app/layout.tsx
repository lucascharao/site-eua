import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const cormorant = Cormorant_Garamond({ weight: ["400", "600"], subsets: ["latin"], variable: "--font-cormorant" });

export const metadata: Metadata = {
  title: "Grout & About | Tampa's Premier Bathroom Renovation & Tile Specialists",
  description: "Transform your bathroom into a sanctuary of beauty and relaxation. Owner-operated, Certified Schluter Installer serving Tampa Bay. Get a free estimate today.",
  keywords: "bathroom renovation, tile specialist, Tampa, Schluter certified, shower installation, steam shower",
  openGraph: {
    title: "Grout & About | Tampa's Premier Bathroom Renovation",
    description: "Owner-operated bathroom renovation specialists. Certified Schluter Installer serving Tampa Bay.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <body className={`${inter.className} bg-[#0A0A0A] text-[#F5F5F5] antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
