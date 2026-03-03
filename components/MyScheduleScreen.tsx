
import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  MoreHorizontal,
  XCircle,
  CheckCircle2,
  Calendar,
  Star,
  Filter,
  WifiOff
} from 'lucide-react';

interface MyScheduleScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const MyScheduleScreen: React.FC<MyScheduleScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [typeFilter, setTypeFilter] = useState<'all' | 'group' | 'pt' | 'spa'>('all');
  const isOffline = false; // Mock state: change to true to test offline mode

  const upcomingEvents = [
    {
      id: 1,
      day: '12',
      month: 'Сен',
      weekday: 'Четверг',
      time: '19:00',
      title: 'Йога Flow',
      type: 'group', // normalized type
      displayType: 'Групповое',
      trainer: 'Анна Морозова',
      location: 'Зал групповых программ 2',
      duration: '60 мин',
      canCancel: true,
      image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 2,
      day: '14',
      month: 'Сен',
      weekday: 'Суббота',
      time: '11:00',
      title: 'Персональная тренировка',
      type: 'pt',
      displayType: 'Персональное',
      trainer: 'Алексей Смирнов',
      location: 'Тренажерный зал',
      duration: '60 мин',
      canCancel: true,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop'
    }
  ];

  const historyEvents = [
    {
      id: 3,
      date: '10 Сен',
      time: '18:30',
      title: 'Силовой тренинг',
      trainer: 'Алексей Смирнов',
      status: 'completed',
      type: 'pt',
      rated: false
    },
    {
      id: 4,
      date: '08 Сен',
      time: '10:00',
      title: 'Бассейн',
      trainer: 'Свободное плавание',
      status: 'completed',
      type: 'spa', // using spa/pool loosely as spa type for filter
      rated: true
    },
    {
      id: 5,
      date: '05 Сен',
      time: '19:00',
      title: 'Zumba',
      trainer: 'Мария Иванова',
      status: 'missed',
      type: 'group',
      rated: false
    },
    {
      id: 6,
      date: '01 Сен',
      time: '12:00',
      title: 'Массаж',
      trainer: 'SPA-центр',
      status: 'cancelled',
      type: 'spa',
      rated: false
    }
  ];

  const filterEvents = (events: any[]) => {
    if (typeFilter === 'all') return events;
    return events.filter(e => e.type === typeFilter);
  };

  const currentEvents = activeTab === 'upcoming'
    ? filterEvents(upcomingEvents)
    : filterEvents(historyEvents);

  const FilterChip = ({ id, label }: { id: typeof typeFilter, label: string }) => (
    <button
      onClick={() => setTypeFilter(id)}
      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${typeFilter === id
          ? 'bg-gray-900 text-white border-gray-900'
          : 'bg-white text-gray-600 border-gray-200'
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => onNavigate('home')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Мои записи</h1>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'upcoming' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Предстоящие
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            История
          </button>
        </div>

        {/* Type Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <FilterChip id="all" label="Все" />
          <FilterChip id="group" label="Групповые" />
          <FilterChip id="pt" label="Персональные" />
          <FilterChip id="spa" label="SPA & Wellness" />
        </div>
      </div>

      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-center gap-2 text-xs font-bold animate-in slide-in-from-top-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span className="opacity-90">Нет сети. Показана сохраненная версия.</span>
        </div>
      )}

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {activeTab === 'upcoming' ? (
          currentEvents.length > 0 ? (
            currentEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => onNavigate(event.type === 'pt' ? 'booking_pt_details' : 'booking_class_details')}
                className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 relative overflow-hidden group active:scale-[0.99] transition-transform"
              >
                <div className="flex gap-4">
                  {/* Date Column */}
                  <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl w-16 h-16 shrink-0 border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase">{event.month}</span>
                    <span className="text-xl font-extrabold text-gray-900 leading-none">{event.day}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base truncate">{event.title}</h3>
                        <p className="text-xs text-gray-500 mb-2">{event.trainer}</p>
                      </div>
                      <div className="bg-gray-100 p-1.5 rounded-full text-gray-400">
                        <MoreHorizontal className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                        <Clock className="w-3 h-3" /> {event.time}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3" /> {event.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                  <button
                    disabled={isOffline}
                    onClick={(e) => { e.stopPropagation(); onNavigate('calendar_sync'); }}
                    className="flex-1 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Calendar className="w-3.5 h-3.5" /> В календарь
                  </button>
                  {event.canCancel && (
                    <button
                      disabled={isOffline}
                      onClick={(e) => { e.stopPropagation(); onNavigate('booking_cancel'); }}
                      className="flex-1 py-2 bg-red-50 rounded-xl text-xs font-bold text-red-600 flex items-center justify-center gap-2 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Отменить
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center text-gray-400">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <CalendarDays className="w-10 h-10 opacity-30" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Нет записей</h3>
              <p className="text-sm max-w-[200px]">У вас нет предстоящих тренировок в этой категории.</p>
              <button
                onClick={() => onNavigate('booking_schedule')}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
              >
                Открыть расписание
              </button>
            </div>
          )
        ) : (
          <div className="space-y-3">
            {currentEvents.length > 0 ? currentEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-sm">{event.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{event.trainer}</p>
                    <span className="text-xs text-gray-400 font-medium">{event.date} • {event.time}</span>
                  </div>
                  <div className="text-right">
                    {event.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-lg">
                        <CheckCircle2 className="w-3 h-3" /> Посещено
                      </span>
                    )}
                    {event.status === 'missed' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-1 rounded-lg">
                        Пропущено
                      </span>
                    )}
                    {event.status === 'cancelled' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                        Отменено
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Action */}
                {event.status === 'completed' && !event.rated && (
                  <button
                    disabled={isOffline}
                    onClick={() => onNavigate('review_create')}
                    className="w-full py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Star className="w-3.5 h-3.5" /> Оценить тренировку
                  </button>
                )}
                {event.rated && (
                  <div className="w-full py-2 text-center text-[10px] font-medium text-gray-400">
                    Вы оценили это занятие
                  </div>
                )}
              </div>
            )) : (
              <div className="text-center py-12 text-gray-400">
                <p>История пуста</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyScheduleScreen;
