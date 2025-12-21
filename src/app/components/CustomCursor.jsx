"use client";
import React, { useEffect, useRef } from 'react';
import { useCursor } from '../context/CursorContext';

const CustomCursor = () => {
  const { cursorType } = useCursor();
  
  // Use refs for direct DOM manipulation to avoid re-renders and for performance.
  const dotRef = useRef(null);
  const outlineRef = useRef(null);

  // Ref to store the latest mouse position.
  const mousePositionRef = useRef({ x: -100, y: -100 });
  
  // Ref to store the smoothed position of the outline.
  const outlinePositionRef = useRef({ x: -100, y: -100 });

  // This effect sets up the mouse move listener.
  useEffect(() => {
    // Optional: Don't attach listeners on small screens to save performance
    if (window.innerWidth < 768) return;

    const handleMouseMove = (e) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // This effect runs the animation loop for both cursor elements.
  useEffect(() => {
    // Optional: Don't run animation loop on small screens
    if (window.innerWidth < 768) return;

    let animationFrameId;
    
    const animateCursor = () => {
      // Get the latest mouse position.
      const { x: targetX, y: targetY } = mousePositionRef.current;
      
      // Get the current outline position.
      const { x: currentX, y: currentY } = outlinePositionRef.current;

      // Update the dot's position directly for immediate response.
      if (dotRef.current) {
        dotRef.current.style.left = `${targetX}px`;
        dotRef.current.style.top = `${targetY}px`;
      }
      
      // Calculate the new smoothed position for the outline.
      const newOutlineX = currentX + (targetX - currentX) * 0.15;
      const newOutlineY = currentY + (targetY - currentY) * 0.15;
      
      // Update the outline's position directly.
      if (outlineRef.current) {
        outlineRef.current.style.left = `${newOutlineX}px`;
        outlineRef.current.style.top = `${newOutlineY}px`;
      }
      
      // Store the new smoothed position for the next frame.
      outlinePositionRef.current = { x: newOutlineX, y: newOutlineY };
      
      // Continue the loop.
      animationFrameId = requestAnimationFrame(animateCursor);
    };
    
    animationFrameId = requestAnimationFrame(animateCursor);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const isHovering = cursorType === 'hover';

  return (
    <>
      {/* ADDED 'hidden md:block' here to hide on mobile */}
      <div className="hidden md:block">
          {/* Dot - This follows the cursor precisely */}
          <div
            ref={dotRef}
            className="pointer-events-none fixed z-[999] h-2 w-2 rounded-full bg-gray-900 transition-transform duration-300"
            style={{
              transform: `translate(-50%, -50%) scale(${isHovering ? 0 : 1})`,
            }}
          />
          {/* Outline - This "chases" the cursor */}
          <div
            ref={outlineRef}
            className="pointer-events-none fixed z-[999] flex items-center justify-center rounded-full border border-black transition-all duration-500 ease-out"
            style={{
              width: isHovering ? '80px' : '40px',
              height: isHovering ? '80px' : '40px',
              transform: 'translate(-50%, -50%)',
              backgroundColor: isHovering ? 'black' : 'transparent',
            }}
          >
            <span
              className="text-white text-sm font-medium transition-opacity duration-300"
              style={{ opacity: isHovering ? 1 : 0 }}
            >
              View
            </span>
          </div>
      </div>
    </>
  );
};

export default CustomCursor;