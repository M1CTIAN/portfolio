"use client";
import React, { useEffect, useState } from "react";
import { useCursor } from "./context/CursorContext";
import About from "./components/About";
import ProjectShowcase from "./components/ProjectsCarousel";
import Hero from "./components/Hero";
import Contact from "./components/Contact";
import "./globals.css";

export default function Page() {
    const { isLoaded, setIsLoaded } = useCursor();
    const [showEmailCopied, setShowEmailCopied] = useState(false);
    const [views, setViews] = useState(0);
    const [viewsLoading, setViewsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // Function to copy email to clipboard and show modal
    const copyEmailToClipboard = async () => {
        const email = "raj.arpit140@gmail.com";
        try {
            await navigator.clipboard.writeText(email);
            setShowEmailCopied(true);
            setTimeout(() => setShowEmailCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy email: ', err);
        }
    };

    // Views tracking with Vercel Analytics
    useEffect(() => {
        const trackView = async () => {
            try {
                // Check if this is a new session
                const hasVisitedToday = sessionStorage.getItem('visitedToday');

                if (!hasVisitedToday) {
                    // Record the view
                    await fetch('/api/views', { method: 'POST' });
                    sessionStorage.setItem('visitedToday', 'true');
                }

                // Fetch current view count
                const response = await fetch('/api/views');
                const data = await response.json();

                if (data.views) {
                    setViews(data.views);
                }
            } catch (error) {
                console.error('Error tracking views:', error);
                // Fallback to localStorage method if API fails
                const currentViews = localStorage.getItem('portfolioViews');
                let viewCount = currentViews ? parseInt(currentViews, 10) : 0;

                const hasVisitedToday = sessionStorage.getItem('visitedToday');
                if (!hasVisitedToday) {
                    viewCount += 1;
                    localStorage.setItem('portfolioViews', viewCount.toString());
                    sessionStorage.setItem('visitedToday', 'true');
                }

                setViews(viewCount);
            } finally {
                setViewsLoading(false);
            }
        };

        trackView();
    }, []);

    // Update this useEffect to use the global state
    useEffect(() => {
        if (isLoaded) return; // Prevent this from running more than once

        const timer = setTimeout(() => setIsLoaded(true), 1000);
        const animationDuration = isMobile ? 1000 : 2800; // Adjust duration for mobile

        // Function to safely stop locomotive scroll
        const stopScroll = () => {
            if (window.locomotive) {
                window.locomotive.stop();
            } else {
                setTimeout(stopScroll, 50);
            }
        };

        // Function to safely re-enable locomotive scroll
        const startScroll = () => {
            if (window.locomotive) {
                window.locomotive.start();
            } else {
                setTimeout(startScroll, 50);
            }
        };

        stopScroll(); // Stop scrolling immediately

        // Re-enable scrolling after the animation completes
        const scrollTimer = setTimeout(() => {
            startScroll();
        }, animationDuration);

        return () => {
            clearTimeout(timer);
            clearTimeout(scrollTimer);
            // Cleanup: ensure scroll is re-enabled if the component unmounts
            // This check is important to prevent errors if locomotive is destroyed.
            if (window.locomotive) {
                try { window.locomotive.start(); } catch (e) { }
            }
        };
    }, [isLoaded, setIsLoaded, isMobile]); // Empty dependency array ensures this runs only once

    return (
        <main className="bg-gray-100 min-h-screen overflow-hidden">
            {/* Text that moves with shutter - Increased z-index */}
            <div
                className={`
                fixed z-[201]
                transition-transform duration-[2250ms] md:duration-[4500ms]
                ${isLoaded ? "translate-y-[-100vh]" : ""}
                `}
                style={{ 
                    top: '50vh', left: '50vw',
                    transform: isLoaded
                        ? 'translate(-50%, -50%) translateY(-100vh)'
                        : 'translate(-50%, -50%)'
                }}
            >
                <h1 className="text-5xl md:text-7xl font-extrabold text-[#d1d5db] drop-shadow-xl animate-fadeinup text-center md:text-left">
                    <span className="hidden md:inline">
                        Crafting <span className="text-[#f3f4f6]">Digital Magic</span>
                    </span>
                    <span className="md:hidden">
                        Hey there!
                    </span>
                </h1>
            </div>

            {/* SVG Shutter overlay - z-index is 200 */}
            <div className="fixed inset-0 z-[200] flex items-center justify-center shutter-overlay">
                <svg
                    width="100%" height="100%"
                    viewBox="0 0 1000 1000" preserveAspectRatio="none"
                    className={`absolute top-0 left-0 w-full h-full md:duration-3000 shutter-svg ${isLoaded ? "shutter-animate" : ""}`}
                >
                    <path
                        id="shutterPath" fill="#18181b"
                        d={
                            isLoaded
                                ? "M0,-100 L1000,-100 L1000,-100 Q500,-100 0,-100 Z"
                                : "M0,0 L1000,0 L1000,1000 Q500,1100 0,1000 Z"
                        }
                    />
                </svg>
            </div>

            <div
                className={`
          relative w-full min-h-screen
           duration-[1500ms] md:duration-[3000ms] ease-in-out
          ${isLoaded ? "translate-y-0" : "translate-y-[100vh]"}
        `}
            >
                <Hero />
            </div>
            <div id="about">
                <About />
            </div>
            <div id="work">
                <ProjectShowcase />
            </div>

            <Contact
                copyEmailToClipboard={copyEmailToClipboard}
                showEmailCopied={showEmailCopied}
            />

            {/* Minimal Footer */}
            <footer className="bg-gray-900 text-white py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h3 className="text-xl font-medium mb-2">Arpit Raj</h3>
                            <p className="text-gray-400 text-sm">
                                Creative Developer & Designer
                            </p>
                        </div>

                        <div className="mt-6 md:mt-0 text-center md:text-right">
                            <div className="flex items-center justify-center md:justify-end space-x-4 mb-2">
                                <div className="text-gray-500 text-sm">
                                    {viewsLoading ? (
                                        <span className="animate-pulse">Loading...</span>
                                    ) : (
                                        `${views.toLocaleString()} views`
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm">
                                © 2025 Built with intention
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
