import React, { useState, useEffect, useMemo } from 'react';
import { ScreenName } from '../types';
import type { CardId } from '../types/client-card';
import { useClientCard } from '../hooks/useClientCard';
import { ArrowLeft, Plus, X, ShieldAlert, FileHeart, Stethoscope } from 'lucide-react';

interface ContraindicationsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const DEMO_CARD_ID = 'card-001' as CardId;

const ContraindicationsScreen: React.FC<ContraindicationsScreenProps> = ({ onNavigate }) => {
  const { card, loading } = useClientCard(DEMO_CARD_ID);
  const hp = card?.healthProfile;

  const initialConditions = useMemo(() => {
    if (!hp) return [];
    const items: { id: number; title: string; type: string }[] = [];
    hp.contraindications.forEach((c, i) => items.push({ id: i + 1, title: c, type: 'chronic' }));
    hp.injuries.forEach((inj, i) => items.push({ id: 100 + i, title: inj, type: 'injury' }));
    if (hp.allergiesText) items.push({ id: 200, title: hp.allergiesText, type: 'allergy' });
    return items;
  }, [hp]);

  const [conditions, setConditions] = useState<{ id: number; title: string; type: string }[]>([]);
  const [newCondition, setNewCondition] = useState('');

  useEffect(() => {
    if (initialConditions.length > 0 && conditions.length === 0) {
      setConditions(initialConditions);
    }
  }, [initialConditions]);

  const handleAdd = () => {
    if (newCondition.trim()) {
      setConditions([...conditions, { id: Date.now(), title: newCondition, type: 'other' }]);
      setNewCondition('');
    }
  };

  const handleRemove = (id: number) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  if (loading || !card) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
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
                    <div className={`w-2 h-2 rounded-full ${item.type === 'allergy' ? 'bg-purple-500' : item.type === 'injury' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
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

        {/* Health Limits */}
        {hp?.limitsText && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-500" /> Ограничения
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{hp.limitsText}</p>
          </div>
        )}

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
