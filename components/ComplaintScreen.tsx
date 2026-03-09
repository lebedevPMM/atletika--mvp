import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Send, Camera, AlertCircle, Dumbbell, Sparkles, User, HelpCircle, CheckCircle2 } from 'lucide-react';

interface ComplaintScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const ComplaintScreen: React.FC<ComplaintScreenProps> = ({ onNavigate }) => {
  const [category, setCategory] = useState('equipment');
  const [text, setText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const categories = [
    { id: 'equipment', label: 'Оборудование', icon: Dumbbell },
    { id: 'cleanliness', label: 'Чистота', icon: Sparkles },
    { id: 'staff', label: 'Персонал', icon: User },
    { id: 'other', label: 'Другое', icon: HelpCircle },
  ];

  const handleSubmit = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onNavigate('support');
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Send className="w-12 h-12 text-green-600 ml-1 mt-1" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Заявка принята</h2>
        <p className="text-gray-500 max-w-xs leading-relaxed">
          Спасибо за сигнал! Мы рассмотрим обращение в течение 24 часов. Статус можно отследить в чате.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Сообщить о проблеме</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800 leading-snug">
            Ваш отзыв помогает нам стать лучше. Опишите проблему максимально подробно.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Что случилось?</label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md ring-2 ring-blue-200 ring-offset-1' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                    <span className="text-sm font-bold">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Комментарий</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Например: Сломан тренажер для жима ногами в зоне свободных весов..."
              className="w-full h-32 bg-white border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-shadow font-medium"
            />
          </div>

          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Фото (по желанию)</label>
             <button className="w-full py-6 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-medium flex flex-col items-center justify-center gap-2 hover:bg-white hover:border-blue-300 hover:text-blue-500 transition-colors bg-gray-50/50">
               <Camera className="w-8 h-8 opacity-50" />
               <span className="text-xs">Нажмите, чтобы загрузить</span>
             </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
        <button 
          onClick={handleSubmit}
          disabled={!text}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Отправить заявку
        </button>
      </div>
    </div>
  );
};

export default ComplaintScreen;