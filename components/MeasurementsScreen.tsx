import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Save, Calendar, Ruler, History, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface MeasurementsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const MeasurementsScreen: React.FC<MeasurementsScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'input' | 'history'>('input');
  const [date, setDate] = useState('2024-09-12');
  
  // Values
  const [weight, setWeight] = useState('65.5');
  const [chest, setChest] = useState('92');
  const [waist, setWaist] = useState('68');
  const [hips, setHips] = useState('94');

  // BMI Calculation
  const height = 1.70; // Mock height from profile
  const bmi = (Number(weight) / (height * height)).toFixed(1);

  const getBmiStatus = (val: number) => {
    if (val < 18.5) return { label: 'Ниже нормы', color: 'text-blue-600' };
    if (val < 25) return { label: 'Норма', color: 'text-green-600' };
    if (val < 30) return { label: 'Избыток', color: 'text-yellow-600' };
    return { label: 'Ожирение', color: 'text-red-600' };
  };

  const bmiStatus = getBmiStatus(Number(bmi));

  const history = [
    { date: '12 Сен', weight: 65.5, delta: -0.5 },
    { date: '05 Сен', weight: 66.0, delta: -0.2 },
    { date: '29 Авг', weight: 66.2, delta: 0 },
  ];

  const handleSave = () => {
    onNavigate('plan'); // Return to Plan to see results
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Замеры тела</h1>
        </div>
        <button 
          onClick={() => setActiveTab(activeTab === 'input' ? 'history' : 'input')}
          className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <History className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-24">
        
        {activeTab === 'input' ? (
          <>
            {/* BMI Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
               <div>
                 <p className="text-xs text-gray-400 font-bold uppercase mb-1">Ваш ИМТ (BMI)</p>
                 <h2 className="text-3xl font-extrabold text-gray-900">{bmi}</h2>
                 <p className={`text-xs font-bold mt-1 ${bmiStatus.color}`}>{bmiStatus.label}</p>
               </div>
               <div className="h-16 w-16 rounded-full border-4 border-gray-100 border-t-green-500 border-r-green-500 flex items-center justify-center rotate-45">
                  <span className="-rotate-45 font-bold text-gray-400 text-xs">Norm</span>
               </div>
            </div>

            {/* Date Picker */}
            <div className="bg-white p-3 rounded-xl border border-gray-100 mb-6 flex items-center gap-3">
               <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                 <Calendar className="w-5 h-5" />
               </div>
               <div className="flex-1">
                 <label className="text-[10px] text-gray-400 font-bold uppercase block">Дата замера</label>
                 <input 
                   type="date" 
                   value={date}
                   onChange={(e) => setDate(e.target.value)}
                   className="font-bold text-gray-900 text-sm bg-transparent focus:outline-none w-full mt-0.5"
                 />
               </div>
            </div>

            {/* Inputs Grid */}
            <div className="space-y-3">
               <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">KG</div>
                     <span className="font-bold text-gray-900">Вес</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                     <input 
                       type="number" 
                       value={weight}
                       onChange={(e) => setWeight(e.target.value)}
                       className="w-20 text-right font-extrabold text-2xl text-gray-900 bg-transparent border-b border-gray-200 focus:border-blue-500 focus:outline-none py-1"
                     />
                     <span className="text-sm font-medium text-gray-400">кг</span>
                  </div>
               </div>

               {[
                 { label: 'Грудь', val: chest, set: setChest },
                 { label: 'Талия', val: waist, set: setWaist },
                 { label: 'Бедра', val: hips, set: setHips },
               ].map((item, idx) => (
                 <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <Ruler className="w-5 h-5" />
                       </div>
                       <span className="font-bold text-gray-900">{item.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                       <input 
                         type="number" 
                         value={item.val}
                         onChange={(e) => item.set(e.target.value)}
                         className="w-20 text-right font-extrabold text-2xl text-gray-900 bg-transparent border-b border-gray-200 focus:border-blue-500 focus:outline-none py-1"
                       />
                       <span className="text-sm font-medium text-gray-400">см</span>
                    </div>
                 </div>
               ))}
            </div>
          </>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
             <h3 className="font-bold text-gray-900 ml-1">История изменений</h3>
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-50 p-3 text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                   <span>Дата</span>
                   <span className="text-center">Вес</span>
                   <span className="text-right">Изм.</span>
                </div>
                {history.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-3 p-4 border-b border-gray-50 items-center">
                     <span className="text-sm font-medium text-gray-900">{item.date}</span>
                     <span className="text-center font-bold text-gray-900">{item.weight} кг</span>
                     <div className={`flex justify-end items-center gap-1 text-sm font-bold ${item.delta < 0 ? 'text-green-600' : item.delta > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                        {item.delta < 0 ? <TrendingDown className="w-4 h-4" /> : item.delta > 0 ? <TrendingUp className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                        {Math.abs(item.delta)}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {activeTab === 'input' && (
        <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
          <button 
            onClick={handleSave}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Сохранить замеры
          </button>
        </div>
      )}
    </div>
  );
};

export default MeasurementsScreen;