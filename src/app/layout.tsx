'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
    });
    return () => {
      scroll.destroy();
    };
  }, []);

  return (
    <html lang="en">
      <body>
        <div data-scroll-container ref={scrollRef}>
          {children}
        </div>
      </body>
    </html>
  );
}
