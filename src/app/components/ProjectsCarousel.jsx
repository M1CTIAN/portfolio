"use client";
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext'; // Import the context hook

// Reusable Project Section Component
const ProjectSection = ({ project, index }) => {
    const { setCursorType } = useCursor();
    const videoRef = useRef(null);

    return (
        <motion.section 
            id={`work-${project.id}`}
            className="relative min-h-[40vh] cursor-none overflow-hidden"
            onViewportEnter={() => videoRef.current?.play()}
            onViewportLeave={() => videoRef.current?.pause()}
            viewport={{ amount: 0.3 }} // Play when 30% of the video is visible
        >
            {/* Background Video */}
            <div className="absolute inset-0 w-full h-full z-0">
                <video
                    ref={videoRef}
                    poster={project.image}
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src={project.video_webm} type="video/webm" />
                    <source src={project.video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/60 to-black/80"></div>
            </div>

            {/* Clickable Link Overlay */}
            <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group absolute inset-0 z-10 flex items-center justify-center py-20 px-6"
                onMouseEnter={() => setCursorType('hover')}
                onMouseLeave={() => setCursorType('default')}
                aria-label={`View project: ${project.title}`}
            >
                {/* Content */}
                <div className="relative max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}></div>
                        <motion.div 
                            className={`lg:col-span-7 ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="space-y-6 text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                                <div className="flex items-center space-x-4 text-sm text-gray-300">
                                    <span className="font-mono">
                                        {String(project.id).padStart(2, '0')}
                                    </span>
                                    <span>•</span>
                                    <span>{project.year}</span>
                                </div>
                                <h3 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                                    {project.title}
                                </h3>
                                <p className="text-gray-200 text-lg leading-relaxed max-w-lg">
                                    {project.description}
                                </p>
                                <div className="pt-4">
                                    {/* This is now a div styled to look like the original link */}
                                    <div
                                        className="inline-flex items-center font-medium group-hover:gap-3 gap-2 transition-all duration-300 text-white border border-white/50 group-hover:bg-white/10 px-4 py-2 rounded-full"
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
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </a>
        </motion.section>
    );
};

export default function ProjectsCarousel() {
    const projects = [
        {
            id: 1,
            title: "IIIT Bhopal Website",
            year: "2024",
            description: "Modern website for IIIT Bhopal with a focus on user experience currently under development and deployed in beta phase",
            image: "/p1.png",
            video: "/p1.mp4",
            video_webm: "/p1.webm",
            link: "https://iiitbhopal.site"
        },
        {
            id: 2,
            title: "IEEE IIIT BHOPAL Website",
            year: "2023",
            description: "The official website for IEEE IIIT Bhopal Student Branch, showcasing events and resources",
            image: "/p2.png",
            video: "/p2.mp4",
            video_webm: "/p2.webm",
            link: "https://ieeeiiitbhopalsb.com/"
        },
        {
            id: 3,
            title: "Potato Doc",
            year: "2025",
            description: "AI powered disease(Blight) detection and management system for potato crops, enhancing agricultural productivity",
            image: "/p3.png",
            video: "/p3.mp4",
            video_webm: "/p3.webm",
            link: "https://potato-doc.vercel.app/"
        }
    ];

    return (
        <div className="bg-white">
            {/* Main Header Section */}
            <div className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight">
                            My Work
                        </h2>
                    </div>
                    <div className="w-24 h-px bg-gray-300"></div>
                </div>
            </div>

            {/* Project Sections with Separators */}
            {projects.map((project, index) => (
                <React.Fragment key={project.id}>
                    <ProjectSection project={project} index={index} />
                    {index < projects.length - 1 && (
                        <div className="relative bg-white h-10">
                        </div>
                    )}
                </React.Fragment>
            ))}

            {/* More Projects Coming Soon */}
            <div className="py-32 text-center bg-white">
                <div className="inline-flex items-center space-x-4 text-gray-500">
                    <div className="w-24 h-px bg-gray-300"></div>
                    <span className="text-sm font-medium tracking-wider uppercase">More projects coming soon</span>
                    <div className="w-24 h-px bg-gray-300"></div>
                </div>
            </div>
        </div>
    );
}