import React, { useState } from 'react';
import { ScreenName } from '../types';
import { Phone, ChevronRight } from 'lucide-react';

interface MethodistLoginScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const MethodistLoginScreen: React.FC<MethodistLoginScreenProps> = ({ onNavigate }) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = () => {
    if (phone.length < 10) {
      setError('Введите корректный номер телефона');
      return;
    }
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onNavigate('methodist_otp');
    }, 1000);
  };

  const formatPhone = (value: string) => {
    return value.replace(/[^\d+ ]/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-white safe-area-top safe-area-bottom">
      <div className="w-full max-w-sm space-y-8">

        <div className="text-center">
          <div className="w-16 h-16 bg-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-purple-900/50">
            <span className="text-2xl font-bold tracking-tighter text-white">M+</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Atletika+ Метод</h1>
          <p className="text-gray-400">Вход для методиста</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 space-y-4">
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Номер телефона</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className={`w-full bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-700'} rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono text-lg`}
                placeholder="+7 999 000-00-00"
              />
              <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
            </div>
            {error && <p className="text-red-400 text-xs mt-2 ml-1">{error}</p>}

            <button
              onClick={handleSendCode}
              disabled={isLoading || !phone}
              className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Отправка...' : (
                <>
                  Получить код <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={() => onNavigate('trainer_login')}
          className="w-full py-4 text-gray-500 text-sm hover:text-white transition-colors"
        >
          Я тренер
        </button>
      </div>
    </div>
  );
};

export default MethodistLoginScreen;
