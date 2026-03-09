import React from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, TrendingUp, Users, Star, Award } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface TrainerKPIScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerKPIScreen: React.FC<TrainerKPIScreenProps> = ({ onNavigate }) => {
  const kpi = {
    sales: 85, // percent
    retention: 92, // percent
    nps: 4.9, // score
    rating: 3, // place in club
  };

  const salesData = [
    { name: 'Выполнено', value: 85, color: '#2563eb' },
    { name: 'Осталось', value: 15, color: '#e5e7eb' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Моя эффективность</h1>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Main KPI Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
           <div className="relative w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesData}
                    innerRadius={45}
                    outerRadius={60}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {salesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-2xl font-extrabold text-blue-600">{kpi.sales}%</span>
                 <span className="text-[10px] text-gray-400 font-bold uppercase">План</span>
              </div>
           </div>
           
           <div className="flex-1 pl-6 space-y-4">
              <div>
                 <p className="text-gray-400 text-xs font-bold uppercase mb-1">Прогноз бонуса</p>
                 <p className="text-2xl font-extrabold text-gray-900">15 400 ₽</p>
              </div>
              <div className="text-xs text-gray-500 leading-snug">
                 Выполните план на 100%, чтобы получить повышенный коэффициент.
              </div>
           </div>
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-2 gap-3">
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                 <Users className="w-5 h-5 text-purple-500" />
                 <span className="text-xs font-bold text-gray-400 uppercase">Удержание</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{kpi.retention}%</p>
              <p className="text-xs text-green-600 font-medium">+2% к прошлому мес.</p>
           </div>

           <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                 <Star className="w-5 h-5 text-orange-500" />
                 <span className="text-xs font-bold text-gray-400 uppercase">NPS</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{kpi.nps}</p>
              <p className="text-xs text-gray-500 font-medium">54 оценки</p>
           </div>
        </div>

        {/* Leaderboard Snippet */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 text-white shadow-lg flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-yellow-400 border border-white/10">
                 <Award className="w-6 h-6" />
              </div>
              <div>
                 <p className="font-bold text-lg">3 Место</p>
                 <p className="text-xs text-gray-400">в рейтинге клуба</p>
              </div>
           </div>
           <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">До 2 места</p>
              <p className="font-bold text-blue-400">1400 pts</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerKPIScreen;