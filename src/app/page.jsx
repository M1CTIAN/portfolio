"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedLetter from "./AnimatedLetter.jsx";
import Navigation from "./components/Navigation";
import About from "./components/About";
import ParallaxSection from "./components/ParallaxSection";

const projects = [
    {
        title: "Project One",
        description: "Description for project one.",
        image: "./p1.png",
        tags: ["HTML", "CSS", "JavaScript"],
    },
    {
        title: "Project Two",
        description: "Description for project two.",
        image: "https://via.placeholder.com/800x600",
        tags: ["React", "TypeScript", "Node.js"],
    },
    // Add more projects as needed
];

function ProjectsShowcase({ projects }) {
    const ref = useRef(null);
    // Get scroll progress for the section
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    // Map vertical scroll to horizontal translation
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

    return (
        <section ref={ref} className="relative py-32 bg-white overflow-x-clip">
            <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-gray-900 tracking-tight">
                Projects
            </h2>
            <div className="relative w-full overflow-visible">
                <motion.div
                    style={{ x }}
                    className="flex gap-12 px-12"
                >
                    {projects.map((project, i) => (
                        <motion.div
                            key={i}
                            className="min-w-[350px] max-w-[350px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 flex flex-col items-center"
                            initial={{ opacity: 0, scale: 0.85, rotate: -8 + i * 4 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.12, type: "spring" }}
                            viewport={{ once: true, amount: 0.4 }}
                            whileHover={{ scale: 1.04, rotate: 2 }}
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-48 object-cover rounded-xl mb-6 shadow-lg"
                            />
                            <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
                            <p className="text-gray-600 mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag, j) => (
                                    <span
                                        key={j}
                                        className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default function Page() {
    const [reveal, setReveal] = useState(false);
    const [, setScrollDisabled] = useState(true);
    const [lens, setLens] = useState({ x: 0, y: 0, show: false });
    const [mouse, setMouse] = useState({ x: -9999, y: -9999 });
    const [mouseOnScreen, setMouseOnScreen] = useState(true);

    // Refs for letters
    const arpitRefs = useRef([]);
    const rajRefs = useRef([]);

    useEffect(() => {
        // Track mouse globally
        const handleMouseMove = (e) => {
            setMouse({ x: e.clientX, y: e.clientY });
            setMouseOnScreen(true);
        };

        const handleMouseLeave = () => {
            // IMMEDIATELY reset on mouse leave
            setMouseOnScreen(false);
            setMouse({ x: -9999, y: -9999 });
        };

        // Add more events for better detection
        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        // Add this fallback check that runs every 100ms
        const checkInterval = setInterval(() => {
            // If mouse is at edge or outside window
            if (
                !document.hasFocus() ||
                mouseOnScreen && (
                    mouse.x <= 0 ||
                    mouse.y <= 0 ||
                    mouse.x >= window.innerWidth ||
                    mouse.y >= window.innerHeight
                )
            ) {
                handleMouseLeave();
            }
        }, 100);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            clearInterval(checkInterval);
        };
    }, [mouse, mouseOnScreen]);

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
        }, 3800);

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

    // Letter animation helper
    const renderAnimatedLetters = (word, refs, colorClass, plClass) => {
        return (
            <h1 className={`${plClass} text-[20vw] text-left md:text-[15vw] lg:text-[480px] font-black ${colorClass} leading-none tracking-tight flex`}>
                {word.split('').map((char, idx) => {
                    return (
                        <AnimatedLetter
                            key={idx}
                            char={char}
                            mousePosition={mouse}
                        />
                    );
                })}
            </h1>
        );
    };

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
            <div
                className={`
          relative w-full min-h-screen
           duration-[3000ms] ease-in-out
          ${reveal ? "translate-y-0" : "translate-y-[100vh]"}
        `}
            >
                <Navigation />

                {/* Main Content Area - Typography Focus */}
                <div className="min-h-screen flex justify-center relative overflow-hidden bg-gray-100">
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
                        <div className="">
                            {renderAnimatedLetters("Arpit", arpitRefs, "text-gray-900", "pl-12")}
                            {renderAnimatedLetters("Raj", rajRefs, "text-gray-400", "pl-6")}
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
                            <div className="text-lg font-medium text-white">CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES • </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* About Section with Scroll Animations */}
            <About />
            {/* <ProjectsShowcase projects={projects} /> */}
        </main>
    );
}
