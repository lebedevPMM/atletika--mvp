import type { ThemeTokens } from '../types';

const FONT = {
  display: 'SpaceGrotesk-Bold',
  heading: 'SpaceGrotesk-SemiBold',
  body: 'Inter-Regular',
  bodyMedium: 'Inter-Medium',
  bodySemiBold: 'Inter-SemiBold',
  data: 'JetBrainsMono-Medium',
  dataRegular: 'JetBrainsMono-Regular',
};

export const obsidianTokens: ThemeTokens = {
  name: 'obsidian',

  colors: {
    bg: {
      primary: '#0A0A0A',
      elevated: '#1A1A1A',
      surface: '#242424',
      sunken: '#050505',
      scrim: 'rgba(0,0,0,0.6)',
      hover: 'rgba(255,255,255,0.04)',
      pressed: 'rgba(255,255,255,0.08)',
      selected: 'rgba(0,255,135,0.08)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#8A8A8A',
      tertiary: '#5C5C5C',
      disabled: '#3D3D3D',
      inverse: '#0A0A0A',
      accent: '#00FF87',
    },
    accent: {
      primary: '#00FF87',
      secondary: '#00D4FF',
      glow: 'rgba(0,255,135,0.25)',
      surface: 'rgba(0,255,135,0.08)',
      border: 'rgba(0,255,135,0.20)',
    },
    semantic: {
      success: { main: '#00FF87', surface: 'rgba(0,255,135,0.10)' },
      warning: { main: '#FFB800', surface: 'rgba(255,184,0,0.10)' },
      error: { main: '#FF3B3B', surface: 'rgba(255,59,59,0.10)' },
      info: { main: '#00D4FF', surface: 'rgba(0,212,255,0.10)' },
    },
    border: {
      default: 'rgba(255,255,255,0.06)',
      strong: 'rgba(255,255,255,0.12)',
      focus: '#00FF87',
      error: '#FF3B3B',
    },
    activity: {
      group: '#00FF87',
      personal: '#00D4FF',
      spa: '#A78BFA',
      pool: '#38BDF8',
      kids: '#FBBF24',
    },
  },

  typography: {
    display:  { fontFamily: FONT.display,    fontWeight: '700', fontSize: 40, lineHeight: 44, letterSpacing: -0.8 },
    h1:      { fontFamily: FONT.display,    fontWeight: '700', fontSize: 32, lineHeight: 37, letterSpacing: -0.48 },
    h2:      { fontFamily: FONT.heading,    fontWeight: '600', fontSize: 24, lineHeight: 29, letterSpacing: -0.24 },
    h3:      { fontFamily: FONT.heading,    fontWeight: '600', fontSize: 20, lineHeight: 25, letterSpacing: -0.1 },
    h4:      { fontFamily: FONT.heading,    fontWeight: '600', fontSize: 18, lineHeight: 23, letterSpacing: 0 },
    bodyLg:  { fontFamily: FONT.bodyMedium, fontWeight: '500', fontSize: 18, lineHeight: 27, letterSpacing: 0 },
    body:    { fontFamily: FONT.body,       fontWeight: '400', fontSize: 16, lineHeight: 24, letterSpacing: 0 },
    bodySm:  { fontFamily: FONT.body,       fontWeight: '400', fontSize: 14, lineHeight: 20, letterSpacing: 0.14 },
    caption: { fontFamily: FONT.body,       fontWeight: '400', fontSize: 13, lineHeight: 18, letterSpacing: 0.26 },
    overline:{ fontFamily: FONT.bodySemiBold,fontWeight:'600', fontSize: 11, lineHeight: 14, letterSpacing: 0.88 },
    dataLg:  { fontFamily: FONT.data,       fontWeight: '500', fontSize: 24, lineHeight: 29, letterSpacing: 0 },
    data:    { fontFamily: FONT.data,       fontWeight: '500', fontSize: 16, lineHeight: 21, letterSpacing: 0 },
    dataSm:  { fontFamily: FONT.dataRegular,fontWeight: '400', fontSize: 13, lineHeight: 17, letterSpacing: 0 },
  },

  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },

  elevation: {
    0: {},
    1: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
    2: {
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.06)',
      shadowColor: '#00FF87',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.05,
      shadowRadius: 20,
      elevation: 2,
    },
    3: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 32,
      elevation: 8,
    },
  },

  animations: {
    springs: {
      default: { damping: 20, stiffness: 300 },
      gentle: { damping: 25, stiffness: 200 },
      snappy: { damping: 15, stiffness: 400 },
      bouncy: { damping: 10, stiffness: 350 },
    },
    timing: {
      fast: { duration: 150 },
      normal: { duration: 250 },
      slow: { duration: 400 },
    },
    card: {
      pressScale: 0.98,
    },
  },
};
