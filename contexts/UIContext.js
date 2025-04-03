import React, { createContext, useState, useContext, useRef } from 'react';
import { Animated } from 'react-native';

// Create the context
const UIContext = createContext();

// Custom hook to use the UI context
export const useUIContext = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return context;
};

// Provider component
export const UIProvider = ({ children }) => {
  // UI state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // UI operations
  const toggleMenu = () => {
    const toValue = isMenuOpen ? 0 : 1;
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };

  // Context value
  const value = {
    // State
    isMenuOpen,
    slideAnim,
    
    // Operations
    toggleMenu,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export default UIContext; 