import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';
type BrandTheme = 'default' | 'ember';

interface ThemeContextType {
    theme: Theme;
    brandTheme: BrandTheme;
    toggleTheme: () => void;
    toggleBrandTheme: () => void;
    setBrandTheme: (theme: BrandTheme) => void;
    isDarkMode: boolean;
    isEmber: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('atletika-theme');
        return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    });

    const [brandTheme, setBrandThemeState] = useState<BrandTheme>(() => {
        const saved = localStorage.getItem('atletika-brand-theme');
        return saved === 'ember' ? 'ember' : 'default';
    });

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('atletika-theme', theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.classList.remove('brand-default', 'brand-ember');
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
        setBrandThemeState((prev) => prev === 'default' ? 'ember' : 'default');
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            brandTheme,
            toggleTheme,
            toggleBrandTheme,
            setBrandTheme,
            isDarkMode: theme === 'dark',
            isEmber: brandTheme === 'ember'
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
