
import React from 'react';
import { Home, CalendarDays, MessageSquare, User, Dumbbell, Users, LayoutGrid } from 'lucide-react';
import { ScreenName } from '../types';
interface BottomNavProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const isTrainerMode = currentScreen.startsWith('trainer_');

  const clientNavItems = [
    {
      name: 'home',
      label: 'Главная',
      icon: Home,
      activeScreens: [
        'home',
        'notifications',
        'qr_pass',
        'news_detail',
        'club_details',
        'club_team'
      ]
    },
    {
      name: 'plan',
      label: 'План',
      icon: Dumbbell,
      activeScreens: [
        'plan',
        'my_schedule',
        'measurements',
        'trackers'
      ]
    },
    {
      name: 'booking_schedule',
      label: 'Запись',
      icon: CalendarDays,
      activeScreens: [
        'booking_schedule',
        'booking_class_details',
        'booking_pt_details',
        'booking_confirm',
        'waitlist'
      ]
    },
    {
      name: 'community',
      label: 'Network',
      icon: Users,
      activeScreens: [
        'community',
        'directory',
        'chat_list',
        'chat_room',
        'social_profile'
      ]
    },
    {
      name: 'profile',
      label: 'Профиль',
      icon: User,
      activeScreens: [
        'profile',
        'wallet',
        'tariff_details',
        'family',
        'settings',
        'docs',
        'support',
        'loyalty',
        'favorites'
      ]
    },
  ];

  const trainerNavItems = [
    {
      name: 'trainer_home',
      label: 'Сегодня',
      icon: Home,
      activeScreens: ['trainer_home', 'trainer_notifications', 'trainer_scan', 'trainer_requests', 'trainer_tasks']
    },
    {
      name: 'trainer_schedule',
      label: 'Расписание',
      icon: CalendarDays,
      activeScreens: ['trainer_schedule', 'trainer_class_details']
    },
    {
      name: 'trainer_clients_list',
      label: 'Клиенты',
      icon: Users,
      activeScreens: ['trainer_clients_list', 'trainer_client_profile', 'trainer_client_progress']
    },
    {
      name: 'trainer_settings',
      label: 'Меню',
      icon: LayoutGrid,
      activeScreens: ['trainer_settings', 'trainer_profile', 'trainer_support', 'trainer_finance', 'trainer_chats']
    }
  ];

  const navItems = isTrainerMode ? trainerNavItems : clientNavItems;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-t border-gray-200 dark:border-zinc-800 px-4 py-3 flex justify-between items-center z-40 safe-area-bottom">
      {navItems.map((item) => {
        const isActive = item.activeScreens.includes(currentScreen);
        const Icon = item.icon;

        return (
          <button
            key={item.name}
            onClick={() => onNavigate(item.name as ScreenName)}
            className="flex flex-col items-center gap-1 min-w-[56px] w-full group"
          >
            <div className={`p-1.5 rounded-xl ${isActive ? 'bg-cyan-50 dark:bg-zinc-800 text-cyan-600 dark:text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-transparent text-gray-400 dark:text-zinc-500 group-hover:text-gray-600 dark:group-hover:text-zinc-300'}`}>
              <Icon
                className={`w-6 h-6 ${isActive ? 'scale-110' : 'scale-100'}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </div>
            <span className={`text-[10px] font-medium ${isActive ? 'text-cyan-700 dark:text-white' : 'text-gray-400 dark:text-zinc-600'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;