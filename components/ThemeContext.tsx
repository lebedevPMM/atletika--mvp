import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getThemeConfig, getAvailableThemes, type ThemeConfig } from './themes/registry';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    brandTheme: string;
    themeConfig: ThemeConfig;
    toggleTheme: () => void;
    cycleBrandTheme: () => void;
    setBrandTheme: (id: string) => void;
    isDarkMode: boolean;
    availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Read ?theme= from URL, if valid */
function getThemeFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('theme');
    if (t && getAvailableThemes().includes(t)) return t;
    return null;
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('atletika-theme');
        return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    });

    const [brandTheme, setBrandThemeState] = useState<string>(() => {
        // Priority: URL param > localStorage > 'default'
        return getThemeFromUrl()
            ?? localStorage.getItem('atletika-brand-theme')
            ?? 'default';
    });

    const themeConfig = getThemeConfig(brandTheme);
    const availableThemes = getAvailableThemes();

    // Apply dark/light mode
    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('atletika-theme', theme);
    }, [theme]);

    // Apply brand theme CSS class
    useEffect(() => {
        // Remove all brand-* classes
        const classes = document.documentElement.classList;
        Array.from(classes).forEach((c) => {
            if (c.startsWith('brand-')) classes.remove(c);
        });
        classes.add(`brand-${brandTheme}`);
        localStorage.setItem('atletika-brand-theme', brandTheme);

        // Load custom fonts if theme requires them
        if (themeConfig.fontsUrl) {
            const existingLink = document.querySelector(`link[data-theme-fonts="${brandTheme}"]`);
            if (!existingLink) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = themeConfig.fontsUrl;
                link.dataset.themeFonts = brandTheme;
                document.head.appendChild(link);
            }
        }
    }, [brandTheme, themeConfig]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    const setBrandTheme = useCallback((id: string) => {
        if (getAvailableThemes().includes(id)) {
            setBrandThemeState(id);
        }
    }, []);

    const cycleBrandTheme = useCallback(() => {
        const themes = getAvailableThemes();
        if (themes.length <= 1) return;
        const currentIndex = themes.indexOf(brandTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setBrandThemeState(themes[nextIndex]);
    }, [brandTheme]);

    return (
        <ThemeContext.Provider value={{
            theme,
            brandTheme,
            themeConfig,
            toggleTheme,
            cycleBrandTheme,
            setBrandTheme,
            isDarkMode: theme === 'dark',
            availableThemes,
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
