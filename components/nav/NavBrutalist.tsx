import React from 'react';
import { Home, BarChart3, PlusSquare, User } from 'lucide-react';
import { ScreenName } from '../../types';

interface NavBrutalistProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

const navItems = [
  { name: 'home', label: 'Home', icon: Home, activeScreens: ['home', 'notifications', 'qr_pass', 'news_detail', 'club_details', 'club_team'] },
  { name: 'plan', label: 'Stats', icon: BarChart3, activeScreens: ['plan', 'my_schedule', 'measurements', 'trackers'] },
  { name: 'booking_schedule', label: 'Add', icon: PlusSquare, activeScreens: ['booking_schedule', 'booking_class_details', 'booking_pt_details', 'booking_confirm', 'waitlist'] },
  { name: 'profile', label: 'Profile', icon: User, activeScreens: ['profile', 'wallet', 'tariff_details', 'family', 'settings', 'docs', 'support', 'loyalty', 'favorites'] },
];

/**
 * NavBrutalist — editorial bottom nav with square icons, no rounded corners.
 * Active item gets a filled square icon.
 */
const NavBrutalist: React.FC<NavBrutalistProps> = ({ currentScreen, onNavigate }) => {
  return (
    <div
      className="fixed bottom-0 left-0 w-full h-[70px] flex justify-around items-center z-[100] border-t border-[length:var(--yt-border-width,1.5px)] border-t-border"
      style={{
        backgroundColor: 'var(--yt-glass-bg, var(--t-nav-bg))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {navItems.map((item) => {
        const isActive = item.activeScreens.includes(currentScreen);
        const Icon = item.icon;

        return (
          <button
            key={item.name}
            onClick={() => onNavigate(item.name as ScreenName)}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-opacity ${
              isActive ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <div
              className={`w-6 h-6 border-[1.5px] border-t-border flex items-center justify-center ${
                isActive ? 'bg-t-text' : ''
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-t-bg' : 'text-t-text'}`} strokeWidth={2} />
            </div>
            <span className="text-[0.6rem] uppercase font-bold tracking-wider text-t-text">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default NavBrutalist;
