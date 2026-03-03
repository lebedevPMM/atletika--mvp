import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  LogOut,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  Bell,
  ChevronRight,
  Inbox,
  ListTodo,
  MapPin,
  Activity,
  ChevronLeft,
  AlertOctagon,
  XCircle,
  Play
} from 'lucide-react';

interface TrainerHomeScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerHomeScreen: React.FC<TrainerHomeScreenProps> = ({ onNavigate }) => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0); // 0 = Today

  // Mock Shift Data
  const shift = {
    club: 'Atletika+ Moscow City',
    time: '10:00 - 18:00',
    isActive: true,
  };

  // Mock Date Navigation
  const dates = [
    { label: 'Вчера', date: '24 Окт' },
    { label: 'Сегодня', date: '25 Окт' },
    { label: 'Завтра', date: '26 Окт' },
  ];

  // Mock Signals (Red Zone)
  const signals = [
    { id: 1, text: 'Алексей П. - 3 пропуска подряд', type: 'missed', action: 'Написать' },
    { id: 2, text: 'Мария К. - Нет замеров 45 дней', type: 'stagnation', action: 'Открыть' },
  ];

  // Mock Schedule
  const [schedule, setSchedule] = useState([
    { id: 1, time: '09:00', client: 'Мария Иванова', type: 'Персональная', status: 'completed' },
    { id: 2, time: '11:00', client: 'Дмитрий Петров', type: 'Сплит-тренировка', status: 'completed' },
    { id: 3, time: '14:00', client: 'Обед', type: 'break', status: 'break' },
    { id: 4, time: '15:30', client: 'Елена Соколова', type: 'Вводный инструктаж', status: 'upcoming' },
    { id: 5, time: '17:00', client: 'Алексей Смирнов', type: 'Персональная', status: 'upcoming' },
    { id: 6, time: '19:00', client: 'Группа "Сила"', type: 'Групповая (8 чел)', status: 'upcoming' },
  ]);

  const handleStatusChange = (id: number, newStatus: string) => {
    setSchedule(prev => prev.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  const handleItemClick = (item: any) => {
    if (item.status === 'break') return;
    if (item.type.includes('Групповая')) {
      onNavigate('trainer_class_details');
    } else {
      onNavigate('trainer_client_profile');
    }
  };

  // Nearest Session (Next Upcoming)
  const nearestSession = schedule.find(s => s.status === 'upcoming' && s.type !== 'break');

  return (
    <div className="bg-gray-50 min-h-screen pb-24 flex flex-col">
      {/* Dark Header Area */}
      <div className="bg-blue-600 pt-12 pb-6 px-5 rounded-b-[2rem] shadow-xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>

        {/* Top Header */}
        <div className="relative z-10 flex justify-between items-start mb-6">
          <div onClick={() => onNavigate('trainer_select_club')} className="flex items-center gap-3 active:opacity-80 transition-opacity cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold border border-white/30 backdrop-blur-sm">
              ТР
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">Анна М.</h1>
              <div className="flex items-center gap-1.5 mt-1 bg-black/10 px-2 py-0.5 rounded-lg w-fit backdrop-blur-sm">
                <MapPin className="w-3 h-3 text-white/70" />
                <p className="text-white/90 text-[10px] font-medium truncate max-w-[120px]">{shift.club}</p>
                <ChevronRight className="w-3 h-3 text-white/50" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('trainer_notifications')}
              className="p-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors relative backdrop-blur-sm"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-400 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Date Navigation (Mock) */}
        <div className="relative z-10 flex items-center justify-between bg-white/10 p-1 rounded-xl backdrop-blur-md mb-6 border border-white/10">
          <button
            onClick={() => setSelectedDateIndex(selectedDateIndex > 0 ? selectedDateIndex - 1 : 0)}
            className="p-2 text-white/70 hover:bg-white/10 rounded-lg disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-sm">{dates[1].label}</span>
            <span className="text-white/60 text-xs">{dates[1].date}</span>
          </div>
          <button
            onClick={() => setSelectedDateIndex(2)}
            className="p-2 text-white/70 hover:bg-white/10 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Nearest Session Card */}
        {nearestSession && (
          <div className="relative z-10 bg-white rounded-2xl p-4 shadow-lg animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide bg-blue-50 px-2 py-0.5 rounded-md mb-1 inline-block">Ближайшая</span>
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{nearestSession.client}</h3>
                <p className="text-gray-500 text-sm">{nearestSession.type}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900 block leading-none">{nearestSession.time}</span>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-1.5 rounded">Через 15 мин</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('trainer_class_details')}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-blue-200 shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Начать занятие
            </button>
          </div>
        )}
      </div>

      <div className="px-5 mt-6 space-y-6 flex-1 overflow-y-auto">

        {/* Signals Section */}
        {signals.length > 0 && (
          <div className="slide-in-from-bottom delay-100 duration-500">
            <h2 className="text-xs font-bold text-red-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4" />
              Красная зона ({signals.length})
            </h2>
            <div className="space-y-3">
              {signals.map(signal => (
                <div key={signal.id} className="bg-white p-3 rounded-xl border-l-4 border-l-red-500 shadow-sm flex items-center justify-between border border-gray-100">
                  <span className="text-sm font-bold text-gray-800">{signal.text}</span>
                  <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg active:bg-blue-100">
                    {signal.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="slide-in-from-bottom delay-200 duration-500">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-bold text-gray-900">Лента дня</h2>
          </div>

          <div className="space-y-4 relative before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-200">
            {schedule.map((item) => (
              <div key={item.id} className="relative pl-10">
                {/* Timeline Dot */}
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-[3px] border-gray-50 shadow-sm z-10 ${item.status === 'completed' ? 'bg-green-500' :
                  item.status === 'break' ? 'bg-gray-300' :
                    item.status === 'missed' ? 'bg-red-500' : 'bg-blue-600'
                  }`}></div>

                {/* Time */}
                <div className="absolute left-0 top-0 text-[10px] font-bold text-gray-400 -mt-1.5 ml-2 bg-gray-50 px-1 rounded">
                  {item.time}
                </div>

                {/* Card */}
                <div
                  onClick={() => handleItemClick(item)}
                  className={`rounded-2xl p-4 border shadow-sm transition-all active:scale-[0.99] ${item.status === 'break'
                    ? 'bg-gray-50 border-gray-100 border-dashed cursor-default opacity-70'
                    : item.status === 'completed'
                      ? 'bg-green-50/50 border-green-100' // Green tint for done
                      : item.status === 'missed'
                        ? 'bg-red-50/50 border-red-100' // Red tint for missed
                        : 'bg-white border-gray-100 cursor-pointer'
                    }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-sm font-bold ${item.status === 'break' ? 'text-gray-500' : 'text-gray-900'}`}>
                        {item.client}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{item.type}</p>
                    </div>

                    {/* Status Badge or Actions */}
                    {item.status === 'completed' && (
                      <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Проведено
                      </span>
                    )}
                    {item.status === 'missed' && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Пропуск
                      </span>
                    )}
                  </div>

                  {/* Action Buttons for Upcoming */}
                  {item.status === 'upcoming' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(item.id, 'completed'); }}
                        className="flex-1 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 active:scale-95 transition-transform"
                      >
                        Проведено
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(item.id, 'missed'); }}
                        className="flex-1 py-2 bg-gray-50 text-gray-500 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-600 active:scale-95 transition-transform"
                      >
                        Пропуск
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerHomeScreen;