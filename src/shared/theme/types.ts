import type { ViewStyle, TextStyle } from 'react-native';

// === Color types ===

export interface ColorSet {
  main: string;
  surface: string;
}

export type ActivityType = 'group' | 'personal' | 'spa' | 'pool' | 'kids';

export interface ThemeColors {
  bg: {
    primary: string;
    elevated: string;
    surface: string;
    sunken: string;
    scrim: string;
    hover: string;
    pressed: string;
    selected: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
    accent: string;
  };
  accent: {
    primary: string;
    secondary: string;
    tertiary?: string;
    glow?: string;
    surface: string;
    border: string;
  };
  semantic: {
    success: ColorSet;
    warning: ColorSet;
    error: ColorSet;
    info: ColorSet;
  };
  border: {
    default: string;
    strong: string;
    focus: string;
    error: string;
  };
  activity: Record<ActivityType, string>;
}

// === Typography ===

export interface TypographyStyle {
  fontFamily: string;
  fontWeight: TextStyle['fontWeight'];
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface ThemeTypography {
  display: TypographyStyle;
  h1: TypographyStyle;
  h2: TypographyStyle;
  h3: TypographyStyle;
  h4: TypographyStyle;
  bodyLg: TypographyStyle;
  body: TypographyStyle;
  bodySm: TypographyStyle;
  caption: TypographyStyle;
  overline: TypographyStyle;
  dataLg: TypographyStyle;
  data: TypographyStyle;
  dataSm: TypographyStyle;
}

// === Spacing (shared) ===

export const SPACING = {
  0: 0,
  px: 1,
  '0.5': 2,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

// === Layout (shared) ===

export const LAYOUT = {
  screen: { padding: 16 },
  card: { padding: 16, minHeight: 64 },
  tabBar: { height: 56 },
  header: { height: 44 },
  bottomSheet: { maxHeightPercent: 0.85 },
  button: { height: 52, smHeight: 40 },
  input: { height: 52 },
  avatar: { sm: 32, md: 48, lg: 72 },
  qr: { size: 280 },
  slotCard: { height: 80, colorStripe: 4 },
  icon: { xs: 16, sm: 20, md: 24, lg: 32, xl: 48 },
} as const;

// === Radius ===

export interface ThemeRadius {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  full: number;
}

// === Elevation ===

export type ThemeElevation = Record<0 | 1 | 2 | 3, ViewStyle>;

// === Animations ===

export interface SpringConfig {
  damping: number;
  stiffness: number;
  mass?: number;
}

export interface TimingConfig {
  duration: number;
}

export interface ThemeAnimations {
  springs: {
    default: SpringConfig;
    gentle: SpringConfig;
    snappy: SpringConfig;
    bouncy: SpringConfig;
    morphing?: SpringConfig;
  };
  timing: {
    fast: TimingConfig;
    normal: TimingConfig;
    slow: TimingConfig;
    mesh?: TimingConfig;
  };
  card: {
    pressScale: number;
  };
  stagger?: {
    delay: number;
  };
}

// === Combined Theme ===

export interface ThemeTokens {
  name: 'obsidian' | 'kinetic';
  colors: ThemeColors;
  typography: ThemeTypography;
  radius: ThemeRadius;
  elevation: ThemeElevation;
  animations: ThemeAnimations;
}
