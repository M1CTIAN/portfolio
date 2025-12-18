"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useCursor } from '../context/CursorContext';

const CATEGORIES = ["ALL", "WEB", "ML", "PRs", "OTHER"];

const categorizeProject = (repo) => {
    const topics = repo.topics || [];
    const lang = (repo.language || "").toLowerCase();
    const desc = (repo.description || "").toLowerCase();
    const name = (repo.name || "").toLowerCase();

    // Check topics and language
    if (topics.includes("machine-learning") || topics.includes("ai") || topics.includes("deep-learning") || lang === "python" || lang === "jupyter notebook") return "ML";
    if (topics.includes("react") || topics.includes("nextjs") || topics.includes("vue") || topics.includes("web") || topics.includes("ejs") || lang === "javascript" || lang === "typescript" || lang === "html" || lang === "css" || lang === "ejs") return "WEB";
    
    return "OTHER";
};

const ProjectRow = ({ project, setCursorType }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [readmeContent, setReadmeContent] = useState(null);
    const [loadingReadme, setLoadingReadme] = useState(false);

    useEffect(() => {
        if (isOpen && !readmeContent && !loadingReadme) {
            const fetchReadme = async () => {
                setLoadingReadme(true);
                try {
                    const response = await fetch(`https://api.github.com/repos/${project.full_name}/readme`, {
                        headers: { 'Accept': 'application/vnd.github.raw' }
                    });
                    if (response.ok) {
                        const text = await response.text();
                        setReadmeContent(text);
                    } else {
                        setReadmeContent("NO_README");
                    }
                } catch (error) {
                    console.error("Error fetching README:", error);
                    setReadmeContent("NO_README");
                } finally {
                    setLoadingReadme(false);
                }
            };
            fetchReadme();
        }
    }, [isOpen, project.full_name, readmeContent, loadingReadme]);

    return (
        <div className="border-b border-gray-200">
            <div 
                className="group flex flex-col md:flex-row items-start md:items-center justify-between py-4 transition-all duration-300 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setCursorType('hover')}
                onMouseLeave={() => setCursorType('default')}
            >
                <div className="flex-1 min-w-0 pr-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 transition-colors truncate">
                        {project.name}
                    </h3>
                    {project.description !== "No description available" && !isOpen && (
                        <p className="text-gray-500 text-sm line-clamp-1">
                            {project.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-8 mt-4 md:mt-0 shrink-0">
                    <div className="text-right hidden md:block">
                        <div className="text-xs font-mono text-gray-500 uppercase mb-1 bg-gray-100 px-2 py-1 rounded inline-block">
                            {project.language || "—"}
                        </div>
                        <div className="text-xs font-mono text-gray-400 mt-1">
                            {project.category} · {project.year}
                        </div>
                    </div>
                    
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
                        <svg 
                            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6">
                            <div className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-4">
                                {loadingReadme ? (
                                    "Loading content..."
                                ) : readmeContent && readmeContent !== "NO_README" ? (
                                    <div className="prose prose-sm max-w-none prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-lg prose-headings:font-bold prose-headings:text-gray-900 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm]} 
                                            rehypePlugins={[rehypeRaw]}
                                            components={{
                                                a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                                                img: ({node, ...props}) => {
                                                    let src = props.src;
                                                    if (src && !src.startsWith('http')) {
                                                        src = `https://raw.githubusercontent.com/${project.full_name}/HEAD/${src.replace(/^\.\//, '')}`;
                                                    }
                                                    return <img {...props} src={src} className="max-w-full h-auto rounded-lg" />;
                                                }
                                            }}
                                        >
                                            {readmeContent}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    project.description !== "No description available" ? project.description : "No description available"
                                )}
                            </div>
                            <a 
                                href={project.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm font-medium text-gray-900 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                                onMouseEnter={() => setCursorType('hover')}
                                onMouseLeave={() => setCursorType('default')}
                            >
                                View Project 
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function ProjectsPage({ onClose }) {
    const { setCursorType } = useCursor();
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const [reposResponse, prsResponse] = await Promise.all([
                    fetch('https://api.github.com/users/M1CTIAN/repos?sort=updated&per_page=100'),
                    fetch(`https://api.github.com/search/issues?q=${encodeURIComponent('type:pr author:M1CTIAN is:merged')}&per_page=100`)
                ]);
                
                const reposData = await reposResponse.json();
                const prsData = await prsResponse.json();
                
                const prRepoMap = new Map();
                (prsData.items || []).forEach(item => {
                    const full_name = item.repository_url.replace('https://api.github.com/repos/', '');
                    const name = full_name.split('/')[1].toLowerCase();
                    prRepoMap.set(name, full_name);
                });

                const projectPromises = reposData
                    .filter(repo => repo.name !== "M1CTIAN")
                    .filter(repo => !repo.fork || prRepoMap.has(repo.name.toLowerCase()))
                    .map(async (repo) => {
                        let category = categorizeProject(repo);
                        let projectFullName = repo.full_name;
                        let description = repo.description;

                        if (repo.fork && prRepoMap.has(repo.name.toLowerCase())) {
                            category = "PRs";
                            projectFullName = prRepoMap.get(repo.name.toLowerCase());
                            try {
                                const res = await fetch(`https://api.github.com/repos/${projectFullName}`);
                                if (res.ok) {
                                    const data = await res.json();
                                    description = data.description;
                                }
                            } catch (e) {
                                console.error("Error fetching upstream description:", e);
                            }
                        }
                        
                        return {
                            id: repo.id,
                            name: repo.name,
                            full_name: projectFullName,
                            description: description || "No description available",
                            year: new Date(repo.created_at).getFullYear(),
                            link: `https://github.com/${projectFullName}`,
                            language: repo.language,
                            category: category,
                            topics: repo.topics
                        };
                    });

                const formattedProjects = await Promise.all(projectPromises);

                setProjects(formattedProjects);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = filter === "ALL" 
        ? projects
        : projects.filter(p => p.category === filter);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-gray-200">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-gray-50/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            onMouseEnter={() => setCursorType('hover')}
                            onMouseLeave={() => setCursorType('default')}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-mono font-bold tracking-tight">
                            <span className="text-gray-400">{projects.length} — </span>
                            ALL PROJECTS
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                onMouseEnter={() => setCursorType('hover')}
                                onMouseLeave={() => setCursorType('default')}
                                className={`px-3 py-1 text-xs font-mono border transition-all duration-300 rounded-full ${
                                    filter === cat 
                                        ? "bg-gray-900 text-white border-gray-900" 
                                        : "bg-transparent text-gray-500 border-gray-300 hover:border-gray-900 hover:text-gray-900"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects List */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ProjectRow project={project} setCursorType={setCursorType} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
