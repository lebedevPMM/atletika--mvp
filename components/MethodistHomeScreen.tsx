import React from 'react';
import { ScreenName } from '../types';
import {
  Bell,
  Calendar,
  Users,
  Activity,
  AlertTriangle,
  Clock,
  MapPin,
  ChevronRight,
} from 'lucide-react';

interface MethodistHomeScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const MethodistHomeScreen: React.FC<MethodistHomeScreenProps> = ({ onNavigate }) => {
  const signals = [
    {
      id: 1,
      text: 'Тренер Иванов: 3 пропуска подряд',
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-500',
    },
    {
      id: 2,
      text: 'Зал №2: загрузка < 30% (вечер)',
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-500',
    },
    {
      id: 3,
      text: "Программа 'Силовая база': не обновлялась 90 дней",
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-500',
    },
  ];

  const schedule = [
    { time: '07:00', name: 'Утренняя йога', trainer: 'Николаева', hall: 'Зал 1', current: 12, max: 15, full: false },
    { time: '08:30', name: 'Функциональный', trainer: 'Козлов', hall: 'Зал 2', current: 8, max: 12, full: false },
    { time: '09:00', name: 'Силовая база', trainer: 'Петров', hall: 'Зал 3', current: 10, max: 10, full: true },
    { time: '10:30', name: 'Пилатес', trainer: 'Николаева', hall: 'Зал 1', current: 6, max: 15, full: false },
    { time: '12:00', name: 'Бокс', trainer: 'Иванов', hall: 'Зал 4', current: 4, max: 8, full: false },
    { time: '14:00', name: 'Похудение 2.0', trainer: 'Смирнова', hall: 'Зал 2', current: 15, max: 20, full: false },
    { time: '17:00', name: 'Танцы', trainer: 'Волкова', hall: 'Зал 1', current: 18, max: 20, full: false },
    { time: '19:00', name: 'Силовая вечер', trainer: 'Петров', hall: 'Зал 3', current: 10, max: 10, full: true },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-24 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 pt-12 pb-6 px-5 rounded-b-[2rem] shadow-xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>

        <div className="relative z-10 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm border border-white/30 backdrop-blur-sm">
              АМ
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Анна Методист</h1>
              <p className="text-white/70 text-xs mt-0.5">Atletika Центральный</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('notifications')}
            className="p-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors relative backdrop-blur-sm"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-6 flex-1 overflow-y-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-4.5 h-4.5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 leading-none">24</p>
            <p className="text-[10px] text-gray-500 mt-1 font-medium leading-tight">Тренировок сегодня</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-2">
              <Users className="w-4.5 h-4.5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 leading-none">8</p>
            <p className="text-[10px] text-gray-500 mt-1 font-medium leading-tight">Тренеров на смене</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-2">
              <Activity className="w-4.5 h-4.5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 leading-none">76%</p>
            <p className="text-[10px] text-gray-500 mt-1 font-medium leading-tight">Загрузка залов</p>
          </div>
        </div>

        {/* Signals Section */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-purple-600" />
            Сигналы
          </h2>
          <div className="space-y-2.5">
            {signals.map((signal) => (
              <div
                key={signal.id}
                className={`${signal.color} border rounded-xl p-3.5 flex items-start gap-3`}
              >
                <AlertTriangle className={`w-4 h-4 ${signal.iconColor} mt-0.5 shrink-0`} />
                <p className="text-sm text-gray-800 font-medium leading-snug">{signal.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            Расписание на сегодня
          </h2>

          <div className="space-y-0 relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[39px] top-2 bottom-2 w-px bg-gray-200"></div>

            {schedule.map((item, index) => (
              <div key={index} className="flex items-start gap-4 relative pb-4 last:pb-0">
                {/* Time label */}
                <div className="w-[44px] shrink-0 text-right">
                  <span className="text-xs font-bold text-gray-400">{item.time}</span>
                </div>

                {/* Dot */}
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 relative z-10 ${
                  item.full ? 'bg-green-500' : 'bg-purple-400'
                }`}></div>

                {/* Card */}
                <div className="flex-1 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-gray-900 truncate">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{item.trainer}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs text-gray-500 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" />
                          {item.hall}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        item.full
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.current}/{item.max}
                      </span>
                      {item.full && (
                        <span className="text-[9px] font-bold text-green-600 uppercase">полная</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          <button
            onClick={() => onNavigate('methodist_programs')}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 border-purple-600 text-purple-600 font-bold text-sm hover:bg-purple-50 active:scale-[0.98] transition-all"
          >
            Все программы
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('methodist_trainers')}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 border-purple-600 text-purple-600 font-bold text-sm hover:bg-purple-50 active:scale-[0.98] transition-all"
          >
            Оценки тренеров
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MethodistHomeScreen;
