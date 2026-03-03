import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Calendar, Check, Save } from 'lucide-react';

interface TrainerAvailabilityScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerAvailabilityScreen: React.FC<TrainerAvailabilityScreenProps> = ({ onNavigate }) => {
  const [activeDay, setActiveDay] = useState(0);
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  // Mock structure: 0 = unavailable, 1 = available, 2 = booked
  const [slots, setSlots] = useState([
    { time: '09:00', status: 1 },
    { time: '10:00', status: 2 },
    { time: '11:00', status: 1 },
    { time: '12:00', status: 0 },
    { time: '13:00', status: 0 },
    { time: '14:00', status: 1 },
    { time: '15:00', status: 1 },
    { time: '16:00', status: 1 },
    { time: '17:00', status: 2 },
    { time: '18:00', status: 2 },
    { time: '19:00', status: 1 },
    { time: '20:00', status: 0 },
  ]);

  const toggleSlot = (index: number) => {
    const s = slots[index];
    if (s.status === 2) return; // Cannot change booked slots
    const newSlots = [...slots];
    newSlots[index].status = s.status === 1 ? 0 : 1;
    setSlots(newSlots);
  };

  const getSlotStyle = (status: number) => {
    switch (status) {
      case 2: return 'bg-gray-100 text-gray-400 cursor-not-allowed border-transparent';
      case 1: return 'bg-green-500 text-white border-green-600 shadow-md shadow-green-200';
      default: return 'bg-white text-gray-400 border-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('trainer_settings')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Мой график</h1>
        </div>
        <button className="bg-gray-900 text-white p-2 rounded-lg shadow-sm">
          <Save className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white border-b border-gray-100 px-4 py-3 flex justify-between">
         {days.map((d, i) => (
           <button 
             key={d}
             onClick={() => setActiveDay(i)}
             className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
               activeDay === i 
                 ? 'bg-blue-600 text-white shadow-md' 
                 : 'bg-transparent text-gray-500 hover:bg-gray-50'
             }`}
           >
             {d}
           </button>
         ))}
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
         <div className="grid grid-cols-3 gap-3">
            {slots.map((slot, idx) => (
              <button
                key={idx}
                onClick={() => toggleSlot(idx)}
                disabled={slot.status === 2}
                className={`py-4 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${getSlotStyle(slot.status)}`}
              >
                {slot.time}
                {slot.status === 2 && <span className="block text-[10px] font-normal">Занято</span>}
              </button>
            ))}
         </div>

         <div className="mt-8 flex gap-4 justify-center">
            <div className="flex items-center gap-2 text-xs text-gray-500">
               <div className="w-3 h-3 bg-white border-2 border-gray-200 rounded-full"></div> Нет
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
               <div className="w-3 h-3 bg-green-500 rounded-full"></div> Доступно
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
               <div className="w-3 h-3 bg-gray-200 rounded-full"></div> Занято
            </div>
         </div>
      </div>
    </div>
  );
};

export default TrainerAvailabilityScreen;