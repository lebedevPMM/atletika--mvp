import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Phone, MessageSquare, CheckCircle2, Circle, Clock, User, Calendar } from 'lucide-react';

interface TrainerLeadDetailsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerLeadDetailsScreen: React.FC<TrainerLeadDetailsScreenProps> = ({ onNavigate }) => {
  const [status, setStatus] = useState<'new' | 'contacted' | 'meeting' | 'sold'>('contacted');

  const steps = [
    { id: 'new', label: 'Новый' },
    { id: 'contacted', label: 'Звонок' },
    { id: 'meeting', label: 'Встреча' },
    { id: 'sold', label: 'Продажа' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('trainer_tasks')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Карточка лида</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {/* Profile */}
        <div className="flex items-center gap-4 mb-6">
           <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">
             AK
           </div>
           <div>
             <h2 className="text-2xl font-bold text-gray-900">Анна К.</h2>
             <p className="text-sm text-gray-500">+7 (999) 123-45-67</p>
             <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold uppercase mt-1 inline-block">Интерес: ПТ</span>
           </div>
        </div>

        {/* Pipeline Status */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
           <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 ml-1">Статус сделки</h3>
           <div className="flex justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
              {steps.map((step, idx) => {
                const isActive = step.id === status;
                const isPassed = steps.findIndex(s => s.id === status) >= idx;
                
                return (
                  <div key={step.id} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setStatus(step.id as any)}>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                       isActive ? 'bg-blue-600 border-blue-600 text-white' :
                       isPassed ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-gray-200 text-gray-300'
                     }`}>
                       {isPassed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                     </div>
                     <span className={`text-[10px] font-bold ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{step.label}</span>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Notes / History */}
        <div className="space-y-4">
           <h3 className="text-xs font-bold text-gray-400 uppercase ml-1">История взаимодействия</h3>
           
           <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                 <Clock className="w-3 h-3" /> Сегодня, 10:30
              </div>
              <p className="text-sm text-gray-900 font-medium">Исходящий звонок</p>
              <p className="text-xs text-gray-500 mt-1">Клиент просил перезвонить после 18:00. Интересуется блоком из 10 тренировок.</p>
           </div>

           <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm opacity-70">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                 <User className="w-3 h-3" /> Вчера, 14:00
              </div>
              <p className="text-sm text-gray-900 font-medium">Новый лид</p>
              <p className="text-xs text-gray-500 mt-1">Заявка с сайта. Источник: Instagram.</p>
           </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-white border-t border-gray-100 p-4 safe-area-bottom grid grid-cols-2 gap-3">
         <button className="flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
           <MessageSquare className="w-4 h-4" /> WhatsApp
         </button>
         <button className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors shadow-lg shadow-green-200">
           <Phone className="w-4 h-4" /> Позвонить
         </button>
      </div>
    </div>
  );
};

export default TrainerLeadDetailsScreen;