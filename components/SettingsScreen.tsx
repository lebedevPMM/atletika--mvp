
import React, { useState } from 'react';
import { ScreenName } from '../types';
import { useTheme } from './ThemeContext';
import {
  ArrowLeft,
  Bell,
  Moon,
  Lock,
  Globe,
  ChevronRight,
  LogOut,
  Shield,
  Info,
  FileText,
  Calendar,
  MapPin,
  Camera,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface SettingsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme, isEmber, toggleBrandTheme } = useTheme();
  const [calendarSync, setCalendarSync] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [cacheSize, setCacheSize] = useState('156 MB');
  const [osPermissions, setOsPermissions] = useState({
    calendar: 'denied', // MOCK: denied by default to show alert logic
    location: 'granted',
    camera: 'granted',
    notifications: 'granted'
  });

  const handleCalendarToggle = () => {
    if (!calendarSync) {
      if (osPermissions.calendar !== 'granted') {
        alert('Доступ к календарю запрещен. Пожалуйста, включите его в настройках устройства.');
        return;
      }
    }
    setCalendarSync(!calendarSync);
  };

  const handleClearCache = () => {
    if (cacheSize === '0 KB') return;

    setIsClearingCache(true);
    setTimeout(() => {
      setCacheSize('0 KB');
      setIsClearingCache(false);
      alert('Кэш успешно очищен');
    }, 1500);
  };

  const getPermissionLabel = (status: string) => {
    switch (status) {
      case 'granted': return <span className="text-xs font-bold text-green-500">Разрешено</span>;
      case 'denied': return <span className="text-xs font-bold text-red-500">Запрещено</span>;
      case 'prompt': return <span className="text-xs font-bold text-zinc-500">Спросить</span>;
      default: return null;
    }
  };

  // Dynamic classes based on theme
  const bgMain = isDarkMode ? 'bg-zinc-950' : 'bg-gray-50';
  const bgCard = isDarkMode ? 'bg-zinc-900' : 'bg-white';
  const textMain = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSub = isDarkMode ? 'text-zinc-500' : 'text-gray-500';
  const border = isDarkMode ? 'border-zinc-800' : 'border-gray-100';
  const iconBg = (color: string) => isDarkMode ? `bg-${color}-500/10 border-${color}-500/20` : `bg-${color}-50 border-${color}-100`;

  return (
    <div className={`${bgMain} min-h-screen pb-24 transition-colors duration-300`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/80 border-gray-200'} backdrop-blur-md p-4 shadow-sm border-b flex items-center gap-4 sticky top-0 z-10 transition-colors`}>
        <button onClick={() => onNavigate('profile')} className={`p-2 -ml-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-gray-100 text-gray-700'}`}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className={`text-xl font-black italic uppercase tracking-tighter ${textMain}`}>Настройки</h1>
      </div>

      <div className="p-4 space-y-6 animate-in slide-in-from-bottom-4 duration-500">

        {/* Section: App Settings */}
        <section>
          <h2 className={`text-xs font-bold uppercase tracking-wide mb-3 ml-2 ${textSub}`}>Приложение</h2>
          <div className={`${bgCard} rounded-3xl shadow-sm border ${border} overflow-hidden transition-colors`}>
            <button
              onClick={() => onNavigate('notification_settings')}
              className={`w-full flex items-center justify-between p-4 border-b ${border} transition-colors ${isDarkMode ? 'active:bg-zinc-800 hover:bg-zinc-800/50' : 'active:bg-gray-50 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 text-blue-500 rounded-full flex items-center justify-center border ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className={`block text-sm font-bold ${textMain}`}>Уведомления</span>
                  <span className={`text-[10px] ${textSub}`}>Push, Email, SMS</span>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-zinc-600' : 'text-gray-300'}`} />
            </button>

            <div className={`flex items-center justify-between p-4 border-b ${border}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 text-purple-500 rounded-full flex items-center justify-center border ${isDarkMode ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-100'}`}>
                  <Moon className="w-5 h-5" />
                </div>
                <span className={`text-sm font-bold ${textMain}`}>Темная тема</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-7 rounded-full flex items-center px-0.5 cursor-pointer transition-colors duration-300 ${isDarkMode ? 'bg-cyan-600' : 'bg-gray-300'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Brand Theme Toggle */}
            <div className={`flex items-center justify-between p-4 border-b ${border}`}>
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center border"
                  style={{
                    background: isEmber ? 'linear-gradient(135deg, #ff4d00 0%, #8a2be2 100%)' : (isDarkMode ? 'rgba(255, 77, 0, 0.1)' : 'rgba(255, 77, 0, 0.1)'),
                    borderColor: isEmber ? 'transparent' : (isDarkMode ? 'rgba(255, 77, 0, 0.2)' : 'rgba(255, 77, 0, 0.2)')
                  }}
                >
                  <span className="text-lg">🔥</span>
                </div>
                <div className="text-left">
                  <span className={`block text-sm font-bold ${textMain}`}>Ember Style</span>
                  <span className={`text-[10px] ${textSub}`}>{isEmber ? 'Активен' : 'Классика'}</span>
                </div>
              </div>
              <button
                onClick={toggleBrandTheme}
                className={`w-12 h-7 rounded-full flex items-center px-0.5 cursor-pointer transition-colors duration-300`}
                style={{ backgroundColor: isEmber ? '#ff4d00' : (isDarkMode ? '#3f3f46' : '#d1d5db') }}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isEmber ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <button className={`w-full flex items-center justify-between p-4 transition-colors ${isDarkMode ? 'active:bg-zinc-800 hover:bg-zinc-800/50' : 'active:bg-gray-50 hover:bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 text-orange-500 rounded-full flex items-center justify-center border ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-100'}`}>
                  <Globe className="w-5 h-5" />
                </div>
                <span className={`text-sm font-bold ${textMain}`}>Язык</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-1 rounded border ${isDarkMode ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>Русский</span>
                <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-zinc-600' : 'text-gray-300'}`} />
              </div>
            </button>
          </div>
        </section>

        {/* Section: Integration & Permissions */}
        <section>
          <h2 className={`text-xs font-bold uppercase tracking-wide mb-3 ml-2 ${textSub}`}>Интеграции и доступ</h2>
          <div className={`${bgCard} rounded-3xl shadow-sm border ${border} overflow-hidden transition-colors`}>
            {/* Calendar Sync */}
            <div className={`flex items-center justify-between p-4 border-b ${border}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 text-red-500 rounded-full flex items-center justify-center border ${isDarkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className={`block text-sm font-bold ${textMain}`}>Синхронизация</span>
                  <span className={`text-[10px] ${textSub}`}>Календарь устройства</span>
                </div>
              </div>
              <div
                onClick={handleCalendarToggle}
                className={`w-12 h-7 rounded-full flex items-center px-0.5 cursor-pointer transition-colors duration-300 ${calendarSync ? 'bg-cyan-600' : (isDarkMode ? 'bg-zinc-700' : 'bg-gray-300')}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${calendarSync ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>

            {/* Permission List */}
            <div className={`p-4 space-y-3 ${isDarkMode ? 'bg-zinc-950/50' : 'bg-gray-50/50'}`}>
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs">Геолокация</span>
                </div>
                {getPermissionLabel(osPermissions.location)}
              </div>
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
                  <Camera className="w-4 h-4" />
                  <span className="text-xs">Камера</span>
                </div>
                {getPermissionLabel(osPermissions.camera)}
              </div>
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Календарь</span>
                </div>
                {getPermissionLabel(osPermissions.calendar)}
              </div>
            </div>

            <button className={`w-full py-3 text-xs font-bold text-cyan-500 border-t ${border} transition-colors ${isDarkMode ? 'active:bg-zinc-800 hover:text-cyan-400' : 'active:bg-gray-50 hover:text-cyan-600'}`}>
              Открыть настройки устройства
            </button>
          </div>
        </section>

        {/* Section: Data */}
        <section>
          <h2 className={`text-xs font-bold uppercase tracking-wide mb-3 ml-2 ${textSub}`}>Данные</h2>
          <div className={`${bgCard} rounded-3xl shadow-sm border ${border} overflow-hidden transition-colors`}>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isDarkMode ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                  {isClearingCache ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                </div>
                <div className="text-left">
                  <span className={`block text-sm font-bold ${textMain}`}>Очистить кэш</span>
                  <span className={`text-[10px] ${textSub}`}>{cacheSize}</span>
                </div>
              </div>
              <button
                onClick={handleClearCache}
                disabled={cacheSize === '0 KB' || isClearingCache}
                className={`px-4 py-2 rounded-lg text-xs font-bold disabled:opacity-50 transition-colors ${isDarkMode ? 'bg-zinc-800 text-zinc-300 active:bg-zinc-700 hover:text-white' : 'bg-gray-100 text-gray-600 active:bg-gray-200 hover:text-gray-900'}`}
              >
                Очистить
              </button>
            </div>
          </div>
        </section>

        {/* Section: Security */}
        <section>
          <h2 className={`text-xs font-bold uppercase tracking-wide mb-3 ml-2 ${textSub}`}>Безопасность</h2>
          <div className={`${bgCard} rounded-3xl shadow-sm border ${border} overflow-hidden transition-colors`}>
            <button
              onClick={() => onNavigate('change_password')}
              className={`w-full flex items-center justify-between p-4 border-b ${border} transition-colors ${isDarkMode ? 'active:bg-zinc-800 hover:bg-zinc-800/50' : 'active:bg-gray-50 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 text-green-500 rounded-full flex items-center justify-center border ${isDarkMode ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-100'}`}>
                  <Lock className="w-5 h-5" />
                </div>
                <span className={`text-sm font-bold ${textMain}`}>Код-пароль</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-zinc-600' : 'text-gray-300'}`} />
            </button>
            <button className={`w-full flex items-center justify-between p-4 transition-colors ${isDarkMode ? 'active:bg-zinc-800 hover:bg-zinc-800/50' : 'active:bg-gray-50 hover:bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isDarkMode ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                  <Shield className="w-5 h-5" />
                </div>
                <span className={`text-sm font-bold ${textMain}`}>Face ID</span>
              </div>
              <span className={`text-xs font-bold text-cyan-500 px-2 py-1 rounded border ${isDarkMode ? 'bg-cyan-950/30 border-cyan-900/30' : 'bg-cyan-50 border-cyan-100'}`}>Вкл</span>
            </button>
          </div>
        </section>

        {/* Section: Info */}
        <section>
          <div className={`${bgCard} rounded-3xl shadow-sm border ${border} overflow-hidden transition-colors`}>
            <button
              onClick={() => onNavigate('about')}
              className={`w-full flex items-center justify-between p-4 border-b ${border} transition-colors ${isDarkMode ? 'active:bg-zinc-800 hover:bg-zinc-800/50' : 'active:bg-gray-50 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isDarkMode ? 'bg-zinc-800 text-zinc-500 border-zinc-700' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                  <Info className="w-5 h-5" />
                </div>
                <span className={`text-sm font-bold ${textMain}`}>О приложении</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-zinc-600' : 'text-gray-300'}`} />
            </button>
            <button
              onClick={() => onNavigate('auth_privacy')}
              className={`w-full flex items-center justify-between p-4 transition-colors ${isDarkMode ? 'active:bg-zinc-800 hover:bg-zinc-800/50' : 'active:bg-gray-50 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isDarkMode ? 'bg-zinc-800 text-zinc-500 border-zinc-700' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <span className={`text-sm font-bold ${textMain}`}>Правовая информация</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-zinc-600' : 'text-gray-300'}`} />
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <button
          onClick={() => onNavigate('auth_phone')}
          className={`w-full font-bold p-4 rounded-2xl border flex items-center justify-center gap-2 transition-colors ${isDarkMode ? 'bg-red-500/10 text-red-500 border-red-500/20 active:bg-red-500/20 hover:bg-red-500/15' : 'bg-red-50 text-red-600 border-red-100 active:bg-red-100 hover:bg-red-100'}`}
        >
          <LogOut className="w-5 h-5" />
          Выйти
        </button>

        <div className="text-center pb-6">
          <p className={`text-[10px] font-mono ${textSub}`}>ID: 1029384 • v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;