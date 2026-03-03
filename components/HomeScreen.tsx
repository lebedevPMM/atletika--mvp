
import React from 'react';
import { ScreenName } from '../types';
import { HomeScreenDefault } from './HomeScreenDefault';

interface HomeScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

/**
 * HomeScreen — renders the home layout.
 * All themes style the same content via CSS tokens.
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen">
      <HomeScreenDefault onNavigate={onNavigate} />
    </div>
  );
};

export default HomeScreen;
