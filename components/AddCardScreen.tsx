import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, CreditCard, Lock, ScanLine, CheckCircle2, Eye, EyeOff, WifiOff } from 'lucide-react';

interface AddCardScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const AddCardScreen: React.FC<AddCardScreenProps> = ({ onNavigate }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [holder, setHolder] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const isOffline = false; // Mock offline state

  // Formatter for card number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substr(i, 4));
    }
    if (parts.length > 4) return;
    setCardNumber(parts.join(' '));
  };

  // Formatter for expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      v = v.substr(0, 2) + '/' + v.substr(2, 2);
    }
    if (v.length > 5) return;
    setExpiry(v);
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onNavigate('payment_methods');
      }, 1500);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Карта добавлена</h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('payment_methods')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Новая карта</h1>
      </div>

      <div className="p-4 space-y-8 flex-1 overflow-y-auto">

        {/* Offline Banner */}
        {isOffline && (
          <div className="bg-gray-900 text-white px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold animate-in slide-in-from-top-2">
            <WifiOff className="w-4 h-4" />
            <span className="opacity-90">Нет сети. Привязка карты недоступна.</span>
          </div>
        )}

        {/* Visual Card Container */}
        <div className="perspective-1000 w-full aspect-[1.586] relative group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
          <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

            {/* Front */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-xl p-6 text-white backface-hidden flex flex-col justify-between overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

              <div className="relative z-10 flex justify-between items-start">
                <div className="w-12 h-8 bg-yellow-500/90 rounded flex items-center justify-center shadow-sm">
                  <div className="w-8 h-5 border border-black/20 rounded-sm"></div>
                </div>
                <CreditCard className="w-6 h-6 text-white/70" />
              </div>

              <div className="relative z-10">
                <p className="font-mono text-xl tracking-widest drop-shadow-md mb-6">
                  {cardNumber || '•••• •••• •••• ••••'}
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">Card Holder</p>
                    <p className="font-medium tracking-wide uppercase text-sm truncate max-w-[180px]">
                      {holder || 'YOUR NAME'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5 text-right">Expires</p>
                    <p className="font-medium tracking-wide text-sm">
                      {expiry || 'MM/YY'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 bg-gradient-to-bl from-gray-800 to-gray-900 rounded-2xl shadow-xl text-white backface-hidden rotate-y-180 border border-white/10 overflow-hidden">
              <div className="w-full h-12 bg-black mt-6 opacity-80"></div>
              <div className="p-6 pt-4">
                <div className="flex justify-end">
                  <div className="bg-white text-gray-900 px-3 py-1.5 rounded text-sm font-mono font-bold w-12 text-center">
                    {cvc || '•••'}
                  </div>
                </div>
                <p className="text-[9px] text-gray-400 mt-2 text-right">CVV/CVC code</p>
                <div className="mt-8 flex items-center gap-2 opacity-50 justify-center">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs">Secure Connection</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Номер карты</label>
            <div className="relative">
              <input
                type="tel"
                value={cardNumber}
                onChange={handleCardNumberChange}
                onFocus={() => setIsFlipped(false)}
                placeholder="0000 0000 0000 0000"
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-4 pr-12 font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              <ScanLine className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Срок действия</label>
              <input
                type="tel"
                value={expiry}
                onChange={handleExpiryChange}
                onFocus={() => setIsFlipped(false)}
                placeholder="MM/YY"
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">CVV / CVC</label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={3}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                  onFocus={() => setIsFlipped(true)}
                  onBlur={() => setIsFlipped(false)}
                  placeholder="123"
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                <Lock className="absolute right-4 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Имя владельца</label>
            <input
              type="text"
              value={holder}
              onChange={(e) => setHolder(e.target.value.toUpperCase())}
              onFocus={() => setIsFlipped(false)}
              placeholder="IVAN IVANOV"
              className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 uppercase transition-all"
            />
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-xl border border-gray-200">
          <Lock className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            Мы спишем 1 ₽ для проверки карты и вернем его моментально.
          </p>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
        <button
          onClick={handleSave}
          disabled={cardNumber.length < 19 || expiry.length < 5 || cvc.length < 3 || isOffline}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {isLoading ? 'Проверка...' : 'Привязать карту'}
        </button>
      </div>
    </div>
  );
};

export default AddCardScreen;