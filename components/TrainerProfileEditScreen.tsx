import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Save, Camera, X, Plus } from 'lucide-react';

interface TrainerProfileEditScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerProfileEditScreen: React.FC<TrainerProfileEditScreenProps> = ({ onNavigate }) => {
  const [bio, setBio] = useState('Сертифицированный тренер международной категории. Помогаю достичь цели без вреда для здоровья.');
  const [tags, setTags] = useState(['Силовой тренинг', 'CrossFit', 'Реабилитация']);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Мой профиль</h1>
        </div>
        <button 
          onClick={() => onNavigate('trainer_home')}
          className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1"
        >
          <Save className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {/* Photos */}
        <div className="mb-6">
           <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 block ml-1">Фото профиля</label>
           <div className="flex gap-4">
              <div className="w-24 h-24 rounded-2xl bg-gray-200 overflow-hidden relative group">
                 <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" alt="Profile" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Camera className="w-6 h-6 text-white" />
                 </div>
              </div>
              <button className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors bg-white">
                 <Plus className="w-6 h-6 mb-1" />
                 <span className="text-[10px] font-bold">Добавить</span>
              </button>
           </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
           <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 block ml-1">О себе</label>
           <textarea 
             className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[120px] resize-none"
             value={bio}
             onChange={(e) => setBio(e.target.value)}
           />
        </div>

        {/* Specialties */}
        <div className="mb-6">
           <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 block ml-1">Специализация</label>
           <div className="flex flex-wrap gap-2 mb-3">
             {tags.map((tag) => (
               <div key={tag} className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium text-gray-700">
                 {tag}
                 <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500">
                   <X className="w-3.5 h-3.5" />
                 </button>
               </div>
             ))}
           </div>
           <div className="flex gap-2">
             <input 
               type="text" 
               value={newTag}
               onChange={(e) => setNewTag(e.target.value)}
               placeholder="Добавить тег..."
               className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
               onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
             />
             <button 
               onClick={handleAddTag}
               className="bg-gray-900 text-white px-4 rounded-xl shadow-md active:scale-95 transition-transform"
             >
               <Plus className="w-5 h-5" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfileEditScreen;