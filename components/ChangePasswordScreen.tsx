import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ChangePasswordScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1); // 1: Old, 2: New, 3: Confirm, 4: Success
  const [pin, setPin] = useState('');
  
  const handleDigit = (digit: number) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      
      if (newPin.length === 4) {
        setTimeout(() => {
          setPin('');
          if (step < 3) {
            setStep(step + 1);
          } else {
            setStep(4);
          }
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  if (step === 4) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Код изменен</h2>
        <p className="text-gray-500 mb-8">Используйте новый код для входа в приложение.</p>
        <button 
          onClick={() => onNavigate('settings')}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold"
        >
          Вернуться в настройки
        </button>
      </div>
    );
  }

  const getTitle = () => {
    switch (step) {
      case 1: return 'Введите текущий код';
      case 2: return 'Придумайте новый код';
      case 3: return 'Повторите новый код';
      default: return '';
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="p-4 shadow-sm flex items-center gap-4">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Безопасность</h1>
      </div>

      <div className="flex-1 flex flex-col items-center pt-12">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-500">
          <Lock className="w-6 h-6" />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-8 animate-in fade-in slide-in-from-bottom-2" key={step}>
          {getTitle()}
        </h2>

        {/* PIN Dots */}
        <div className="flex gap-4 mb-12">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                i < pin.length ? 'bg-blue-600 scale-110' : 'bg-gray-200'
              }`}
            ></div>
          ))}
        </div>

        {/* Numpad */}
        <div className="w-full max-w-xs grid grid-cols-3 gap-y-4 gap-x-8 px-6 mt-auto mb-12">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="h-20 w-20 rounded-full bg-gray-50 text-2xl font-bold text-gray-900 hover:bg-gray-100 active:bg-blue-50 active:text-blue-600 transition-colors flex items-center justify-center mx-auto"
            >
              {digit}
            </button>
          ))}
          <div className="h-20 w-20"></div> {/* Spacer */}
          <button
            onClick={() => handleDigit(0)}
            className="h-20 w-20 rounded-full bg-gray-50 text-2xl font-bold text-gray-900 hover:bg-gray-100 active:bg-blue-50 active:text-blue-600 transition-colors flex items-center justify-center mx-auto"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-20 w-20 rounded-full flex items-center justify-center mx-auto text-gray-400 hover:text-gray-600 active:text-red-500 transition-colors"
          >
            <ArrowLeft className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordScreen;