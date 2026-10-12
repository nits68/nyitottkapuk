import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import grainImage from "@/public/images/grain.jpg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nyitott kapuk napja - 2026",
  description: "A Jedlik szoftverfejlesztő és -tesztelő képzésének bemutatkozó oldala",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // A data-theme kezdőértéke megegyezik a store alapértelmezett témájával (sötét)
    <html data-scroll-behavior="smooth" data-theme="dark" lang="hu">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div
          className="fixed inset-0 -z-50 opacity-5"
          style={{ backgroundImage: `url(${grainImage.src})`, backgroundRepeat: "repeat" }}
        />
        {children}
      </body>
    </html>
  );
}
