"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCursor } from '../context/CursorContext'; // Import the context hook

const Navigation = () => {
  const { isLoaded } = useCursor(); // Get the global loaded state
  const [showPill, setShowPill] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Smooth scroll function that works with Locomotive Scroll
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element && window.locomotive) {
      window.locomotive.scrollTo(element, {
        duration: 1200,
        easing: [0.25, 0.0, 0.35, 1.0],
        offset: -50 // Optional offset
      });
    } else if (element) {
      // Fallback to native smooth scroll
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setSidebarOpen(false);
  };

  useEffect(() => {
    setMounted(true);

    const handleScroll = (data) => {
      const scrollY = data?.scroll?.y ?? window.scrollY;
      setShowPill(scrollY > 100);
    };

    const setupListeners = () => {
      if (window.locomotive) {
        window.locomotive.on('scroll', handleScroll);
      } else {
        window.addEventListener('scroll', handleScroll, { passive: true });
      }
      handleScroll();
    };

    if (window.locomotive) {
      setupListeners();
    } else {
      const timer = setTimeout(setupListeners, 500);
      return () => clearTimeout(timer);
    }

    return () => {
      if (window.locomotive) {
        try { window.locomotive.off('scroll', handleScroll); } catch (e) {}
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    // This wrapper controls the fade-in of the entire navigation component
    <div className={`transition-opacity duration-500 delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Main Navbar - Hidden on scroll */}
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-transform duration-300 ${
          showPill ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="px-10 mx-auto py-4">
          <div className="flex justify-between items-center">
            <div className="text-lg font-medium text-gray-900">
              © Code by Arpit
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-gray-900">Home</button>
              <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-gray-900">About</button>
              <button onClick={() => scrollToSection('work')} className="text-gray-600 hover:text-gray-900">Work</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-gray-900">Contact</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Pill / Hamburger Menu Button - Appears on scroll */}
      <div
        className={`fixed top-6 right-6 z-50 transition-all duration-500 ${
          showPill ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="bg-white/80 backdrop-blur-md shadow-lg rounded-full p-3"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Sidebar - Mobile Menu */}
      {mounted && createPortal(sidebar, document.body)}
    </div>
  );
};

export default Navigation;