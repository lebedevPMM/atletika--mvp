
import React, { useState } from 'react';
import { ScreenName } from '../types';
import { Search, PenSquare, ShieldCheck, Check, CheckCheck } from 'lucide-react';

interface ChatListScreenProps {
  onNavigate: (screen: ScreenName) => void;
  embedded?: boolean;
}

const ChatListScreen: React.FC<ChatListScreenProps> = ({ onNavigate, embedded = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const onlineCoaches = [
    { id: 101, name: 'Анна', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
    { id: 102, name: 'Макс', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max' },
    { id: 103, name: 'Ольга', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga' },
    { id: 104, name: 'Иван', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan' },
  ];

  const chats = [
    {
      id: 1,
      name: 'Поддержка клуба',
      lastMessage: 'Ваше обращение #1234 закрыто.',
      time: '14:30',
      unread: 0,
      isSupport: true,
      avatar: null,
      pinned: true,
      status: 'read'
    },
    {
      id: 2,
      name: 'Алексей Смирнов',
      role: 'Тренер',
      lastMessage: 'печатает...',
      isTyping: true,
      time: '18:45',
      unread: 2,
      isSupport: false,
      online: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      status: 'received'
    },
    {
      id: 3,
      name: 'Мария Иванова',
      role: 'Йога',
      lastMessage: 'Не забудь взять коврик, если есть свой. До встречи на занятии!',
      time: 'Вчера',
      unread: 0,
      isSupport: false,
      online: false,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      status: 'read'
    },
    {
      id: 4,
      name: 'Администратор SPA',
      role: 'Сервис',
      lastMessage: 'Вы записаны на массаж 12.09 в 19:00',
      time: '10 Сен',
      unread: 0,
      isSupport: false,
      online: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      status: 'sent'
    },
  ];

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen pb-24 flex flex-col transition-colors duration-300">
      {/* Header */}
      {!embedded && (
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-4 shadow-sm dark:shadow-lg border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-10 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Сообщения</h1>
            <button className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-400 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-zinc-700">
              <PenSquare className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 dark:bg-zinc-950 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {/* Stories / Online */}
        <div className="pt-4 pb-2">
          <h2 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wide px-4 mb-3">Сейчас онлайн</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-4">
            {onlineCoaches.map((coach) => (
              <div key={coach.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full p-0.5 border-2 border-green-500/50 group-hover:border-green-400 transition-colors">
                    <img src={coach.img} className="w-full h-full rounded-full object-cover border border-white dark:border-zinc-900" alt={coach.name} />
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></div>
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{coach.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="bg-white dark:bg-zinc-900/50 rounded-t-3xl min-h-full p-2 border-t border-gray-100 dark:border-zinc-800/50 transition-colors">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onNavigate('chat_room')}
              className={`w-full p-3 rounded-2xl flex items-center gap-4 transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-[0.99] ${chat.pinned ? 'bg-cyan-50 dark:bg-cyan-950/10 mb-1 border border-cyan-100 dark:border-cyan-900/20' : ''
                }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                {chat.isSupport ? (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-white shadow-lg shadow-cyan-900/20 border border-cyan-500/30">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden ring-1 ring-gray-100 dark:ring-zinc-700">
                    <img src={chat.avatar || ''} alt={chat.name} className="w-full h-full object-cover" />
                  </div>
                )}

                {!chat.isSupport && chat.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 text-left border-b border-gray-100 dark:border-zinc-800/50 pb-3 group-last:border-0 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate text-base">{chat.name}</h3>
                    {chat.pinned && <div className="bg-cyan-100 dark:bg-cyan-500/10 p-0.5 rounded text-cyan-600 dark:text-cyan-400"><ShieldCheck className="w-3 h-3" /></div>}
                  </div>
                  <span className={`text-xs whitespace-nowrap font-medium ${chat.unread > 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-400 dark:text-zinc-500'}`}>{chat.time}</span>
                </div>

                <div className="flex justify-between items-center">
                  <p className={`text-sm truncate pr-4 leading-snug flex-1 ${chat.isTyping ? 'text-cyan-600 dark:text-cyan-400 italic' : chat.unread > 0 ? 'text-gray-800 dark:text-zinc-200 font-semibold' : 'text-gray-500 dark:text-zinc-500'}`}>
                    {chat.isTyping ? 'Печатает...' : chat.lastMessage}
                  </p>

                  {chat.unread > 0 ? (
                    <div className="min-w-[20px] h-5 bg-cyan-500 rounded-full flex items-center justify-center px-1.5 shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                      <span className="text-[10px] font-bold text-white dark:text-cyan-950">{chat.unread}</span>
                    </div>
                  ) : (
                    !chat.isSupport && (
                      chat.status === 'read' ? <CheckCheck className="w-4 h-4 text-cyan-500 shrink-0" /> :
                        chat.status === 'sent' ? <Check className="w-4 h-4 text-gray-400 dark:text-zinc-600 shrink-0" /> : null
                    )
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatListScreen;