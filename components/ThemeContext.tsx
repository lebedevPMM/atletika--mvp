import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';
type BrandTheme = 'default' | 'neon' | 'pastel';

interface ThemeContextType {
    theme: Theme;
    brandTheme: BrandTheme;
    toggleTheme: () => void;
    toggleBrandTheme: () => void;
    setBrandTheme: (theme: BrandTheme) => void;
    isDarkMode: boolean;
    isNeon: boolean;
    isPastel: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // Load from localStorage or default
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('atletika-theme');
        return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    });

    const [brandTheme, setBrandThemeState] = useState<BrandTheme>(() => {
        const saved = localStorage.getItem('atletika-brand-theme');
        return (saved === 'neon' || saved === 'pastel') ? saved as BrandTheme : 'default';
    });

    useEffect(() => {
        // Apply theme class to HTML
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('atletika-theme', theme);
    }, [theme]);

    useEffect(() => {
        // Apply brand theme class to HTML
        document.documentElement.classList.remove('brand-default', 'brand-neon', 'brand-pastel');
        document.documentElement.classList.add(`brand-${brandTheme}`);
        localStorage.setItem('atletika-brand-theme', brandTheme);
    }, [brandTheme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const setBrandTheme = (theme: BrandTheme) => {
        setBrandThemeState(theme);
    };

    const toggleBrandTheme = () => {
        setBrandThemeState((prev) => {
            if (prev === 'default') return 'neon';
            if (prev === 'neon') return 'pastel';
            return 'default';
        });
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            brandTheme,
            toggleTheme,
            toggleBrandTheme,
            setBrandTheme,
            isDarkMode: theme === 'dark',
            isNeon: brandTheme === 'neon',
            isPastel: brandTheme === 'pastel'
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
