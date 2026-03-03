import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Star,
  Check,
  Info,
  User,
  ChevronRight,
  AlertCircle,
  Wallet,
  Sparkles,
  FileCheck
} from 'lucide-react';

interface BookingSpaDetailsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const BookingSpaDetailsScreen: React.FC<BookingSpaDetailsScreenProps> = ({ onNavigate }) => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedMaster, setSelectedMaster] = useState<string>('any');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingState, setBookingState] = useState<'idle' | 'validating' | 'success'>('idle');
  const [activePackage, setActivePackage] = useState<{ id: number; title: string; qtyLeft: number } | null>(null);

  // --- MOCK USER DATA (Shared with PurchasedServicesScreen) ---
  const userPackages = [
    {
      id: 2,
      type: 'spa_pack',
      title: 'Спортивный массаж',
      qtyLeft: 4,
    }
  ];

  useEffect(() => {
    // Check if current service is covered by an active package
    const found = userPackages.find(p => p.title === service.title && p.qtyLeft > 0);
    if (found) {
      setActivePackage(found);
    }
  }, []);

  // --- MOCK DATA FROM SPEC ---
  // DEV: Toggle these flags to test different flows
  const service = {
    id: 'spa-1',
    title: 'Спортивный массаж',
    category: 'Массаж',
    duration: '60 мин',
    basePrice: 3000,
    rating: 4.9,
    reviews: 84,
    description: 'Глубокая проработка мышц. Снимает гипертонус, улучшает кровообращение. Рекомендуется после интенсивных тренировок.',
    prepNotes: 'Не рекомендуется принимать пищу за 1.5 часа до процедуры.',
    contraNotes: 'Наличие воспалительных процессов, высокая температура.',
    requiresPrepayment: !activePackage, // No prepayment if using package
    requiresConfirmation: false, // TRY: true
    cancelPolicy: 'Бесплатная отмена за 4 часа. При поздней отмене удерживается 50%.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2000&auto=format&fit=crop'
  };

  const masters = [
    { id: 'any', name: 'Любой мастер', role: 'Быстрая запись', img: null, priceModifier: 0 },
    { id: 'm1', name: 'Анна К.', role: 'Топ-мастер', priceModifier: 500, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
    { id: 'm2', name: 'Игорь В.', role: 'Массажист', priceModifier: 0, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan' },
    { id: 'm3', name: 'Ольга С.', role: 'Реабилитолог', priceModifier: 1000, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga' },
  ];

  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day: d.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase(),
      date: d.getDate().toString(),
      fullDate: d
    };
  });

  const slots = [
    { time: '10:00', price: service.basePrice },
    { time: '11:30', price: service.basePrice },
    { time: '13:00', price: service.basePrice },
    { time: '15:00', price: service.basePrice },
    { time: '16:30', price: service.basePrice },
    { time: '18:00', price: service.basePrice },
  ];

  const getCurrentPrice = () => {
    if (activePackage) return 0;
    const master = masters.find(m => m.id === selectedMaster);
    return service.basePrice + (master?.priceModifier || 0);
  };

  const getCtaLabel = () => {
    if (isLoading) return 'Обработка...';
    if (activePackage) return 'Записаться (списание)';
    if (service.requiresPrepayment) return 'Перейти к оплате';
    if (service.requiresConfirmation) return 'Отправить заявку';
    return 'Записаться';
  };

  const ctaColorClass = () => {
    if (!selectedSlot) return 'bg-gray-200 text-gray-400 cursor-not-allowed';
    if (activePackage) return 'bg-purple-600 text-white active:scale-95 shadow-lg shadow-purple-200';
    if (service.requiresPrepayment) return 'bg-black text-white active:scale-95 shadow-lg';
    if (service.requiresConfirmation) return 'bg-blue-600 text-white active:scale-95 shadow-lg shadow-blue-200';
    return 'bg-blue-600 text-white active:scale-95 shadow-lg shadow-blue-200';
  };

  const handleBook = () => {
    if (!selectedSlot) return;

    setIsLoading(true);
    setBookingState('validating');

    // Simulate Server Validation
    setTimeout(() => {
      // Simulate Price Change (rare case logic)
      if (!activePackage && Math.random() > 0.95) {
        setIsLoading(false);
        setBookingState('idle');
        alert('Внимание! Цена на услугу изменилась. Пожалуйста, подтвердите новую стоимость.');
        return;
      }

      setIsLoading(false);
      setBookingState('success');

      if (!activePackage && service.requiresPrepayment) {
        onNavigate('payment_methods');
      } else {
        onNavigate('booking_confirm');
      }
    }, 1200);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col relative pb-24">

      {/* Hero Header */}
      <div className="relative h-64 shrink-0">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

        {/* Nav Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 safe-area-top">
          <button
            onClick={() => onNavigate('BACK')}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 text-white border border-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white text-xs font-bold uppercase tracking-wide">
            {service.category}
          </div>
        </div>

        {/* Service Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h1 className="text-2xl font-bold mb-2 leading-tight">{service.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-xs font-medium">
              <Clock className="w-3.5 h-3.5" /> {service.duration}
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-xs font-medium">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span>{service.rating} ({service.reviews})</span>
            </div>

            {/* Status Badges */}
            {service.requiresPrepayment && (
              <div className="flex items-center gap-1 bg-green-500/80 backdrop-blur-md px-2 py-0.5 rounded text-xs font-bold">
                <Wallet className="w-3.5 h-3.5" /> Предоплата
              </div>
            )}
            {service.requiresConfirmation && (
              <div className="flex items-center gap-1 bg-blue-500/80 backdrop-blur-md px-2 py-0.5 rounded text-xs font-bold">
                <FileCheck className="w-3.5 h-3.5" /> Заявка
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 flex-1">

        {/* Prep & Contra Notes */}
        <div className="space-y-2">
          {service.prepNotes && (
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-3">
              <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-orange-800 uppercase mb-1">Важно знать</h3>
                <p className="text-xs text-orange-900 leading-relaxed">{service.prepNotes}</p>
              </div>
            </div>
          )}
          {service.contraNotes && (
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-red-800 uppercase mb-1">Противопоказания</h3>
                <p className="text-xs text-red-900 leading-relaxed">{service.contraNotes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Master Selection */}
        <section>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 ml-1">Выберите специалиста</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            {masters.map((master) => {
              const isSelected = selectedMaster === master.id;
              return (
                <button
                  key={master.id}
                  onClick={() => setSelectedMaster(master.id)}
                  className={`flex flex-col items-center gap-2 min-w-[90px] p-2 rounded-2xl border transition-all ${isSelected
                    ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                    : 'bg-white border-gray-100'
                    }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'}`}>
                    {master.id === 'any' ? (
                      <div className="w-full h-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Sparkles className="w-6 h-6" />
                      </div>
                    ) : (
                      <img src={master.img!} className="w-full h-full object-cover" alt={master.name} />
                    )}
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>{master.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{master.role}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Date Selection */}
        <section>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 ml-1">Дата и время</h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
            {dates.map((d, i) => (
              <button
                key={i}
                onClick={() => setSelectedDateIndex(i)}
                className={`flex flex-col items-center justify-center min-w-[56px] h-16 rounded-xl border transition-all ${selectedDateIndex === i
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105'
                  : 'bg-white text-gray-500 border-gray-200'
                  }`}
              >
                <span className="text-[10px] font-bold uppercase mb-0.5 opacity-80">{d.day}</span>
                <span className="text-lg font-extrabold leading-none">{d.date}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {slots.map((slot, i) => {
              // Adjust price if specific expensive master is selected
              const price = selectedMaster !== 'any'
                ? service.basePrice + (masters.find(m => m.id === selectedMaster)?.priceModifier || 0)
                : service.basePrice;

              const isSelected = selectedSlot === slot.time;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedSlot(slot.time)}
                  className={`py-3 px-2 rounded-xl border transition-all flex flex-col items-center justify-center ${isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-900 hover:border-blue-300'
                    }`}
                >
                  <span className="text-sm font-bold">{slot.time}</span>
                  {activePackage ? (
                    <span className={`text-[10px] mt-0.5 font-bold uppercase ${isSelected ? 'text-purple-100' : 'text-purple-600'}`}>
                      Включено
                    </span>
                  ) : (
                    selectedMaster !== 'any' && (
                      <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                        {price} ₽
                      </span>
                    )
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Cancel Policy */}
        <div className="bg-gray-100 p-4 rounded-2xl flex gap-3 text-xs text-gray-500">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {service.cancelPolicy}
            {service.requiresPrepayment && (
              <span className="block mt-1 font-bold text-gray-600">
                При отмене менее чем за 4 часа предоплата не возвращается.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 safe-area-bottom z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">{activePackage ? 'Оплата' : 'Итого'}</p>
            <div className="flex items-baseline gap-1">
              {activePackage ? (
                <div>
                  <span className="text-sm font-bold text-gray-900 leading-tight">Абонемент</span>
                  <p className="text-[10px] text-purple-600 font-bold">Осталось: {activePackage.qtyLeft - 1} из {activePackage.qtyLeft} посещений</p>
                </div>
              ) : (
                <>
                  <span className="text-xl font-extrabold text-gray-900">{getCurrentPrice()} ₽</span>
                  <span className="text-xs text-gray-500 font-medium">/ сеанс</span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleBook}
            disabled={!selectedSlot || isLoading}
            className={`px-6 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 ${ctaColorClass()}`}
          >
            {getCtaLabel()}
            {!isLoading && <ChevronRight className="w-4 h-4 opacity-60" />}
          </button>
        </div>
      </div>

    </div>
  );
};

export default BookingSpaDetailsScreen;
