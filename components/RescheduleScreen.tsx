import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

interface RescheduleScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const RescheduleScreen: React.FC<RescheduleScreenProps> = ({ onNavigate }) => {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock Request Data
  const currentBooking = {
    id: 'b-123',
    title: 'Персональная тренировка',
    date: '12 Сентября',
    time: '19:00',
    trainer: 'Алексей Смирнов',
    price: 2500
  };

  // Mock Policy
  const policy = {
    allowed: true,
    cutoffHours: 12, // Reschedule allowed up to 12h before
    fee: 500, // Fee if within cutoff
    isLate: true // Simulating a late reschedule
  };

  const compatibleSlots = [
    { id: 1, time: '10:00', date: 'Завтра, 13 Сен', trainer: 'Алексей Смирнов' },
    { id: 2, time: '14:00', date: 'Завтра, 13 Сен', trainer: 'Алексей Смирнов' },
    { id: 3, time: '19:00', date: 'Завтра, 13 Сен', trainer: 'Алексей Смирнов' },
    { id: 4, time: '11:00', date: 'Послезавтра, 14 Сен', trainer: 'Алексей Смирнов' },
  ];

  const handleConfirm = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onNavigate('my_schedule');
      }, 2500);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Запись перенесена!</h2>
        <p className="text-gray-500 mb-6">
          Ждем вас {compatibleSlots.find(s => s.id === selectedSlot)?.date.toLowerCase()} в {compatibleSlots.find(s => s.id === selectedSlot)?.time}.
          <br />
          Старая запись отменена.
        </p>
        <button
          onClick={() => onNavigate('my_schedule')}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold"
        >
          В расписание
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('booking_class_details')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Перенос записи</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-24">

        {/* Old Slot */}
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 ml-1">Текущая запись</h2>
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 opacity-60">
          <h3 className="font-bold text-gray-900 mb-1">{currentBooking.title}</h3>
          <p className="text-sm text-gray-500 mb-3">{currentBooking.trainer}</p>
          <div className="flex items-center gap-2 text-sm text-gray-700 decoration-slate-500 line-through">
            <Calendar className="w-4 h-4" />
            {currentBooking.date} • {currentBooking.time}
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 p-2 rounded-full text-blue-600 shadow-sm">
            <ArrowRight className="w-6 h-6 rotate-90" />
          </div>
        </div>

        {/* Policy Info */}
        {policy.isLate && (
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-6 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-orange-900 mb-1">Поздний перенос</h4>
              <p className="text-xs text-orange-800 leading-relaxed">
                До начала занятия осталось менее {policy.cutoffHours} часов.
                Взимается комиссия <strong>{policy.fee} ₽</strong>.
              </p>
            </div>
          </div>
        )}

        {/* New Slots */}
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 ml-1">Выберите новое время</h2>
        <div className="space-y-3">
          {compatibleSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => setSelectedSlot(slot.id)}
              className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${selectedSlot === slot.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-[1.01]'
                  : 'bg-white border-gray-200 text-gray-900 hover:border-blue-300'
                }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className={`w-5 h-5 ${selectedSlot === slot.id ? 'text-blue-200' : 'text-gray-400'}`} />
                <div className="text-left">
                  <span className="font-medium text-sm block">{slot.date}</span>
                  <span className={`text-xs ${selectedSlot === slot.id ? 'text-blue-200' : 'text-gray-400'}`}>{slot.trainer}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${selectedSlot === slot.id ? 'text-blue-200' : 'text-gray-400'}`} />
                <span className="font-bold">{slot.time}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
        {selectedSlot && (
          <div className="flex justify-between items-center mb-3 text-sm">
            <span className="text-gray-500">Итого к оплате:</span>
            <span className="font-bold text-gray-900">
              {policy.isLate ? `${policy.fee} ₽` : '0 ₽'}
            </span>
          </div>
        )}
        <button
          onClick={handleConfirm}
          disabled={!selectedSlot || isProcessing}
          className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${!selectedSlot || isProcessing
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white active:scale-[0.98]'
            }`}
        >
          {isProcessing ? 'Обработка...' : (
            policy.isLate ? `Оплатить ${policy.fee} ₽ и перенести` : 'Подтвердить перенос'
          )}
        </button>
      </div>
    </div>
  );
};

export default RescheduleScreen;