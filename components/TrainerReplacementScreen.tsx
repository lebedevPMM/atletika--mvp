import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Calendar, Search, User, Check } from 'lucide-react';

interface TrainerReplacementScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerReplacementScreen: React.FC<TrainerReplacementScreenProps> = ({ onNavigate }) => {
  const [selectedShift, setSelectedShift] = useState<number | null>(null);
  
  const shifts = [
    { id: 1, date: '14 Сен, Сб', time: '09:00 - 15:00', role: 'Дежурство' },
    { id: 2, date: '15 Сен, Вс', time: '12:00 - 13:00', role: 'Групповая (Pump)' },
  ];

  const colleagues = [
    { id: 1, name: 'Дмитрий Петров', role: 'Тренажерный зал', available: true },
    { id: 2, name: 'Елена Соколова', role: 'Групповые', available: true },
    { id: 3, name: 'Иван Кузнецов', role: 'Тренажерный зал', available: false },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Найти замену</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {/* Step 1: Select Shift */}
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-1">1. Выберите смену</h2>
        <div className="space-y-3 mb-8">
           {shifts.map((shift) => (
             <div 
               key={shift.id} 
               onClick={() => setSelectedShift(shift.id)}
               className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                 selectedShift === shift.id 
                   ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' 
                   : 'bg-white border-gray-200 hover:border-blue-300'
               }`}
             >
                <div>
                  <p className="font-bold text-gray-900 text-sm">{shift.role}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Calendar className="w-3 h-3" /> {shift.date} • {shift.time}
                  </div>
                </div>
                {selectedShift === shift.id && <Check className="w-5 h-5 text-blue-600" />}
             </div>
           ))}
        </div>

        {/* Step 2: Select Colleague */}
        {selectedShift && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
             <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-1">2. Кому отправить запрос?</h2>
             <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                   <div className="relative">
                     <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                     <input type="text" placeholder="Поиск сотрудника..." className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-xs font-medium focus:outline-none" />
                   </div>
                </div>
                <div className="divide-y divide-gray-50">
                   <button className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">ALL</div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">Всем свободным</p>
                        <p className="text-xs text-gray-500">Рассылка уведомления</p>
                      </div>
                   </button>
                   {colleagues.map(c => (
                     <button key={c.id} disabled={!c.available} className={`w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 ${!c.available ? 'opacity-50' : ''}`}>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.role} {c.available ? '' : '• Занят'}</p>
                        </div>
                        {c.available && <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
        <button 
          disabled={!selectedShift}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
        >
          Отправить запрос
        </button>
      </div>
    </div>
  );
};

export default TrainerReplacementScreen;