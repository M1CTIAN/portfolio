"use client";
import React, { useRef, useEffect } from 'react';
// importing image from next
import Image from 'next/image';

const Hero = () => {
    const marqueeRef = useRef(null);

    // Optimized, Intersection-Aware Marquee Animation
    useEffect(() => {
        const marqueeElement = marqueeRef.current;
        if (!marqueeElement) return;

        let lastScrollY = 0;
        let scrollDirection = 'down';
        let targetSpeed = -0.8;
        let currentSpeed = -0.8;
        let offset = 0;
        let animationId = null;

        const marqueeContent = marqueeElement.querySelector('.marquee-content');
        if (!marqueeContent) return;

        let singleContentWidth = 0;

        const animateMarquee = () => {
            // Lazily calculate width on the first frame to ensure it's not 0
            if (singleContentWidth === 0) {
                singleContentWidth = marqueeContent.scrollWidth / 2;
                if (singleContentWidth === 0) {
                    animationId = requestAnimationFrame(animateMarquee);
                    return; // Wait for next frame if width is not ready
                }
            }

            // Smooth speed transition using linear interpolation
            const lerpFactor = 0.05;
            currentSpeed += (targetSpeed - currentSpeed) * lerpFactor;
            offset += currentSpeed;

            // Correct, seamless loop logic for both directions
            if (currentSpeed < 0 && offset <= -singleContentWidth) {
                // If moving left and passed one full content width, loop back
                offset += singleContentWidth;
            } else if (currentSpeed > 0 && offset >= 0) {
                // If moving right and returned to the start, loop back
                offset -= singleContentWidth;
            }

            marqueeContent.style.transform = `translateX(${offset}px)`;
            animationId = requestAnimationFrame(animateMarquee);
        };

        const handleScroll = (data) => {
            const scrolled = data?.scroll?.y || window.pageYOffset || 0;
            const scrollDiff = scrolled - lastScrollY;

            if (Math.abs(scrollDiff) > 2) { // Sensitivity threshold
                const newDirection = scrollDiff > 0 ? 'down' : 'up';
                if (newDirection !== scrollDirection) {
                    scrollDirection = newDirection;
                    targetSpeed = scrollDirection === 'up' ? 0.8 : -0.8;
                }
            }
            lastScrollY = scrolled;
        };

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    // Start animation and listeners when visible
                    if (window.locomotive) {
                        window.locomotive.on('scroll', handleScroll);
                    } else {
                        window.addEventListener('scroll', handleScroll, { passive: true });
                    }
                    animationId = requestAnimationFrame(animateMarquee);
                } else {
                    // Stop animation and listeners when not visible
                    if (animationId) cancelAnimationFrame(animationId);
                    animationId = null;
                    if (window.locomotive) {
                        try { window.locomotive.off('scroll', handleScroll); } catch (e) { }
                    }
                    window.removeEventListener('scroll', handleScroll);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(marqueeElement);

        return () => {
            observer.disconnect();
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
                <h1 className={`text-[24vw] sm:text-[22vw] md:text-[15vw] lg:text-[480px] font-black ${colorClass} leading-none tracking-tight select-none`}>
                    {word}
                </h1>
            </div>
        );
    };

    return (
        <>
            {/* Main Content Area - Typography Focus */}
            <div id="home" className="min-h-screen flex flex-col justify-center items-start md:flex-row md:justify-center md:items-center relative bg-gray-100 pt-20 md:pt-0 px-4">
                {/* Role Badge - Adjusted for responsiveness */}
                <div className="absolute bottom-8 left-4 md:fixed md:bottom-32 md:right-12 md:left-auto z-30 text-left md:text-right">
                    <div className="text-gray-400 text-xs md:text-sm">↘</div>
                    <div className="text-gray-900 text-sm md:text-lg font-light">Freelance</div>
                    <div className="text-gray-900 text-base md:text-xl font-medium">Designer & Developer</div>
                    <div className="text-gray-900 text-sm md:text-lg font-light">Based in New Delhi, India</div>
                </div>

                {/* Central Typography Layout */}
                <div className="relative w-full md:w-auto pb-20 min-w-screen z-20">
                    {/* Main Name Typography - Adjusted for responsiveness */}
                    <div className="overflow-visible">
                        {renderSimpleText("Arpit", "text-gray-900", "pl-6")}
                        {renderSimpleText("Raj","text-gray-400", "pl-0")}
                    </div>
                </div>
                {/* Image - Adjusted for responsiveness */}
                <Image
                    src="/me.png"
                    alt="Arpit Raj"
                    width={1200}
                    height={1200}
                    priority
                    sizes="(max-width: 768px) 100vw, 65vw"
                    className="absolute bottom-0 w-[200%] h-[65vh] left-1/2 -translate-x-1/2 object-contain object-bottom md:left-auto md:translate-x-0 md:w-[65%] md:h-auto md:max-w-none md:-right-20 z-30 md:z-10"
                />
            </div>

            <div ref={marqueeRef} className="absolute bottom-0 left-0 w-full overflow-hidden bg-gray-900 z-20 py-3">
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
        </>
    );
};

export default Hero;