import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Bell, Mail, MessageSquare, Tag, Clock } from 'lucide-react';

interface NotificationSettingsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState({
    push: true,
    email: false,
    sms: true,
    promos: true,
    reminders: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('settings')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Уведомления</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* System Channels */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-2">Каналы связи</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-gray-900">Push-уведомления</span>
                  <span className="text-[10px] text-gray-500">Системные настройки</span>
                </div>
              </div>
              <div
                onClick={() => toggle('push')}
                className={`w-12 h-7 rounded-full flex items-center px-0.5 cursor-pointer transition-colors duration-300 ${settings.push ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${settings.push ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>

            <div className="p-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-gray-900">Email рассылка</span>
              </div>
              <div
                onClick={() => toggle('email')}
                className={`w-12 h-7 rounded-full flex items-center px-0.5 cursor-pointer transition-colors duration-300 ${settings.email ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${settings.email ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-gray-900">SMS оповещения</span>
              </div>
              <div
                onClick={() => toggle('sms')}
                className={`w-12 h-7 rounded-full flex items-center px-0.5 cursor-pointer transition-colors duration-300 ${settings.sms ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${settings.sms ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Types */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-2">Типы уведомлений</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-gray-900">Акции и скидки</span>
                  <span className="text-[10px] text-gray-500">Персональные предложения</span>
                </div>
              </div>
              <div
                onClick={() => toggle('promos')}
                className={`w-12 h-7 rounded-full flex items-center px-0.5 cursor-pointer transition-colors duration-300 ${settings.promos ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${settings.promos ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-gray-900">Напоминания</span>
                  <span className="text-[10px] text-gray-500">О тренировках и записях</span>
                </div>
              </div>
              <div
                onClick={() => toggle('reminders')}
                className={`w-12 h-7 rounded-full flex items-center px-0.5 cursor-pointer transition-colors duration-300 ${settings.reminders ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${settings.reminders ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>
        </section>

        <p className="text-center text-[10px] text-gray-400 px-4">
          Некоторые важные сервисные уведомления (например, о смене пароля или подтверждении оплаты) нельзя отключить.
        </p>
      </div>
    </div>
  );
};

export default NotificationSettingsScreen;