import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Plus,
  MoreVertical,
  MapPin,
  Check,
  AlertCircle,
  Users,
  X,
  Phone,
  MessageSquare,
  Play,
  User,
  Coffee,
  Briefcase,
  CalendarDays
} from 'lucide-react';

interface TrainerScheduleScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerScheduleScreen: React.FC<TrainerScheduleScreenProps> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [selectedDateIndex, setSelectedDateIndex] = useState(0); // 0 is today
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // Dynamic dates generator
  const getDays = () => {
    return Array.from({ length: 14 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        day: d.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase(),
        date: d.getDate().toString(),
        full: d,
        isToday: i === 0,
        hasEvents: Math.random() > 0.3
      };
    });
  };

  const days = getDays();
  const selectedDateObj = days[selectedDateIndex];
  const monthName = selectedDateObj.full.toLocaleDateString('ru-RU', { month: 'long' });

  // Mock Schedule Data with conflicts
  const schedule = [
    { id: 1, time: '09:00', endTime: '10:00', title: 'Мария Иванова', type: 'pt', status: 'completed', location: 'Тренажерный зал', paid: true, conflict: false },
    { id: 2, time: '10:00', endTime: '11:00', title: 'Свободное окно', type: 'free', status: 'free' },
    // Conflict Example
    { id: 3, time: '11:00', endTime: '12:00', title: 'Дмитрий Петров', type: 'pt', status: 'upcoming', location: 'Зона единоборств', paid: false, conflict: true },
    { id: 31, time: '11:30', endTime: '12:30', title: 'Анна Сидорова', type: 'pt', status: 'upcoming', location: 'Кардио зона', paid: true, conflict: true },

    { id: 4, time: '12:30', endTime: '13:00', title: 'Свободное окно', type: 'free', status: 'free' },
    { id: 5, time: '13:00', endTime: '14:00', title: 'Обед', type: 'break', status: 'break' },
    { id: 6, time: '14:00', endTime: '15:00', title: 'Свободное окно', type: 'free', status: 'free' },
    { id: 7, time: '15:00', endTime: '16:30', title: 'Группа "Сила"', type: 'group', status: 'upcoming', count: 8, max: 12, location: 'Зал №2', conflict: false },
  ];

  const getSlotStyle = (type: string, status: string, conflict?: boolean) => {
    if (conflict) return 'bg-red-50 border-red-200 border-l-4 border-l-red-500';
    if (type === 'break') return 'bg-gray-100 border-gray-200 opacity-70';
    if (type === 'free') return 'bg-white border-gray-200 border-dashed hover:border-blue-300';
    if (status === 'completed') return 'bg-green-50 border-green-100';
    if (type === 'group') return 'bg-purple-50 border-purple-100';
    return 'bg-blue-50 border-blue-100';
  };

  const handleSlotClick = (id: number, type: string) => {
    if (type !== 'free' && type !== 'break') {
      // Direct navigation for simplicity in MVP, or open details
      if (type === 'group') {
        onNavigate('trainer_class_details');
      } else {
        setActiveSlot(id); // For PT showing action sheet
      }
    } else if (type === 'free') {
      setIsAddingEvent(true);
    }
  };

  const handleStartSession = () => {
    // Navigate to tracking or details
    setActiveSlot(null);
    onNavigate('trainer_class_details'); // Reusing for now
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col relative">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="p-4 flex items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('trainer_home')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Расписание</h1>
          </div>

          {/* Day/Week Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'day' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >
              День
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'week' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >
              Неделя
            </button>
          </div>
        </div>

        {/* Month & Today */}
        <div className="px-4 flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900 capitalize">
            {monthName}
          </div>
          <button
            onClick={() => setSelectedDateIndex(0)}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${selectedDateIndex === 0 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
          >
            Сегодня
          </button>
        </div>

        {/* Date Strip */}
        <div className="flex px-2 pb-4 overflow-x-auto no-scrollbar gap-2">
          {days.map((d, index) => (
            <button
              key={index}
              onClick={() => setSelectedDateIndex(index)}
              className={`flex flex-col items-center justify-center min-w-[48px] h-16 rounded-2xl transition-all relative shrink-0 ${selectedDateIndex === index
                  ? 'bg-gray-900 text-white shadow-lg scale-105 z-10'
                  : 'bg-transparent text-gray-400 hover:bg-gray-50'
                }`}
            >
              <span className="text-[10px] font-bold mb-1">{d.day}</span>
              <span className="text-lg font-bold leading-none">{d.date}</span>
              {d.hasEvents && selectedDateIndex !== index && (
                <span className="absolute bottom-2 w-1 h-1 bg-blue-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'week' ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
          <CalendarDays className="w-12 h-12 mb-3 opacity-20" />
          <p className="text-sm font-medium">Режим недели в разработке</p>
          <button onClick={() => setViewMode('day')} className="mt-4 text-blue-600 font-bold text-sm">Вернуться к дню</button>
        </div>
      ) : (
        <>
          {/* Summary Stats (Day View Only) */}
          <div className="grid grid-cols-3 gap-3 p-4">
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Записей</span>
              <p className="text-lg font-bold text-gray-900">6</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Часов</span>
              <p className="text-lg font-bold text-gray-900">6.5</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Доход</span>
              <p className="text-lg font-bold text-green-600">12k</p>
            </div>
          </div>

          {/* Timeline List */}
          <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-4">
            {schedule.map((slot) => (
              <div key={slot.id} className="flex gap-4 group">
                {/* Time Column */}
                <div className="w-12 text-right shrink-0 pt-2">
                  <span className="text-sm font-bold text-gray-900 block">{slot.time}</span>
                  <span className="text-[10px] text-gray-400 block">{slot.endTime}</span>
                </div>

                {/* Card */}
                <div
                  onClick={() => handleSlotClick(slot.id, slot.type)}
                  className={`flex-1 rounded-2xl p-3 border relative transition-all active:scale-[0.98] ${getSlotStyle(slot.type, slot.status, slot.conflict)}`}
                >
                  {/* Vertical Status Line */}
                  <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${slot.conflict ? 'bg-red-500' :
                      slot.type === 'pt' ? 'bg-blue-500' : slot.type === 'group' ? 'bg-purple-500' : 'bg-transparent'
                    }`}></div>

                  <div className="flex justify-between items-start pl-3">
                    <div>
                      {/* Title */}
                      <h3 className={`font-bold text-sm ${slot.type === 'free' ? 'text-gray-400' : 'text-gray-900'} flex items-center gap-2`}>
                        {slot.title}
                        {slot.conflict && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 rounded font-bold flex items-center gap-0.5"><AlertCircle className="w-3 h-3" /> Конфликт</span>}
                      </h3>

                      {/* Details */}
                      {slot.type !== 'free' && slot.type !== 'break' && (
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" /> {slot.location}
                          </div>
                          {slot.type === 'group' && (
                            <div className="flex items-center gap-1.5 text-xs text-purple-700 font-medium">
                              <Users className="w-3 h-3" /> {slot.count}/{slot.max} чел.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions / Icons */}
                    <div className="flex flex-col items-end gap-2">
                      {slot.type === 'pt' && (
                        slot.paid ? (
                          <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Опл.
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <AlertCircle className="w-3 h-3" /> Долг
                          </span>
                        )
                      )}
                      {slot.type === 'free' && (
                        <button className="bg-gray-100 p-1.5 rounded-lg text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={() => setIsAddingEvent(true)}
          className="w-14 h-14 bg-gray-900 rounded-full shadow-lg shadow-gray-400 flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Add Event Modal */}
      {isAddingEvent && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddingEvent(false)}></div>
          <div className="bg-white w-full rounded-t-3xl p-6 relative animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Создать событие</h2>
              <button onClick={() => setIsAddingEvent(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-transparent hover:border-blue-200">
                <User className="w-6 h-6" />
                <span className="font-bold text-sm">Клиент</span>
              </button>
              <button className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center gap-2 hover:bg-purple-50 hover:text-purple-600 transition-colors border border-transparent hover:border-purple-200">
                <Users className="w-6 h-6" />
                <span className="font-bold text-sm">Группа</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center gap-2 hover:bg-yellow-50 hover:text-yellow-600 transition-colors border border-transparent hover:border-yellow-200">
                <Coffee className="w-6 h-6" />
                <span className="font-bold text-sm">Перерыв</span>
              </button>
              <button className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-200">
                <Briefcase className="w-6 h-6" />
                <span className="font-bold text-sm">Дежурство</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Sheet */}
      {activeSlot && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActiveSlot(null)}></div>
          <div className="bg-white w-full rounded-t-3xl p-6 relative animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Действия</h2>
              <button onClick={() => setActiveSlot(null)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={handleStartSession}
                className="p-4 bg-green-50 rounded-2xl flex flex-col items-center gap-2 active:bg-green-100 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 ml-0.5" />
                </div>
                <span className="font-bold text-green-700 text-sm">Начать</span>
              </button>

              <button
                onClick={() => onNavigate('chat_room')}
                className="p-4 bg-blue-50 rounded-2xl flex flex-col items-center gap-2 active:bg-blue-100 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="font-bold text-blue-700 text-sm">Написать</span>
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => onNavigate('trainer_client_profile')}
                className="w-full p-4 rounded-xl border border-gray-100 flex items-center gap-3 font-bold text-gray-700 hover:bg-gray-50"
              >
                <User className="w-5 h-5" /> Открыть профиль
              </button>
              <button className="w-full p-4 rounded-xl border border-gray-100 flex items-center gap-3 font-bold text-red-600 hover:bg-red-50">
                <X className="w-5 h-5" /> Отменить занятие
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerScheduleScreen;
