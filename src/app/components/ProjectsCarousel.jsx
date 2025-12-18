"use client";
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

const ProjectCard = ({ project, className, isHovered }) => {
    const videoRef = useRef(null);

    React.useEffect(() => {
        if (isHovered) {
            videoRef.current?.play();
        } else {
            videoRef.current?.pause();
        }
    }, [isHovered]);

    return (
        <div className={`relative h-full w-full overflow-hidden bg-gray-900 ${className}`}>
            {/* Background Video */}
            <div className={`absolute inset-0 z-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
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
            </div>

            {/* Static Image Background */}
            <div className={`absolute inset-0 z-0 transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />

            {/* Content */}
            <a 
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8"
            >
                <div className="transform transition-transform duration-500 translate-y-0">
                    <div className="text-gray-300 font-mono text-xs md:text-sm mb-2 tracking-widest uppercase">
                        {project.year}
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
                        {project.title}
                    </h3>
                    <p className={`text-gray-300 text-sm md:text-base line-clamp-2 transition-all duration-500 ${isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'}`}>
                        {project.description}
                    </p>
                </div>

                <div className={`absolute top-6 right-6 transition-all duration-300 ${isHovered ? 'opacity-100 rotate-45' : 'opacity-0 rotate-0'}`}>
                    <div className="bg-white/10 backdrop-blur-md text-white rounded-full p-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </div>
                </div>
            </a>
        </div>
    );
};

export default function ProjectsCarousel({ onViewAllClick }) {
    const { setCursorType } = useCursor();
    const [hoveredCol, setHoveredCol] = useState(null);

    const projects = [
        {
            id: 1,
            title: "IIIT Bhopal",
            year: "2024",
            description: "Modern website for IIIT Bhopal with a focus on user experience currently under development.",
            image: "/p1.png",
            video: "/p1.mp4",
            video_webm: "/p1.webm",
            link: "https://iiitbhopal.site"
        },
        {
            id: 2,
            title: "IEEE SB",
            year: "2023",
            description: "The official website for IEEE IIIT Bhopal Student Branch, showcasing events and resources.",
            image: "/p2.png",
            video: "/p2.mp4",
            video_webm: "/p2.webm",
            link: "https://ieeeiiitbhopalsb.com/"
        },
        {
            id: 3,
            title: "Potato Doc",
            year: "2025",
            description: "AI powered disease detection and management system for potato crops.",
            image: "/p3.png",
            video: "/p3.mp4",
            video_webm: "/p3.webm",
            link: "https://potato-doc.vercel.app/"
        }
    ];

    const getFlexValue = (index) => {
        if (hoveredCol === null) {
            // Default state: Projects are equal, View All is smaller
            return index === 3 ? 0.5 : 1;
        }
        // Hover state: Hovered item expands significantly
        return hoveredCol === index ? 3 : 0.5;
    };

    return (
        <div className="bg-white py-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 flex items-end justify-between">
                    <div>
                        <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-4">
                            SELECTED WORK
                        </h2>
                        <div className="w-24 h-2 bg-gray-900"></div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2 h-[800px] md:h-[600px]">
                    {/* Project Columns */}
                    {projects.map((project, index) => (
                        <motion.div 
                            key={project.id}
                            className="relative overflow-hidden rounded-2xl"
                            initial={false}
                            animate={{ flex: getFlexValue(index) }}
                            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                            onMouseEnter={() => { setHoveredCol(index); setCursorType('hover'); }}
                            onMouseLeave={() => { setHoveredCol(null); setCursorType('default'); }}
                        >
                            <ProjectCard 
                                project={project} 
                                isHovered={hoveredCol === index}
                            />
                        </motion.div>
                    ))}

                    {/* View All Column */}
                    <motion.div 
                        className="relative overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 cursor-pointer group"
                        initial={false}
                        animate={{ flex: getFlexValue(3) }}
                        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                        onMouseEnter={() => { setHoveredCol(3); setCursorType('hover'); }}
                        onMouseLeave={() => { setHoveredCol(null); setCursorType('default'); }}
                        onClick={onViewAllClick}
                    >
                        <div className="absolute inset-0 bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300" />
                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                            <div className="flex flex-col items-center gap-4 transform md:-rotate-90 md:whitespace-nowrap">
                                <span className="text-lg font-bold text-gray-900 tracking-widest uppercase">
                                    View All Projects
                                </span>
                                <div className="w-12 h-px bg-gray-900"></div>
                            </div>
                            
                            <div className={`absolute bottom-8 transition-all duration-300 ${hoveredCol === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <div className="bg-gray-900 text-white rounded-full p-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}