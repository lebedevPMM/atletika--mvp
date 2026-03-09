import React from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Bell, Calendar, DollarSign, Info } from 'lucide-react';

interface TrainerNotificationsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerNotificationsScreen: React.FC<TrainerNotificationsScreenProps> = ({ onNavigate }) => {
  const notifications = [
    { id: 1, type: 'booking', title: 'Новая запись', msg: 'Мария Иванова записалась на ПТ завтра в 10:00.', time: '10 мин назад' },
    { id: 2, type: 'finance', title: 'Выплата', msg: 'Вам начислено 15 000 ₽ за период 1-7 Сентября.', time: '2 часа назад' },
    { id: 3, type: 'system', title: 'Обновление', msg: 'В зале №2 проводится ремонт кондиционера.', time: 'Вчера' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'finance': return <DollarSign className="w-5 h-5 text-green-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-blue-50';
      case 'finance': return 'bg-green-50';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Уведомления</h1>
      </div>

      <div className="p-4 space-y-3">
        {notifications.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
             <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getBg(item.type)}`}>
               {getIcon(item.type)}
             </div>
             <div>
               <div className="flex justify-between items-start mb-1">
                 <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
                 <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{item.time}</span>
               </div>
               <p className="text-xs text-gray-500 leading-relaxed">{item.msg}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerNotificationsScreen;