import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from './ThemeContext';

/**
 * Floating theme switcher button.
 * Cycles through available brand themes on click.
 * Only visible when there are 2+ themes registered.
 */
const ThemeSwitcher: React.FC = () => {
    const { cycleBrandTheme, brandTheme, availableThemes } = useTheme();

    // Hide if only one theme available, or if not in debug mode
    const isDebug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug');
    if (availableThemes.length <= 1 || !isDebug) return null;

    return (
        <button
            onClick={cycleBrandTheme}
            className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-t-bg-elevated border border-t-border text-t-accent shadow-lg hover:scale-110 transition-transform"
            title={`Theme: ${brandTheme}`}
        >
            <Palette className="w-5 h-5" />
        </button>
    );
};

export default ThemeSwitcher;
