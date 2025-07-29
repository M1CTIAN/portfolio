"use client";
import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import About from "./components/About";
import ProjectShowcase from "./components/ProjectsCarousel";
import Interactive3D from "./components/Interactive3D";
import "./globals.css";

export default function Page() {
    const [reveal, setReveal] = useState(false);
    const [, setScrollDisabled] = useState(true);
    const [showEmailCopied, setShowEmailCopied] = useState(false);

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

    useEffect(() => {
        // Store original scroll position
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // IMPROVED scroll prevention handler
        const preventScroll = (e) => {
            if (e.cancelable) {
                e.preventDefault();
            }
            e.stopPropagation();
            return false;
        };

        const preventKeyboardScroll = (e) => {
            const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40]; // space, pgup/down, arrows etc
            if (keys.includes(e.keyCode)) {
                e.preventDefault();
                return false;
            }
        };

        // More aggressive scroll locking
        document.body.style.cssText = `
            position: fixed;
            top: -${scrollTop}px;
            left: 0;
            right: 0;
            width: 100%;
            overflow: hidden;
            touch-action: none;
          `;
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.height = '100vh';

        // Immediate event listener attachment
        window.addEventListener('wheel', preventScroll, { passive: false, capture: true });
        window.addEventListener('touchmove', preventScroll, { passive: false, capture: true });
        window.addEventListener('scroll', () => window.scrollTo(0, scrollTop), { passive: false });
        window.addEventListener('keydown', preventKeyboardScroll, { passive: false });
        document.addEventListener('touchstart', preventScroll, { passive: false });
        document.addEventListener('touchend', preventScroll, { passive: false });

        const timer = setTimeout(() => setReveal(true), 1000);

        // Re-enable scrolling after 4 seconds
        const scrollTimer = setTimeout(() => {
            setScrollDisabled(false);

            // Restore scroll
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';

            // Restore scroll position
            window.scrollTo(0, scrollTop);

            // Remove event listeners
            window.removeEventListener('wheel', preventScroll, { capture: true });
            window.removeEventListener('touchmove', preventScroll, { capture: true });
            window.removeEventListener('scroll', () => window.scrollTo(0, scrollTop));
            window.removeEventListener('keydown', preventKeyboardScroll);
            document.removeEventListener('touchstart', preventScroll);
            document.removeEventListener('touchend', preventScroll);
        }, 2800);

        return () => {
            clearTimeout(timer);
            clearTimeout(scrollTimer);

            // Cleanup: ensure scrolling is re-enabled and listeners are removed
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            window.scrollTo(0, scrollTop);

            window.removeEventListener('wheel', preventScroll, { capture: true });
            window.removeEventListener('touchmove', preventScroll, { capture: true });
            window.removeEventListener('scroll', () => window.scrollTo(0, scrollTop));
            window.removeEventListener('keydown', preventKeyboardScroll);
            document.removeEventListener('touchstart', preventScroll);
            document.removeEventListener('touchend', preventScroll);
        };
    }, []);

    useEffect(() => {
        let lastScrollY = 0;
        let scrollDirection = 'down';
        let targetSpeed = -0.8;
        let currentSpeed = -0.8;
        let baseOffset = -2000;
        let animationId = null;
        let lastTime = performance.now();

        // Smooth animation loop with speed interpolation
        const animateMarquee = (currentTime) => {
            const deltaTime = Math.min(currentTime - lastTime, 16) / 1000;

            // Smooth speed transition using linear interpolation
            const lerpFactor = 0.05;
            currentSpeed += (targetSpeed - currentSpeed) * lerpFactor;

            // Apply the smoothed speed
            baseOffset += currentSpeed;

            // Reset offset periodically to prevent large numbers
            if (Math.abs(baseOffset) > 10000) {
                baseOffset = baseOffset > 0 ? 1000 : -1000;
            }

            document.documentElement.style.setProperty('--marquee-offset', baseOffset);

            lastTime = currentTime;
            animationId = requestAnimationFrame(animateMarquee);
        };

        let ticking = false;
        const handleScroll = (data) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = data?.scroll?.y || window.pageYOffset || 0;
                    const scrollDiff = scrolled - lastScrollY;

                    if (Math.abs(scrollDiff) > 3) {
                        const newDirection = scrollDiff > 0 ? 'down' : 'up';

                        if (newDirection !== scrollDirection) {
                            scrollDirection = newDirection;
                            targetSpeed = scrollDirection === 'up' ? 0.8 : -0.8;
                        }
                    }

                    lastScrollY = scrolled;
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Setup listeners
        const setupScrollListeners = () => {
            if (window.locomotive) {
                window.locomotive.on('scroll', handleScroll);
            } else {
                window.addEventListener('scroll', handleScroll, { passive: true });
            }
            animateMarquee(performance.now());
        };

        setTimeout(setupScrollListeners, 4000);

        return () => {
            if (animationId) cancelAnimationFrame(animationId);
            if (window.locomotive) {
                try { window.locomotive.off('scroll', handleScroll); } catch (e) { }
            }
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Simple static text rendering - no animations
    const renderSimpleText = (word, colorClass, plClass) => {
        return (
            <div className={plClass}>
                <h1 className={`text-[20vw] text-left md:text-[15vw] lg:text-[480px] font-black ${colorClass} leading-none tracking-tight select-none`}>
                    {word}
                </h1>
            </div>
        );
    };

    return (
        <main className="bg-gray-100 min-h-screen overflow-hidden">
            {/* Move Navigation OUTSIDE the transformed wrapper */}
            <Navigation />

            {/* ——— KEEP these OUTSIDE the transformed wrapper ——— */}
            {/* Text that moves with shutter */}
            <div
                className={`
                fixed z-101
                transition-transform duration-[4500ms]
                ${reveal ? "translate-y-[-100vh]" : ""}
                `}
                style={{
                    top: '50vh', left: '50vw',
                    transform: reveal
                        ? 'translate(-50%, -50%) translateY(-100vh)'
                        : 'translate(-50%, -50%)'
                }}
            >
                <h1 className="text-5xl md:text-7xl font-extrabold text-[#d1d5db] drop-shadow-xl animate-fadeinup">
                    Crafting <span className="text-[#f3f4f6]">Digital Magic</span>
                </h1>
            </div>

            {/* SVG Shutter overlay */}
            <div className="fixed inset-0 z-50 flex items-center justify-center shutter-overlay">
                <svg
                    width="100%" height="100%"
                    viewBox="0 0 1000 1000" preserveAspectRatio="none"
                    className={`absolute top-0 left-0 w-full h-full duration-3000 shutter-svg ${reveal ? "shutter-animate" : ""}`}
                >
                    <path
                        id="shutterPath" fill="#18181b"
                        d={
                            reveal
                                ? "M0,-100 L1000,-100 L1000,-100 Q500,-100 0,-100 Z"
                                : "M0,0 L1000,0 L1000,1000 Q500,1100 0,1000 Z"
                        }
                    />
                </svg>
            </div>

            <div
                className={`
          relative w-full min-h-screen
           duration-[3000ms] ease-in-out
          ${reveal ? "translate-y-0" : "translate-y-[100vh]"}
        `}
            >
                {/* Remove Navigation from here */}

                {/* Main Content Area - Typography Focus */}
                <div id="home" className="min-h-screen flex justify-center relative bg-gray-100">
                    {/* Role Badge - Top Right */}
                    <div className="fixed bottom-32 right-12 z-30">
                        <div className="text-right">
                            <div className="text-gray-400 text-sm">↘</div>
                            <div className="text-gray-900 text-lg font-light">Freelance</div>
                            <div className="text-gray-900 text-xl font-medium">Designer & Developer</div>
                            <div className="text-gray-900 text-lg font-light">Based in New Delhi, India</div>
                        </div>
                    </div>

                    {/* Central Typography Layout */}
                    <div className="relative mt-6 min-w-screen z-20">
                        {/* Main Name Typography */}
                        <div className="overflow-visible">
                            {renderSimpleText("Arpit", "text-gray-900", "pl-12")}
                            {renderSimpleText("Raj", "text-gray-400", "pl-6")}
                        </div>
                    </div>
                    <div className="absolute bottom-0 w-[65%] -right-20 z-10">
                        <img
                            src="./me.png"
                            alt="Arpit Raj"
                        />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-gray-900 z-20 py-3">
                    <div className="marquee-container">
                        <div className="marquee-content">
                            <span className="text-lg font-medium text-white inline-block">
                                CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES •
                            </span>
                            <span className="text-lg font-medium text-white inline-block">
                                CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES •
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="about">
                <About />
            </div>
            <div id="work">
                <ProjectShowcase />
            </div>

            {/* Philosophy & Contact Section - Inspired Design */}
            <section id="contact" className="relative bg-gray-100 py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        {/* Left - Philosophy */}
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                                City-Born, Self-Shaped
                            </h2>

                            <div className="space-y-6 text-gray-700 leading-relaxed">
                                <p>
                                    Shaped by a childhood spent moving between cities, with New Delhi as my anchor, I&apos;ve 
                                    learned to value perspective, adaptability, and purpose. This background informs my belief 
                                    that technology shouldn&apos;t just strive for scale or novelty, but for integrity and intention.
                                </p>

                                <p>
                                    I am devoted to continually learning and maintaining
                                    mindfulness as a craftsman.
                                </p>
                            </div>
                        </div>

                        {/* Right - Image with decorative element below */}
                        <div>
                            <img
                                src="/fill.png"
                                alt="Filler Image"
                                width={500}
                                height={100}
                                className="w-full h-auto max-h-36 object-cover rounded-lg shadow-lg"
                            />
                            
                            {/* Decorative sketch element below image */}
                            <div className="mt-8 opacity-30">
                                <svg width="200" height="60" viewBox="0 0 200 60" className="text-gray-400">
                                    <path
                                        d="M10,40 Q50,10 90,40 T170,40"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M15,45 Q45,20 80,45 T160,45"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        fill="none"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Divider Line */}
                    <div className="w-full h-px bg-gray-300 my-16"></div>

                    {/* Large Typography Section */}
                    <div className="text-center mb-16">
                        <h3 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 leading-none tracking-tight">
                            Build the world with{' '}
                            <span className="italic font-sans text-gray-600">intention</span>
                        </h3>
                    </div>

                    {/* Contact Links */}
                    <div className="flex flex-wrap justify-center gap-8 text-lg">
                        <button
                            onClick={copyEmailToClipboard}
                            className="text-gray-600 hover:text-gray-900 transition-colors duration-300 border-b border-gray-300 hover:border-gray-900 pb-1 cursor-pointer"
                        >
                            Email
                        </button>
                        <a
                            href="https://www.linkedin.com/in/arpit---raj/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 transition-colors duration-300 border-b border-gray-300 hover:border-gray-900 pb-1"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="https://github.com/M1CTIAN"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 transition-colors duration-300 border-b border-gray-300 hover:border-gray-900 pb-1"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </section>

            {/* Email Copied Toast - Bottom Right */}
            {showEmailCopied && (
                <div className="fixed bottom-6 right-6 z-[100] pointer-events-none">
                    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 p-4 pointer-events-auto animate-slideInRight">
                        <div className="flex items-center space-x-3">
                            {/* Check icon */}
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-900 font-medium text-sm">Email copied!</p>
                                <p className="text-gray-600 text-xs">raj.arpit140@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

                        <div className="mt-6 md:mt-0">
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
