import type { Metadata } from "next";
import { Outfit, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KOPI SENJA - Ops Dashboard",
  description:
    "Dashboard operasi Kopi Senja: jualan, stok, cawangan, dan laporan dalam satu tempat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms" className={`${outfit.variable} ${plexMono.variable}`}>
      <body className="bg-cream text-espresso min-h-dvh antialiased">{children}</body>
    </html>
  );
}
