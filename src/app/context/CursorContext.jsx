"use client";
import React, { createContext, useState, useContext } from 'react';

const CursorContext = createContext();

export const CursorProvider = ({ children }) => {
  const [cursorType, setCursorType] = useState('default');
  const [isLoaded, setIsLoaded] = useState(false); // Add this line

  return (
    // Add isLoaded and setIsLoaded to the context's value
    <CursorContext.Provider value={{ cursorType, setCursorType, isLoaded, setIsLoaded }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);