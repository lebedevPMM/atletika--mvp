
import React, { useState } from 'react';
import { ScreenName } from '../types';
import { 
  ArrowLeft, 
  Gift, 
  Trophy, 
  ChevronRight, 
  History, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Info, 
  Calendar,
  AlertCircle,
  FileText,
  HelpCircle
} from 'lucide-react';

interface LoyaltyScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

// Types for the mock data
type PeriodFilter = '7_days' | '30_days' | '90_days' | 'all';

const LoyaltyScreen: React.FC<LoyaltyScreenProps> = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState<PeriodFilter>('30_days');
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Mock Data: Loyalty Status
  const loyaltyProgram = {
    balance: 1250,
    currency: 'Б',
    tier: 'Silver',
    nextTier: 'Gold',
    progress: 65, // Percentage
    toNextTierAmount: 3500,
    currencyToNext: '₽', // We need to spend Rubles to get points usually
    expiringPoints: 150,
    expiringDate: '31.10.2024'
  };

  // Mock Data: Operations
  const allOperations = [
    { id: 1, title: 'Оплата тренировки', description: 'Списание бонусов', date: 'Сегодня, 14:20', amount: -200, type: 'write_off' },
    { id: 2, title: 'Кешбэк за абонемент', description: 'Начисление 5%', date: '01.09.2024', amount: +500, type: 'income' },
    { id: 3, title: 'День рождения', description: 'Подарок от клуба', date: '20.08.2024', amount: +300, type: 'income' },
    { id: 4, title: 'Покупка воды', description: 'Списание', date: '15.08.2024', amount: -50, type: 'write_off' },
    { id: 5, title: 'Приведи друга', description: 'Акция', date: '10.06.2024', amount: +1000, type: 'income' },
  ];

  // Filtering Logic
  const getFilteredOperations = () => {
    // In a real app, this would filter by date object comparison. 
    // Here we simulate list length changes based on filter.
    switch (activeFilter) {
      case '7_days': return allOperations.slice(0, 1);
      case '30_days': return allOperations.slice(0, 3);
      case '90_days': return allOperations.slice(0, 4);
      default: return allOperations;
    }
  };

  const operations = getFilteredOperations();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Бонусный счёт</h1>
        </div>
        <button 
          onClick={() => setShowRulesModal(!showRulesModal)}
          className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-10 space-y-6">
        
        {/* 1. Balance Block (Card) */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
           
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                 <div>
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Ваш баланс</p>
                   <div className="flex items-baseline gap-1">
                     <span className="text-5xl font-extrabold tracking-tighter">{loyaltyProgram.balance}</span>
                     <span className="text-xl font-medium text-gray-400">{loyaltyProgram.currency}</span>
                   </div>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                   <Gift className="w-6 h-6 text-yellow-400" />
                 </div>
              </div>

              {/* Expiring Points Warning */}
              {loyaltyProgram.expiringPoints > 0 && (
                <div className="flex items-start gap-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-3 mb-4">
                   <AlertCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
                   <div className="text-xs">
                     <span className="font-bold text-white">{loyaltyProgram.expiringPoints} {loyaltyProgram.currency}</span>
                     <span className="text-gray-300"> сгорят {loyaltyProgram.expiringDate}</span>
                   </div>
                </div>
              )}

              {/* Tier Progress */}
              <div>
                 <div className="flex justify-between items-end mb-2">
                    <span className="bg-gradient-to-r from-gray-200 to-gray-400 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {loyaltyProgram.tier}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      До {loyaltyProgram.nextTier}: {loyaltyProgram.toNextTierAmount} {loyaltyProgram.currencyToNext}
                    </span>
                 </div>
                 <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${loyaltyProgram.progress}%` }}
                    ></div>
                 </div>
              </div>
           </div>
        </div>

        {/* 2. Rules Summary */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Правила программы</h3>
           <ul className="space-y-3 mb-4">
              <li className="flex items-start gap-3 text-sm text-gray-700">
                 <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                 <span>1 бонус = 1 рубль. Используйте для оплаты услуг.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-700">
                 <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                 <span>Оплачивайте бонусами до 30% от чека.</span>
              </li>
           </ul>
           <button onClick={() => onNavigate('docs')} className="w-full py-2.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
             <FileText className="w-3.5 h-3.5" />
             Полные правила начисления
           </button>
        </div>

        {/* 3. History Section */}
        <div>
           <h3 className="font-bold text-gray-900 mb-4 px-1 flex items-center gap-2">
             <History className="w-5 h-5 text-gray-500" /> История операций
           </h3>

           {/* Filters */}
           <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: '7_days', label: '7 дней' },
                { id: '30_days', label: '30 дней' },
                { id: '90_days', label: '90 дней' },
                { id: 'all', label: 'Все время' }
              ].map((filter) => (
                <button 
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as PeriodFilter)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    activeFilter === filter.id 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
           </div>

           {/* List */}
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[100px]">
              {operations.length > 0 ? (
                <div className="divide-y divide-gray-50">
                   {operations.map((item) => (
                     <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                              {item.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                           </div>
                           <div>
                              <p className="font-bold text-gray-900 text-sm leading-tight">{item.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                 <span className="text-xs text-gray-500">{item.description}</span>
                                 <span className="text-[10px] text-gray-300">•</span>
                                 <span className="text-[10px] text-gray-400">{item.date}</span>
                              </div>
                           </div>
                        </div>
                        <div className={`font-bold text-sm ${item.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                           {item.amount > 0 ? '+' : ''}{item.amount} {loyaltyProgram.currency}
                        </div>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                   <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                     <Calendar className="w-6 h-6 text-gray-300" />
                   </div>
                   <p className="text-sm font-bold text-gray-900">Нет операций</p>
                   <p className="text-xs text-gray-500 mt-1">За выбранный период начислений не было.</p>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default LoyaltyScreen;
