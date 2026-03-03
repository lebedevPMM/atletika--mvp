
import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, CreditCard, Plus, Trash2, CheckCircle2, AlertCircle, Smartphone } from 'lucide-react';

interface PaymentMethodsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const PaymentMethodsScreen: React.FC<PaymentMethodsScreenProps> = ({ onNavigate }) => {
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [cards, setCards] = useState([
    { id: '1', type: 'visa', last4: '4242', brand: 'T-Bank' },
    { id: '2', type: 'mastercard', last4: '8832', brand: 'Sber' },
  ]);
  const [isOffline, setIsOffline] = useState(false); // Mock offline state

  const handleDeleteCard = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Удалить карту?')) {
      setCards(cards.filter(c => c.id !== id));
      if (selectedMethodId === id) setSelectedMethodId(null);
    }
  };

  const handlePay = () => {
    if (!selectedMethodId) return;

    if (selectedMethodId === 'sbp') {
      onNavigate('payment_sbp');
    } else {
      onNavigate('payment_process');
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-4 shadow-sm dark:shadow-lg border-b border-gray-100 dark:border-zinc-800 flex items-center gap-4 sticky top-0 z-10 transition-colors">
        <button onClick={() => onNavigate('profile')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-zinc-300" />
        </button>
        <h1 className="text-xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">Оплата</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-32">

        {/* Invoice Summary Card */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 mb-6 relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

          <div className="flex justify-between items-start mb-2 relative z-10">
            <div>
              <p className="text-xs text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-wide mb-1">К оплате</p>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">4 500 ₽</h2>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-500/20">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Счет #8392</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-zinc-400 font-medium leading-relaxed relative z-10">
            Абонемент "Безлимитный" (1 месяц)<br />
            <span className="text-xs text-gray-400 dark:text-zinc-500">Продление до 28.02.2024</span>
          </p>
        </div>

        {/* Offline Warning */}
        {isOffline && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-500/20 p-4 rounded-2xl flex items-center gap-3 mb-6 animate-pulse">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-xs font-bold text-red-600 dark:text-red-500">Нет соединения с интернетом</p>
          </div>
        )}

        {/* Card Selection */}
        <h3 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-3 ml-1">Способ оплаты</h3>

        <div className="space-y-3">

          {/* SBP Method */}
          <div
            onClick={() => setSelectedMethodId('sbp')}
            className={`w-full bg-white dark:bg-zinc-900 p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer active:scale-[0.99] group ${selectedMethodId === 'sbp'
                ? 'border-cyan-500 ring-2 ring-cyan-500 ring-offset-2 dark:ring-offset-zinc-950 shadow-md'
                : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
              }`}
          >
            <div className="flex items-center gap-4">
              {/* SBP Icon Placeholder */}
              <div className="w-12 h-8 bg-black/5 dark:bg-white/10 rounded overflow-hidden flex items-center justify-center">
                {/* Simple triangles logic for SBP logo approximation or just text */}
                <div className="relative w-6 h-6">
                  <div className="absolute top-0 left-0 w-3 h-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-bl from-blue-500 to-cyan-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-gradient-to-tl from-green-500 to-emerald-500 rounded-br-lg"></div>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">СБП (Быстрый платеж)</p>
                <p className="text-xs text-gray-500 dark:text-zinc-500">Без ввода данных карты</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedMethodId === 'sbp' ? 'border-cyan-500 bg-cyan-500' : 'border-gray-300 dark:border-zinc-700'}`}>
              {selectedMethodId === 'sbp' && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </div>

          {/* Saved Cards */}
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedMethodId(card.id)}
              className={`w-full bg-white dark:bg-zinc-900 p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer active:scale-[0.99] group ${selectedMethodId === card.id
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-950 shadow-md'
                  : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gray-100 dark:bg-zinc-800 rounded flex items-center justify-center border border-gray-200 dark:border-zinc-700">
                  <CreditCard className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {card.brand} •••• {card.last4}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-zinc-500">01/28</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => handleDeleteCard(e, card.id)}
                  className="p-2 text-gray-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedMethodId === card.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-zinc-700'}`}>
                  {selectedMethodId === card.id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <button
            disabled={isOffline}
            onClick={() => onNavigate('payment_card_add')}
            className="w-full bg-white dark:bg-zinc-900 p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800 flex items-center justify-center gap-2 text-gray-500 dark:text-zinc-500 hover:border-cyan-500 dark:hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950/10 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-800 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/30 flex items-center justify-center transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold">Добавить новую карту</span>
          </button>

        </div>

        {/* Security Note */}
        <div className="mt-8 flex items-center justify-center gap-2 opacity-50">
          <Smartphone className="w-3 h-3 text-gray-400 dark:text-zinc-600" />
          <p className="text-[10px] text-gray-400 dark:text-zinc-600 font-medium">Платежи защищены шифрованием уровня банка</p>
        </div>

      </div>

      {/* Footer */}
      <div className="p-4 bg-white/80 dark:bg-zinc-900/80 border-t border-gray-100 dark:border-zinc-800 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)] transition-colors">
        <button
          onClick={handlePay}
          disabled={!selectedMethodId || isOffline}
          className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-bold font-sans uppercase tracking-widest shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:shadow-none hover:bg-cyan-500 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {selectedMethodId ? 'Оплатить 4 500 ₽' : 'Выберите способ'}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodsScreen;
