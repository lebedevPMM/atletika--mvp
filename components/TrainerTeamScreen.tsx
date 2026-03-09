import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Phone, Search, Filter, MessageCircle } from 'lucide-react';

interface TrainerTeamScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerTeamScreen: React.FC<TrainerTeamScreenProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'shift'>('shift');

  const team = [
    { id: 1, name: 'Анна Морозова', role: 'Групповые программы', status: 'online', shift: '09:00 - 18:00', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
    { id: 2, name: 'Дмитрий Петров', role: 'Тренажерный зал', status: 'busy', shift: '12:00 - 21:00', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
    { id: 3, name: 'Елена Соколова', role: 'Врач', status: 'offline', shift: 'Выходной', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria' },
    { id: 4, name: 'Иван Кузнецов', role: 'Менеджер', status: 'online', shift: '10:00 - 19:00', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan' },
  ];

  const filteredTeam = filter === 'all' ? team : team.filter(m => m.status !== 'offline');

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Команда</h1>
        </div>
        <button className="p-2 bg-gray-100 rounded-full text-gray-600">
          <Search className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex-1">
        {/* Filter */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 mb-4">
           <button 
             onClick={() => setFilter('shift')}
             className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${filter === 'shift' ? 'bg-gray-900 text-white' : 'text-gray-500'}`}
           >
             В смене
           </button>
           <button 
             onClick={() => setFilter('all')}
             className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${filter === 'all' ? 'bg-gray-900 text-white' : 'text-gray-500'}`}
           >
             Все сотрудники
           </button>
        </div>

        <div className="space-y-3">
          {filteredTeam.map((member) => (
            <div key={member.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      member.status === 'online' ? 'bg-green-500' : member.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{member.name}</h4>
                    <p className="text-xs text-gray-500 mb-0.5">{member.role}</p>
                    <p className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded w-fit">{member.shift}</p>
                  </div>
               </div>
               
               <div className="flex gap-2">
                  <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100">
                    <Phone className="w-4 h-4" />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerTeamScreen;