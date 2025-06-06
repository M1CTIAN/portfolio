import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ParallaxSection({ children, bgElement }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

    // Parallax for background
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    // Parallax for foreground
    const fgY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

    return (
        <section ref={ref} className="relative min-h-[120vh] overflow-visible">
            {/* Background parallax */}
            <motion.div
                style={{ y: bgY }}
                className="absolute inset-0 z-0 pointer-events-none"
            >
                {bgElement}
            </motion.div>
            {/* Foreground parallax */}
            <motion.div style={{ y: fgY }} className="relative z-10">
                {children}
            </motion.div>
        </section>
    );
}