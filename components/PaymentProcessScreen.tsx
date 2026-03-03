
import React, { useEffect, useState } from 'react';
import { ScreenName } from '../types';
import { Loader2, ShieldCheck, Lock, AlertCircle } from 'lucide-react';

interface PaymentProcessScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type ProcessState = 'processing' | '3ds' | 'verifying' | 'success' | 'failed';

const PaymentProcessScreen: React.FC<PaymentProcessScreenProps> = ({ onNavigate }) => {
  const [state, setState] = useState<ProcessState>('processing');

  useEffect(() => {
    // 1. Initial Processing
    const timer1 = setTimeout(() => {
      setState('3ds');
    }, 2000);

    // 2. Simulate User 3DS Input (Auto-complete for MVP)
    const timer2 = setTimeout(() => {
      setState('verifying');
    }, 5000);

    // 3. Final Result
    const timer3 = setTimeout(() => {
      // Randomly fail sometimes for demo, or just succeed
      const success = true;
      setState(success ? 'success' : 'failed');

      setTimeout(() => {
        onNavigate(success ? 'payment_result' : 'payment_failed');
      }, 1000);
    }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onNavigate]);

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300">

      {/* Background Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center opacity-30 blur-md pointer-events-none">
        <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl">
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4 mb-4 mx-auto"></div>
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/2 mx-auto"></div>
        </div>
      </div>

      {/* 3DS Webview Simulation */}
      {state === '3ds' && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white dark:bg-zinc-900 animate-in slide-in-from-bottom duration-300">
          {/* Fake Browser Header */}
          <div className="bg-gray-100 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 p-2 flex items-center gap-2 safe-area-top">
            <div className="flex gap-1.5 ml-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 bg-white dark:bg-zinc-900 rounded-lg py-1 px-3 text-center text-xs font-mono text-gray-500 dark:text-zinc-500 shadow-sm flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> secure.bank.com/3ds-confirm
            </div>
          </div>

          {/* Bank Content */}
          <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-zinc-950">
            <div className="bg-white px-8 py-10 rounded-xl shadow-2xl border border-gray-100 dark:border-zinc-800 w-full max-w-sm overflow-hidden text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">T-Bank Secure</h3>
              <p className="text-sm text-gray-500 mb-8">Подтвердите операцию покупки <strong>4 500 ₽</strong></p>

              <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 mb-6">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Код из СМС</p>
                <p className="text-2xl font-mono font-bold text-gray-800 tracking-widest animate-pulse">9 2 8 4</p>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-200">
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing State Overlay */}
      {(state === 'processing' || state === 'verifying') && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm transition-colors">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-gray-100 dark:border-zinc-800 max-w-xs w-full">
            <div className="w-16 h-16 relative mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-zinc-800"></div>
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
              <Loader2 className="absolute inset-0 w-full h-full p-4 text-cyan-500 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {state === 'processing' ? 'Обработка...' : 'Проверка...'}
            </h2>
            <p className="text-center text-sm text-gray-500 dark:text-zinc-500 leading-relaxed">
              {state === 'processing' ? 'Соединение с банком' : 'Подтверждение транзакции'}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentProcessScreen;
