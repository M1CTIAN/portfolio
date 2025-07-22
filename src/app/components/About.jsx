import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

// Simplified wiggle path generator with smooth endings
function getWigglePaths(t, numLines = 8, width = 1200) {
    const amplitude = 8;
    const freq = 0.6;
    const step = 12;

    const halfW = width / 2;
    const spacing = halfW / (numLines - 1);

    const paths = [];
    for (let i = 0; i < numLines; i++) {
        const baseX = halfW + spacing * i;
        let d = '';

        // Generate points with fade-out at the end
        for (let y = 0; y <= 800; y += step) {
            // Fade out the wiggle amplitude towards the end
            const fadeOut = Math.max(0, 1 - (y / 800) * 0.8); // Start fading at 20% from end
            const currentAmplitude = amplitude * fadeOut;
            
            const wiggle = Math.sin(t * freq + y / 400 + i * 0.2) * currentAmplitude;
            const x = baseX + wiggle;

            if (y === 0) {
                d = `M${x},${y}`;
            } else {
                d += ` L${x},${y}`;
            }
        }
        
        // Add a smooth curve to center at the end
        const finalY = 800;
        const finalX = baseX; // Return to base position
        d += ` Q${baseX + (amplitude * 0.3)},${finalY - 20} ${finalX},${finalY}`;
        
        paths.push(d);
    }

    return paths;
}

export default function About() {
    const NUM_LINES = 10;
    const [svgWidth, setSvgWidth] = useState(1200);
    const [time, setTime] = useState(0);

    // Memoize paths to prevent unnecessary recalculations
    const wigglePaths = useMemo(() =>
        getWigglePaths(time, NUM_LINES, svgWidth),
        [time, svgWidth]
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
            setSvgWidth(window.innerWidth);

            const handleResize = () => setSvgWidth(window.innerWidth);
            window.addEventListener("resize", handleResize, { passive: true });
            return () => window.removeEventListener("resize", handleResize);
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
                viewBox={`0 0 ${svgWidth} 800`}
                preserveAspectRatio="none"
                fill="none"
            >
                <defs>
                    {/* Gradient for fading effect */}
                    <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(99,102,241,0.15)" stopOpacity="1"/>
                        <stop offset="70%" stopColor="rgba(99,102,241,0.15)" stopOpacity="1"/>
                        <stop offset="90%" stopColor="rgba(99,102,241,0.08)" stopOpacity="0.5"/>
                        <stop offset="100%" stopColor="rgba(99,102,241,0.02)" stopOpacity="0.1"/>
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
                    />
                ))}
            </svg>

            {/* Simplified background elements - removed some for performance */}
            <motion.div
                className="absolute top-0 right-0 w-[40%] h-[40%] bg-gray-200 rounded-full opacity-20"
                initial={{ scale: 0.8, x: 100 }}
                whileInView={{ scale: 1, x: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
            />

            <motion.div
                className="absolute bottom-20 left-20 w-72 h-72 bg-gray-200 rounded-full opacity-15"
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
                                    className="absolute bottom-0 left-0 h-1 bg-gray-700"
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
                                className="mt-8 text-lg md:text-xl text-gray-700 leading-relaxed"
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
                                    href="mailto:arpitraj.iiitb@gmail.com"
                                    className="px-6 py-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-lg transition-all duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Connect With Me
                                </motion.a>
                                <motion.a
                                    href="/ArpitRaj_Resume.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-full border-2 border-indigo-500 text-indigo-600 bg-white hover:bg-indigo-50 font-semibold shadow-lg transition-all duration-200"
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