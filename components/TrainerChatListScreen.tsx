import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Search, MessageSquare, Check, CheckCheck } from 'lucide-react';

interface TrainerChatListScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerChatListScreen: React.FC<TrainerChatListScreenProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'clients' | 'leads'>('all');

  const chats = [
    { id: 1, name: 'Мария Иванова', msg: 'Спасибо за тренировку!', time: '10:00', unread: 2, type: 'clients', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
    { id: 2, name: 'Иван Петров', msg: 'Завтра в 19:00?', time: 'Вчера', unread: 0, type: 'clients', status: 'read', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan' },
    { id: 3, name: 'Новый Пользователь', msg: 'Здравствуйте, сколько стоит блок?', time: '10 Сен', unread: 1, type: 'leads', img: null },
  ];

  const filtered = chats.filter(c => filter === 'all' || c.type === filter);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 pb-2 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => onNavigate('trainer_home')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Сообщения</h1>
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2">
           <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>Все</button>
           <button onClick={() => setFilter('clients')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filter === 'clients' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>Клиенты</button>
           <button onClick={() => setFilter('leads')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filter === 'leads' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>Лиды</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
         {filtered.map((chat) => (
           <div 
             key={chat.id} 
             onClick={() => onNavigate('chat_room')}
             className="bg-white p-3 rounded-2xl mb-2 flex items-center gap-4 active:scale-[0.99] transition-transform"
           >
              <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden shrink-0">
                 {chat.img ? (
                   <img src={chat.img} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 font-bold">?</div>
                 )}
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex justify-between mb-1">
                    <h3 className="font-bold text-sm text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{chat.time}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <p className={`text-sm truncate pr-2 ${chat.unread ? 'font-bold text-gray-900' : 'text-gray-500'}`}>{chat.msg}</p>
                    {chat.unread > 0 ? (
                      <div className="bg-blue-600 text-white text-[10px] font-bold px-1.5 min-w-[20px] h-5 rounded-full flex items-center justify-center">{chat.unread}</div>
                    ) : (
                      chat.status === 'read' && <CheckCheck className="w-4 h-4 text-blue-400" />
                    )}
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default TrainerChatListScreen;