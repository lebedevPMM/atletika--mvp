import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Search, Filter, Dumbbell, Play, Plus } from 'lucide-react';

interface TrainerExerciseLibraryScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerExerciseLibraryScreen: React.FC<TrainerExerciseLibraryScreenProps> = ({ onNavigate }) => {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedCount, setSelectedCount] = useState(0);

  const categories = [
    { id: 'all', label: 'Все' },
    { id: 'legs', label: 'Ноги' },
    { id: 'chest', label: 'Грудь' },
    { id: 'back', label: 'Спина' },
    { id: 'abs', label: 'Пресс' },
  ];

  const exercises = [
    { id: 1, name: 'Приседания со штангой', cat: 'legs', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=200&auto=format&fit=crop' },
    { id: 2, name: 'Жим лежа', cat: 'chest', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200&auto=format&fit=crop' },
    { id: 3, name: 'Тяга верхнего блока', cat: 'back', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop' },
    { id: 4, name: 'Выпады с гантелями', cat: 'legs', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop' },
    { id: 5, name: 'Планка', cat: 'abs', img: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?q=80&w=200&auto=format&fit=crop' },
  ];

  const filtered = exercises.filter(ex => 
    (category === 'all' || ex.cat === category) && 
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = () => {
    setSelectedCount(prev => prev + 1);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Библиотека</h1>
        </div>

        <div className="flex gap-2 mb-4">
           <div className="relative flex-1">
             <input 
               type="text" 
               placeholder="Поиск упражнения..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
             />
             <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
           </div>
           <button className="p-2.5 bg-gray-100 rounded-xl text-gray-600">
             <Filter className="w-5 h-5" />
           </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
           {categories.map((cat) => (
             <button 
               key={cat.id}
               onClick={() => setCategory(cat.id)}
               className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                 category === cat.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
               }`}
             >
               {cat.label}
             </button>
           ))}
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-3 pb-24">
         {filtered.map((ex) => (
           <div key={ex.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-[0.99] transition-transform">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden shrink-0 relative">
                    <img src={ex.img} className="w-full h-full object-cover" alt={ex.name} />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Play className="w-6 h-6 text-white fill-current" />
                    </div>
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{ex.name}</h3>
                    <div className="flex gap-2">
                       <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase font-bold tracking-wide">{ex.cat}</span>
                    </div>
                 </div>
              </div>
              <button 
                onClick={toggleSelect}
                className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
           </div>
         ))}
      </div>

      {selectedCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 safe-area-bottom">
           <button 
             onClick={() => onNavigate('trainer_client_plan')}
             className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
           >
             Добавить {selectedCount} упр.
           </button>
        </div>
      )}
    </div>
  );
};

export default TrainerExerciseLibraryScreen;