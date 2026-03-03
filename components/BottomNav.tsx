import React from 'react';
import { ScreenName } from '../types';
import { useTheme } from './ThemeContext';
import NavDock from './nav/NavDock';

interface BottomNavProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

/**
 * BottomNav — delegates to the nav variant specified by the current theme.
 * Each theme can specify a different navVariant in the registry.
 * Currently supported: 'dock' → NavDock
 */
const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const { themeConfig } = useTheme();

  switch (themeConfig.navVariant) {
    case 'dock':
    default:
      return <NavDock currentScreen={currentScreen} onNavigate={onNavigate} />;
  }
};

export default BottomNav;
