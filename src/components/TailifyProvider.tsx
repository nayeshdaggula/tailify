import React, { createContext, useContext, useState, useEffect } from 'react';

interface TailifyContextProps {
  themeVariant: 'light' | 'dark' | 'default';
  setThemeVariant: (variant: 'light' | 'dark' | 'default') => void;
}

const TailifyContext = createContext<TailifyContextProps | undefined>(undefined);

export const TailifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeVariant, setThemeVariant] = useState<'light' | 'dark' | 'default'>('default');

  // Read from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('tailify-theme-variant') as 'light' | 'dark' | 'default';
      setThemeVariant(storedTheme || 'default');
    }
  }, []);

  // Apply theme variant
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tailify-theme-variant', themeVariant);
      
      document.documentElement.classList.remove('light', 'dark', 'default');
      document.documentElement.classList.add(themeVariant);
    }
  }, [themeVariant]);

  return (
    <TailifyContext.Provider value={{ themeVariant, setThemeVariant }}>
      {children}
    </TailifyContext.Provider>
  );
};

export const useTailify = () => {
  const context = useContext(TailifyContext);
  if (!context) {
    throw new Error('useTailify must be used within a TailifyProvider');
  }
  return context;
};