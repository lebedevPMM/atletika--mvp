import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Users, Send, CheckCircle2 } from 'lucide-react';

interface TrainerBroadcastScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerBroadcastScreen: React.FC<TrainerBroadcastScreenProps> = ({ onNavigate }) => {
  const [audience, setAudience] = useState<'all' | 'group' | 'leads'>('all');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setMessage('');
        onNavigate('trainer_home');
      }, 2000);
    }
  };

  if (sent) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Рассылка отправлена</h2>
        <p className="text-gray-500 text-sm mt-2">Сообщение доставлено 12 получателям.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('trainer_home')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Рассылка</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-6">
           <label className="block text-xs font-bold text-gray-400 uppercase mb-3 ml-1">Получатели</label>
           <div className="space-y-2">
              <button 
                onClick={() => setAudience('all')}
                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${audience === 'all' ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span className="font-bold text-sm">Все активные клиенты</span>
                </div>
                <span className={`text-xs font-medium ${audience === 'all' ? 'text-blue-200' : 'text-gray-400'}`}>12 чел.</span>
              </button>

              <button 
                onClick={() => setAudience('group')}
                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${audience === 'group' ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span className="font-bold text-sm">Группа "Сила"</span>
                </div>
                <span className={`text-xs font-medium ${audience === 'group' ? 'text-blue-200' : 'text-gray-400'}`}>8 чел.</span>
              </button>
           </div>
        </div>

        <div>
           <label className="block text-xs font-bold text-gray-400 uppercase mb-3 ml-1">Сообщение</label>
           <textarea 
             value={message}
             onChange={(e) => setMessage(e.target.value)}
             className="w-full h-40 bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none placeholder:text-gray-400"
             placeholder="Напишите текст рассылки..."
           />
           <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
              <button onClick={() => setMessage('К сожалению, я заболел. Занятие отменяется.')} className="whitespace-nowrap px-3 py-1.5 bg-gray-200 rounded-lg text-xs font-bold text-gray-600">Я заболел</button>
              <button onClick={() => setMessage('Освободилось окно на сегодня в 19:00. Кто хочет?')} className="whitespace-nowrap px-3 py-1.5 bg-gray-200 rounded-lg text-xs font-bold text-gray-600">Свободное окно</button>
           </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
        <button 
          onClick={handleSend}
          disabled={!message}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" /> Отправить
        </button>
      </div>
    </div>
  );
};

export default TrainerBroadcastScreen;