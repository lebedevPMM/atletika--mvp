import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Plus, Search, Tag, Calendar, Edit2 } from 'lucide-react';

interface TrainerClientNotesScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerClientNotesScreen: React.FC<TrainerClientNotesScreenProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const notes = [
    { id: 1, date: '12 Сен 2024', tag: 'Здоровье', text: 'Жалоба на боль в правом колене при выпадах. Исключить осевую нагрузку на неделю.', color: 'red' },
    { id: 2, date: '05 Сен 2024', tag: 'План', text: 'Увеличили рабочие веса в жиме ногами (+10кг). Техника стабильная.', color: 'blue' },
    { id: 3, date: '28 Авг 2024', tag: 'Общее', text: 'Клиент опоздал на 15 минут. Провели укороченную разминку.', color: 'gray' },
  ];

  const filteredNotes = notes.filter(n => n.text.toLowerCase().includes(searchTerm.toLowerCase()));

  const getTagStyle = (color: string) => {
    switch(color) {
      case 'red': return 'bg-red-50 text-red-700 border-red-100';
      case 'blue': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => onNavigate('trainer_client_profile')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">Заметки</h1>
            <p className="text-xs text-gray-500">Мария Иванова</p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Поиск по заметкам..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative group">
             <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTagStyle(note.color)} uppercase tracking-wide`}>
                  {note.tag}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {note.date}
                </span>
             </div>
             <p className="text-sm text-gray-800 leading-relaxed font-medium">
               {note.text}
             </p>
             <button className="absolute top-2 right-2 p-2 text-gray-300 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100">
               <Edit2 className="w-4 h-4" />
             </button>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
        <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]">
          <Plus className="w-5 h-5" /> Добавить заметку
        </button>
      </div>
    </div>
  );
};

export default TrainerClientNotesScreen;