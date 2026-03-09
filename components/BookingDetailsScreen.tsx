import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  MapPin,
  Share2,
  Clock,
  Calendar,
  MoreVertical,
  XCircle,
  CreditCard,
  AlertCircle,
  Info,
  ChevronRight,
  Zap,
  Flame,
  CheckCircle2,
  Timer,
  User,
  Users,
  Tag,
  AlertTriangle
} from 'lucide-react';

interface BookingDetailsScreenProps {
  onNavigate: (screen: ScreenName) => void;
  type?: 'group' | 'pt';
}

type BookingState = 'available' | 'booked' | 'waitlist' | 'full' | 'closed' | 'cancelled';

const BookingDetailsScreen: React.FC<BookingDetailsScreenProps> = ({ onNavigate, type = 'group' }) => {
  // DEV STATE: Controls the view mode for demonstration
  // Toggle this to test different UI states defined in the PDF
  const [bookingState, setBookingState] = useState<BookingState>('available');
  const [isPaid, setIsPaid] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Mock Data from PDF Spec
  const groupDetails = {
    id: 'class-123',
    title: 'Yoga Flow',
    tags: ['Mind & Body', 'Растяжка', 'Для всех'],
    trainerId: 101,
    trainerName: 'Анна Морозова',
    trainerRole: 'Инструктор групповых программ',
    trainerImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',

    // Date & Time
    date: '12 Сен',
    weekday: 'Четверг',
    startTime: '19:00',
    endTime: '20:30',
    duration: '90 мин',

    // Location
    location: 'Atletika+ Сити',
    studio: 'Зал ГП #2',

    // Meta
    level: 'Средний',
    calories: '350 ккал',

    // Descriptions
    description: 'Динамичная практика йоги, направленная на развитие гибкости и силы. Подходит для всех уровней подготовки. Пожалуйста, приходите за 5-10 минут до начала.',
    notes: 'Возьмите с собой полотенце и бутылку воды.',

    // Capacity
    capacity: 12,
    freeSpots: 3,

    // Payment
    price: 0,
    requiresPayment: false,

    // Rules
    cancelWindow: '3 часа',
    latePolicy: 'Отмена менее чем за 3 часа до начала считается посещением.',

    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2000&auto=format&fit=crop',
  };

  const ptDetails = {
    id: 'pt-123',
    title: 'Персональная тренировка',
    tags: ['Индивидуально', 'Силовая', 'Результат'],
    trainerId: 102,
    trainerName: 'Иван Козлов',
    trainerRole: 'Топ-тренер',
    trainerImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',

    // Date & Time
    date: '15 Сен',
    weekday: 'Воскресенье',
    startTime: '10:00',
    endTime: '11:00',
    duration: '60 мин',

    // Location
    location: 'Atletika+ Сити',
    studio: 'Тренажерный зал',

    // Meta
    level: 'Любой',
    calories: '400+ ккал',

    // Descriptions
    description: 'Индивидуальное занятие с тренером по вашей программе. Разбор техники, коррекция весов и мотивация.',
    notes: 'Если это ваша первая тренировка, приходите за 15 минут для анкетирования.',

    // Capacity
    capacity: 1,
    freeSpots: 1,

    // Payment
    price: 2500,
    requiresPayment: true,

    // Rules
    cancelWindow: '12 часов',
    latePolicy: 'Отмена менее чем за 12 часов влечет полную оплату.',

    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2000&auto=format&fit=crop',
  };

  const details = type === 'pt' ? ptDetails : groupDetails;

  const handleBack = () => {
    onNavigate('BACK');
  };

  const handleBook = () => {
    // Logic: If requires payment -> Invoice -> Payment -> Success
    // For MVP demo, we assume instant success or redirect to payment confirmation
    if (details.requiresPayment) {
      onNavigate('booking_confirm'); // Or 'invoice' depending on flow
    } else {
      setBookingState('booked');
    }
  };

  const handleCancelRequest = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    setBookingState('cancelled');
    // In real app: POST /booking/cancel
  };

  const handleJoinWaitlist = () => {
    setBookingState('waitlist');
    // In real app: POST /booking/waitlist
  };

  // --- RENDER HELPERS ---

  const renderStatusBadge = () => {
    switch (bookingState) {
      case 'booked':
        return (
          <div className="flex items-center gap-1.5 bg-green-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-green-400/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Вы записаны
          </div>
        );
      case 'waitlist':
        return (
          <div className="flex items-center gap-1.5 bg-purple-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-purple-400/30">
            <Timer className="w-3.5 h-3.5" /> Лист ожидания
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex items-center gap-1.5 bg-red-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-red-400/30">
            <XCircle className="w-3.5 h-3.5" /> Отменено
          </div>
        );
      case 'full':
        return (
          <div className="flex items-center gap-1.5 bg-zinc-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-zinc-500/30">
            <AlertCircle className="w-3.5 h-3.5" /> Мест нет
          </div>
        );
      default:
        // Available - maybe show spots left
        if (details.freeSpots <= 3) {
          return (
            <div className="flex items-center gap-1.5 bg-orange-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse border border-orange-400/30">
              <Flame className="w-3.5 h-3.5" /> ост. {details.freeSpots} места
            </div>
          );
        }
        return null;
    }
  };

  const renderBottomAction = () => {
    if (bookingState === 'closed') {
      return (
        <button disabled className="w-full bg-zinc-800 text-zinc-500 py-4 rounded-xl font-bold text-sm cursor-not-allowed border border-zinc-700">
          Запись закрыта
        </button>
      );
    }

    if (bookingState === 'cancelled') {
      return (
        <button
          onClick={() => setBookingState('available')}
          className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-transform hover:bg-cyan-500"
        >
          Записаться снова
        </button>
      );
    }

    if (bookingState === 'booked') {
      return (
        <div className="flex gap-3">
          <button
            onClick={handleCancelRequest}
            className="flex-1 bg-zinc-900 border border-red-900/50 text-red-500 py-4 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 active:bg-red-950/20 transition-colors hover:text-red-400"
          >
            Отменить
          </button>
          <button
            onClick={() => onNavigate('my_schedule')}
            className="flex-[2] bg-cyan-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-cyan-500"
          >
            <Calendar className="w-4 h-4" />
            Мое расписание
          </button>
        </div>
      );
    }

    if (bookingState === 'waitlist') {
      return (
        <button
          onClick={handleCancelRequest}
          className="w-full bg-zinc-900 border border-red-900/50 text-red-500 py-4 rounded-xl font-bold text-sm shadow-sm active:bg-red-950/20 hover:text-red-400"
        >
          Покинуть лист ожидания
        </button>
      );
    }

    if (bookingState === 'full') {
      return (
        <button
          onClick={handleJoinWaitlist}
          className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-cyan-500"
        >
          <Timer className="w-5 h-5" />
          В лист ожидания
        </button>
      );
    }

    // Available
    return (
      <div className="flex items-center gap-4">
        <div className="flex-col">
          <p className="text-[10px] text-zinc-500 font-bold uppercase mb-0.5">Цена</p>
          {details.requiresPayment ? (
            <p className="text-xl font-black text-white">{details.price} ₽</p>
          ) : (
            <p className="text-xl font-black text-green-500">Бесплатно</p>
          )}
        </div>
        <button
          onClick={handleBook}
          className="flex-1 bg-cyan-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-cyan-500"
        >
          {details.requiresPayment ? 'Оплатить' : 'Записаться'}
          <ChevronRight className="w-4 h-4 opacity-50" />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col relative">

      {/* Hero Image */}
      <div className="relative h-72 w-full shrink-0">
        <img
          src={details.image}
          alt="Class"
          className={`w-full h-full object-cover transition-all duration-500 hover:scale-105 ${bookingState === 'cancelled' ? 'grayscale opacity-30' : 'grayscale'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-black/40"></div>

        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 safe-area-top">
          <button onClick={handleBack} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-colors text-white border border-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-colors text-white border border-white/10">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Tags */}
        <div className="absolute top-20 left-5 flex flex-col gap-2 items-start">
          {details.tags.map((tag, i) => (
            <span key={i} className="px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase rounded-lg shadow-sm">
              {tag}
            </span>
          ))}
        </div>

        {/* Title Block */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
          <div className="mb-3">{renderStatusBadge()}</div>
          <h1 className="text-3xl font-black text-white leading-tight mb-1 drop-shadow-md italic uppercase">{details.title}</h1>
          <p className="text-zinc-300 text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-500" /> {details.duration}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 -mt-4 relative z-30 pb-32">
        <div className="bg-zinc-900 rounded-t-3xl shadow-xl shadow-black/20 border-t border-l border-r border-zinc-800 min-h-full p-5 space-y-6">

          {/* Date & Location */}
          <div className="flex items-start gap-4 pb-4 border-b border-zinc-800">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex flex-col items-center justify-center text-cyan-500 shrink-0 border border-cyan-500/20">
              <span className="text-[10px] font-bold uppercase">{details.weekday.substring(0, 3)}</span>
              <span className="text-xl font-black leading-none">{details.date.split(' ')[0]}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-white">{details.startTime}</span>
                <span className="text-sm text-zinc-500 font-medium">- {details.endTime}</span>
              </div>
              <p className="text-sm text-zinc-400 leading-snug">{details.studio}</p>
            </div>
          </div>

          {/* Trainer Card */}
          <div
            onClick={() => onNavigate('trainer_about')}
            className="flex items-center justify-between p-3 rounded-2xl border border-zinc-800 bg-zinc-950 hover:border-cyan-500/30 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden ring-2 ring-zinc-800 group-hover:ring-cyan-500/50 transition-all">
                <img src={details.trainerImg} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Trainer" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase">Тренер</p>
                <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{details.trainerName}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-cyan-500" />
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-white text-sm mb-2 uppercase tracking-wide">О занятии</h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
              {details.description}
            </p>
          </div>

          {/* Notes */}
          {details.notes && (
            <div className="bg-cyan-500/10 p-4 rounded-xl border border-cyan-500/20 flex gap-3">
              <Info className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-cyan-400 uppercase mb-1">Важно</h4>
                <p className="text-xs text-cyan-100/80 leading-relaxed">{details.notes}</p>
              </div>
            </div>
          )}

          {/* Policy & Rules */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2 mb-2 text-zinc-500">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Правила отмены</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Бесплатная отмена за <strong>{details.cancelWindow}</strong> до начала.
              {details.latePolicy}
            </p>
          </div>

          {/* Stats (Level, Calories) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase">Уровень</p>
                <p className="text-sm font-bold text-white">{details.level}</p>
              </div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase">Расход</p>
                <p className="text-sm font-bold text-white">{details.calories}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 safe-area-bottom z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-md mx-auto">
          {renderBottomAction()}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowCancelModal(false)}></div>
          <div className="bg-zinc-900 w-full max-w-sm mx-4 mb-4 sm:mb-0 rounded-3xl p-6 relative animate-in slide-in-from-bottom duration-300 shadow-2xl border border-zinc-800">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 mx-auto border border-red-500/20">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-center text-white mb-2">Отменить запись?</h2>
            <p className="text-sm text-center text-zinc-400 mb-6 leading-relaxed">
              Вы уверены, что хотите отменить <strong>{details.title}</strong>?
              <br />
              <span className="text-xs text-red-400 font-bold mt-2 block bg-red-500/10 py-1 px-2 rounded border border-red-500/20">
                {details.latePolicy}
              </span>
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="py-3 rounded-xl font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Оставить
              </button>
              <button
                onClick={confirmCancel}
                className="py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
              >
                Да, отменить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEV CONTROLS (Hidden in prod) */}
      <div className="fixed top-20 right-2 z-50 opacity-20 hover:opacity-100 transition-opacity">
        <select
          value={bookingState}
          onChange={(e) => setBookingState(e.target.value as BookingState)}
          className="bg-black/50 text-white text-[10px] p-1 rounded backdrop-blur-md border border-white/10"
        >
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="waitlist">Waitlist</option>
          <option value="full">Full</option>
          <option value="cancelled">Cancelled</option>
          <option value="closed">Closed</option>
        </select>
      </div>

    </div>
  );
};

export default BookingDetailsScreen;
