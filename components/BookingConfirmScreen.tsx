
import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Check,
  AlertCircle,
  FileText,
  Loader2,
  Wallet,
  Info
} from 'lucide-react';

interface BookingConfirmScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const BookingConfirmScreen: React.FC<BookingConfirmScreenProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Consents state
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [medicalAgreed, setMedicalAgreed] = useState(false);

  // Mock Draft Data (simulating booking_draft from API)
  const booking = {
    type: 'SPA', // 'PT', 'GROUP', 'SPA'
    serviceName: 'Спортивный массаж',
    trainerName: 'Ольга Соколова',
    trainerRole: 'Массажист',
    trainerImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga',
    date: '12 Сен, Четверг',
    time: '15:00 - 16:00',
    duration: '60 мин',
    location: 'Кабинет №3 (SPA)',
    price: 3000,
    currency: '₽',
    paymentRequired: true, // If true -> generate invoice logic
    cancelWindow: '3 часа', // Configurable from backend
  };

  const isButtonDisabled = !policyAgreed || !medicalAgreed || isLoading;

  const handleConfirm = () => {
    if (isButtonDisabled) return;

    setIsLoading(true);

    // Simulate API POST /booking/bookings
    setTimeout(() => {
      setIsLoading(false);
      onNavigate('booking_result');
    }, 1500);
  };

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col relative pb-24">
      {/* Header */}
      <div className="bg-zinc-900/80 backdrop-blur-md p-4 shadow-lg border-b border-zinc-800 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => onNavigate('booking_spa_details')} // Back to details
          className="p-2 -ml-2 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-zinc-300" />
        </button>
        <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">Подтверждение</h1>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">

        {/* 1. Booking Summary Card */}
        <section className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-800">
          <div className="flex items-start gap-4 mb-4 border-b border-zinc-800 pb-4">
            <div className="w-14 h-14 bg-zinc-800 rounded-2xl overflow-hidden shrink-0 border border-zinc-700">
              <img src={booking.trainerImg} className="w-full h-full object-cover grayscale" alt="Trainer" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg leading-tight">{booking.serviceName}</h2>
              <p className="text-sm text-zinc-500">{booking.trainerName}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-cyan-500 border border-zinc-700">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-zinc-300">{booking.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-cyan-500 border border-zinc-700">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-zinc-300">{booking.time} <span className="text-zinc-500">({booking.duration})</span></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-cyan-500 border border-zinc-700">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-zinc-300">{booking.location}</span>
            </div>
          </div>
        </section>

        {/* 2. Cost & Payment Method */}
        <section className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-zinc-500 uppercase">Итого</span>
            <span className="text-xl font-black text-white tracking-widest">{booking.price} {booking.currency}</span>
          </div>

          {booking.paymentRequired ? (
            <div className="bg-zinc-950 p-3 rounded-xl flex gap-3 items-start border border-zinc-800">
              <Wallet className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-400">
                <span className="font-bold block text-white mb-0.5">Оплата после записи</span>
                Счет будет выставлен автоматически и доступен в разделе Кошелек.
              </div>
            </div>
          ) : (
            <div className="bg-green-900/10 p-3 rounded-xl flex gap-3 items-center text-green-500 font-bold text-xs border border-green-500/20">
              <Check className="w-4 h-4" /> Включено в абонемент
            </div>
          )}
        </section>

        {/* 3. Cancellation Policy */}
        <section className="bg-yellow-900/10 rounded-2xl p-5 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-2 text-yellow-500">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase">Правила отмены</h3>
          </div>
          <p className="text-xs text-yellow-200/80 leading-relaxed font-medium">
            Бесплатная отмена за <strong>{booking.cancelWindow}</strong> до начала.
            Поздняя отмена или неявка оплачиваются полностью.
          </p>
        </section>

        {/* 4. Consents */}
        <section className="space-y-3 pt-2">
          {/* Policy Consent */}
          <label className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${policyAgreed ? 'border-cyan-500/50 bg-cyan-950/10' : 'border-zinc-800 bg-zinc-900'
            }`}>
            <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${policyAgreed ? 'bg-cyan-600 border-cyan-600' : 'bg-transparent border-zinc-600'
              }`}>
              {policyAgreed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
            <input type="checkbox" className="hidden" checked={policyAgreed} onChange={() => setPolicyAgreed(!policyAgreed)} />
            <span className="text-xs text-zinc-400 select-none leading-snug">
              Я принимаю <span className="text-cyan-400 font-bold">правила отмены</span> и условия предоставления услуг.
            </span>
          </label>

          {/* Medical Consent (Specific for SPA/PT) */}
          <label className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${medicalAgreed ? 'border-cyan-500/50 bg-cyan-950/10' : 'border-zinc-800 bg-zinc-900'
            }`}>
            <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${medicalAgreed ? 'bg-cyan-600 border-cyan-600' : 'bg-transparent border-zinc-600'
              }`}>
              {medicalAgreed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
            <input type="checkbox" className="hidden" checked={medicalAgreed} onChange={() => setMedicalAgreed(!medicalAgreed)} />
            <span className="text-xs text-zinc-400 select-none leading-snug">
              Подтверждаю отсутствие медицинских противопоказаний.
            </span>
          </label>
        </section>

      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 safe-area-bottom z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleConfirm}
            disabled={isButtonDisabled}
            className={`w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${isButtonDisabled
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none'
              : 'bg-cyan-600 text-white shadow-cyan-500/20 hover:bg-cyan-500'
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Обработка...
              </>
            ) : (
              'Подтвердить запись'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmScreen;
