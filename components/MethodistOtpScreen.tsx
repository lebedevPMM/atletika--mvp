import React, { useState, useEffect, useRef } from 'react';
import { ScreenName } from '../types';
import { CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

interface MethodistOtpScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const MethodistOtpScreen: React.FC<MethodistOtpScreenProps> = ({ onNavigate }) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length !== 4) {
      setError('Введите 4 цифры');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      if (fullCode === '0000') {
        setError('Неверный код');
      } else {
        onNavigate('methodist_select_club');
      }
    }, 1000);
  };

  const handleResend = () => {
    setTimer(30);
  };

  useEffect(() => {
    if (code.every(digit => digit !== '')) {
      handleVerify();
    }
  }, [code]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-white safe-area-top safe-area-bottom">
      <div className="w-full max-w-sm space-y-8">

        <div className="text-center">
          <div className="w-16 h-16 bg-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-purple-900/50">
            <span className="text-2xl font-bold tracking-tighter text-white">M+</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Atletika+ Метод</h1>
          <p className="text-gray-400">Код подтверждения</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

          <div className="flex items-center justify-between">
            <button onClick={() => onNavigate('methodist_login')} className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Изменить номер
            </button>
            <span className="text-sm font-mono text-gray-300">+7 999 ... 00-00</span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 text-center">Код из SMS</label>
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-14 h-16 bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-600'} rounded-xl text-center text-2xl font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all`}
                />
              ))}
            </div>
            {error && (
              <div className="flex items-center justify-center gap-2 text-red-400 text-xs mt-2 animate-pulse">
                <AlertCircle className="w-3 h-3" />
                {error}
              </div>
            )}
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading || code.some(c => !c)}
            className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Проверка...
              </>
            ) : (
              <>
                Войти <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center">
            {timer > 0 ? (
              <p className="text-xs text-gray-500">
                Отправить код повторно через <span className="font-mono text-gray-300">00:{timer.toString().padStart(2, '0')}</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-xs text-purple-400 hover:text-purple-300 font-bold transition-colors"
              >
                Отправить код повторно
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MethodistOtpScreen;
