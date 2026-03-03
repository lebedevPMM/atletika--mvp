
import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Check, Copy, AlertCircle, QrCode, Loader2 } from 'lucide-react';

interface PaymentSBPScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const PaymentSBPScreen: React.FC<PaymentSBPScreenProps> = ({ onNavigate }) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [status, setStatus] = useState<'waiting' | 'processing' | 'success' | 'expired'>('waiting');

  // Quick bank link mocks
  const banks = [
    { name: 'Sber', color: 'bg-green-600' },
    { name: 'T-Bank', color: 'bg-yellow-400 text-black' },
    { name: 'Alfa', color: 'bg-red-600' },
    { name: 'VTB', color: 'bg-blue-700' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-4 shadow-sm dark:shadow-lg border-b border-gray-100 dark:border-zinc-800 flex items-center gap-4 sticky top-0 z-10 transition-colors">
        <button onClick={() => onNavigate('payment_methods')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-zinc-300" />
        </button>
        <h1 className="text-xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">Оплата через СБП</h1>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center">
        {/* Status Indicator */}
        <div className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border transition-colors ${status === 'expired' ? 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20 text-red-500' :
            status === 'success' ? 'bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20 text-green-500' :
              'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400'
          }`}>
          {status === 'waiting' && <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>}
          {status === 'processing' && <Loader2 className="w-3 h-3 animate-spin" />}
          {status === 'success' && <Check className="w-3 h-3" />}
          {status === 'expired' && <AlertCircle className="w-3 h-3" />}

          <span className="text-xs font-bold uppercase tracking-wide">
            {status === 'waiting' && `Ожидание оплаты: ${formatTime(timeLeft)}`}
            {status === 'processing' && 'Проверяем платеж...'}
            {status === 'success' && 'Оплачено'}
            {status === 'expired' && 'Время истекло'}
          </span>
        </div>

        <div className={`bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 w-full max-w-sm text-center relative overflow-hidden transition-all ${status === 'expired' ? 'opacity-50' : 'opacity-100'}`}>
          {/* Decorative bg */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>

          <div className="mb-2">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">4 500 ₽</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-8 uppercase tracking-wide">Счет #8392</p>

          {/* QR Code Area */}
          <div className="aspect-square bg-white rounded-2xl flex items-center justify-center mb-8 relative border-4 border-white dark:border-zinc-950 p-2 shadow-inner ring-1 ring-gray-100 dark:ring-zinc-800">
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center relative overflow-hidden">
              <QrCode className="w-40 h-40 text-black" strokeWidth={1.5} />
              {/* SBP Logo Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white dark:bg-zinc-900 px-3 py-1 rounded-md shadow-lg border border-gray-100 dark:border-zinc-800">
                  <span className="text-xs font-black text-gray-900 dark:text-white">СБП</span>
                </div>
              </div>
            </div>

            {/* Blur overlay for expired state */}
            {status === 'expired' && (
              <div className="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
                <span className="text-xs font-bold text-red-500 bg-white dark:bg-zinc-900 px-3 py-1 rounded-full shadow-lg border border-red-500/20">QR истек</span>
              </div>
            )}
          </div>

          {status !== 'expired' ? (
            <>
              <p className="text-xs text-gray-500 dark:text-zinc-500 mb-6 leading-relaxed">
                Отсканируйте камерой телефона или выберите банк для быстрой оплаты
              </p>

              {/* Quick Bank Links */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {banks.map((bank, i) => (
                  <button key={i} className="flex flex-col items-center gap-1 group">
                    <div className={`w-12 h-12 rounded-2xl ${bank.color} shadow-lg shadow-black/10 flex items-center justify-center text-[10px] font-bold text-white transition-transform active:scale-90 group-hover:scale-105 ring-1 ring-white/10`}>
                      {bank.name[0]}
                    </div>
                    <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-bold uppercase">{bank.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => alert('Ссылка скопирована')} className="flex-1 bg-gray-50 dark:bg-zinc-800 py-3 rounded-xl text-xs font-bold text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2">
                  <Copy className="w-4 h-4" />
                  Скопировать
                </button>
                <button onClick={() => onNavigate('payment_process')} className="flex-1 bg-cyan-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20">
                  Проверить
                </button>
              </div>
            </>
          ) : (
            <button onClick={() => { setTimeLeft(600); setStatus('waiting'); }} className="w-full bg-cyan-600 text-white py-3 rounded-xl font-bold hover:bg-cyan-500 transition-colors">
              Обновить QR-код
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default PaymentSBPScreen;