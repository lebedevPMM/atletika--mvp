import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Heart, MessageCircle, MoreHorizontal, User, Image as ImageIcon, Calendar, Award } from 'lucide-react';

interface TrainerCommunityScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerCommunityScreen: React.FC<TrainerCommunityScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'events'>('feed');

  const posts = [
    {
      id: 1,
      author: 'HR Отдел',
      role: 'Администрация',
      time: '2 часа назад',
      text: 'Коллеги, поздравляем Дмитрия Петрова с получением квалификации "Мастер-Тренер"! 🎓 Желаем новых побед и довольных клиентов.',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
      likes: 24,
      comments: 5,
      isOfficial: true
    },
    {
      id: 2,
      author: 'Елена Соколова',
      role: 'Групповые программы',
      time: 'Сегодня, 10:30',
      text: 'Кто может подменить меня в субботу на ZUMBA в 12:00? С меня кофе и вкусняшка! ☕️🧁',
      image: null,
      likes: 3,
      comments: 2,
      isOfficial: false
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 pb-0 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Сообщество</h1>
        </div>

        <div className="flex border-b border-gray-100">
           <button 
             onClick={() => setActiveTab('feed')}
             className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'feed' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
           >
             Лента
           </button>
           <button 
             onClick={() => setActiveTab('events')}
             className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'events' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
           >
             События
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'feed' ? (
          <>
            {/* Create Post Input */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
               <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                 <User className="w-5 h-5" />
               </div>
               <div className="flex-1 bg-gray-50 rounded-xl px-4 py-2 text-sm text-gray-400 cursor-text">
                 Написать сообщение...
               </div>
               <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                 <ImageIcon className="w-5 h-5" />
               </button>
            </div>

            {/* Trainer of the Month */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
               <div className="relative z-10 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-white/20">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" alt="Winner" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Award className="w-4 h-4 text-white" />
                      <span className="text-xs font-bold uppercase tracking-wide">Тренер месяца</span>
                    </div>
                    <h3 className="font-bold text-lg leading-tight">Дмитрий Петров</h3>
                    <p className="text-xs opacity-90">За высокие показатели продаж</p>
                  </div>
               </div>
            </div>

            {/* Posts */}
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                          {/* Placeholder avatar logic */}
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {post.author[0]}
                          </div>
                       </div>
                       <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-gray-900">{post.author}</h3>
                            {post.isOfficial && <span className="bg-blue-100 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 rounded">OFFICIAL</span>}
                          </div>
                          <p className="text-xs text-gray-500">{post.role} • {post.time}</p>
                       </div>
                    </div>
                    <button className="text-gray-400">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                 </div>

                 <div className="px-4 pb-2 text-sm text-gray-800 leading-relaxed">
                   {post.text}
                 </div>

                 {post.image && (
                   <div className="mt-2 h-48 bg-gray-100">
                     <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
                   </div>
                 )}

                 <div className="p-4 flex items-center gap-6 border-t border-gray-50 mt-2">
                    <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </button>
                 </div>
              </div>
            ))}
          </>
        ) : (
          <div className="space-y-4">
             <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                <div className="w-16 h-16 bg-purple-50 rounded-xl flex flex-col items-center justify-center text-purple-600 border border-purple-100 shrink-0">
                   <span className="text-xs font-bold uppercase">Сен</span>
                   <span className="text-2xl font-extrabold leading-none">25</span>
                </div>
                <div>
                   <h3 className="font-bold text-gray-900 text-lg mb-1">Обучение по продажам</h3>
                   <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                     <Calendar className="w-3.5 h-3.5" /> 14:00 - 16:00
                   </div>
                   <button className="text-xs font-bold bg-gray-100 px-3 py-1.5 rounded-lg text-gray-600">Я пойду</button>
                </div>
             </div>

             <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                <div className="w-16 h-16 bg-green-50 rounded-xl flex flex-col items-center justify-center text-green-600 border border-green-100 shrink-0">
                   <span className="text-xs font-bold uppercase">Окт</span>
                   <span className="text-2xl font-extrabold leading-none">05</span>
                </div>
                <div>
                   <h3 className="font-bold text-gray-900 text-lg mb-1">Корпоративный выезд</h3>
                   <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                     <Calendar className="w-3.5 h-3.5" /> Весь день
                   </div>
                   <button className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-lg">Вы идете</button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerCommunityScreen;