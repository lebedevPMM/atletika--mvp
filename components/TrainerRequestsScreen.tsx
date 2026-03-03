import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Check, X, Clock, Calendar, User, MessageSquare } from 'lucide-react';

interface TrainerRequestsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerRequestsScreen: React.FC<TrainerRequestsScreenProps> = ({ onNavigate }) => {
  const [requests, setRequests] = useState([
    { id: 1, client: 'Новый Клиент', service: 'Персональная тренировка', date: 'Завтра, 14 Сен', time: '10:00', comment: 'Хочу начать с базы. Раньше не занимался.', status: 'pending' },
    { id: 2, client: 'Мария Иванова', service: 'Сплит-тренировка', date: '15 Сен, Вс', time: '12:00', comment: 'Буду с подругой', status: 'pending' },
  ]);

  const handleAction = (id: number, action: 'accept' | 'decline') => {
    setRequests(requests.filter(r => r.id !== id));
    // Toast logic would go here
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('trainer_home')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Заявки ({requests.length})</h1>
      </div>

      <div className="p-4 space-y-4">
        {requests.length > 0 ? (
          requests.map((req) => (
            <div key={req.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
               
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{req.client}</h3>
                    <p className="text-sm text-gray-500">{req.service}</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <User className="w-5 h-5" />
                  </div>
               </div>

               <div className="flex items-center gap-4 mb-4 text-sm text-gray-700">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-400" /> {req.date}
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-400" /> {req.time}
                  </div>
               </div>

               {req.comment && (
                 <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-600 italic mb-6 flex gap-2">
                   <MessageSquare className="w-4 h-4 shrink-0 opacity-50" />
                   "{req.comment}"
                 </div>
               )}

               <div className="flex gap-3">
                  <button 
                    onClick={() => handleAction(req.id, 'decline')}
                    className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                  >
                    <X className="w-4 h-4" /> Отклонить
                  </button>
                  <button 
                    onClick={() => handleAction(req.id, 'accept')}
                    className="flex-[2] py-3 bg-gray-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg active:scale-95"
                  >
                    <Check className="w-4 h-4" /> Принять
                  </button>
               </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-400">
             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
               <Check className="w-10 h-10 text-gray-300" />
             </div>
             <h3 className="text-lg font-bold text-gray-900">Нет новых заявок</h3>
             <p className="text-sm">Все запросы обработаны. Хорошей работы!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerRequestsScreen;