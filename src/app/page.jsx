"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCursor } from "./context/CursorContext";
import About from "./components/About";
import ProjectShowcase from "./components/ProjectsCarousel";
import ProjectsPage from "./components/ProjectsPage";
import Hero from "./components/Hero";
import Contact from "./components/Contact";
import "./globals.css";

export default function Page() {
    const { isLoaded, setIsLoaded } = useCursor();
    const [showEmailCopied, setShowEmailCopied] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [cssLoaded, setCssLoaded] = useState(false);
    const [showProjectsPage, setShowProjectsPage] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Hide navbar when projects page is open
    useEffect(() => {
        if (showProjectsPage) {
            document.body.classList.add('hide-navbar');
        } else {
            document.body.classList.remove('hide-navbar');
        }
        return () => document.body.classList.remove('hide-navbar');
    }, [showProjectsPage]);

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

    // Check for CSS loading
    useEffect(() => {
        const checkCSSLoaded = () => {
            // Method 1: Check if a specific CSS class is applied
            const testElement = document.createElement('div');
            testElement.className = 'hero-photo'; // CSS class from Hero.css
            testElement.style.position = 'absolute';
            testElement.style.visibility = 'hidden';
            document.body.appendChild(testElement);

            const styles = window.getComputedStyle(testElement);
            const cssApplied = styles.getPropertyValue('transform') !== 'none' ||
                styles.getPropertyValue('left') !== 'auto';

            document.body.removeChild(testElement);

            if (cssApplied) {
                setCssLoaded(true);
                return;
            }

            // Method 2: Check if stylesheets are loaded
            const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
            let loadedCount = 0;

            const checkStylesheet = (link) => {
                return new Promise((resolve) => {
                    if (link.sheet && link.sheet.cssRules) {
                        resolve(true);
                    } else {
                        link.addEventListener('load', () => resolve(true));
                        link.addEventListener('error', () => resolve(false));
                    }
                });
            };

            Promise.all([...stylesheets].map(checkStylesheet)).then(() => {
                setCssLoaded(true);
            });
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(checkCSSLoaded, 100);
        return () => clearTimeout(timer);
    }, []);



    // Updated useEffect to wait for both time and CSS loading
    useEffect(() => {
        if (isLoaded) return; // Prevent this from running more than once

        // Wait for both conditions: minimum time elapsed AND CSS loaded
        const timer = setTimeout(() => {
            if (cssLoaded) {
                setIsLoaded(true);
            } else {
                // If CSS not loaded yet, wait for it
                const cssWatcher = setInterval(() => {
                    if (cssLoaded) {
                        setIsLoaded(true);
                        clearInterval(cssWatcher);
                    }
                }, 50);

                // Failsafe: force load after maximum wait time
                setTimeout(() => {
                    setIsLoaded(true);
                    clearInterval(cssWatcher);
                }, 3000);
            }
        }, 1000);

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
    }, [isLoaded, setIsLoaded, isMobile, cssLoaded]); // Added cssLoaded dependency

    const openProjectsPage = () => {
        setShowProjectsPage(true);
        document.body.style.overflow = 'hidden';
    };

    const closeProjectsPage = () => {
        setShowProjectsPage(false);
        document.body.style.overflow = '';
    };

    return (
        <div className="relative overflow-hidden">
            {/* Main Website Container */}
            <motion.main 
                className="bg-gray-100 min-h-screen"
                animate={{ x: showProjectsPage ? "-100%" : "0%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
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
                        Hi !
                    </span>
                    <span className="md:hidden pb-[5px]">
                        Hey!<br /> I am Arpit Raj
                    </span>
                </h1>
            </div>

            {/* SVG Shutter overlay - z-index is 200 */}
            <div className={`fixed inset-0 z-[200] flex items-center justify-center shutter-overlay ${isLoaded ? 'pointer-events-none' : ''}`}>
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
                <ProjectShowcase onViewAllClick={openProjectsPage} />
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
                            <p className="text-gray-500 text-sm">
                                © 2025 Built with intention
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </motion.main>

            {/* Projects Page - Slides in from right */}
            {mounted && createPortal(
                <AnimatePresence>
                    {showProjectsPage && (
                        <motion.div 
                            key="projects-page"
                            className="fixed top-0 left-0 w-full h-[100dvh] overflow-y-auto bg-white"
                            style={{ zIndex: 9999 }}
                            initial={{ x: "100%" }}
                            animate={{ x: "0%" }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <ProjectsPage onClose={closeProjectsPage} />
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}