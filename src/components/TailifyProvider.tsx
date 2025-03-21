"use client"; // 👈 Marking this as a client component

import React, { createContext, useContext, useState, useEffect } from 'react';

interface TailifyContextProps {
  themeVariant: 'light' | 'dark' | 'default';
  setThemeVariant: (variant: 'light' | 'dark' | 'default') => void;
}

const TailifyContext = createContext<TailifyContextProps | undefined>(undefined);

export const TailifyProvider: React.FC<{ children: React.ReactNode; themeVariant?: 'light' | 'dark' | 'default' }> = ({
  children,
  themeVariant: propThemeVariant = 'default',
}) => {
  const [themeVariant, setThemeVariant] = useState<'light' | 'dark' | 'default'>(propThemeVariant);

  // On mount, check localStorage if no prop value is explicitly set
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('tailify-theme-variant') as 'light' | 'dark' | 'default' | null;
      if (!propThemeVariant && storedTheme) {
        setThemeVariant(storedTheme);
      }
    }
  }, [propThemeVariant]);

  // Apply and persist theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tailify-theme-variant', themeVariant);

      // Remove existing classes
      document.documentElement.classList.remove('light', 'dark', 'default');
      document.documentElement.classList.add(themeVariant);

      // Set `data-tailify-theme-variant` attribute for Tailwind support
      document.documentElement.setAttribute('data-tailify-theme-variant', themeVariant);
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