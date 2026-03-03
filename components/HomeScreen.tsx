
import React from 'react';
import { ScreenName } from '../types';
import { useTheme } from './ThemeContext';
import { Settings, Palette } from 'lucide-react';

// Import Variants
import { HomeScreenDefault } from './HomeScreenDefault';
import { HomeScreenEmber } from './HomeScreenEmber';

interface HomeScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { brandTheme, toggleBrandTheme } = useTheme();

  return (
    <div className="relative min-h-screen">
      {/* Variant Switcher */}
      {brandTheme === 'default' && <HomeScreenDefault onNavigate={onNavigate} toggleBrandTheme={toggleBrandTheme} brandTheme={brandTheme} />}
      {brandTheme === 'ember' && (
        <HomeScreenEmber
          onNavigate={onNavigate}
          toggleBrandTheme={toggleBrandTheme}
          brandTheme={brandTheme}
        />
      )}

      {/* DEV THEME TOGGLE */}
      <button
        onClick={toggleBrandTheme}
        className="absolute top-24 right-4 z-50 p-2 bg-black/50 backdrop-blur-md border border-white/20 rounded-full shadow-xl text-white hover:bg-black transition-colors flex items-center gap-2 group"
        title="Dev Mode: Switch Theme"
      >
        <Palette className="w-5 h-5" />
        <span className="text-[10px] font-mono uppercase tracking-wider hidden group-hover:block pr-1">
          {brandTheme}
        </span>
      </button>
    </div>
  );
};

export default HomeScreen;
