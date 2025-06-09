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
      
      // Store the instance globally so your page.jsx can access it
      window.locomotive = scroll;
      
      // Also store it in a different way for compatibility
      window.locomotiveScroll = scroll;
      
      console.log("Locomotive Scroll initialized and stored globally");
      
      // Dispatch custom event when ready
      window.dispatchEvent(new CustomEvent('locomotive-ready'));
    });
    
    return () => {
      if (scroll) {
        scroll.destroy();
        // Clean up global references
        window.locomotive = null;
        window.locomotiveScroll = null;
      }
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