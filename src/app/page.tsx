"use client";
import React, { useEffect, useState } from "react";

export default function Page() {
    const [reveal, setReveal] = useState(false);
    const [scrollDisabled, setScrollDisabled] = useState(true);

    useEffect(() => {
        // Store original scroll position
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // More comprehensive scroll prevention
        const preventScroll = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        };

        const preventKeyboardScroll = (e: KeyboardEvent) => {
            const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40]; // spacebar, page up/down, end, home, arrow keys
            if (keys.includes(e.keyCode)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };

        // Lock scroll position
        const lockScroll = () => {
            window.scrollTo(0, scrollTop);
        };

        // Multiple methods to prevent scrolling
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollTop}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // Add event listeners to prevent all forms of scrolling
        window.addEventListener('wheel', preventScroll, { passive: false, capture: true });
        window.addEventListener('touchmove', preventScroll, { passive: false, capture: true });
        window.addEventListener('scroll', lockScroll, { passive: false });
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
            window.removeEventListener('scroll', lockScroll);
            window.removeEventListener('keydown', preventKeyboardScroll);
            document.removeEventListener('touchstart', preventScroll);
            document.removeEventListener('touchend', preventScroll);
        }, 4000);

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
            window.removeEventListener('scroll', lockScroll);
            window.removeEventListener('keydown', preventKeyboardScroll);
            document.removeEventListener('touchstart', preventScroll);
            document.removeEventListener('touchend', preventScroll);
        };
    }, []);

    return (
        <main className="bg-gray-100 min-h-screen overflow-hidden">
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
            {/* ———————————————————————————————— */}

            {/* Now your transformed content wrapper */}
            <div
                className={`
          relative w-full min-h-screen
           duration-[3000ms] ease-in-out
          ${reveal ? "translate-y-0" : "translate-y-[100vh]"}
        `}
            >

                {/* Main Content Area - Typography Focus */}
                <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-100">
                    {/* Role Badge - Top Right */}
                    <div className="fixed top-32 right-12 z-30">
                        <div className="text-right">
                            <div className="text-gray-400 text-sm mb-1">↘</div>
                            <div className="text-gray-900 text-lg font-light">Freelance</div>
                            <div className="text-gray-900 text-xl font-medium">Designer & Developer</div>
                        </div>
                    </div>

                    {/* Central Typography Layout */}
                    <div className="relative z-20 text-center">
                        {/* Main Name Typography */}
                        <div className="mb-8">
                            <h1 className="text-[20vw] md:text-[15vw] lg:text-[12vw] font-black text-gray-900 leading-none tracking-tight">
                                Arpit
                            </h1>
                            <h2 className="text-[20vw] md:text-[15vw] lg:text-[12vw] font-black text-gray-300 leading-none tracking-tight -mt-4">
                                Raj
                            </h2>
                        </div>

                        {/* Subtitle */}
                        <div className="max-w-md mx-auto">
                            <p className="text-lg text-gray-600 font-light tracking-wide">
                                Creative Developer specializing in modern web experiences
                            </p>
                        </div>
                    </div>


                </div>




                <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-gray-900 z-20 py-3">
                    <div className="marquee-container">
                        <div className="marquee-content">
                            <div className="text-lg font-medium text-white">CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Section */}
            <div className="min-h-screen flex items-center justify-center bg-white">
                <h2 className="text-3xl text-gray-900">Next Section</h2>
            </div>
        </main>
    );
}