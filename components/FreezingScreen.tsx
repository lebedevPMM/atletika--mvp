
import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import { 
  ArrowLeft, 
  Snowflake, 
  Calendar, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  ShieldAlert, 
  Wallet,
  ArrowRight,
  Info
} from 'lucide-react';

interface FreezingScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type FreezeState = 'available' | 'frozen' | 'debt' | 'success';

const FreezingScreen: React.FC<FreezingScreenProps> = ({ onNavigate }) => {
  // DEV: Toggle this state to see different views defined in Spec
  const [viewState, setViewState] = useState<FreezeState>('available');
  
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(14); // days
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock Config
  const config = {
    daysTotal: 30,
    daysUsed: 5,
    daysLeft: 25,
    minDays: 7,
    maxDays: 25,
    tariffEndDate: new Date('2025-03-20'),
    debtAmount: 1500, // Used if state is 'debt'
    currentFreeze: { // Used if state is 'frozen'
      from: '12.09.2024',
      to: '19.09.2024',
      days: 7
    }
  };

  // Helper: Calculate new end date
  const getNewEndDate = () => {
    const d = new Date(config.tariffEndDate);
    d.setDate(d.getDate() + duration);
    return d.toLocaleDateString('ru-RU');
  };

  const getOldEndDate = () => {
    return config.tariffEndDate.toLocaleDateString('ru-RU');
  };

  // Helper: Format date
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  const handleFreeze = () => {
    setIsLoading(true);
    // Simulate API POST /membership/freeze
    setTimeout(() => {
      setIsLoading(false);
      setShowConfirm(false);
      setViewState('success');
    }, 1500);
  };

  // --- RENDER: SUCCESS ---
  if (viewState === 'success') {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-blue-50/50">
          <Snowflake className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Абонемент заморожен</h2>
        <p className="text-gray-500 mb-8 max-w-xs text-sm leading-relaxed">
          Действие карты приостановлено на <span className="font-bold text-gray-900">{duration} дней</span>.<br/>
          Срок действия карты продлен до <span className="font-bold text-blue-600">{getNewEndDate()}</span>.
        </p>
        <button 
          onClick={() => onNavigate('tariff_details')}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          Вернуться в тариф
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col relative">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Заморозка</h1>
        </div>
        
        {/* DEV CONTROLS: Switch States */}
        <select 
          value={viewState} 
          onChange={(e) => setViewState(e.target.value as FreezeState)}
          className="bg-gray-100 text-[10px] p-1 rounded border-none outline-none text-gray-500 font-mono"
        >
          <option value="available">Active</option>
          <option value="frozen">Frozen</option>
          <option value="debt">Debt</option>
        </select>
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-32">
        
        {/* Scenario 1: ACTIVE FREEZE (Already Frozen) */}
        {viewState === 'frozen' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden text-center">
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <Snowflake className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10 rotate-12" />
                
                <div className="relative z-10">
                   <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-sm">
                     <Clock className="w-8 h-8 text-white" />
                   </div>
                   <h2 className="text-2xl font-bold mb-1">Абонемент на паузе</h2>
                   <p className="text-blue-100 font-medium text-sm">
                     {config.currentFreeze.from} — {config.currentFreeze.to}
                   </p>
                </div>
             </div>

             <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                   <span className="text-sm font-medium text-gray-500">Заморожено дней</span>
                   <span className="font-bold text-gray-900 text-lg">{config.currentFreeze.days}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
                   <div className="bg-blue-600 h-full w-1/2 rounded-full animate-pulse"></div>
                </div>
                
                <div className="flex gap-3 bg-blue-50 p-3 rounded-xl border border-blue-100">
                   <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                   <p className="text-xs text-blue-800 leading-snug">
                     Ваш абонемент автоматически активируется <b>{config.currentFreeze.to}</b>.
                     Для досрочной разморозки обратитесь к администратору клуба.
                   </p>
                </div>
             </div>
          </div>
        )}

        {/* Scenario 2: DEBT (Blocked) */}
        {viewState === 'debt' && (
          <div className="space-y-6 animate-in fade-in text-center pt-8">
             <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 mb-4 ring-8 ring-red-50/50">
               <Wallet className="w-10 h-10" />
             </div>
             
             <div>
               <h2 className="text-xl font-bold text-gray-900 mb-2">Заморозка недоступна</h2>
               <p className="text-gray-500 text-sm max-w-[260px] mx-auto leading-relaxed">
                 У вас есть задолженность по оплате услуг клуба. Пожалуйста, оплатите долг для доступа к управлению услугами.
               </p>
             </div>
             
             <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm flex justify-between items-center max-w-xs mx-auto w-full">
                <span className="font-medium text-gray-900 text-sm">Задолженность</span>
                <span className="font-bold text-red-600 text-lg">{config.debtAmount} ₽</span>
             </div>

             <button 
               onClick={() => onNavigate('invoice')}
               className="w-full max-w-xs mx-auto bg-red-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-200 active:scale-[0.98] transition-transform"
             >
               Перейти к оплате
             </button>
          </div>
        )}

        {/* Scenario 3: AVAILABLE (Standard Flow) */}
        {viewState === 'available' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Status Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
               
               <div className="flex justify-between items-start mb-4 relative z-10">
                 <div>
                   <p className="text-blue-200 text-xs font-bold uppercase tracking-wide mb-1">Доступный остаток</p>
                   <div className="flex items-baseline gap-2">
                     <span className="text-5xl font-extrabold tracking-tighter">{config.daysLeft}</span>
                     <span className="text-lg font-medium opacity-80">дней</span>
                   </div>
                 </div>
                 <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                   <Snowflake className="w-6 h-6 text-white" />
                 </div>
               </div>
               
               <div className="relative z-10">
                 <div className="flex justify-between text-[10px] text-blue-200 font-bold mb-1.5">
                   <span>Использовано: {config.daysUsed}</span>
                   <span>Всего: {config.daysTotal}</span>
                 </div>
                 <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                   <div className="bg-white h-full rounded-full" style={{ width: `${(config.daysUsed / config.daysTotal) * 100}%` }}></div>
                 </div>
               </div>
            </div>

            {/* Form */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-6">
               {/* Start Date */}
               <div>
                 <label className="text-xs font-bold text-gray-400 uppercase mb-3 block flex items-center gap-2">
                   <Calendar className="w-4 h-4" /> Начать с даты
                 </label>
                 <input 
                   type="date" 
                   value={startDate}
                   onChange={(e) => setStartDate(e.target.value)}
                   min={new Date().toISOString().split('T')[0]}
                   className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-900 font-bold text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                 />
               </div>

               {/* Duration */}
               <div>
                 <label className="text-xs font-bold text-gray-400 uppercase mb-3 block flex items-center gap-2 justify-between">
                   <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Длительность</span>
                   <span className="text-blue-600 font-extrabold text-sm">{duration} дней</span>
                 </label>
                 
                 {/* Preset Chips */}
                 <div className="flex gap-2 mb-5">
                    {[7, 14, config.daysLeft].map((d) => (
                      <button 
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                          duration === d 
                            ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {d} дней
                      </button>
                    ))}
                 </div>

                 {/* Slider */}
                 <div className="px-1">
                   <input 
                     type="range" 
                     min={config.minDays} 
                     max={config.daysLeft} 
                     value={duration} 
                     onChange={(e) => setDuration(Number(e.target.value))}
                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                   />
                   <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-medium">
                      <span>Min: {config.minDays} дн.</span>
                      <span>Max: {config.daysLeft} дн.</span>
                   </div>
                 </div>
               </div>
            </div>

            {/* Impact Summary */}
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
               <div>
                 <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Срок действия карты</p>
                 <div className="flex items-center gap-2 text-sm">
                    <span className="text-blue-300 line-through font-medium">{getOldEndDate()}</span>
                    <ArrowRight className="w-3 h-3 text-blue-400" />
                    <span className="font-extrabold text-blue-700">{getNewEndDate()}</span>
                 </div>
               </div>
               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                 <CheckCircle2 className="w-5 h-5" />
               </div>
            </div>

            {/* Warning */}
            <div className="flex gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100 items-start">
               <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
               <p className="text-xs text-yellow-800 leading-snug font-medium">
                 Внимание: если у вас есть записи на тренировки в период заморозки, они будут <span className="font-bold underline">автоматически отменены</span>.
               </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Action */}
      {viewState === 'available' && (
        <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
          <button 
            onClick={() => setShowConfirm(true)}
            disabled={duration < config.minDays || duration > config.daysLeft}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
          >
            <Snowflake className="w-4 h-4" />
            Заморозить на {duration} дней
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowConfirm(false)}></div>
           <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative animate-in slide-in-from-bottom duration-300 shadow-2xl text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 border border-blue-100">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Подтвердите действие</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed px-4">
                Вы замораживаете абонемент с <b className="text-gray-900">{formatDate(startDate)}</b> на <b className="text-gray-900">{duration} дней</b>. 
                <br/><span className="text-xs text-red-500 font-bold mt-2 block">Действие нельзя отменить в первые 7 дней.</span>
              </p>
              
              <div className="space-y-3">
                 <button 
                   onClick={handleFreeze}
                   disabled={isLoading}
                   className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                 >
                   {isLoading ? 'Обработка...' : 'Да, заморозить'}
                 </button>
                 <button 
                   onClick={() => setShowConfirm(false)}
                   className="w-full py-3.5 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                 >
                   Отмена
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default FreezingScreen;
