import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Bell,
  Calendar,
  User,
  Shield,
  LogOut,
  ChevronRight,
  HelpCircle,
  Building2,
  MapPin,
  Settings,
  Info
} from 'lucide-react';

interface TrainerSettingsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerSettingsScreen: React.FC<TrainerSettingsScreenProps> = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState(true);

  // Mock Data
  const profile = {
    name: 'Анна Морозова',
    role: 'Тренер групповых программ',
    phone: '+7 999 123-45-67',
    avatar: null
  };

  const currentClub = {
    name: 'Atletika+ Moscow City',
    address: 'Пресненская наб., 12',
    canSwitch: true // Mock logic for multiple clubs
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">Ещё</h1>
      </div>

      <div className="p-4 space-y-6">

        {/* Profile Card */}
        <button
          onClick={() => onNavigate('trainer_profile')}
          className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.99] transition-transform"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">
            {profile.name.charAt(0)}
          </div>
          <div className="text-left flex-1">
            <h2 className="font-bold text-gray-900 text-lg">{profile.name}</h2>
            <p className="text-gray-500 text-sm">{profile.role}</p>
            <p className="text-gray-400 text-xs mt-1">{profile.phone}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>

        {/* Current Club */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 ml-2">Рабочий контекст</h2>
          <button
            onClick={() => currentClub.canSwitch && onNavigate('trainer_select_club')}
            disabled={!currentClub.canSwitch}
            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 text-sm">{currentClub.name}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {currentClub.address}
                </div>
              </div>
            </div>
            {currentClub.canSwitch && (
              <div className="flex items-center gap-2 text-blue-600">
                <span className="text-xs font-bold">Сменить</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </button>
        </div>

        {/* Settings & Support */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 ml-2">Приложение</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Settings Link */}
            <button
              onClick={() => onNavigate('trainer_preferences')}
              className="w-full flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Settings className="w-5 h-5" /></div>
                <span className="text-sm font-medium text-gray-900">Настройки</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>

            {/* Support */}
            <button
              onClick={() => onNavigate('trainer_support')}
              className="w-full flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><HelpCircle className="w-5 h-5" /></div>
                <span className="text-sm font-medium text-gray-900">Поддержка</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>

            {/* About */}
            <button className="w-full flex items-center justify-between p-4 active:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><Info className="w-5 h-5" /></div>
                <span className="text-sm font-medium text-gray-900">О приложении</span>
              </div>
              <span className="text-xs text-gray-400 mr-2">v 1.0.0 (MVP)</span>
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => onNavigate('trainer_logout')}
          className="w-full bg-white text-red-500 font-medium p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center gap-2 active:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Выйти из аккаунта
        </button>

      </div>
    </div>
  );
};

export default TrainerSettingsScreen;