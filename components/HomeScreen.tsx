
import React from 'react';
import { ScreenName } from '../types';
import { useTheme } from './ThemeContext';

// Home screen variants
import { HomeScreenDefault } from './HomeScreenDefault';
import YapTrackHome from './yaptrack/YapTrackHome';

interface HomeScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

/**
 * HomeScreen — delegates to the home variant specified by the current theme.
 * Each theme can define a completely different home layout.
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { themeConfig } = useTheme();

  switch (themeConfig.homeVariant) {
    case 'yaptrack':
      return <YapTrackHome onNavigate={onNavigate} />;
    case 'default':
    default:
      return (
        <div className="relative min-h-screen">
          <HomeScreenDefault onNavigate={onNavigate} />
        </div>
      );
  }
};

export default HomeScreen;
