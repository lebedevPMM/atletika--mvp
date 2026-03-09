import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Search, BookOpen, Video, FileText, ChevronRight, Play } from 'lucide-react';

interface TrainerKnowledgeBaseScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerKnowledgeBaseScreen: React.FC<TrainerKnowledgeBaseScreenProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 1, title: 'Скрипты продаж', count: 5, icon: FileText, color: 'bg-green-100 text-green-600' },
    { id: 2, title: 'Методики тренировок', count: 12, icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
    { id: 3, title: 'Видео-инструкции', count: 8, icon: Video, color: 'bg-red-100 text-red-600' },
  ];

  const recent = [
    { id: 1, title: 'Работа с возражениями: "Дорого"', type: 'pdf', read: false },
    { id: 2, title: 'Обзор линейки Technogym Excite', type: 'video', read: true },
    { id: 3, title: 'Регламент проведения вводного инструктажа', type: 'doc', read: true },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">База знаний</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Поиск материалов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-1">Категории</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
           {categories.map(cat => (
             <button key={cat.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-left active:scale-[0.98] transition-transform">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${cat.color}`}>
                  <cat.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{cat.title}</h3>
                <p className="text-xs text-gray-500">{cat.count} материалов</p>
             </button>
           ))}
        </div>

        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-1">Недавние</h2>
        <div className="space-y-3">
           {recent.map(item => (
             <button key={item.id} className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between active:bg-gray-50">
                <div className="flex items-center gap-3 overflow-hidden">
                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.type === 'video' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                     {item.type === 'video' ? <Play className="w-4 h-4 fill-current" /> : <FileText className="w-5 h-5" />}
                   </div>
                   <div className="text-left min-w-0">
                     <h4 className={`text-sm font-bold truncate ${item.read ? 'text-gray-600' : 'text-gray-900'}`}>{item.title}</h4>
                     {!item.read && <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">Новое</span>}
                   </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerKnowledgeBaseScreen;