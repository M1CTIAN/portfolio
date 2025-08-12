"use client";
import React, { useState, useEffect } from "react";

export default function ProjectsPage() {
    const [isWriting, setIsWriting] = useState(false);

    useEffect(() => {
        // Start writing animation after a short delay
        const timer = setTimeout(() => {
            setIsWriting(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const projects = [
        {
            id: 1,
            title: "IIIT Bhopal Website",
            year: "2024",
            description: "Modern website for IIIT Bhopal with a focus on user experience currently under development and deployed in beta phase",
            image: "/p1.png",
            link: "https://iiitbhopal.site",
            technologies: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
            category: "Web Development"
        },
        {
            id: 2,
            title: "IEEE IIIT BHOPAL Website",
            year: "2023",
            description: "The official website for IEEE IIIT Bhopal Student Branch, showcasing events and resources",
            image: "/p2.png",
            link: "https://ieeeiiitbhopalsb.com/",
            technologies: ["React", "Node.js", "MongoDB", "Express"],
            category: "Web Development"
        },
        {
            id: 3,
            title: "Potato Doc",
            year: "2025",
            description: "AI powered disease(Blight) detection and management system for potato crops",
            image: "/p3.png",
            link: "#",
            technologies: ["Python", "TensorFlow", "Flask", "OpenCV"],
            category: "Machine Learning"
        },
        {
            id: 4,
            title: "Portfolio Website",
            year: "2025",
            description: "Personal portfolio website showcasing projects and skills with smooth animations",
            image: "/pic.jpg",
            link: "#",
            technologies: ["Next.js", "Framer Motion", "Tailwind CSS"],
            category: "Web Development"
        },
        {
            id: 5,
            title: "Creative Projects",
            year: "2024-2025",
            description: "Various creative and experimental projects",
            image: "/me.png",
            link: "#",
            technologies: ["Various"],
            category: "Creative"
        },
        {
            id: 6,
            title: "Currently Working",
            year: "2025",
            description: "Projects currently in development",
            image: "/pic.jpg",
            link: "#",
            technologies: ["TBD"],
            category: "In Progress"
        }
    ];

    return (
        <main className="bg-gray-100 min-h-screen">
    
            {/* Projects Tiles Grid */}
            <section className="relative py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, index) => (
                            <div
                                key={project.id}
                                className={`
                                    group relative overflow-hidden rounded-2xl bg-white
                                    shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-lg
                                    transition-all duration-500 hover:scale-105
                                    ${index === 0 || index === 3 ? 'md:col-span-1 lg:col-span-2' : ''}
                                    ${index === 2 ? 'md:row-span-2' : ''}
                                `}
                                style={{
                                    minHeight: index === 2 ? '500px' : index === 0 || index === 3 ? '300px' : '250px'
                                }}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover opacity-20 transition-all duration-700 group-hover:opacity-30 group-hover:scale-110"
                                    />
                                </div>

                                {/* Content Overlay */}
                                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                                    {/* Top Section */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                {project.category}
                                            </span>
                                            <span className="text-xs text-gray-500 font-medium">{project.year}</span>
                                        </div>

                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-gray-700 transition-colors duration-300">
                                            {project.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Bottom Section */}
                                    <div>
                                        {/* Technologies */}
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {project.technologies.slice(0, 3).map((tech, techIndex) => (
                                                <span
                                                    key={techIndex}
                                                    className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.technologies.length > 3 && (
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                                    +{project.technologies.length - 3}
                                                </span>
                                            )}
                                        </div>

                                        {/* View Project Button */}
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-gray-900 font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:text-gray-600"
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
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h3 className="text-xl font-medium mb-2">Arpit Raj</h3>
                            <p className="text-gray-400 text-sm">
                                Creative Developer & Designer
                            </p>
                        </div>

                        <div className="mt-6 md:mt-0">
                            <p className="text-gray-500 text-sm">
                                © 2025 Built with intention
                            </p>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
                
                .writing-text {
                    opacity: 1;
                    animation: fadeInWrite 0.5s ease-out forwards;
                }

                .draw-path {
                    animation: drawPath 3s ease-out forwards;
                }

                @keyframes fadeInWrite {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes drawPath {
                    from {
                        stroke-dashoffset: 2000;
                    }
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </main>
    );
}