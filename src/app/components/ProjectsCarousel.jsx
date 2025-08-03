"use client";
import React from 'react';
import { useCursor } from '../context/CursorContext'; // Import the context hook

export default function ProjectsCarousel() {
    const { setCursorType } = useCursor(); // Get the setter function from context

    const projects = [
        {
            id: 1,
            title: "IIIT Bhopal Website",
            year: "2024",
            description: "Modern website for IIIT Bhopal with a focus on user experience currently under development and deployed in beta phase",
            image: "/p1.png",
            link: "https://iiitbhopal.site"
        },
        {
            id: 2,
            title: "IEEE IIIT BHOPAL Website",
            year: "2023",
            description: "The official website for IEEE IIIT Bhopal Student Branch, showcasing events and resources",
            image: "/p2.png",
            link: "https://ieeeiiitbhopalsb.com/"
        },
        {
            id: 3,
            title: "Potato Doc",
            year: "2025",
            description: "AI powered disease(Blight) detection and management system for potato crops, enhancing agricultural productivity",
            image: "/p3.png",
            link: "https://potato-doc.vercel.app/"
        }
    ];

    return (
        <section 
            id="work" 
            className="min-h-screen bg-white py-20 px-6 cursor-none" // Add cursor-none here
        >
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="mb-20">
                    <div className="flex items-baseline justify-between mb-8">
                        <h2 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight">
                            Projects
                        </h2>
                        <div className="text-gray-500 text-sm">
                            Selected work 2023-2025
                        </div>
                    </div>
                    <div className="w-24 h-px bg-gray-300"></div>
                </div>

                {/* Projects Grid */}
                <div className="space-y-24">
                    {projects.map((project, index) => (
                        <div 
                            key={project.id}
                            className="group" // cursor-none is inherited from the parent section
                            onMouseEnter={() => setCursorType('hover')}
                            onMouseLeave={() => setCursorType('default')}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                {/* Project Image */}
                                <div className={`lg:col-span-7 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                                    <a 
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block cursor-none" // Add cursor-none here
                                    >
                                        <div className="relative overflow-hidden bg-gray-100 aspect-[4/3] rounded-sm">
                                            <img 
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                                            />
                                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                                        </div>
                                    </a>
                                </div>

                                {/* Project Info */}
                                <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span className="font-mono">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span>•</span>
                                            <span>{project.year}</span>
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight group-hover:text-gray-600 transition-colors duration-300">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            {project.description}
                                        </p>
                                        <div className="pt-4">
                                            <a 
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-gray-900 font-medium group-hover:gap-3 gap-2 transition-all duration-300 hover:text-gray-600 cursor-none" // Add cursor-none here
                                            >
                                                <span>View Project</span>
                                                <svg 
                                                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-32 text-center">
                    <div className="inline-flex items-center space-x-4 text-gray-500">
                        <div className="w-12 h-px bg-gray-300"></div>
                        <span className="text-sm">More projects coming soon</span>
                        <div className="w-12 h-px bg-gray-300"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}