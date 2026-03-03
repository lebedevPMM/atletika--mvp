import React from 'react';
import { ScreenName } from '../types';
import { XCircle, RefreshCw, MessageSquare, CreditCard, WifiOff, AlertTriangle } from 'lucide-react';

interface PaymentFailedScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const PaymentFailedScreen: React.FC<PaymentFailedScreenProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const isOffline = false; // Mock offline state

  // Mock Payment Context
  const paymentContext = {
    amount: 3900,
    currency: '₽',
    description: 'Продление абонемента "Безлимит"',
    error: 'Банк отклонил операцию (Недостаточно средств)',
    cardLast4: '4589'
  };

  const handleRetry = () => {
    if (isOffline) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Simulate success or redirect to process
      onNavigate('payment_process');
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in shake duration-300 relative">
      <button
        onClick={() => onNavigate('invoice')} // Back to context (e.g. invoice)
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 font-bold text-sm"
      >
        Закрыть
      </button>

      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 mx-auto">
        {isOffline ? (
          <WifiOff className="w-12 h-12 text-gray-400" />
        ) : (
          <XCircle className="w-12 h-12 text-red-600" />
        )}
      </div>

      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
        {isOffline ? 'Нет соединения' : 'Ошибка оплаты'}
      </h1>
      <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
        {isOffline
          ? 'Проверьте настройки сети и попробуйте снова.'
          : paymentContext.error}
      </p>

      {/* Payment Context Card */}
      <div className="bg-gray-50 p-4 rounded-2xl w-full max-w-xs mb-8 border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 font-medium">Сумма</span>
          <span className="text-lg font-bold text-gray-900">{paymentContext.amount.toLocaleString()} {paymentContext.currency}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Карта</span>
          <div className="flex items-center gap-1.5 font-mono text-gray-700">
            <CreditCard className="w-3 h-3" /> •••• {paymentContext.cardLast4}
          </div>
        </div>
      </div>

      <div className="w-full space-y-3 max-w-sm">
        <button
          disabled={isLoading}
          onClick={handleRetry}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
        >
          {isLoading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          {isLoading ? 'Обработка...' : 'Попробовать снова'}
        </button>

        <button
          disabled={isLoading || isOffline}
          onClick={() => onNavigate('payment_methods')}
          className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Сменить способ оплаты
        </button>

        <button
          onClick={() => onNavigate('support')}
          className="w-full text-blue-600 py-2 font-medium text-sm flex items-center justify-center gap-2 mt-4"
        >
          <MessageSquare className="w-4 h-4" />
          Написать в поддержку
        </button>
      </div>
    </div>
  );
};

export default PaymentFailedScreen;