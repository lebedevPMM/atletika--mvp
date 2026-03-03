import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Plus, X, ShieldAlert, FileHeart, Stethoscope } from 'lucide-react';

interface ContraindicationsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const ContraindicationsScreen: React.FC<ContraindicationsScreenProps> = ({ onNavigate }) => {
  const [conditions, setConditions] = useState([
    { id: 1, title: 'Грыжа межпозвоночного диска L5-S1', type: 'injury' },
    { id: 2, title: 'Сезонная аллергия', type: 'chronic' },
    { id: 3, title: 'Травма колена (2022)', type: 'injury' }
  ]);
  const [newCondition, setNewCondition] = useState('');

  const handleAdd = () => {
    if (newCondition.trim()) {
      setConditions([...conditions, { id: Date.now(), title: newCondition, type: 'other' }]);
      setNewCondition('');
    }
  };

  const handleRemove = (id: number) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('profile')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Медицинская карта</h1>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Privacy Alert */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-100 flex gap-4 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
          <ShieldAlert className="w-8 h-8 text-red-500 shrink-0" />
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Важно для безопасности</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Эта информация видна только вашему тренеру. Укажите все травмы и ограничения, чтобы мы могли адаптировать нагрузку.
            </p>
          </div>
        </div>

        {/* List */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
             <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
               <Stethoscope className="w-4 h-4 text-gray-400" /> Активные записи
             </h2>
             <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">{conditions.length}</span>
          </div>
          
          <div className="space-y-3">
            {conditions.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group transition-all hover:border-blue-200">
                 <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.type === 'injury' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                    <span className="font-medium text-gray-900 text-sm">{item.title}</span>
                 </div>
                 <button 
                   onClick={() => handleRemove(item.id)}
                   className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                 >
                   <X className="w-4 h-4" />
                 </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add New */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
           <label className="text-xs font-bold text-gray-400 uppercase mb-2 block ml-1">Добавить запись</label>
           <div className="flex gap-2">
             <input 
               type="text" 
               value={newCondition}
               onChange={(e) => setNewCondition(e.target.value)}
               placeholder="Например: Астма"
               className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
               onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
             />
             <button 
               onClick={handleAdd}
               disabled={!newCondition.trim()}
               className="bg-gray-900 text-white px-4 rounded-xl shadow-md disabled:opacity-50 transition-all active:scale-95"
             >
               <Plus className="w-5 h-5" />
             </button>
           </div>
        </div>

        {/* Certificate Upload Placeholder */}
        <button className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-gray-400 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
           <FileHeart className="w-8 h-8 opacity-50" />
           <span className="text-xs font-medium">Загрузить справку от врача (PDF/JPG)</span>
        </button>
      </div>
    </div>
  );
};

export default ContraindicationsScreen;