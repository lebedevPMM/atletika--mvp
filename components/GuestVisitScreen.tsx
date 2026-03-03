import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, UserPlus, Calendar, Share2, Copy, CheckCircle2 } from 'lucide-react';

interface GuestVisitScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const GuestVisitScreen: React.FC<GuestVisitScreenProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    if (name && phone && date) {
      setStep('success');
    }
  };

  if (step === 'success') {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Приглашение создано!</h2>
        <p className="text-gray-500 mb-8 max-w-xs">
          Мы отправили SMS с кодом доступа для {name}.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 w-full mb-6 flex items-center justify-between">
           <span className="font-mono font-bold text-lg text-gray-900 tracking-widest">GUEST-8392</span>
           <button className="text-blue-600 font-medium text-sm">
             <Copy className="w-5 h-5" />
           </button>
        </div>

        <button 
          onClick={() => onNavigate('profile')}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold"
        >
          Вернуться в профиль
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('profile')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Гостевой визит</h1>
      </div>

      <div className="p-4 flex-1">
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg mb-6 relative overflow-hidden">
           <UserPlus className="absolute -right-4 -top-4 w-32 h-32 text-white/10 rotate-12" />
           <h2 className="text-lg font-bold mb-1">Приведи друга</h2>
           <p className="text-blue-100 text-sm mb-4 max-w-[80%]">
             Ваш тариф включает 3 гостевых визита в месяц. Друг получит доступ ко всем зонам клуба.
           </p>
           <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold border border-white/30">
             Осталось: 2 из 3
           </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
           <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Имя гостя</label>
             <input 
               type="text" 
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="Иван Петров"
               className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
             />
           </div>

           <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Телефон</label>
             <input 
               type="tel" 
               value={phone}
               onChange={(e) => setPhone(e.target.value)}
               placeholder="+7 (999) 000-00-00"
               className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
             />
           </div>

           <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Дата визита</label>
             <div className="relative">
               <input 
                 type="date" 
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
               />
               <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
             </div>
           </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
        <button 
          onClick={handleSubmit}
          disabled={!name || !phone || !date}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Создать приглашение
        </button>
      </div>
    </div>
  );
};

export default GuestVisitScreen;