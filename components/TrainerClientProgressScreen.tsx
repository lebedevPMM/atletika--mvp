import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, TrendingUp, Plus, Calendar, Ruler, Scale } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface TrainerClientProgressScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerClientProgressScreen: React.FC<TrainerClientProgressScreenProps> = ({ onNavigate }) => {
  const [activeMetric, setActiveMetric] = useState<'weight' | 'waist'>('weight');

  const data = [
    { date: '01.08', weight: 70.0, waist: 75 },
    { date: '15.08', weight: 69.2, waist: 74 },
    { date: '01.09', weight: 68.5, waist: 73 },
    { date: '15.09', weight: 67.8, waist: 71 },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Прогресс</h1>
          <p className="text-xs text-gray-500">Мария Иванова</p>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        
        {/* Metric Toggles */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 mb-6">
           <button
             onClick={() => setActiveMetric('weight')}
             className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeMetric === 'weight' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500'}`}
           >
             <Scale className="w-4 h-4" /> Вес
           </button>
           <button
             onClick={() => setActiveMetric('waist')}
             className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeMetric === 'waist' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500'}`}
           >
             <Ruler className="w-4 h-4" /> Талия
           </button>
        </div>

        {/* Chart */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6 h-64">
           <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">{activeMetric === 'weight' ? 'Динамика веса' : 'Объем талии'}</p>
                <div className="flex items-center gap-2 mt-1">
                   <h2 className="text-2xl font-extrabold text-gray-900">
                     {activeMetric === 'weight' ? '67.8 кг' : '71 см'}
                   </h2>
                   <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                     {activeMetric === 'weight' ? '-2.2 кг' : '-4 см'}
                   </span>
                </div>
              </div>
           </div>
           
           <ResponsiveContainer width="100%" height="70%">
             <LineChart data={data}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
               <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} dy={10} />
               <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
               <Tooltip 
                 contentStyle={{backgroundColor: '#1f2937', borderRadius: '8px', border: 'none', color: '#fff'}}
                 itemStyle={{color: '#fff'}}
                 labelStyle={{display: 'none'}}
                 formatter={(value: any) => [value, activeMetric === 'weight' ? 'кг' : 'см']}
               />
               <Line 
                 type="monotone" 
                 dataKey={activeMetric} 
                 stroke="#2563eb" 
                 strokeWidth={3} 
                 dot={{fill: '#2563eb', r: 4, strokeWidth: 2, stroke: '#fff'}} 
               />
             </LineChart>
           </ResponsiveContainer>
        </div>

        {/* Measurements List */}
        <h3 className="font-bold text-gray-900 mb-3 px-1">История замеров</h3>
        <div className="space-y-3">
           {data.slice().reverse().map((item, i) => (
             <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                     <Calendar className="w-4 h-4" />
                   </div>
                   <span className="font-medium text-gray-900 text-sm">{item.date}</span>
                </div>
                <div className="flex gap-4 text-sm">
                   <div>
                     <span className="text-gray-400 text-xs mr-1">Вес:</span>
                     <span className="font-bold">{item.weight}</span>
                   </div>
                   <div>
                     <span className="text-gray-400 text-xs mr-1">Талия:</span>
                     <span className="font-bold">{item.waist}</span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
        <button 
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Добавить замер
        </button>
      </div>
    </div>
  );
};

export default TrainerClientProgressScreen;