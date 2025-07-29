"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const Navigation = () => {
  const [showPill, setShowPill] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainNavRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Smooth scroll function that works with Locomotive Scroll
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      if (window.locomotive && window.locomotive.scrollTo) {
        // Use Locomotive Scroll if available
        window.locomotive.scrollTo(element, {
          duration: 1000,
          easing: [0.25, 0.0, 0.35, 1.0]
        });
      } else {
        // Fallback to native smooth scroll
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    // Close sidebar if open
    setSidebarOpen(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    let ticking = false;

    const handleScroll = (data) => {
      // Get scroll position from locomotive or fallback to native
      const scrolled = data?.scroll?.y ||
        window.locomotive?.scroll?.y ||
        window.locomotive?.instance?.scroll?.y ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop || 0;

      // Check if main nav should be hidden (scrolled past it)
      const shouldShowPill = scrolled > 100;

      if (shouldShowPill !== showPill) {
        setShowPill(shouldShowPill);
      }
    };

    const updateScrollVar = () => {
      const scrolled = window.locomotive?.scroll?.y ||
        window.locomotive?.instance?.scroll?.y ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop || 0;

      const shouldShowPill = scrolled > 100;

      if (shouldShowPill !== showPill) {
        setShowPill(shouldShowPill);
      }

      ticking = false;
    };

    const handleScrollEvent = (data) => {
      // Handle locomotive scroll data
      if (data?.scroll?.y !== undefined) {
        handleScroll(data);
        return;
      }

      // Handle native scroll
      if (!ticking) {
        requestAnimationFrame(updateScrollVar);
        ticking = true;
      }
    };

    const setupScrollListeners = () => {
      if (window.locomotive) {
        try {
          window.locomotive.on('scroll', handleScrollEvent);
          window.locomotive.on('update', handleScrollEvent);
        } catch (e) {
          window.addEventListener("scroll", handleScrollEvent, { passive: true });
        }
      } else {
        window.addEventListener("scroll", handleScrollEvent, { passive: true });
      }

      // Initial check
      updateScrollVar();
    };

    const locomotiveReadyHandler = () => {
      setTimeout(setupScrollListeners, 100);
    };

    window.addEventListener('locomotive-ready', locomotiveReadyHandler);

    const timer = setTimeout(() => {
      setupScrollListeners();
    }, 4000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('locomotive-ready', locomotiveReadyHandler);
      if (window.locomotive) {
        try {
          window.locomotive.off('scroll', handleScrollEvent);
          window.locomotive.off('update', handleScrollEvent);
        } catch (e) { }
      }
      window.removeEventListener("scroll", handleScrollEvent);
    };
  }, [showPill]);

  const pillNavigation = (
    <div className="fixed top-6 right-8 z-[60] pointer-events-none">
      <nav
        className={`pointer-events-auto transition-all duration-700 ease-out ${showPill
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-90 translate-y-2 pointer-events-none"
          }`}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-12 h-12 bg-white/95 shadow-xl rounded-full border border-gray-200/50 backdrop-blur-md flex items-center justify-center hover:bg-gray-50 transition-colors duration-300"
        >
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="w-4 h-0.5 bg-gray-900 rounded"></div>
            <div className="w-4 h-0.5 bg-gray-900 rounded"></div>
            <div className="w-4 h-0.5 bg-gray-900 rounded"></div>
          </div>
        </button>
      </nav>
    </div>
  );

  const sidebar = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar with SVG shutter animation */}
      <div
        className={`fixed top-0 right-0 h-full w-80 shadow-2xl z-[90] overflow-hidden transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* SVG Shutter Effect */}
        <svg
          width="100%" 
          height="100%"
          viewBox="0 0 320 1000" 
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <path
            fill="white"
            d={
              sidebarOpen
                ? "M0,0 L320,0 L320,1000 L0,1000 Z"
                : "M320,0 L320,0 L320,1000 Q240,500 320,1000 Z"
            }
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Sidebar Content */}
        <div 
          className={`relative z-10 p-8 h-full transition-opacity duration-500 ${
            sidebarOpen ? "opacity-100 delay-300" : "opacity-0"
          }`}
        >
          {/* Close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-6 right-6 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Links */}
          <nav className="mt-16 space-y-8">
            <button
              onClick={() => scrollToSection('home')}
              className="block text-2xl font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-300 text-left"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block text-2xl font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-300 text-left"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('work')}
              className="block text-2xl font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-300 text-left"
            >
              Work
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block text-2xl font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-300 text-left"
            >
              Contact
            </button>
          </nav>

          {/* Footer */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="text-sm text-gray-500">
              © Code by Arpit
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Main navbar (visible at top) */}
      <nav
        ref={mainNavRef}
        className={`fixed top-0 left-0 w-full z-[60] transition-all duration-700 ease-out ${showPill
          ? "opacity-0 -translate-y-full pointer-events-none"
          : "opacity-100 translate-y-0"
          }`}
      >
        <div className="flex justify-between items-center px-8 py-6">
          <div className="text-sm font-medium text-gray-900">
            © Code by Arpit
          </div>
          <div className="flex gap-8">
            <button 
              onClick={() => scrollToSection('home')} 
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('work')} 
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Work
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Pill navbar rendered in portal (outside locomotive container) */}
      {mounted && createPortal(pillNavigation, document.body)}

      {/* Sidebar rendered in portal */}
      {mounted && createPortal(sidebar, document.body)}
    </>
  );
};

export default Navigation;