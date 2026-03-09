import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Timer, Activity, TrendingUp, Save } from 'lucide-react';

interface TrainerClientAssessmentScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerClientAssessmentScreen: React.FC<TrainerClientAssessmentScreenProps> = ({ onNavigate }) => {
  const [plank, setPlank] = useState('');
  const [pushups, setPushups] = useState('');
  const [squats, setSquats] = useState('');
  const [score, setScore] = useState<number | null>(null);

  const calculateScore = () => {
    // Dummy logic
    const s = (Number(plank) / 2) + (Number(pushups) * 2) + Number(squats);
    setScore(Math.min(100, Math.round(s)));
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Фитнес-тест</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg mb-6 text-center">
           <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Рейтинг формы</p>
           {score !== null ? (
             <div className="animate-in zoom-in duration-500">
               <span className="text-6xl font-extrabold">{score}</span>
               <span className="text-2xl font-medium text-blue-200">/100</span>
             </div>
           ) : (
             <p className="text-2xl font-bold opacity-50">--</p>
           )}
        </div>

        <div className="space-y-4">
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><Timer className="w-6 h-6" /></div>
                 <div>
                   <h3 className="font-bold text-gray-900">Планка</h3>
                   <p className="text-xs text-gray-500">Макс. время (сек)</p>
                 </div>
              </div>
              <input 
                type="number" 
                value={plank}
                onChange={(e) => setPlank(e.target.value)}
                placeholder="0"
                className="w-20 text-right text-xl font-bold border-b border-gray-200 focus:border-blue-500 focus:outline-none"
              />
           </div>

           <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Activity className="w-6 h-6" /></div>
                 <div>
                   <h3 className="font-bold text-gray-900">Отжимания</h3>
                   <p className="text-xs text-gray-500">За 1 минуту</p>
                 </div>
              </div>
              <input 
                type="number" 
                value={pushups}
                onChange={(e) => setPushups(e.target.value)}
                placeholder="0"
                className="w-20 text-right text-xl font-bold border-b border-gray-200 focus:border-blue-500 focus:outline-none"
              />
           </div>

           <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-green-50 text-green-600 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
                 <div>
                   <h3 className="font-bold text-gray-900">Приседания</h3>
                   <p className="text-xs text-gray-500">За 1 минуту</p>
                 </div>
              </div>
              <input 
                type="number" 
                value={squats}
                onChange={(e) => setSquats(e.target.value)}
                placeholder="0"
                className="w-20 text-right text-xl font-bold border-b border-gray-200 focus:border-blue-500 focus:outline-none"
              />
           </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
        <button 
          onClick={calculateScore}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> {score !== null ? 'Обновить результат' : 'Рассчитать и сохранить'}
        </button>
      </div>
    </div>
  );
};

export default TrainerClientAssessmentScreen;