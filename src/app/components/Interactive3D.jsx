"use client";
import { useEffect, useRef, useState } from 'react';

export default function Interactive3D() {
  const containerRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    let animationId;
    
    const handleMouseMove = (e) => {
      if (containerRef.current && !animationId) {
        animationId = requestAnimationFrame(() => {
          const rect = containerRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setMousePos({ x, y });
          animationId = null;
        });
      }
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        if (animationId) cancelAnimationFrame(animationId);
      };
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      
      {/* Simplified Background Text */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute text-8xl font-black text-gray-200/8 select-none"
          style={{
            top: '25%',
            left: '15%',
            transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`,
            transition: 'transform 0.8s ease-out'
          }}
        >
          DESIGN
        </div>
        
        <div 
          className="absolute text-7xl font-black text-gray-200/8 select-none"
          style={{
            bottom: '25%',
            right: '15%',
            transform: `translate(${mousePos.x * -0.02}px, ${mousePos.y * -0.02}px)`,
            transition: 'transform 0.8s ease-out'
          }}
        >
          CREATE
        </div>
      </div>

      {/* Simple Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-400/40 rounded-full"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + (i % 2) * 40}%`,
              transform: `translate(${mousePos.x * (0.03 + i * 0.01)}px, ${mousePos.y * (0.02 + i * 0.01)}px)`,
              transition: 'transform 0.6s ease-out'
            }}
          />
        ))}
      </div>

      {/* Subtle Grid */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px),
            linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * 0.01}px)`,
          transition: 'transform 1s ease-out'
        }}
      />

      {/* Simple Ripple Effect */}
      {isHovering && (
        <div 
          className="absolute pointer-events-none transition-all duration-300"
          style={{
            left: mousePos.x - 60,
            top: mousePos.y - 60,
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(55, 65, 81, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      )}
    </div>
  );
}
