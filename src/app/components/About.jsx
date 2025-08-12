"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

// Enhanced wiggle path generation with mouse repulsion
function getWigglePaths(time, numLines, svgWidth, mouseX, mouseY, svgHeight) {
    const paths = [];
    const baseHeight = 850;
    const startX = svgWidth * 0.6;
    const endX = svgWidth;
    const rightHalfWidth = endX - startX;

    for (let i = 0; i < numLines; i++) {
        const x = startX + (i / (numLines - 1)) * rightHalfWidth;
        const amplitude = 15 + Math.sin(i * 0.3) * 5;
        const frequency = 0.008;
        const phase = time * 0.5;

        let path = `M${x},0`;
        const steps = Math.max(20, Math.floor(baseHeight / 30));

        for (let y = 0; y <= baseHeight; y += baseHeight / steps) {
            let offset = Math.sin(y * frequency + phase) * amplitude;

            // Calculate mouse repulsion
            const mouseDistanceX = mouseX - (x + offset);
            const mouseDistanceY = mouseY - y;
            const totalDistance = Math.sqrt(mouseDistanceX * mouseDistanceX + mouseDistanceY * mouseDistanceY);

            // Repulsion parameters
            const repulsionRadius = 80; // Area of influence
            const repulsionStrength = 30; // How strong the repulsion is

            if (totalDistance < repulsionRadius && totalDistance > 0) {
                const repulsionForce = (repulsionRadius - totalDistance) / repulsionRadius;
                const repulsionIntensity = repulsionForce * repulsionStrength;

                // Push away from mouse
                const pushX = (mouseDistanceX / totalDistance) * repulsionIntensity * -1;
                const pushY = (mouseDistanceY / totalDistance) * repulsionIntensity * -1;

                offset += pushX;
                // You can also add vertical displacement if needed:
                // const adjustedY = y + pushY;
            }

            path += ` L${x + offset},${y}`;
        }
        paths.push(path);
    }
    return paths;
}

export default function About() {
    const NUM_LINES = 10;
    const [svgWidth, setSvgWidth] = useState(1200);
    const [svgHeight, setSvgHeight] = useState(850);
    const [time, setTime] = useState(0);
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 }); // Start off-screen

    // Memoize paths to prevent unnecessary recalculations
    const wigglePaths = useMemo(() =>
        getWigglePaths(time, NUM_LINES, svgWidth, mousePos.x, mousePos.y, svgHeight),
        [time, svgWidth, mousePos.x, mousePos.y, svgHeight]
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
            setSvgWidth(window.innerWidth);

            const handleResize = () => setSvgWidth(window.innerWidth);
            window.addEventListener("resize", handleResize, { passive: true });
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    // Mouse tracking for repulsion effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const rect = aboutSection.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setMousePos({ x, y });
            }
        };

        const handleMouseLeave = () => {
            // Move mouse position off-screen when leaving the section
            setMousePos({ x: -1000, y: -1000 });
        };

        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.addEventListener('mousemove', handleMouseMove, { passive: true });
            aboutSection.addEventListener('mouseleave', handleMouseLeave, { passive: true });
            return () => {
                aboutSection.removeEventListener('mousemove', handleMouseMove);
                aboutSection.removeEventListener('mouseleave', handleMouseLeave);
            };
        }
    }, []);

    // Throttled animation frame
    useEffect(() => {
        let animationId;
        let lastTime = 0;

        const animate = (currentTime) => {
            // Throttle to 30fps instead of 60fps
            if (currentTime - lastTime > 33) {
                setTime(currentTime / 1000);
                lastTime = currentTime;
            }
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <section
            id="about"
            className="bg-gray-100 relative pt-52 pb-32 overflow-hidden"
        >
            {/* Enhanced SVG with gradient fade */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
                width="100%"
                height="100%"
                viewBox={`0 0 ${svgWidth} 850`}
                preserveAspectRatio="none"
                fill="none"
            >
                <defs>
                    {/* Updated gradient to use website colors */}
                    <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(107,114,128,0.15)" stopOpacity="1" />
                        <stop offset="70%" stopColor="rgba(107,114,128,0.15)" stopOpacity="1" />
                        <stop offset="90%" stopColor="rgba(107,114,128,0.08)" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="rgba(107,114,128,0.02)" stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                {wigglePaths.map((d, i) => (
                    <path
                        key={i}
                        d={d}
                        stroke="url(#fadeGradient)"
                        strokeWidth={1.5}
                        fill="none"
                        strokeLinecap="round"
                        style={{
                            transition: 'all 0.15s ease-out'
                        }}
                    />
                ))}
            </svg>


            {/* Simplified background elements */}
            <motion.div
                className="absolute top-0 right-0 w-[40%] h-[40%] bg-gray-400 rounded-full opacity-10"
                initial={{ scale: 0.8, x: 100 }}
                whileInView={{ scale: 1, x: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
            />

            <motion.div
                className="absolute bottom-20 left-20 w-72 h-72 bg-gray-400 rounded-full opacity-10"
                initial={{ scale: 0.5, y: 100 }}
                whileInView={{ scale: 1, y: 0 }}
                transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
            />

            {/* Main content */}
            <div className="max-w-7xl mx-auto relative px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    <div>
                        {/* Simplified title animation */}
                        <motion.div
                            className="mb-16 space-y-1 z-10 relative"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, staggerChildren: 0.2 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <motion.h2
                                className="italic text-6xl md:text-7xl font-bold times leading-tight text-gray-900"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                Designer.
                            </motion.h2>

                            <motion.h2
                                className="italic text-6xl md:text-7xl font-bold times leading-tight text-gray-900"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                Developer.
                            </motion.h2>

                            <div className="relative">
                                <motion.h2
                                    className="italic text-6xl md:text-7xl font-bold times leading-tight text-gray-900"
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                >
                                    Problem-solver.
                                </motion.h2>
                                <motion.div
                                    className="absolute bottom-0 left-0 h-1 bg-gray-900"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "75%" }}
                                    transition={{ duration: 1.2, delay: 0.8 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            className="max-w-xl"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <p className="italic text-2xl md:text-[35px] text-gray-900 leading-tight font-serif">
                                Tech enthusiast with a builder's mindset and a love for clean,
                                scalable solutions.
                                <span className="block mt-4">
                                    Always learning, always shipping.
                                </span>
                            </p>

                            <motion.p
                                className="mt-8 text-lg md:text-xl text-gray-400 leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.8 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                I'm Arpit Raj, a tech enthusiast and final year B.Tech student at IIIT Bhopal,
                                driven by a love for clean code, elegant design, and solving real-world problems
                                through technology.
                            </motion.p>

                            <motion.div
                                className="flex gap-6 mt-10"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <motion.a
                                    href="https://www.linkedin.com/in/arpit---raj/"
                                    target="_blank"
                                    className="px-6 py-3 rounded-full bg-gray-900 hover:bg-gray-400 text-white font-semibold shadow-lg transition-all duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Connect With Me
                                </motion.a>
                                <motion.a
                                    href="/ArpitRaj_Resume.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-full border-2 border-gray-900 text-gray-900 bg-white hover:bg-gray-100 font-semibold shadow-lg transition-all duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Resume
                                </motion.a>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}