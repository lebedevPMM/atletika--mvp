import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import {
  User,
  BarChart3,
  Calendar,
  BookOpen,
  Bell,
  Palette,
  Info,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface MethodistSettingsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const MethodistSettingsScreen: React.FC<MethodistSettingsScreenProps> = ({ onNavigate }) => {
  const [showLogout, setShowLogout] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string) => {
    setToast(message);
  };

  const toolsItems = [
    { icon: BarChart3, label: 'Аналитика клуба', action: () => onNavigate('methodist_analytics') },
    { icon: Calendar, label: 'Расписание клуба', action: () => showToast('В разработке') },
    { icon: BookOpen, label: 'База знаний', action: () => showToast('В разработке') },
  ];

  const settingsItems = [
    { icon: Bell, label: 'Уведомления', action: () => showToast('В разработке') },
    { icon: Palette, label: 'Тема оформления', action: () => showToast('В разработке') },
    { icon: Info, label: 'О приложении', action: () => showToast('В разработке') },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">Меню</h1>
      </div>

      <div className="p-4 space-y-6">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900">Анна Методист</h2>
              <p className="text-xs text-gray-500">Главный методист</p>
              <p className="text-xs text-gray-400 mt-0.5">Atletika Центральный</p>
            </div>
          </div>
        </div>

        {/* Section: Инструменты */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Инструменты</h2>
          <div className="space-y-2">
            {toolsItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full bg-white rounded-xl p-4 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-900 flex-1 text-left">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Section: Настройки */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Настройки</h2>
          <div className="space-y-2">
            {settingsItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full bg-white rounded-xl p-4 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-900 flex-1 text-left">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogout(true)}
          className="w-full bg-red-50 text-red-600 rounded-xl p-4 flex items-center gap-3 hover:bg-red-100 active:bg-red-200 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Выйти из аккаунта</span>
        </button>

      </div>

      {/* Logout Confirm Dialog */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 text-center mb-6">Выйти?</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 bg-gray-100 text-gray-700 font-medium rounded-xl p-3 hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  setShowLogout(false);
                  onNavigate('methodist_logout');
                }}
                className="flex-1 bg-red-500 text-white font-medium rounded-xl p-3 hover:bg-red-600 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
};

export default MethodistSettingsScreen;
