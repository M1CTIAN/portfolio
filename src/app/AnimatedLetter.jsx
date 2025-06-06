"use client";
import React, { useRef, useState, useEffect } from "react";

const AnimatedLetter = ({ char, mousePosition }) => {
    const letterRef = useRef(null);
    const [offset, setOffset] = useState({ x: 0, y: 0, rotation: 0 });
    const prevOffsetRef = useRef({ x: 0, y: 0, rotation: 0 });
    const velocityRef = useRef({ x: 0, y: 0, rotation: 0 });
    const lastUpdateRef = useRef(performance.now());
    const frameRef = useRef(null);
    const prevMouseRef = useRef({ x: -9999, y: -9999 });
    const rotationSeedRef = useRef(Math.random() * 10 - 5);

    // Animation configuration
    const config = {
        duration: 0,
        ease: [0.2, 0.8, 0.2, 1],
        dampingFactor: 0.15,
        rotationDampingFactor: 0.6,
        tension: 1,
        rotationTension: 0.5
    };

    useEffect(() => {
        // Get the marquee element
        const marquee = document.querySelector('.marquee-container');
        
        // Check if mouse is below marquee
        const isMouseBelowMarquee = marquee && mousePosition.y > marquee.getBoundingClientRect().top;
        
        // Reset position when cursor leaves screen OR is below marquee
        if (mousePosition.x === -9999 && mousePosition.y === -9999 || isMouseBelowMarquee) {
            if (letterRef.current) {
                letterRef.current.style.transition = `transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)`;
            }
            setOffset({ x: 0, y: 0, rotation: 0 });
            prevOffsetRef.current = { x: 0, y: 0, rotation: 0 };
            velocityRef.current = { x: 0, y: 0, rotation: 0 };
            return;
        }

        if (letterRef.current) {
            letterRef.current.style.transition = `transform ${config.duration}s cubic-bezier(${config.ease.join(',')})`;
        }

        const animateFrame = () => {
            // Check again within the animation frame in case marquee position changed
            const marquee = document.querySelector('.marquee-container');
            const isMouseBelowMarquee = marquee && mousePosition.y > marquee.getBoundingClientRect().top;
            
            if (isMouseBelowMarquee) {
                // Skip animation if mouse is below marquee
                frameRef.current = requestAnimationFrame(animateFrame);
                return;
            }
            

            if (!letterRef.current) return;

            const rect = letterRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = mousePosition.x - centerX;
            const dy = mousePosition.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Calculate mouse movement delta and direction
            const mouseDeltaX = mousePosition.x - prevMouseRef.current.x;
            const mouseDeltaY = mousePosition.y - prevMouseRef.current.y;
            const mouseMovement = Math.sqrt(mouseDeltaX * mouseDeltaX + mouseDeltaY * mouseDeltaY);

            // Update prev mouse position
            prevMouseRef.current = { x: mousePosition.x, y: mousePosition.y };

            const radius = 700;
            let targetX = 0, targetY = 0, targetRotation = 0;

            if (distance < radius) {
                // Position calculation remains the same
                const distanceEffect = Math.pow((radius - distance) / radius, 1.5);
                const force = distanceEffect * 200;
                targetX = -dx / (distance || 1) * force;
                targetY = -dy / (distance || 1) * force;

                // Only apply rotation when mouse is actually moving
                if (mouseMovement > 1) { // threshold to avoid micro-movements
                    // NEW: Calculate rotation based on mouse movement direction
                    // Extract direction from delta vector and convert to degrees
                    const movementAngle = Math.atan2(mouseDeltaY, mouseDeltaX) * (180 / Math.PI);

                    // Scale rotation based on movement speed (capped)
                    const movementFactor = Math.min(mouseMovement, 30) / 30;

                    // Apply rotation based on movement angle + random seed for variety
                    // The rotation will follow the mouse movement direction
                    targetRotation = movementAngle * 0.15 * rotationSeedRef.current * movementFactor;
                } else {
                    // When mouse stops, target rotation of zero
                    targetRotation = 0;
                }
            }

            const now = performance.now();
            const deltaTime = Math.min(now - lastUpdateRef.current, 30) / 1000;
            lastUpdateRef.current = now;

            const currX = prevOffsetRef.current.x;
            const currY = prevOffsetRef.current.y;
            const currRotation = prevOffsetRef.current.rotation;

            const springForceX = (targetX - currX) * config.tension;
            const springForceY = (targetY - currY) * config.tension;
            const springForceRotation = (targetRotation - currRotation) * config.rotationTension;

            velocityRef.current.x = velocityRef.current.x * (1 - config.dampingFactor) + springForceX * deltaTime;
            velocityRef.current.y = velocityRef.current.y * (1 - config.dampingFactor) + springForceY * deltaTime;
            velocityRef.current.rotation = velocityRef.current.rotation * (1 - config.rotationDampingFactor) + springForceRotation * deltaTime;

            const newX = currX + velocityRef.current.x;
            const newY = currY + velocityRef.current.y;
            const newRotation = currRotation + velocityRef.current.rotation;

            setOffset({ x: newX, y: newY, rotation: newRotation });
            prevOffsetRef.current = { x: newX, y: newY, rotation: newRotation };

            frameRef.current = requestAnimationFrame(animateFrame);
        };

        frameRef.current = requestAnimationFrame(animateFrame);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [mousePosition]);

    return (
        <span
            ref={letterRef}
            style={{
                display: "inline-block",
                transform: `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${offset.rotation}deg)`,
                willChange: 'transform'
            }}
        >
            {char}
        </span>
    );
};

export default AnimatedLetter;