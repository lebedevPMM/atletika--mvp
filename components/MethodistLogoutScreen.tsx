import React, { useState } from 'react';
import { ScreenName } from '../types';
import { LogOut } from 'lucide-react';

interface MethodistLogoutScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const MethodistLogoutScreen: React.FC<MethodistLogoutScreenProps> = ({ onNavigate }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setIsLoggingOut(false);
      onNavigate('methodist_login');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-white safe-area-top safe-area-bottom">
      <div className="w-full max-w-sm bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 relative overflow-hidden">

        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full -mr-16 -mt-16 blur-xl pointer-events-none"></div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 text-purple-500">
            <LogOut className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold mb-3">Выход из аккаунта</h1>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">
            Вы уверены, что хотите выйти? <br />
            <span className="text-gray-500">Ваши локальные данные будут удалены.</span>
          </p>

          <div className="w-full space-y-3">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoggingOut ? 'Выход...' : 'Выйти из аккаунта'}
            </button>

            <button
              onClick={() => onNavigate('methodist_home')}
              disabled={isLoggingOut}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3.5 rounded-xl font-bold active:scale-[0.98] transition-all"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MethodistLogoutScreen;
