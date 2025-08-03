'use client';
import { useEffect, useRef } from "react";
import "./globals.css";
import Navigation from "./components/Navigation";
import { CursorProvider } from "./context/CursorContext"; // Import provider
import CustomCursor from "./components/CustomCursor"; // Import cursor

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
        lerp: 0.08, // A lower value like 0.08 makes scrolling feel smoother
        multiplier: 0.8, // Slightly reduces scroll speed for a less frantic feel
        smoothMobile: false, // Use native scrolling on mobile for better performance
        getDirection: true, // Required for the marquee direction change
      });
      
      // Store the instance globally
      window.locomotive = scroll;
      
      // Dispatch custom event when ready
      window.dispatchEvent(new CustomEvent('locomotive-ready'));
    });
    
    return () => {
      if (scroll) {
        scroll.destroy();
        window.locomotive = null;
      }
    };
  }, []);

  return (
    <html lang="en">
      <CursorProvider>
        <body>
          <CustomCursor />
          {/* Render Navigation OUTSIDE the scroll container */}
          <Navigation />
          {/* The scroll container only contains the page content */}
          <div data-scroll-container ref={scrollRef}>
            {children}
          </div>
        </body>
      </CursorProvider>
    </html>
  );
}