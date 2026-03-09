import React from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Download, Info } from 'lucide-react';

interface TrainerSalaryDetailScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerSalaryDetailScreen: React.FC<TrainerSalaryDetailScreenProps> = ({ onNavigate }) => {
  const salary = {
    period: 'Сентябрь 2024',
    total: 124500,
    items: [
      { id: 1, title: 'Персональные тренировки', qty: 42, rate: 1500, sum: 63000 },
      { id: 2, title: 'Групповые программы', qty: 12, rate: 800, sum: 9600 },
      { id: 3, title: 'Дежурства (часы)', qty: 40, rate: 300, sum: 12000 },
      { id: 4, title: 'Бонус за выполнение плана', qty: 1, rate: 15000, sum: 15000, isBonus: true },
      { id: 5, title: 'Окладная часть', qty: 1, rate: 25000, sum: 25000 },
    ],
    deductions: [
      { id: 6, title: 'НДФЛ (13%)', sum: -16185 }
    ]
  };

  const toPay = salary.total + salary.deductions[0].sum; // Simple calculation for demo

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Расчетный лист</h1>
            <p className="text-xs text-gray-500">{salary.period}</p>
          </div>
        </div>
        <button className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
          <Download className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
           <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase">Начислено</span>
              <span className="font-bold text-green-600">+{salary.total.toLocaleString()} ₽</span>
           </div>
           
           <div className="divide-y divide-gray-50">
             {salary.items.map((item) => (
               <div key={item.id} className="p-4 flex justify-between items-start">
                  <div>
                    <p className={`text-sm font-bold ${item.isBonus ? 'text-blue-600' : 'text-gray-900'}`}>{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.qty} x {item.rate} ₽</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.sum.toLocaleString()} ₽</span>
               </div>
             ))}
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
           <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase">Удержания</span>
              <span className="font-bold text-red-600">{salary.deductions[0].sum.toLocaleString()} ₽</span>
           </div>
           
           <div className="divide-y divide-gray-50">
             {salary.deductions.map((item) => (
               <div key={item.id} className="p-4 flex justify-between items-center">
                  <p className="text-sm font-bold text-gray-900">{item.title}</p>
                  <span className="text-sm font-bold text-gray-900">{item.sum.toLocaleString()} ₽</span>
               </div>
             ))}
           </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
           <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
           <p className="text-xs text-blue-800 leading-relaxed">
             Выплата производится 5-го (аванс) и 20-го (остаток) числа каждого месяца. Если дата выпадает на выходной, выплата переносится на ближайший рабочий день.
           </p>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
         <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-500">К выплате на руки:</span>
            <span className="text-2xl font-extrabold text-gray-900">{toPay.toLocaleString()} ₽</span>
         </div>
      </div>
    </div>
  );
};

export default TrainerSalaryDetailScreen;