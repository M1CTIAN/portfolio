"use client";
import React, { useRef, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';
import '../styles/Hero.css'; // Import custom CSS for Hero component
// importing image from next
import Image from 'next/image';

const wrap = (min, max, v) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

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
            <div className={`${plClass} hero-main`}>
                <h1 className={`text-[24vw] font-black ${colorClass} leading-none tracking-tight select-none`}>
                    {word}
                </h1>
            </div>
        );
    };

    return (
        <>
            {/* Main Content Area - Typography Focus */}
            <div id="home" className="">
                {/* Role Badge - Adjusted for responsiveness */}
                <div className="absolute bottom-15 w-full z-11 hero-text">
                    <div className="text-gray-400 text-lg ">↘</div>
                    <div className="text-gray-900 text-lg font-light">Freelance</div>
                    <div className="text-gray-900 text-xl font-medium">Designer & Developer</div>
                    <div className="text-gray-900 text-lg font-light">Based in New Delhi, India</div>
                </div>

                {/* Central Typography Layout */}
                <div className="absolute">
                    <div className="">
                        {renderSimpleText("Arpit", "text-gray-900", "pl-6")}
                        {renderSimpleText("Raj", "text-gray-400", "pl-0")}
                    </div>
                </div>
                {/* Image - Adjusted for responsiveness */}
                <img
                    src="/me2.png"
                    alt="Arpit Raj"
                    width={1300}
                    height={1200}
                    className={
                        "absolute bottom-0 z-10 pointer-events-none object-cover " +
                        // MOBILE & TABLET (0px to 1199px)
                        "left-1/2 -translate-x-1/2 w-auto h-[125vh] sm:h-[125vh] " +
                        // DESKTOP (1200px and up - Restores your original layout)
                        "min-[1200px]:left-2/5 min-[1200px]:translate-x-0 min-[1200px]:right-0 " +
                        "min-[1200px]:h-auto min-[1200px]:w-[70vw] xl:w-[60vw] max-w-none"
                    }
                    style={{ transformOrigin: 'center bottom' }}
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