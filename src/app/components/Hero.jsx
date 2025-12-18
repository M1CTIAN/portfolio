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
    const baseX = useMotionValue(0);
    const scrollY = useMotionValue(0);
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const x = useTransform(baseX, (v) => `${wrap(0, -50, v)}%`);

    const directionFactor = useRef(1);
    const smoothedDirection = useRef(1);

    useAnimationFrame((t, delta) => {
        // Change direction based on scroll velocity
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        // Smoothly interpolate the direction to prevent sudden jumps
        smoothedDirection.current += (directionFactor.current - smoothedDirection.current) * 0.05;

        // Movement = (Smoothed Base Direction * Base Speed) + (Scroll Velocity * Influence)
        let moveBy = (smoothedDirection.current * 2 + velocityFactor.get() * 2) * (delta / 1000);

        baseX.set(baseX.get() + moveBy);
    });

    // Connect Locomotive Scroll to Framer Motion
    useEffect(() => {
        const handleScroll = (data) => {
            const y = data?.scroll?.y || window.pageYOffset || 0;
            scrollY.set(y);
        };

        if (window.locomotive) {
            window.locomotive.on('scroll', handleScroll);
        } else {
            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        return () => {
            if (window.locomotive) {
                try { window.locomotive.off('scroll', handleScroll); } catch (e) { }
            }
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrollY]);

    // Simple static text rendering - no animations
    const renderSimpleText = (word, colorClass, plClass) => {
        return (
            <div className={`${plClass} hero-main`}>
                <h1 className={`text-[460.8px] font-black ${colorClass} leading-none tracking-tight select-none`}>
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
                        {renderSimpleText("Raj","text-gray-400", "pl-0")}
                    </div>
                </div>
                {/* Image - Adjusted for responsiveness */}
                <img
                    src="/me2.png"
                    alt="Arpit Raj"
                    width={1300}
                    height={1200}
                    className="absolute hero-photo max-w-[1500px] min-h-[1000px] min-w-[1200px] bottom-0 right-0 z-10"
                />
            </div>

            <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-gray-900 z-20 py-3">
                <div className="marquee-container flex whitespace-nowrap">
                    <motion.div className="marquee-content flex whitespace-nowrap" style={{ x }}>
                        <span className="text-lg font-medium text-white inline-block mr-4">
                            CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES •
                        </span>
                        <span className="text-lg font-medium text-white inline-block mr-4">
                            CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES •
                        </span>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Hero;