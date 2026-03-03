
import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  CheckCircle2,
  Calendar,
  Home,
  QrCode,
  Clock,
  CreditCard,
  AlertCircle,
  XCircle,
  RefreshCw,
  Share2,
  MapPin,
  User
} from 'lucide-react';

interface BookingResultScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type ResultStatus = 'confirmed' | 'pending_confirm' | 'pending_payment' | 'error';

const BookingResultScreen: React.FC<BookingResultScreenProps> = ({ onNavigate }) => {
  // DEMO STATE: Default to confirmed
  const [status, setStatus] = useState<ResultStatus>('confirmed');

  // Mock Booking Data
  const booking = {
    id: '8392-AB',
    title: 'Yoga Flow',
    date: '12 Сен',
    weekday: 'Четверг',
    time: '19:00',
    duration: '60 мин',
    location: 'Atletika+ Сити',
    room: 'Зал ГП #2',
    trainer: 'Анна Морозова',
    price: 2500,
    cancelWindow: 'Бесплатная отмена до 17:00 (за 2ч).',
    paymentDeadline: '15 мин'
  };

  const renderContent = () => {
    switch (status) {
      case 'confirmed':
        return {
          icon: <CheckCircle2 className="w-16 h-16 text-green-500" strokeWidth={2} />,
          bg: 'bg-green-500/10',
          ring: 'ring-green-500/20',
          title: 'Подтверждено!',
          subtitle: 'Запись добавлена в ваше расписание. Ждем вас!',
          primaryAction: { label: 'Открыть расписание', icon: Calendar, target: 'my_schedule' as ScreenName },
          showTicket: true
        };
      case 'pending_confirm':
        return {
          icon: <Clock className="w-16 h-16 text-cyan-500" strokeWidth={2} />,
          bg: 'bg-cyan-500/10',
          ring: 'ring-cyan-500/20',
          title: 'Запрос отправлен',
          subtitle: 'Мы уведомим вас, как только клуб подтвердит запись (обычно в течение 10 мин).',
          primaryAction: { label: 'В расписание', icon: Calendar, target: 'my_schedule' as ScreenName },
          showTicket: true
        };
      case 'pending_payment':
        return {
          icon: <CreditCard className="w-16 h-16 text-orange-500" strokeWidth={2} />,
          bg: 'bg-orange-500/10',
          ring: 'ring-orange-500/20',
          title: 'Счет создан',
          subtitle: `Для гарантии места оплатите счет в течение ${booking.paymentDeadline}.`,
          primaryAction: { label: 'Оплатить', icon: CreditCard, target: 'invoice' as ScreenName },
          showTicket: true
        };
      case 'error':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" strokeWidth={2} />,
          bg: 'bg-red-500/10',
          ring: 'ring-red-500/20',
          title: 'Ошибка',
          subtitle: 'Что-то пошло не так. Пожалуйста, попробуйте снова или свяжитесь с поддержкой.',
          primaryAction: { label: 'Попробовать снова', icon: RefreshCw, target: 'booking_class_details' as ScreenName },
          showTicket: false
        };
    }
  };

  const content = renderContent();

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col relative">

      {/* Dev Controls */}
      <div className="absolute top-4 left-4 z-50">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ResultStatus)}
          className="bg-black/50 backdrop-blur border border-zinc-700 text-[10px] rounded-lg px-2 py-1 font-mono text-zinc-400 hover:text-white"
        >
          <option value="confirmed">Confirmed</option>
          <option value="pending_confirm">Pending Confirm</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="error">Error</option>
        </select>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">

        {/* Status Icon */}
        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-2xl ring-8 ${content.bg} ${content.ring}`}>
          {content.icon}
        </div>

        <h1 className="text-3xl font-black text-white mb-2 leading-tight italic uppercase">{content.title}</h1>
        <p className="text-zinc-500 mb-8 max-w-xs mx-auto text-sm leading-relaxed font-medium">
          {content.subtitle}
        </p>

        {/* Ticket Summary Card */}
        {content.showTicket && (
          <div className="w-full max-w-sm bg-zinc-900 rounded-3xl overflow-hidden shadow-xl mb-6 flex flex-col relative border border-zinc-800">
            {/* Ticket Header */}
            <div className="bg-zinc-800 p-5 text-white text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-1">{booking.title}</h3>
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <User className="w-3.5 h-3.5" />
                  <span>{booking.trainer}</span>
                </div>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-5 pt-7 pb-6 relative">
              {/* Perforations */}
              <div className="absolute top-0 left-0 -ml-3 -mt-3 w-6 h-6 bg-zinc-950 rounded-full border-b border-r border-zinc-800"></div>
              <div className="absolute top-0 right-0 -mr-3 -mt-3 w-6 h-6 bg-zinc-950 rounded-full border-b border-l border-zinc-800"></div>
              <div className="absolute top-0 left-3 right-3 border-t-2 border-dashed border-zinc-700"></div>

              <div className="grid grid-cols-2 gap-y-5 text-left mb-6">
                <div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Дата
                  </p>
                  <p className="text-sm font-bold text-white">{booking.date}</p>
                  <p className="text-xs text-zinc-500">{booking.weekday}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Время
                  </p>
                  <p className="text-sm font-bold text-white">{booking.time}</p>
                  <p className="text-xs text-zinc-500">{booking.duration}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Место
                  </p>
                  <p className="text-sm font-bold text-white">{booking.location}</p>
                  <p className="text-xs text-zinc-500">{booking.room}</p>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-zinc-200">
                <div className="text-left text-black">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">ID Записи</p>
                  <p className="text-lg font-mono font-bold">{booking.id}</p>
                </div>
                <QrCode className="w-8 h-8 text-black opacity-90" />
              </div>
            </div>
          </div>
        )}

        {/* Cancellation / Info Block */}
        {content.showTicket && (
          <div className="w-full max-w-sm flex items-start gap-3 p-4 bg-zinc-900 rounded-2xl mb-6 text-left border border-zinc-800">
            <AlertCircle className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              {status === 'pending_payment'
                ? 'Запись будет отменена автоматически, если оплата не поступит.'
                : booking.cancelWindow
              }
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="w-full space-y-3 max-w-sm mt-auto">
          <button
            onClick={() => onNavigate(content.primaryAction.target)}
            className={`w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform text-white ${status === 'error' ? 'bg-zinc-800 shadow-none' :
              status === 'pending_payment' ? 'bg-orange-600 shadow-orange-500/20' :
                'bg-cyan-600 shadow-cyan-500/20 hover:bg-cyan-500'
              }`}
          >
            <content.primaryAction.icon className="w-5 h-5" />
            {content.primaryAction.label}
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 py-3.5 rounded-xl font-bold hover:bg-zinc-800 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            На главную
          </button>

          {status === 'confirmed' && (
            <button className="text-xs text-zinc-600 font-bold flex items-center justify-center gap-1 mt-2 hover:text-zinc-400 transition-colors">
              <Share2 className="w-3 h-3" /> Поделиться / В календарь
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingResultScreen;
