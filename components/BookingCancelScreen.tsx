
import React, { useState } from 'react';
import { ScreenName } from '../types';
import { 
  X, 
  AlertTriangle, 
  Wallet, 
  CheckCircle2, 
  Calendar, 
  AlertCircle,
  Lock,
  CreditCard,
  MessageSquare,
  Info,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface BookingCancelScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type PolicyType = 'free' | 'fine' | 'locked';

const BookingCancelScreen: React.FC<BookingCancelScreenProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<'confirm' | 'success'>('confirm');
  
  // DEV STATE: Default to 'fine' to show the most complex case
  const [policy, setPolicy] = useState<PolicyType>('fine'); 
  
  const [reason, setReason] = useState<string>('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Mock Booking Data
  const booking = {
    id: '8392-AB',
    title: 'Йога Flow',
    trainer: 'Анна Морозова',
    date: 'Сегодня, 12 Сен',
    time: '19:00',
    duration: '90 мин',
    price: 2500,
    paymentMethod: 'card', 
    cardLast4: '4589'
  };

  const reasons = [
    'Заболел(а)',
    'Не успеваю',
    'Изменились планы',
    'Ошибка в записи',
    'Другое'
  ];

  // Logic for Policy Display
  const getPolicyConfig = () => {
    switch (policy) {
      case 'free':
        return {
          status: 'Отмена бесплатна',
          statusColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-100',
          icon: Wallet,
          iconColor: 'text-green-600',
          refundAmount: booking.price,
          fineAmount: 0,
          message: 'Средства вернутся в полном объеме на вашу карту.',
          btnText: 'Подтвердить отмену',
          btnColor: 'bg-red-600'
        };
      case 'fine':
        const fine = 500; // Example fine
        return {
          status: 'Поздняя отмена',
          statusColor: 'text-orange-700',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-100',
          icon: AlertTriangle,
          iconColor: 'text-orange-600',
          refundAmount: booking.price - fine,
          fineAmount: fine,
          message: 'До начала менее 3 часов. Удерживается штраф согласно правилам клуба.',
          btnText: 'Отменить со штрафом',
          btnColor: 'bg-red-600'
        };
      case 'locked':
        return {
          status: 'Отмена недоступна',
          statusColor: 'text-gray-700',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200',
          icon: Lock,
          iconColor: 'text-gray-500',
          refundAmount: 0,
          fineAmount: booking.price,
          message: 'Занятие уже началось или прошло. Средства не возвращаются.',
          btnText: 'Написать в поддержку',
          btnColor: 'bg-gray-900'
        };
    }
  };

  const config = getPolicyConfig();

  const handleAction = () => {
    if (policy === 'locked') {
      onNavigate('support');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 1500);
  };

  // --- SUCCESS VIEW ---
  if (step === 'success') {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-gray-500" strokeWidth={1.5} />
        </div>
        
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Запись отменена</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-[250px]">
          Ваша запись удалена из расписания.
        </p>
        
        {/* Financial Result Summary */}
        <div className="bg-gray-50 rounded-2xl p-5 w-full max-w-xs border border-gray-100 mb-8 text-left shadow-sm relative overflow-hidden">
           {/* Receipt decoration top */}
           <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>

           <div className="flex justify-between items-center mb-4 pb-4 border-b border-dashed border-gray-200">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Статус</span>
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded uppercase">Canceled</span>
           </div>
           
           <div className="space-y-3">
              <div className="flex justify-between items-center">
                 <span className="text-sm text-gray-600">Оплачено</span>
                 <span className="text-sm font-medium text-gray-900">{booking.price} ₽</span>
              </div>
              
              {config.fineAmount > 0 && (
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Удержан штраф</span>
                    <span className="text-red-500 font-bold">-{config.fineAmount} ₽</span>
                 </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                 <span className="text-sm font-bold text-gray-900">К возврату</span>
                 <span className={`text-lg font-bold ${config.refundAmount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                   {config.refundAmount} ₽
                 </span>
              </div>
           </div>
           
           {config.refundAmount > 0 && (
             <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-400 justify-center">
               <Clock className="w-3 h-3" /> Срок зачисления: 3-5 дней
             </div>
           )}
        </div>

        <div className="w-full space-y-3 max-w-xs">
           <button 
             onClick={() => onNavigate('booking_schedule')}
             className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-transform"
           >
             Открыть расписание
           </button>
           <button 
             onClick={() => onNavigate('booking_class_details')}
             className="w-full bg-white border border-gray-200 text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-50"
           >
             Записаться снова
           </button>
        </div>
      </div>
    );
  }

  // --- CONFIRMATION VIEW ---
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">Отмена записи</h1>
        <button onClick={() => onNavigate('booking_class_details')} className="p-2 -mr-2 rounded-full hover:bg-gray-100">
          <X className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-40">
        
        {/* DEV CONTROLS: Switch Policy Scenario */}
        <div className="bg-gray-200 p-1 rounded-xl mb-6 flex gap-1 overflow-x-auto no-scrollbar">
           <button onClick={() => setPolicy('free')} className={`flex-1 py-1.5 px-2 text-[10px] font-bold uppercase rounded-lg transition-colors ${policy === 'free' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Бесплатно</button>
           <button onClick={() => setPolicy('fine')} className={`flex-1 py-1.5 px-2 text-[10px] font-bold uppercase rounded-lg transition-colors ${policy === 'fine' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Штраф</button>
           <button onClick={() => setPolicy('locked')} className={`flex-1 py-1.5 px-2 text-[10px] font-bold uppercase rounded-lg transition-colors ${policy === 'locked' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Locked</button>
        </div>

        {/* 1. Booking Summary */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4 flex gap-4 items-center">
           <div className="w-14 h-14 bg-gray-100 rounded-xl flex flex-col items-center justify-center shrink-0 border border-gray-200 text-gray-500">
              <Calendar className="w-6 h-6" />
           </div>
           <div>
              <h3 className="font-bold text-gray-900 leading-tight text-sm">{booking.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{booking.date}, {booking.time}</p>
              <p className="text-xs text-gray-400 mt-0.5">{booking.trainer}</p>
           </div>
        </div>

        {/* 2. Policy Impact Card */}
        <div className={`p-5 rounded-2xl border mb-6 relative overflow-hidden transition-colors duration-300 ${config.bgColor} ${config.borderColor}`}>
           <div className="flex gap-4 relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white/60 backdrop-blur-sm ${config.iconColor}`}>
                <config.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-sm mb-1 ${config.statusColor}`}>{config.status}</h3>
                <p className={`text-xs opacity-80 leading-relaxed font-medium ${config.statusColor}`}>
                  {config.message}
                </p>
                
                {/* Accordion for details */}
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className={`mt-2 text-[10px] font-bold flex items-center gap-1 opacity-70 hover:opacity-100 ${config.statusColor}`}
                >
                  {showDetails ? 'Скрыть расчет' : 'Показать расчет'} 
                  {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {/* Calculation Details */}
                {showDetails && (
                  <div className="mt-3 bg-white/60 p-3 rounded-xl backdrop-blur-sm text-xs space-y-1 animate-in slide-in-from-top-1">
                     <div className="flex justify-between">
                       <span className="text-gray-500">Стоимость услуги:</span>
                       <span className="font-medium">{booking.price} ₽</span>
                     </div>
                     {config.fineAmount > 0 && (
                       <div className="flex justify-between text-red-600">
                         <span>Штраф:</span>
                         <span className="font-bold">-{config.fineAmount} ₽</span>
                       </div>
                     )}
                     <div className="border-t border-gray-200 mt-1 pt-1 flex justify-between font-bold text-gray-900">
                       <span>Итого к возврату:</span>
                       <span>{config.refundAmount} ₽</span>
                     </div>
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* 3. Reason Selector (Only if cancellable) */}
        {policy !== 'locked' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-1">Причина отмены (опционально)</h3>
             <div className="flex flex-wrap gap-2 mb-4">
                {reasons.map((r) => {
                  const isSelected = reason === r;
                  return (
                    <button
                      key={r}
                      onClick={() => setReason(isSelected ? '' : r)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        isSelected 
                          ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
             </div>
             
             {reason === 'Другое' && (
               <textarea 
                 value={comment}
                 onChange={(e) => setComment(e.target.value)}
                 className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-24 placeholder:text-gray-400"
                 placeholder="Напишите причину..."
               />
             )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 safe-area-bottom z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
         <div className="flex flex-col gap-3 max-w-md mx-auto">
           {/* Financial Summary Line in Button Area */}
           {policy !== 'locked' && (
             <div className="flex justify-between items-center px-1 mb-1">
               <span className="text-xs text-gray-500 font-medium">
                 {policy === 'free' ? 'Вернем на карту:' : 'Вернем с учетом штрафа:'}
               </span>
               <span className="font-bold text-gray-900">{config.refundAmount} ₽</span>
             </div>
           )}

           <button 
             onClick={handleAction}
             disabled={isLoading}
             className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg text-white transition-all active:scale-[0.98] ${config.btnColor}`}
           >
             {isLoading ? 'Обработка...' : config.btnText}
           </button>
           
           {policy !== 'locked' && (
             <button 
               onClick={() => onNavigate('booking_class_details')}
               className="w-full bg-white text-gray-600 font-bold py-3.5 rounded-xl border border-transparent hover:bg-gray-50 transition-colors"
             >
               Не отменять
             </button>
           )}
         </div>
      </div>
    </div>
  );
};

export default BookingCancelScreen;
