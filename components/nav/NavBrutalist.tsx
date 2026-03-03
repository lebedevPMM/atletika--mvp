import React from 'react';
import { Home, CalendarDays, User, Dumbbell, Users, LayoutGrid } from 'lucide-react';
import { ScreenName } from '../../types';

interface NavBrutalistProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

const clientNavItems = [
  {
    name: 'home',
    label: 'HOME',
    icon: Home,
    activeScreens: ['home', 'notifications', 'qr_pass', 'news_detail', 'club_details', 'club_team'],
  },
  {
    name: 'plan',
    label: 'PLAN',
    icon: Dumbbell,
    activeScreens: ['plan', 'my_schedule', 'measurements', 'trackers'],
  },
  {
    name: 'booking_schedule',
    label: 'BOOK',
    icon: CalendarDays,
    activeScreens: ['booking_schedule', 'booking_class_details', 'booking_pt_details', 'booking_confirm', 'waitlist'],
  },
  {
    name: 'community',
    label: 'SOCIAL',
    icon: Users,
    activeScreens: ['community', 'directory', 'chat_list', 'chat_room', 'social_profile'],
  },
  {
    name: 'profile',
    label: 'ME',
    icon: User,
    activeScreens: ['profile', 'wallet', 'tariff_details', 'family', 'settings', 'docs', 'support', 'loyalty', 'favorites'],
  },
];

const trainerNavItems = [
  {
    name: 'trainer_home',
    label: 'TODAY',
    icon: Home,
    activeScreens: ['trainer_home', 'trainer_notifications', 'trainer_scan', 'trainer_requests', 'trainer_tasks'],
  },
  {
    name: 'trainer_schedule',
    label: 'SCHED',
    icon: CalendarDays,
    activeScreens: ['trainer_schedule', 'trainer_class_details'],
  },
  {
    name: 'trainer_clients_list',
    label: 'CLIENTS',
    icon: Users,
    activeScreens: ['trainer_clients_list', 'trainer_client_profile', 'trainer_client_progress'],
  },
  {
    name: 'trainer_settings',
    label: 'MENU',
    icon: LayoutGrid,
    activeScreens: ['trainer_settings', 'trainer_profile', 'trainer_support', 'trainer_finance', 'trainer_chats'],
  },
];

/**
 * NavBrutalist — editorial bottom nav with square icons, heavy borders.
 * Same tabs as NavDock, different visual style.
 */
const NavBrutalist: React.FC<NavBrutalistProps> = ({ currentScreen, onNavigate }) => {
  const isTrainerMode = currentScreen.startsWith('trainer_');
  const navItems = isTrainerMode ? trainerNavItems : clientNavItems;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-[70px] flex justify-around items-center z-40 border-t border-theme border-t-border bg-t-nav-bg safe-area-bottom"
      style={{
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
              className={`w-6 h-6 border border-theme border-t-border flex items-center justify-center ${
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
