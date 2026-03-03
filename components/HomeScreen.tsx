
import React from 'react';
import { ScreenName } from '../types';

// Import Default Variant
import { HomeScreenDefault } from './HomeScreenDefault';

interface HomeScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen">
      <HomeScreenDefault onNavigate={onNavigate} />
    </div>
  );
};

export default HomeScreen;
