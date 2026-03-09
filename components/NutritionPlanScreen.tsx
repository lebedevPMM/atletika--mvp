import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Plus, Droplets, Flame, ChevronRight, Apple } from 'lucide-react';

interface NutritionPlanScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const NutritionPlanScreen: React.FC<NutritionPlanScreenProps> = ({ onNavigate }) => {
  const [water, setWater] = useState(3); // glasses (250ml)
  const goalWater = 8;

  const nutrition = {
    calories: { current: 1450, goal: 2200 },
    protein: { current: 110, goal: 160 },
    fats: { current: 45, goal: 70 },
    carbs: { current: 150, goal: 250 },
  };

  const meals = [
    { title: 'Завтрак', calories: 450, items: ['Овсянка с ягодами', 'Кофе без сахара'] },
    { title: 'Обед', calories: 650, items: ['Куриная грудка', 'Гречка', 'Салат овощной'] },
    { title: 'Ужин', calories: 350, items: ['Творог 5%', 'Яблоко'] },
    { title: 'Перекус', calories: 0, items: [] },
  ];

  const getProgressColor = (current: number, goal: number) => {
    const percent = (current / goal) * 100;
    if (percent > 100) return 'bg-red-500';
    if (percent > 80) return 'bg-green-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Питание</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-24">
        {/* Calories Ring (Visual representation) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
           <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                <circle 
                  cx="64" cy="64" r="56" stroke="#2563eb" strokeWidth="12" fill="none" 
                  strokeDasharray="351.86" 
                  strokeDashoffset={351.86 - (351.86 * (nutrition.calories.current / nutrition.calories.goal))} 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <Flame className="w-5 h-5 text-orange-500 mb-1" fill="currentColor" />
                 <span className="text-2xl font-extrabold text-gray-900">{nutrition.calories.goal - nutrition.calories.current}</span>
                 <span className="text-[10px] text-gray-400 uppercase font-bold">Осталось</span>
              </div>
           </div>
           
           <div className="flex-1 pl-6 space-y-4">
              {[
                { label: 'Белки', val: nutrition.protein, color: 'bg-blue-500' },
                { label: 'Жиры', val: nutrition.fats, color: 'bg-yellow-500' },
                { label: 'Углеводы', val: nutrition.carbs, color: 'bg-green-500' },
              ].map((macro) => (
                <div key={macro.label}>
                   <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                     <span>{macro.label}</span>
                     <span>{macro.val.current} / {macro.val.goal}г</span>
                   </div>
                   <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                     <div className={`h-full rounded-full ${macro.color}`} style={{ width: `${(macro.val.current / macro.val.goal) * 100}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Water Tracker */}
        <div className="bg-blue-600 text-white p-5 rounded-3xl shadow-lg mb-6 relative overflow-hidden">
           <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
           <div className="relative z-10 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-2">
                   <Droplets className="w-5 h-5 text-blue-200" fill="currentColor" />
                   <h3 className="font-bold text-lg">Водный баланс</h3>
                </div>
                <p className="text-3xl font-extrabold mb-1">{(water * 0.25).toFixed(2)} <span className="text-sm font-medium opacity-80">литра</span></p>
                <p className="text-xs text-blue-200">{water} из {goalWater} стаканов</p>
              </div>
              <button 
                onClick={() => setWater(water + 1)}
                className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-md active:scale-90 transition-transform"
              >
                <Plus className="w-8 h-8" />
              </button>
           </div>
        </div>

        {/* Meals */}
        <h3 className="font-bold text-gray-900 mb-3 px-1">Приемы пищи</h3>
        <div className="space-y-3">
           {meals.map((meal, idx) => (
             <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-gray-900">{meal.title}</h4>
                   <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                     {meal.calories > 0 ? `${meal.calories} ккал` : <Plus className="w-3 h-3" />}
                   </span>
                </div>
                {meal.items.length > 0 ? (
                  <ul className="text-sm text-gray-600 space-y-1">
                    {meal.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div> {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400 italic">Нажмите, чтобы добавить еду</p>
                )}
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default NutritionPlanScreen;