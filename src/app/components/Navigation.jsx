"use client";
import React, { useEffect, useState } from "react";
import { useCursor } from '../context/CursorContext'; // Import the context hook

const Navigation = () => {
  const { isLoaded } = useCursor(); // Get the global loaded state
  const [showPill, setShowPill] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Gate navbar until shutter finishes
  const [canShowNav, setCanShowNav] = useState(false);
  useEffect(() => {
    let t;
    if (isLoaded) {
      // Use a shorter delay on mobile to match the faster animation
      const delay = isMobile ? 1800 : 3500;
      t = setTimeout(() => setCanShowNav(true), delay);
    } else {
      setCanShowNav(false);
    }
    return () => clearTimeout(t);
  }, [isLoaded, isMobile]);

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
    const handleScroll = (data) => {
      const scrollY = data?.scroll?.y ?? window.scrollY;
      setShowPill(scrollY > 100);

      // Determine active section
      const sections = ['home', 'about', 'work', 'contact'];
      let newActiveSection = 'home';
      const offset = window.innerHeight * 0.4; // 40% from the top

      for (const sectionId of sections) {
        const sectionEl = document.getElementById(sectionId);
        if (sectionEl && sectionEl.getBoundingClientRect().top < offset) {
          newActiveSection = sectionId;
        }
      }
      setActiveSection(newActiveSection);
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

      {/* Sidebar with SVG bulge shutter animation */}
      <div
        className={`fixed top-0 right-0 h-full w-80 shadow-2xl z-[90] overflow-hidden transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
          }`}
      >
        {/* SVG Bulge Shutter Effect - Similar to main shutter */}
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
                : "M320,0 L320,0 L320,1000 Q160,500 320,1000 Z"
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
              className={`block text-2xl font-medium hover:text-indigo-600 transition-colors duration-300 text-left ${activeSection === 'home' ? 'text-indigo-600' : 'text-gray-900'}`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`block text-2xl font-medium hover:text-indigo-600 transition-colors duration-300 text-left ${activeSection === 'about' ? 'text-indigo-600' : 'text-gray-900'}`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('work')}
              className={`block text-2xl font-medium hover:text-indigo-600 transition-colors duration-300 text-left ${activeSection === 'work' ? 'text-indigo-600' : 'text-gray-900'}`}
            >
              Work
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`block text-2xl font-medium hover:text-indigo-600 transition-colors duration-300 text-left ${activeSection === 'contact' ? 'text-indigo-600' : 'text-gray-900'}`}
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
      {/* Main Navbar - Only shows on desktop */}
      {!isMobile && (
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
                  opacity: 0,
                  transform: 'translateY(-10px)',
                  animation: 'fadeInFromTop 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
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
      )}

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
          display: (isMobile || showPill) ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          opacity: (isMobile || showPill) ? 1 : 0,
          transform: (isMobile || showPill) ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.9)'
        }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
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
      {sidebar}

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