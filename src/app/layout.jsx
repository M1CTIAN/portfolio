'use client';
import { useEffect, useRef } from "react";
import "./globals.css";

export default function RootLayout({ children }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    let scroll;
    // Only run on client
    import('locomotive-scroll').then((LocomotiveScroll) => {
      if (!scrollRef.current) return;
      scroll = new LocomotiveScroll.default({
        el: scrollRef.current,
        smooth: true,
      });
    });
    return () => {
      if (scroll) scroll.destroy();
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