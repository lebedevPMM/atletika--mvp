/**
 * Theme Registry — central config for all available themes.
 *
 * Each ThemeConfig tells the system:
 * - which CSS file provides the --t-* tokens (loaded via tokens.css)
 * - which nav variant to render
 * - which home screen variant to render
 * - display metadata (label, description)
 *
 * To add a new theme:
 * 1. Create themes/<name>.css with --t-* overrides under html.brand-<name>
 * 2. Import it in tokens.css
 * 3. Add a ThemeConfig entry here
 */

export interface ThemeConfig {
  /** Unique key — matches CSS selector html.brand-<id> */
  id: string;
  /** Human-readable label for the theme switcher */
  label: string;
  /** Short description */
  description: string;
  /** Which nav component variant to use */
  navVariant: 'dock' | 'brutalist';
  /** Optional Google Fonts URL to load */
  fontsUrl?: string;
}

export const themeRegistry: ThemeConfig[] = [
  {
    id: 'default',
    label: 'Default',
    description: 'Dark glassmorphism with cyan accents',
    navVariant: 'dock',
  },
  {
    id: 'yaptrack',
    label: 'YapTrack',
    description: 'Editorial brutalist — coral ink on black',
    navVariant: 'brutalist',
  },
  {
    id: 'yaptrack-acid',
    label: 'YapTrack Acid',
    description: 'Acid green brutalist — technical zine aesthetic',
    navVariant: 'brutalist',
  },
  {
    id: 'charming',
    label: 'Charming',
    description: 'Warm pink fitness — cream cards, Nunito, extra-round',
    navVariant: 'dock',
    fontsUrl: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap',
  },
];

/** Get theme config by id, fallback to default */
export function getThemeConfig(id: string): ThemeConfig {
  return themeRegistry.find((t) => t.id === id) ?? themeRegistry[0];
}

/** Get all available theme ids */
export function getAvailableThemes(): string[] {
  return themeRegistry.map((t) => t.id);
}
