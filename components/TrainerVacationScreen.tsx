import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Calendar, Palmtree, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface TrainerVacationScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerVacationScreen: React.FC<TrainerVacationScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('vacation'); // vacation, sick, dayoff

  const history = [
    { id: 1, type: 'Отпуск', dates: '10.08 - 24.08', status: 'approved', days: 14 },
    { id: 2, type: 'Отгул', dates: '05.07', status: 'rejected', days: 1 },
    { id: 3, type: 'Больничный', dates: '12.03 - 15.03', status: 'approved', days: 3 },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('trainer_support')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Отсутствия</h1>
      </div>

      <div className="p-4 flex-1">
        {/* Balance Card */}
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg mb-6 relative overflow-hidden">
           <Palmtree className="absolute -right-4 -top-4 w-32 h-32 text-white/10 rotate-12" />
           <p className="text-blue-100 text-sm mb-1">Баланс отпуска</p>
           <div className="flex items-baseline gap-2">
             <span className="text-4xl font-bold">14</span>
             <span className="text-xl">дней</span>
           </div>
           <p className="text-xs text-blue-200 mt-2">Накоплено за 8 месяцев</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 mb-6">
           <button 
             onClick={() => setActiveTab('new')}
             className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'new' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}
           >
             Новая заявка
           </button>
           <button 
             onClick={() => setActiveTab('history')}
             className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'history' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}
           >
             История
           </button>
        </div>

        {activeTab === 'new' ? (
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
             <div>
               <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Тип отсутствия</label>
               <select 
                 value={type}
                 onChange={(e) => setType(e.target.value)}
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
               >
                 <option value="vacation">Оплачиваемый отпуск</option>
                 <option value="sick">Больничный</option>
                 <option value="dayoff">Отгул (за свой счет)</option>
               </select>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">С</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">По</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
             </div>

             <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 flex gap-2">
                <Clock className="w-5 h-5 text-yellow-600 shrink-0" />
                <p className="text-xs text-yellow-800 leading-snug">
                  Заявление на отпуск необходимо подавать не позднее чем за 14 дней до начала.
                </p>
             </div>

             <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold shadow-lg active:scale-[0.98]">
               Отправить на согласование
             </button>
          </div>
        ) : (
          <div className="space-y-3">
             {history.map(item => (
               <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{item.type}</h4>
                    <p className="text-xs text-gray-500">{item.dates} • {item.days} дн.</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {item.status === 'approved' ? 'Одобрено' : 'Отказ'}
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerVacationScreen;