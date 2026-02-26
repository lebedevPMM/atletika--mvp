import type { ThemeTokens } from '../types';

const FONT = {
  display: 'ClashDisplay-Bold',
  heading: 'ClashDisplay-Semibold',
  headingMedium: 'ClashDisplay-Medium',
  body: 'Satoshi-Regular',
  bodyMedium: 'Satoshi-Medium',
  bodySemiBold: 'Satoshi-Bold',
  data: 'IBMPlexMono-Medium',
  dataRegular: 'IBMPlexMono-Regular',
};

export const kineticTokens: ThemeTokens = {
  name: 'kinetic',

  colors: {
    bg: {
      primary: '#F5F2EE',
      elevated: '#FFFFFF',
      surface: '#EFECE8',
      sunken: '#EBE8E3',
      scrim: 'rgba(28,25,23,0.5)',
      hover: 'rgba(28,25,23,0.03)',
      pressed: 'rgba(28,25,23,0.06)',
      selected: 'rgba(255,107,53,0.08)',
    },
    text: {
      primary: '#1C1917',
      secondary: '#78716C',
      tertiary: '#A8A29E',
      disabled: '#D6D3D1',
      inverse: '#FFFFFF',
      accent: '#FF6B35',
    },
    accent: {
      primary: '#FF6B35',
      secondary: '#6366F1',
      tertiary: '#06B6D4',
      surface: 'rgba(255,107,53,0.08)',
      border: '#FF6B35',
    },
    semantic: {
      success: { main: '#16A34A', surface: 'rgba(22,163,74,0.10)' },
      warning: { main: '#F59E0B', surface: 'rgba(245,158,11,0.10)' },
      error: { main: '#DC2626', surface: 'rgba(220,38,38,0.10)' },
      info: { main: '#06B6D4', surface: 'rgba(6,182,212,0.10)' },
    },
    border: {
      default: '#E7E5E4',
      strong: '#D6D3D1',
      focus: '#FF6B35',
      error: '#DC2626',
    },
    activity: {
      group: '#FF6B35',
      personal: '#6366F1',
      spa: '#A78BFA',
      pool: '#06B6D4',
      kids: '#FBBF24',
    },
  },

  typography: {
    display:  { fontFamily: FONT.display,      fontWeight: '700', fontSize: 40, lineHeight: 44, letterSpacing: -0.8 },
    h1:      { fontFamily: FONT.display,      fontWeight: '700', fontSize: 32, lineHeight: 37, letterSpacing: -0.48 },
    h2:      { fontFamily: FONT.heading,      fontWeight: '600', fontSize: 24, lineHeight: 29, letterSpacing: -0.24 },
    h3:      { fontFamily: FONT.headingMedium,fontWeight: '500', fontSize: 20, lineHeight: 25, letterSpacing: -0.1 },
    h4:      { fontFamily: FONT.headingMedium,fontWeight: '500', fontSize: 18, lineHeight: 23, letterSpacing: 0 },
    bodyLg:  { fontFamily: FONT.bodyMedium,   fontWeight: '500', fontSize: 18, lineHeight: 27, letterSpacing: 0 },
    body:    { fontFamily: FONT.body,         fontWeight: '400', fontSize: 16, lineHeight: 24, letterSpacing: 0.08 },
    bodySm:  { fontFamily: FONT.body,         fontWeight: '400', fontSize: 14, lineHeight: 20, letterSpacing: 0.14 },
    caption: { fontFamily: FONT.body,         fontWeight: '400', fontSize: 13, lineHeight: 18, letterSpacing: 0.26 },
    overline:{ fontFamily: FONT.bodySemiBold, fontWeight: '600', fontSize: 11, lineHeight: 14, letterSpacing: 0.88 },
    dataLg:  { fontFamily: FONT.data,         fontWeight: '500', fontSize: 24, lineHeight: 29, letterSpacing: 0 },
    data:    { fontFamily: FONT.data,         fontWeight: '400', fontSize: 16, lineHeight: 21, letterSpacing: 0 },
    dataSm:  { fontFamily: FONT.dataRegular,  fontWeight: '400', fontSize: 13, lineHeight: 17, letterSpacing: 0 },
  },

  radius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 24,
    '2xl': 28,
    full: 9999,
  },

  elevation: {
    0: {},
    1: {
      shadowColor: '#1C1917',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 1,
    },
    2: {
      shadowColor: '#1C1917',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 20,
      elevation: 3,
    },
    3: {
      shadowColor: '#1C1917',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.10,
      shadowRadius: 32,
      elevation: 6,
    },
  },

  animations: {
    springs: {
      default: { damping: 15, stiffness: 250, mass: 1 },
      gentle: { damping: 20, stiffness: 180, mass: 1.2 },
      snappy: { damping: 18, stiffness: 400, mass: 0.8 },
      bouncy: { damping: 8, stiffness: 300, mass: 1 },
      morphing: { damping: 12, stiffness: 200, mass: 1.5 },
    },
    timing: {
      fast: { duration: 150 },
      normal: { duration: 300 },
      slow: { duration: 500 },
      mesh: { duration: 3000 },
    },
    card: {
      pressScale: 0.97,
    },
    stagger: {
      delay: 50,
    },
  },
};
