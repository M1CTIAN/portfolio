"use client";
import React, { useEffect, useState } from "react";

export default function Page() {
    const [reveal, setReveal] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setReveal(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main>
            <div className={`relative w-[100%] min-h-screen portfolio-main-bg ${reveal ? 'portfolio-main-bg-revealed' : ''}`}>

                {/* Main website content */}
                <div className="min-h-screen flex items-center justify-center">
                    <h2 className="text-3xl text-[#f3f4f6]">Welcome to my portfolio!</h2>
                </div>

                {/* Text that moves with shutter - viewport-centered */}
                <div
                    className={`fixed z-101 transition-transform duration-[4500ms] ${reveal ? "translate-y-[-100vh]" : ""}`}
                    style={{
                        top: '50vh',
                        left: '50vw',
                        transform: reveal ? 'translate(-50%, -50%) translateY(-100vh)' : 'translate(-50%, -50%)',
                        width: 'auto',
                        height: 'auto'
                    }}
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold text-[#d1d5db] drop-shadow-xl animate-fadeinup">
                        Hi, I'm <span className="text-[#f3f4f6]">Arpit Raj</span>
                    </h1>
                </div>

                {/* SVG Shutter overlay */}
                <div
                    className="fixed inset-0 z-50 w-full h-full flex items-center justify-center shutter-overlay"
                >
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 1000 1000"
                        preserveAspectRatio="none"
                        className={`absolute top-0 left-0 w-full h-full transition-transform duration-3000 shutter-svg ${reveal ? "shutter-animate" : ""}`}
                    >
                        <path
                            id="shutterPath"
                            fill="#18181b"
                            d={
                                reveal
                                    // End state: shutter up (out of view)
                                    ? "M0,-100 L1000,-100 L1000,-100 Q500,-100 0,-100 Z"
                                    // Start state: shutter down, middle part lower (frown)
                                    : "M0,0 L1000,0 L1000,1000 Q500,1100 0,1000 Z"
                            }
                        />
                    </svg>
                </div>

                {/* Infinite scrolling text banner - changed from fixed to absolute */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-black bg-opacity-70 z-20 py-4">
                    <div className="marquee-container">
                        <div className="marquee-content">
                            <span className="text-xl md:text-2xl font-bold text-white">&nbsp;CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES •</span><span className="text-xl md:text-2xl font-bold text-white">&nbsp;CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES •</span><span className="text-xl md:text-2xl font-bold text-white">&nbsp;CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES •</span>
                        </div>
                        <div className="marquee-content">
                            <span className="text-xl md:text-2xl font-bold text-white">&nbsp;CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES •</span><span className="text-xl md:text-2xl font-bold text-white">&nbsp;CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES •</span><span className="text-xl md:text-2xl font-bold text-white">&nbsp;CREATIVE DEVELOPER • PORTFOLIO SHOWCASE • WEB DESIGN • INTERACTIVE EXPERIENCES •</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="min-h-screen flex items-center justify-center">
                <h2 className="text-3xl text-[#f3f4f6]">Explore my work and get in touch!</h2>
            </div>
        </main>
    );
}