import React from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Download, FileText, Check, ChevronRight } from 'lucide-react';

interface TrainerPayrollHistoryScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerPayrollHistoryScreen: React.FC<TrainerPayrollHistoryScreenProps> = ({ onNavigate }) => {
  const payouts = [
    { id: 1, period: 'Август 2024', amount: 118500, date: '05.09.2024', status: 'paid' },
    { id: 2, period: 'Июль 2024', amount: 122000, date: '05.08.2024', status: 'paid' },
    { id: 3, period: 'Июнь 2024', amount: 115400, date: '05.07.2024', status: 'paid' },
    { id: 4, period: 'Май 2024', amount: 108000, date: '05.06.2024', status: 'paid' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">История выплат</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        {payouts.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                 <FileText className="w-5 h-5" />
               </div>
               <div>
                 <h3 className="font-bold text-gray-900 text-sm">{item.period}</h3>
                 <p className="text-xs text-gray-500">Выплачено {item.date}</p>
               </div>
             </div>
             
             <div className="text-right flex flex-col items-end">
               <span className="font-bold text-gray-900">{item.amount.toLocaleString()} ₽</span>
               <button className="flex items-center gap-1 text-[10px] text-blue-600 font-bold mt-1 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 transition-colors">
                 <Download className="w-3 h-3" /> PDF
               </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerPayrollHistoryScreen;