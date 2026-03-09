import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Wallet, TrendingUp, Calendar, Download, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TrainerFinanceScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerFinanceScreen: React.FC<TrainerFinanceScreenProps> = ({ onNavigate }) => {
  const [period, setPeriod] = useState<'week' | 'month'>('month');

  const stats = {
    total: 124500,
    services: 45,
    avg: 2766,
    pending: 12500
  };

  const chartData = [
    { name: '1-7', amount: 28000 },
    { name: '8-14', amount: 32500 },
    { name: '15-21', amount: 24000 },
    { name: '22-28', amount: 40000 },
  ];

  const transactions = [
    { id: 1, title: 'ПТ (Алексей С.)', date: 'Сегодня, 10:00', amount: 1500, status: 'paid' },
    { id: 2, title: 'Группа "Сила"', date: 'Вчера, 19:00', amount: 800, status: 'paid' },
    { id: 3, title: 'ПТ (Мария И.)', date: '10 Сен, 18:00', amount: 1500, status: 'paid' },
    { id: 4, title: 'Сплит (Иван и Ольга)', date: '09 Сен, 11:00', amount: 2200, status: 'pending' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Финансы</h1>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {/* Total Card */}
        <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
           <div className="relative z-10">
             <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Заработано в Сентябре</p>
             <h2 className="text-4xl font-extrabold mb-4">{stats.total.toLocaleString()} ₽</h2>
             
             <div className="flex gap-4">
               <div>
                 <span className="text-xs text-gray-400 block">Услуг</span>
                 <span className="font-bold">{stats.services}</span>
               </div>
               <div>
                 <span className="text-xs text-gray-400 block">В ожидании</span>
                 <span className="font-bold text-yellow-400">{stats.pending.toLocaleString()} ₽</span>
               </div>
             </div>
           </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-gray-900 flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-blue-600" />
               Динамика
             </h3>
             <div className="flex bg-gray-100 rounded-lg p-0.5">
                <button 
                  onClick={() => setPeriod('week')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${period === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                >
                  Неделя
                </button>
                <button 
                  onClick={() => setPeriod('month')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${period === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                >
                  Месяц
                </button>
             </div>
           </div>
           
           <div className="h-40 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                 <Tooltip cursor={{fill: '#f9fafb', radius: 8}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}} />
                 <Bar dataKey="amount" radius={[4, 4, 4, 4]} barSize={20}>
                   {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={index === 3 ? '#2563eb' : '#e5e7eb'} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* History */}
        <div>
           <div className="flex items-center justify-between mb-3 px-1">
             <h3 className="font-bold text-gray-900">История начислений</h3>
             <button className="p-2 bg-white rounded-full border border-gray-200 text-gray-500">
               <Calendar className="w-4 h-4" />
             </button>
           </div>
           
           <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
             {transactions.map((tx, idx) => (
               <div key={tx.id} className={`p-4 flex items-center justify-between ${idx !== transactions.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{tx.title}</p>
                      <p className="text-xs text-gray-500">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">+{tx.amount}</p>
                    <p className={`text-[10px] font-bold uppercase ${tx.status === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {tx.status === 'paid' ? 'Оплачено' : 'Обработка'}
                    </p>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
         <button className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
           <Download className="w-5 h-5" /> Скачать отчет (PDF)
         </button>
      </div>
    </div>
  );
};

export default TrainerFinanceScreen;