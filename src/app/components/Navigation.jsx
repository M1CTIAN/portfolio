"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCursor } from '../context/CursorContext'; // Import the context hook

const Navigation = () => {
  const { isLoaded } = useCursor(); // Get the global loaded state
  const [showPill, setShowPill] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Gate navbar until shutter finishes - increased delay
  const [canShowNav, setCanShowNav] = useState(false);
  useEffect(() => {
    let t;
    if (isLoaded) {
      // Wait longer for shutter to fully complete and clear the viewport
      t = setTimeout(() => setCanShowNav(true), 3500); // Increased from 2500 to 3500
    } else {
      setCanShowNav(false);
    }
    return () => clearTimeout(t);
  }, [isLoaded]);

  // Remove the fallback timer - rely only on the shutter timing
  // This prevents conflicts with the shutter animation

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
        try { window.locomotive.off('scroll', handleScroll); } catch (e) { }
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
        className={`fixed top-0 right-0 h-full w-80 shadow-2xl z-[90] overflow-hidden transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
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
          className={`relative z-10 p-8 h-full transition-opacity duration-500 ${sidebarOpen ? "opacity-100 delay-300" : "opacity-0"
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

  // Only render when shutter is completely done AND canShowNav is true
  if (!canShowNav || !isLoaded) {
    return null;
  }

  return (
    <>
      {/* Main Navbar - Only shows after shutter completely finishes */}
      <nav
        style={{
          position: 'fixed',
          top: showPill ? '-80px' : '0',
          left: '0',
          width: '100%',
          height: '60px',
          backgroundColor: 'rgba(249, 250, 251, 0.0)', // Slightly more transparent
          backdropFilter: 'blur(12px)',
          zIndex: 150, // Lower than shutter (z-200) but higher than content
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          opacity: 1,
          transform: 'translateY(0)',
          animation: 'fadeInFromTop 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards'
        }}
      >
        <div style={{
          fontSize: '16px',
          fontWeight: '400',
          color: '#374151',
          letterSpacing: '0.025em'
        }}>
          © Code by Arpit
        </div>
        <div style={{ display: 'flex', gap: '48px' }}>
          {['Home', 'About', 'Work', 'Contact'].map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              style={{
                color: '#6B7280',
                fontSize: '15px',
                fontWeight: '400',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                position: 'relative',
                padding: '8px 0',
                animationDelay: `${0.1 + index * 0.05}s` // Stagger the button animations
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#111827';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#6B7280';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* Pill / Hamburger Menu Button */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '48px',
          height: '48px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(16px)',
          borderRadius: '50%',
          border: '1px solid rgba(229, 231, 235, 0.4)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          zIndex: 160, // Also lower than shutter
          display: showPill ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          opacity: showPill ? 1 : 0,
          transform: showPill ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.9)'
        }}
        onClick={() => setSidebarOpen(true)}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px) scale(1.05)';
          e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        }}
      >
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: '#374151' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </div>

      {/* Sidebar - Mobile Menu */}
      {mounted && createPortal(sidebar, document.body)}

      <style jsx>{`
        @keyframes fadeInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navigation;