import { motion, useAnimationFrame } from "framer-motion";
import { useState, useEffect } from "react";

function getWigglePaths(t, mouse, numLines = 45, width = 1200) {
  const amplitude       = 12;
  const freq            = 0.8;
  const phase           = 0;
  const step            = 8;
  const exclusionRadius = 200;
  const influenceRadius = 400;
  const swirlStrength   = 80;

  // only cover the right half of the viewport
  const halfW     = width / 2;
  const spacing   = halfW / (numLines - 1);

  // 1. Base wiggle → compute GLOBAL X in [halfW..width]
  let allPoints = [];
  for (let i = 0; i < numLines; i++) {
      const baseX = halfW + spacing * i;     // start at halfW
      let pts = [];
      for (let y = 0; y <= 1000; y += step) {
          const wiggle = Math.sin(t * freq + phase + y/300 + i*0.15) * amplitude;
          pts.push([ baseX + wiggle, y ]);
      }
      allPoints.push(pts);
  }

  // 2. Repulsion → same global‐X logic
  if (mouse) {
    const secTop = document
      .getElementById("about")
      .getBoundingClientRect().top;

    // Precompute a Gaussian σ for smooth falloff
    const sigma    = influenceRadius / 3;
    const sigmaSq2 = 2 * sigma * sigma;

    for (let i = 0; i < numLines; i++) {
      for (let j = 0; j < allPoints[i].length; j++) {
        let [gx, ly] = allPoints[i][j];
        let gy        = secTop + ly;
        const dx      = gx - mouse.x;
        const dy      = gy - mouse.y;
        const dist    = Math.hypot(dx, dy);

        if (dist < exclusionRadius) {
          // hard‐exclude
          const ang = Math.atan2(dy, dx);
          gx = mouse.x + Math.cos(ang) * exclusionRadius;
          gy = mouse.y + Math.sin(ang) * exclusionRadius;
        }
        else if (dist < influenceRadius) {
          // Gaussian falloff for super‐smooth repulsion
          const falloff  = Math.exp(- (dist * dist) / sigmaSq2);
          const strength = 80 * falloff;          // adjust max strength up/down
          const ux       = dx / dist;
          const uy       = dy / dist;

          // radial push
          gx += ux * strength;
          gy += uy * strength;

          // tangential swirl, also smoothed
          const swirl = swirlStrength * falloff;
          gx += -uy * swirl;
          gy +=  ux * swirl;
        }

        // write back local coords
        allPoints[i][j][0] = gx;
        allPoints[i][j][1] = gy - secTop;
      }
    }
  }

  // 3. extra smoothing (both X & Y) for silky motion
  for (let pass = 0; pass < 3; pass++) {
      // horizontal neighbor blend
      for (let i = 1; i < numLines - 1; i++) {
          for (let j = 0; j < allPoints[i].length; j++) {
              const c  = allPoints[i][j];
              const l  = allPoints[i - 1][j];
              const r  = allPoints[i + 1][j];
              // mix 70% center, 15% left, 15% right
              allPoints[i][j][0] = c[0] * 0.7 + (l[0] + r[0]) * 0.15;
          }
      }
      // vertical neighbor blend
      for (let i = 0; i < numLines; i++) {
          for (let j = 1; j < allPoints[i].length - 1; j++) {
              const c  = allPoints[i][j];
              const u  = allPoints[i][j - 1];
              const d  = allPoints[i][j + 1];
              allPoints[i][j][1] = c[1] * 0.7 + (u[1] + d[1]) * 0.15;
          }
      }
  }

  // 4. Build paths (global coords)
  return allPoints.map(pts => {
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let j = 0; j < pts.length - 1; j++) {
          const [x0,y0] = pts[j>0?j-1:j],
                [x1,y1] = pts[j],
                [x2,y2] = pts[j+1],
                [x3,y3] = pts[j+2<pts.length?j+2:j+1];
          const cp1x = x1 + (x2 - x0)/6,
                cp1y = y1 + (y2 - y0)/6,
                cp2x = x2 - (x3 - x1)/6,
                cp2y = y2 - (y3 - y1)/6;
          d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
      }
      return d;
  });
}

