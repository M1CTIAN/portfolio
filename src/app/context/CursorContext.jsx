"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';

const CursorContext = createContext();

export const CursorProvider = ({ children }) => {
    const [cursorType, setCursorType] = useState('default');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            // Simple check for touch screen, a reliable indicator for mobile
            const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            setIsMobile(window.innerWidth < 768 || touch);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    return (
        <CursorContext.Provider value={{ cursorType, setCursorType, isLoaded, setIsLoaded, isMobile }}>
            {children}
        </CursorContext.Provider>
    );
};

export const useCursor = () => useContext(CursorContext);