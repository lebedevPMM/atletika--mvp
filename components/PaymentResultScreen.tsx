
import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import { CheckCircle2, XCircle, Home, RotateCcw, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentResultScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const PaymentResultScreen: React.FC<PaymentResultScreenProps> = ({ onNavigate }) => {
  const [status, setStatus] = useState<'success' | 'pending' | 'failed'>('success');

  useEffect(() => {
    // Only fire confetti if successful
    if (status === 'success') {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500 relative overflow-hidden transition-colors duration-300">

      {/* Visual Indicator */}
      <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-6 mx-auto shadow-sm ring-8 ${status === 'success' ? 'bg-green-100 dark:bg-green-500/10 ring-green-100 dark:ring-green-500/20' :
          status === 'pending' ? 'bg-blue-100 dark:bg-blue-500/10 ring-blue-100 dark:ring-blue-500/20' :
            'bg-red-100 dark:bg-red-500/10 ring-red-100 dark:ring-red-500/20'
        }`}>
        {status === 'success' && <CheckCircle2 className="w-14 h-14 text-green-600 dark:text-green-500" strokeWidth={2} />}
        {status === 'pending' && <Loader2 className="w-14 h-14 text-blue-600 dark:text-blue-500 animate-spin" strokeWidth={2} />}
        {status === 'failed' && <XCircle className="w-14 h-14 text-red-600 dark:text-red-500" strokeWidth={2} />}
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
        {status === 'success' && 'Оплата прошла!'}
        {status === 'pending' && 'Обработка...'}
        {status === 'failed' && 'Ошибка оплаты'}
      </h1>

      <p className="text-gray-500 dark:text-zinc-400 mb-8 text-sm max-w-xs mx-auto">
        {status === 'success' && 'Ваш абонемент активирован. Квитанция отправлена на почту.'}
        {status === 'pending' && 'Мы проверяем статус транзакции с банком.'}
        {status === 'failed' && 'Не удалось списать средства. Проверьте баланс или попробуйте другую карту.'}
      </p>

      {/* Summary Card */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl w-full max-w-xs mb-8 border border-gray-100 dark:border-zinc-800 relative transition-colors shadow-sm">
        <div className="flex justify-between mb-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
          <span className="text-gray-400 dark:text-zinc-500 text-xs font-bold uppercase">Сумма</span>
          <span className="text-gray-900 dark:text-white font-black">4 500 ₽</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 dark:text-zinc-500 text-xs font-bold uppercase">Заказ</span>
          <span className="text-gray-900 dark:text-white font-medium text-xs">#INV-839201</span>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-xs space-y-3">
        {status === 'success' && (
          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold font-sans shadow-lg shadow-cyan-500/20 hover:bg-cyan-500 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            На главную
          </button>
        )}

        {(status === 'failed') && (
          <button
            onClick={() => onNavigate('payment_methods')}
            className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold font-sans shadow-lg shadow-cyan-500/20 hover:bg-cyan-500 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Попробовать снова
          </button>
        )}

        <button
          onClick={() => onNavigate('support')}
          className="w-full py-4 text-sm font-bold text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400 transition-colors"
        >
          Есть проблема? Напишите нам
        </button>
      </div>

    </div>
  );
};

export default PaymentResultScreen;