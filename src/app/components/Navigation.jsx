"use client";
import React, { useEffect, useRef, useState } from "react";

const Navigation = () => {
  const [showPill, setShowPill] = useState(false);
  const mainNavRef = useRef(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (!mainNavRef.current) return;
      const rect = mainNavRef.current.getBoundingClientRect();
      setShowPill(rect.bottom <= 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Main navbar (visible at top) */}
      <nav
        ref={mainNavRef}
        className={`fixed top-0 left-0 w-full z-30 transition-all duration-500 ${showPill ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <div className="flex justify-between items-center px-8 py-6">
          <div className="text-sm font-medium text-gray-900">
            © Code by Arpit
          </div>
          <div className="flex gap-8">
            <a href="#work" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
              Work
            </a>
            <a href="#about" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Pill navbar (visible when main nav is not visible) */}
      <nav
        className={`fixed top-6 right-8 z-50 transition-all duration-500 ${showPill ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
          }`}
      >
        <div className="flex gap-6 items-center bg-white/90 shadow-lg rounded-full px-6 py-3 border border-gray-200 backdrop-blur-md">
          <a href="#work" className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors">
            Work
          </a>
          <a href="#about" className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors">
            About
          </a>
          <a href="#contact" className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors">
            Contact
          </a>
        </div>
      </nav>
    </>
  );
};

export default Navigation;