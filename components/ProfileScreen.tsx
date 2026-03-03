
import React, { useState } from 'react';
import { ScreenName } from '../types';
import { useTheme } from './ThemeContext';
import {
  Settings,
  Wallet,
  FileText,
  LogOut,
  ChevronRight,
  Users,
  HelpCircle,
  CreditCard,
  Edit2,
  Trophy,
  Briefcase,
  Loader2,
  Bell,
  Calendar
} from 'lucide-react';

interface ProfileScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const { isDarkMode } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // MOCK DATA
  const user = {
    name: 'Александр Иванов',
    id: '1029384',
    phone: '+7 (999) 123-45-67',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    tariffStatus: 'Активен до 12.03.2025',
    hasDebt: false, // Toggle to true to see debt item
    familyMembers: 2
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    // Simulate logout delay
    setTimeout(() => {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
      onNavigate('auth_phone');
    }, 1500);
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="px-4 mt-6 mb-2 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wide transition-colors">
      {title}
    </h3>
  );

  const MenuItem = ({
    icon: Icon,
    label,
    onClick,
    badge,
    badgeColor = 'cyan',
    isDestructive = false
  }: {
    icon: React.ElementType,
    label: string,
    onClick: () => void,
    badge?: string,
    badgeColor?: 'cyan' | 'red',
    isDestructive?: boolean
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 border-b last:border-0 transition-colors group
        bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 
        hover:bg-gray-50 dark:hover:bg-zinc-800 active:bg-gray-100 dark:active:bg-zinc-800/80
        ${isDestructive ? 'text-red-500' : 'text-gray-900 dark:text-white'}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl transition-colors ${isDestructive
          ? 'bg-red-50 dark:bg-red-500/10 text-red-500'
          : 'bg-gray-100 dark:bg-zinc-950 text-gray-500 dark:text-zinc-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-950/30'
          }`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-bold tracking-wide">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${badgeColor === 'red'
            ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/20'
            : 'bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20'
            }`}>
            {badge}
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-zinc-600 group-hover:text-gray-400 dark:group-hover:text-zinc-400 transition-colors" />
      </div>
    </button>
  );

  return (
    <div
      className="pb-24 min-h-screen transition-colors duration-300"
    >
      <div className="absolute inset-0 bg-gray-50 dark:bg-zinc-950 -z-10" />
      {/* Header */}
      <div
        className="p-6 pb-6 rounded-b-3xl shadow-sm mb-6 relative overflow-hidden transition-colors"
      >
        <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-b-3xl border-b border-gray-100 dark:border-zinc-800 -z-10" />
        {/* Ambience */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"
          style={{ background: 'rgba(6, 182, 212, 0.05)' }}
        ></div>

        <div className="flex items-center gap-5 relative z-10">
          <div className="relative group">
            <div
              className="w-20 h-20 rounded-full p-1 shadow-xl overflow-hidden group-active:scale-95 transition-transform"
            >
              <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-800 rounded-full border border-gray-200 dark:border-zinc-700" />
              <img src={user.avatar} alt="User" className="w-full h-full object-cover rounded-full relative z-10" />
            </div>
            <button
              onClick={() => onNavigate('profile_edit')}
              className="absolute -bottom-1 -right-1 p-2 rounded-full shadow-lg transition-all"
            >
              <div className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-full border border-gray-200 dark:border-zinc-700" />
              <Edit2 className="w-3.5 h-3.5 relative z-10" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <h1
              className="text-2xl font-black truncate italic"
            >
              {user.name}
            </h1>
            <p
              className="text-sm font-medium mb-2"
            >
              {user.phone}
            </p>
            <div className="flex flex-wrap gap-2">
              <span
                className="px-2 py-0.5 text-[10px] rounded-md font-bold uppercase tracking-wider bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400"
              >
                ID {user.id}
              </span>
              <span
                className="px-2 py-0.5 text-[10px] rounded-md font-bold uppercase tracking-wider bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900 text-cyan-600 dark:text-cyan-400"
              >
                {user.tariffStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTIONS */}

      {/* Account */}
      <SectionHeader title="Аккаунт" />
      <div className="mx-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden transition-colors">
        {user.hasDebt && (
          <MenuItem
            icon={FileText}
            label="Счета"
            badge="3 900 ₽"
            badgeColor="red"
            onClick={() => onNavigate('invoice')}
          />
        )}
        <MenuItem
          icon={CreditCard}
          label="Мой тариф"
          badge="Активен"
          onClick={() => onNavigate('tariff_details')}
        />
        <MenuItem
          icon={Calendar}
          label="Мое расписание"
          onClick={() => onNavigate('my_schedule')}
        />
        <MenuItem
          icon={Wallet}
          label="Кошелек и карты"
          onClick={() => onNavigate('wallet')}
        />
        <MenuItem
          icon={Trophy}
          label="Лояльность и статистика"
          badge="350 баллов"
          onClick={() => onNavigate('loyalty')}
        />
      </div>

      {/* Family */}
      <SectionHeader title="Семья" />
      <div className="mx-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden transition-colors">
        <MenuItem
          icon={Users}
          label="Члены семьи"
          badge={user.familyMembers > 0 ? `${user.familyMembers}` : undefined}
          onClick={() => onNavigate('family')}
        />
      </div>

      {/* Settings */}
      <SectionHeader title="Настройки" />
      <div className="mx-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden transition-colors">
        <MenuItem
          icon={Settings}
          label="Основные настройки"
          onClick={() => onNavigate('settings')}
        />
        <MenuItem
          icon={Bell}
          label="Уведомления"
          onClick={() => onNavigate('notification_settings')}
        />
      </div>

      {/* Docs & Support */}
      <SectionHeader title="Поддержка" />
      <div className="mx-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden transition-colors">
        <MenuItem
          icon={FileText}
          label="Документы"
          onClick={() => onNavigate('docs')}
        />
        <MenuItem
          icon={HelpCircle}
          label="Центр помощи"
          onClick={() => onNavigate('support')}
        />
      </div>

      {/* Trainer (Dev/Staff Only) */}
      <div className="mx-4 mt-6">
        <button
          onClick={() => onNavigate('trainer_login')}
          className="w-full flex items-center justify-center gap-2 text-gray-500 dark:text-zinc-600 font-bold p-3 rounded-xl border border-dashed border-gray-300 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-zinc-400 transition-colors text-xs uppercase tracking-widest"
        >
          <Briefcase className="w-4 h-4" />
          Вход для сотрудников
        </button>
      </div>

      {/* Logout */}
      <div className="mx-4 mt-4 text-center">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="text-red-500/80 font-bold text-xs py-2 px-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors inline-flex items-center gap-2 uppercase tracking-wide"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </button>
      </div>

      <p className="text-center text-[10px] text-gray-400 dark:text-zinc-700 mt-6 mb-8 uppercase tracking-widest font-bold">
        v1.0.0 (MVP)
      </p>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !isLoggingOut && setShowLogoutConfirm(false)}></div>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-xs p-6 relative z-10 shadow-2xl border border-gray-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-200 transition-colors">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 border border-red-200 dark:border-red-500/20">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">Выйти из аккаунта?</h3>
            <p className="text-sm text-center text-gray-500 dark:text-zinc-500 mb-6">
              Ваши данные профиля и авторизация будут удалены с этого устройства.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Выход...
                  </>
                ) : (
                  'Выйти'
                )}
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:text-white py-3 rounded-xl font-bold active:scale-[0.98] transition-colors border border-gray-200 dark:border-zinc-700"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;