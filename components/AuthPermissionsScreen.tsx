import React from 'react';
import { ScreenName } from '../types';
import { Bell, Calendar, ChevronRight, Check, Settings, X } from 'lucide-react';

interface AuthPermissionsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const AuthPermissionsScreen: React.FC<AuthPermissionsScreenProps> = ({ onNavigate }) => {
  const [pushStatus, setPushStatus] = React.useState<'default' | 'granted' | 'denied'>('default');
  const [calendarStatus, setCalendarStatus] = React.useState<'default' | 'granted' | 'denied'>('default');

  const requestPush = () => {
    // Mock system dialog
    if (window.confirm('Разрешить отправку уведомлений?')) {
      setPushStatus('granted');
    } else {
      setPushStatus('denied');
    }
  };

  const requestCalendar = () => {
    // Mock system dialog
    if (window.confirm('Разрешить доступ к календарю?')) {
      setCalendarStatus('granted');
    } else {
      setCalendarStatus('denied');
    }
  };

  const openSettings = () => {
    alert('Открываем системные настройки...');
  };

  const handleContinue = () => {
    // Navigate to next onboarding step or home
    onNavigate('onboarding_bio');
  };

  return (
    <div className="bg-white min-h-screen flex flex-col p-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 text-center leading-tight">Настроим<br />приложение</h1>
        <p className="text-gray-500 mb-8 text-center max-w-xs leading-relaxed text-sm">
          Чтобы Атлетика+ работала на полную мощность, нам нужны некоторые разрешения.
        </p>

        <div className="w-full space-y-4">
          {/* Notification Permission */}
          <div className="bg-white p-5 rounded-2xl flex flex-col gap-4 text-left border border-gray-100 shadow-sm relative overflow-hidden transition-all">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${pushStatus === 'granted' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                }`}>
                {pushStatus === 'granted' ? <Check className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Уведомления</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Напоминания о тренировках за 2 часа и изменения в расписании.
                </p>
              </div>
            </div>

            {pushStatus === 'default' && (
              <button onClick={requestPush} className="w-full py-3 bg-gray-50 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors">
                Разрешить
              </button>
            )}
            {pushStatus === 'denied' && (
              <button onClick={openSettings} className="w-full py-3 bg-red-50 text-red-600 font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                <Settings className="w-4 h-4" /> Открыть настройки
              </button>
            )}
            {pushStatus === 'granted' && (
              <div className="w-full py-3 bg-green-50 text-green-600 font-bold text-sm rounded-xl text-center">
                Разрешено
              </div>
            )}
          </div>

          {/* Calendar Permission */}
          <div className="bg-white p-5 rounded-2xl flex flex-col gap-4 text-left border border-gray-100 shadow-sm relative overflow-hidden transition-all">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${calendarStatus === 'granted' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                }`}>
                {calendarStatus === 'granted' ? <Check className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Календарь</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Добавление записей в ваш календарь в одно касание.
                </p>
              </div>
            </div>

            {calendarStatus === 'default' && (
              <button onClick={requestCalendar} className="w-full py-3 bg-gray-50 text-purple-600 font-bold text-sm rounded-xl hover:bg-purple-50 transition-colors">
                Разрешить
              </button>
            )}
            {calendarStatus === 'denied' && (
              <button onClick={openSettings} className="w-full py-3 bg-red-50 text-red-600 font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                <Settings className="w-4 h-4" /> Открыть настройки
              </button>
            )}
            {calendarStatus === 'granted' && (
              <div className="w-full py-3 bg-green-50 text-green-600 font-bold text-sm rounded-xl text-center">
                Разрешено
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-8 safe-area-bottom">
        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Продолжить <ChevronRight className="w-5 h-5" />
        </button>
        <button
          onClick={handleContinue}
          className="w-full py-4 text-gray-400 font-medium text-sm hover:text-gray-600 transition-colors"
        >
          Позже
        </button>
      </div>
    </div>
  );
};

export default AuthPermissionsScreen;