export default function About() {
    const NUM_LINES = 12;
    const [svgWidth, setSvgWidth] = useState(1200); // default width
    const [wigglePaths, setWigglePaths] = useState([]); // Start empty
    const [mouse, setMouse] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setSvgWidth(window.innerWidth);
            setWigglePaths(getWigglePaths(0, null, NUM_LINES, window.innerWidth));
            const handleResize = () => {
                setSvgWidth(window.innerWidth);
                setWigglePaths(getWigglePaths(0, mouse, NUM_LINES, window.innerWidth));
            };
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    // eslint-disable-next-line
    }, []);

    useAnimationFrame(t => {
        if (typeof window !== "undefined") {
            setWigglePaths(getWigglePaths(t / 1000, mouse, NUM_LINES, svgWidth));
        }
    });

    return (
        <section
            id="about"
            className="bg-gray-100 relative pt-52 pb-32 overflow-hidden"
        >
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                width="100%"
                height="100%"
                viewBox={`0 0 ${svgWidth} 1000`}
                preserveAspectRatio="none"
                fill="none"
            >
                {wigglePaths.map((d, i) => (
                    <motion.path
                        key={i}
                        d={d}
                        stroke="rgba(99,102,241,0.12)"
                        strokeWidth={1.5}
                        fill="none"
                        initial={{ pathLength: 0, pathOffset: i % 2 ? 0 : 1 }}
                        animate={{ pathLength: 1, pathOffset: 0 }}
                        transition={{ duration: 2.5, ease: "easeInOut", delay: i * 0.1 }}
                    />
                ))}
            </svg>

            {/* Existing background elements */}
            <motion.div
                className="absolute top-0 right-0 w-[40%] h-[40%] bg-gray-100 rounded-full opacity-30"
                initial={{ scale: 0.8, x: 100 }}
                whileInView={{ scale: 1, x: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
            />

            <motion.div
                className="absolute bottom-20 left-20 w-72 h-72 bg-gray-200 rounded-full opacity-20"
                initial={{ scale: 0.5, y: 100 }}
                whileInView={{ scale: 1, y: 0 }}
                transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
            />

            {/* Static decorative lines */}
            <motion.div
                className="absolute top-20 left-10 w-40 h-40 pointer-events-none"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
            >
                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                    <motion.path
                        d="M10,30 Q20,20 30,30 T50,30 T70,30 T90,30"
                        stroke="#ddd"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        viewport={{ once: true }}
                    />
                </svg>
            </motion.div>

            <motion.div
                className="absolute top-1/2 right-8 w-48 h-48 pointer-events-none"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
            >
                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                    <motion.path
                        d="M10,50 Q25,30 40,50 T70,50 T100,50"
                        stroke="rgba(99, 102, 241, 0.2)"
                        strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        viewport={{ once: true }}
                    />
                </svg>
            </motion.div>

            <motion.div
                className="absolute bottom-10 right-1/4 w-96 h-20 pointer-events-none"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
            >
                <svg width="100%" height="100%" viewBox="0 0 200 50" fill="none">
                    <motion.path
                        d="M0,25 Q12.5,10 25,25 T50,25 T75,25 T100,25 T125,25 T150,25 T175,25 T200,25"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                        initial={{ pathLength: 0, x: -20 }}
                        whileInView={{ pathLength: 1, x: 0 }}
                        transition={{ duration: 2.5, ease: "easeOut" }}
                        viewport={{ once: true }}
                    />
                </svg>
            </motion.div>

            {/* Rest of your content unchanged */}
            <div className="max-w-7xl mx-auto relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    <div>
                        <div className="mb-16 space-y-1 z-10 relative">
                            <div className="overflow-hidden">
                                <h2 className="italic text-6xl md:text-7xl font-bold times leading-20 text-gray-900">
                                    Designer.
                                </h2>
                            </div>

                            <div className="overflow-hidden">
                                <h2 className="italic text-6xl md:text-7xl font-bold times leading-20 text-gray-900">
                                    Developer.
                                </h2>
                            </div>

                            <div className="overflow-hidden relative">
                                <h2 className="italic text-6xl md:text-7xl font-bold times leading-20 text-gray-900">
                                    Problem-solver.
                                </h2>
                                <motion.div
                                    className="absolute bottom-0 left-0 h-1 bg-gray-700"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "75%" }}
                                    transition={{ duration: 1.2, delay: 1.0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                />
                            </div>
                        </div>

                        <motion.div
                            className="max-w-xl"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <p
                                className="italic text-2xl md:text-[35px] text-gray-900 leading-tight"
                                style={{ fontFamily: "Times New Roman, serif" }}
                            >
                                Tech enthusiast with a builder's mindset and a love for clean,
                                scalable solutions.
                                <motion.span
                                    className="block mt-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                >
                                    Always learning, always shipping.
                                </motion.span>
                            </p>
                            <motion.p
                                className="mt-8 text-lg md:text-2xl text-gray-700"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 1.2 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                I'm Arpit Raj, a tech enthusiast and final year B.Tech student at IIIT Bhopal, driven by a love for clean code, elegant design, and solving real-world problems through technology.
                            </motion.p>
                            <div className="flex gap-6 mt-10">
                                <a
                                    href="mailto:arpitraj.iiitb@gmail.com"
                                    className="px-6 py-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow transition-colors duration-200"
                                    style={{ boxShadow: "0 2px 16px 0 rgba(99,102,241,0.10)" }}
                                >
                                    Connect With Me
                                </a>
                                <a
                                    href="/ArpitRaj_Resume.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-full border-2 border-indigo-500 text-indigo-600 bg-white hover:bg-indigo-50 font-semibold shadow transition-colors duration-200"
                                    style={{ boxShadow: "0 2px 16px 0 rgba(99,102,241,0.07)" }}
                                >
                                    Resume
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}