import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';

interface TrainerShiftEndScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerShiftEndScreen: React.FC<TrainerShiftEndScreenProps> = ({ onNavigate }) => {
  const [checks, setChecks] = useState({
    keys: false,
    equipment: false,
    report: false
  });

  const toggleCheck = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checks).every(Boolean);

  const handleFinish = () => {
    // End shift logic
    onNavigate('trainer_login');
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-white">
      <div className="p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-800">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold">Завершение смены</h1>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {/* Summary Card */}
        <div className="bg-gray-800 rounded-3xl p-6 mb-8 text-center border border-gray-700">
           <p className="text-gray-400 text-xs font-bold uppercase mb-2">Итого за сегодня</p>
           <div className="grid grid-cols-3 gap-4 divide-x divide-gray-700">
              <div>
                <p className="text-2xl font-bold">8.5</p>
                <p className="text-[10px] text-gray-400 uppercase">Часов</p>
              </div>
              <div>
                <p className="text-2xl font-bold">6</p>
                <p className="text-[10px] text-gray-400 uppercase">Тренировок</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">12k</p>
                <p className="text-[10px] text-gray-400 uppercase">Доход</p>
              </div>
           </div>
        </div>

        {/* Checklist */}
        <h3 className="font-bold text-gray-300 mb-4 px-1">Чек-лист закрытия</h3>
        <div className="space-y-3">
           <button 
             onClick={() => toggleCheck('keys')}
             className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${checks.keys ? 'bg-green-900/30 border-green-600' : 'bg-gray-800 border-gray-700'}`}
           >
             <span className="font-medium text-sm">Ключи сданы на ресепшн</span>
             {checks.keys ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>}
           </button>
           
           <button 
             onClick={() => toggleCheck('equipment')}
             className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${checks.equipment ? 'bg-green-900/30 border-green-600' : 'bg-gray-800 border-gray-700'}`}
           >
             <span className="font-medium text-sm">Оборудование проверено</span>
             {checks.equipment ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>}
           </button>

           <button 
             onClick={() => toggleCheck('report')}
             className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${checks.report ? 'bg-green-900/30 border-green-600' : 'bg-gray-800 border-gray-700'}`}
           >
             <span className="font-medium text-sm">Отчет отправлен</span>
             {checks.report ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>}
           </button>
        </div>

        {!allChecked && (
          <div className="mt-6 flex gap-3 p-3 bg-yellow-900/30 rounded-xl border border-yellow-700 items-start">
             <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
             <p className="text-xs text-yellow-200">
               Пожалуйста, выполните все пункты чек-листа перед завершением смены.
             </p>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-800 border-t border-gray-700 safe-area-bottom">
        <button 
          onClick={handleFinish}
          disabled={!allChecked}
          className="w-full bg-red-600 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:bg-gray-700 transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Закончить работу
        </button>
      </div>
    </div>
  );
};

export default TrainerShiftEndScreen;