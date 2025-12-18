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
      setIsMobile(window.innerWidth < 1050); // Tailwind's 'md' breakpoint
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
        className={`fixed inset-0 z-[80] transition-all duration-300 ${
          sidebarOpen 
            ? "opacity-100 backdrop-blur-md bg-gray-900/20" 
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar with SVG bulge shutter animation */}
      <div
        className={`fixed top-0 right-0 h-full w-80 shadow-2xl z-[90] overflow-hidden transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
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
    <div className="navigation-container">
      {/* Main Navbar - Only shows on desktop */}
      {!isMobile && (
        <nav
          className={`fixed left-0 w-full h-[60px] z-[150] flex items-center justify-between px-10 transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] opacity-100 animate-fadeInFromTop ${
            showPill ? '-top-20' : 'top-0'
          }`}
          style={{
            backgroundColor: 'rgba(249, 250, 251, 0.0)', // Custom transparency not available in Tailwind
          }}
        >
          <div className="text-base font-normal text-gray-700 tracking-wider">
            © Code by Arpit
          </div>
          <div className="flex mt-4 gap-12">
            {['Home', 'About', 'Work', 'Contact'].map((item, index) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-gray-500 text-[15px] font-normal bg-none border-none cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] relative py-2 opacity-0 -translate-y-2.5 animate-fadeInFromTop hover:text-gray-900 hover:-translate-y-0.5"
                style={{
                  animationDelay: `${0.1 + index * 0.05}s` // Custom animation delay
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
        className={`fixed top-5 right-5 w-12 h-12 bg-white/90 backdrop-blur-2xl rounded-full border border-gray-200/40 shadow-lg z-[160] flex items-center justify-center cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-xl ${
          (isMobile || showPill) 
            ? 'opacity-100 translate-y-0 scale-100 flex' 
            : 'opacity-0 -translate-y-2 scale-90 hidden'
        }`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px) scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0) scale(1)';
        }}
      >
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="text-gray-700"
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
        
        .animate-fadeInFromTop {
          animation: fadeInFromTop 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .animate-fadeInFromTop.delay-1 {
          animation: fadeInFromTop 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Navigation;