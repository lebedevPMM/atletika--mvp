import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';
type BrandTheme = 'default';

interface ThemeContextType {
    theme: Theme;
    brandTheme: BrandTheme;
    toggleTheme: () => void;
    isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // Load from localStorage or default
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('atletika-theme');
        return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    });

    const brandTheme: BrandTheme = 'default';

    useEffect(() => {
        // Apply theme class to HTML
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('atletika-theme', theme);
    }, [theme]);

    useEffect(() => {
        // Apply brand theme class to HTML
        document.documentElement.classList.add(`brand-${brandTheme}`);
    }, [brandTheme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            brandTheme,
            toggleTheme,
            isDarkMode: theme === 'dark',
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
