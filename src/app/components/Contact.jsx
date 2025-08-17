"use client";
import React from 'react';

const Contact = ({ copyEmailToClipboard, showEmailCopied }) => {
    return (
        <>
            <section id="contact" className="relative bg-gray-100 py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        {/* Left - Philosophy */}
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                                City-Born, Self-Shaped
                            </h2>

                            <div className="space-y-6 text-gray-700 leading-relaxed">
                                <p>
                                    Shaped by a childhood spent moving between cities, with New Delhi as my anchor, I&apos;ve
                                    learned to value perspective, adaptability, and purpose. This background informs my belief
                                    that technology shouldn&apos;t just strive for scale or novelty, but for integrity and intention.
                                </p>

                                <p>
                                    I am devoted to continually learning and maintaining
                                    mindfulness as a craftsman.
                                </p>
                            </div>
                        </div>

                        {/* Right - Image with decorative element below */}
                        <div>
                            <img
                                src="/fill.png"
                                alt="Abstract texture"
                                width={500}
                                height={200} // Adjusted to match max-h-36
                                className="w-full h-auto max-h-36 object-cover rounded-lg"
                            />


                            {/* Decorative sketch element below image */}
                            <div className="mt-8 opacity-30">
                                <svg width="200" height="60" viewBox="0 0 200 60" className="text-gray-400">
                                    <path
                                        d="M10,40 Q50,10 90,40 T170,40"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M15,45 Q45,20 80,45 T160,45"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        fill="none"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Divider Line */}
                    <div className="w-full h-px bg-gray-300 my-16"></div>

                    {/* Large Typography Section */}
                    <div className="text-center mb-16">
                        <h3 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 leading-none tracking-tight">
                            Build the world with{' '}
                            <span className="italic font-sans text-gray-600">intention</span>
                        </h3>
                    </div>

                    {/* Contact Links */}
                    <div className="flex flex-wrap justify-center gap-8 text-lg">
                        <button
                            onClick={copyEmailToClipboard}
                            className="text-gray-600 hover:text-gray-900 transition-colors duration-300 border-b border-gray-300 hover:border-gray-900 pb-1 cursor-pointer"
                        >
                            Email
                        </button>
                        <a
                            href="https://www.linkedin.com/in/arpit---raj/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 transition-colors duration-300 border-b border-gray-300 hover:border-gray-900 pb-1"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="https://github.com/M1CTIAN"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 transition-colors duration-300 border-b border-gray-300 hover:border-gray-900 pb-1"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </section>

            {/* Email Copied Toast - Bottom Right */}
            {showEmailCopied && (
                <div className="fixed bottom-6 right-6 z-[100] pointer-events-none">
                    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 p-4 pointer-events-auto animate-slideInRight">
                        <div className="flex items-center space-x-3">
                            {/* Check icon */}
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-900 font-medium text-sm">Email copied!</p>
                                <p className="text-gray-600 text-xs">raj.arpit140@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Contact;