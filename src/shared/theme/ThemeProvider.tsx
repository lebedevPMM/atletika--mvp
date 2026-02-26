import { createContext, type ReactNode } from 'react';
import { obsidianTokens } from './tokens/obsidian';
import { kineticTokens } from './tokens/kinetic';
import type { ThemeTokens } from './types';

const THEME_NAME = (process.env.EXPO_PUBLIC_THEME as 'obsidian' | 'kinetic') || 'obsidian';

export interface ThemeContextValue {
  name: 'obsidian' | 'kinetic';
  tokens: ThemeTokens;
  colors: ThemeTokens['colors'];
  typography: ThemeTokens['typography'];
  animations: ThemeTokens['animations'];
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const tokens = THEME_NAME === 'kinetic' ? kineticTokens : obsidianTokens;

  const value: ThemeContextValue = {
    name: THEME_NAME,
    tokens,
    colors: tokens.colors,
    typography: tokens.typography,
    animations: tokens.animations,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
