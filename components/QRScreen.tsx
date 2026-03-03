import React, { useEffect, useState } from 'react';
import { X, RefreshCw, Smartphone, AlertTriangle, Snowflake, Wallet, WifiOff, CreditCard, Calendar } from 'lucide-react';
import { ScreenName } from '../types';

interface QRScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const QRScreen: React.FC<QRScreenProps> = ({ onNavigate }) => {
  const [progress, setProgress] = useState(100);
  const status: 'active' | 'frozen' | 'blocked' | 'expired' = 'active'; // Mock status
  const isOffline = false; // Mock offline

  useEffect(() => {
    if (status !== 'active') return;
    const timer = setInterval(() => {
      setProgress((prev) => (prev > 0 ? prev - 1 : 100));
    }, 300); // 30 seconds total
    return () => clearInterval(timer);
  }, [status]);

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-6 text-white safe-area-top safe-area-bottom">
      <button
        onClick={() => onNavigate('home')}
        className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Пропуск в клуб</h1>
        {!isOffline && status === 'active' && <p className="text-gray-300 text-sm">Приложите код к считывателю</p>}
      </div>

      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-orange-500/20 text-orange-200 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold mb-6 w-full max-w-sm border border-orange-500/30">
          <WifiOff className="w-4 h-4" />
          <span className="opacity-90">Нет сети. Код может быть неактуален.</span>
        </div>
      )}

      {status === 'active' ? (
        <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-sm aspect-square flex items-center justify-center relative overflow-hidden">
          {/* Mock QR Code */}
          <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center relative group cursor-pointer">
            <div className="absolute inset-0 border-8 border-white rounded-xl"></div>
            <div className="grid grid-cols-5 gap-1 p-4 w-full h-full opacity-90">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={`bg-white rounded-sm ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
              ))}
            </div>
            {/* Center Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-3 rounded-full shadow-lg">
                <Smartphone className="w-8 h-8 text-black" />
              </div>
            </div>
          </div>

          {/* Animated Bar */}
          <div
            className="absolute bottom-0 left-0 h-1.5 bg-blue-600 transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm aspect-square flex flex-col items-center justify-center text-center relative overflow-hidden">

          {status === 'blocked' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Доступ закрыт</h3>
              <p className="text-sm text-gray-500 mb-6">Имеется задолженность по оплате. Пожалуйста, оплатите счет.</p>
              <button
                onClick={() => onNavigate('invoice')}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm w-full hover:bg-red-700 transition"
              >
                Оплатить долг
              </button>
            </>
          )}

          {status === 'frozen' && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Snowflake className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Заморожено</h3>
              <p className="text-sm text-gray-500 mb-6">Ваш абонемент временно приостановлен.</p>
              <button
                onClick={() => onNavigate('freezing')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm w-full hover:bg-blue-700 transition"
              >
                Управление заморозкой
              </button>
            </>
          )}

          {status === 'expired' && (
            <>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Абонемент истек</h3>
              <p className="text-sm text-gray-500 mb-6">Для посещения клуба необходимо продлить членство.</p>
              <button
                onClick={() => onNavigate('tariff_details')}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm w-full hover:bg-gray-800 transition"
              >
                Выбрать тариф
              </button>
            </>
          )}
        </div>
      )}

      {status === 'active' && (
        <div className="mt-8 flex items-center gap-2 text-sm text-gray-400">
          <RefreshCw className="w-4 h-4 animate-spin-slow" />
          <span>Обновляется автоматически</span>
        </div>
      )}

      <div className="mt-auto mb-8 w-full max-w-sm">
        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Тариф</span>
            <span className="text-xs text-green-400 font-bold uppercase tracking-wider">Активен</span>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <CreditCard className="w-5 h-5 text-gray-300" />
            <span className="font-bold text-lg">Безлимит 12 мес.</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Действует до 12.03.2025</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-4">ID: 1029384 • Alexander I.</p>
      </div>
    </div>
  );
};

export default QRScreen;