import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Star,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Edit,
  UserPlus,
  Archive,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MethodistProgramDetailScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const progressData = [
  { week: 'Нед 1', progress: 95 },
  { week: 'Нед 2', progress: 88 },
  { week: 'Нед 3', progress: 82 },
  { week: 'Нед 4', progress: 79 },
  { week: 'Нед 5', progress: 75 },
  { week: 'Нед 6', progress: 71 },
];

interface WeekDay {
  name: string;
  exercises: string[];
}

interface Week {
  number: number;
  days: WeekDay[];
}

const programWeeks: Week[] = [
  {
    number: 1,
    days: [
      { name: 'День 1: Верхняя часть тела', exercises: ['Жим лёжа', 'Тяга в наклоне', 'Жим гантелей'] },
      { name: 'День 2: Нижняя часть тела', exercises: ['Приседания', 'Румынская тяга', 'Выпады'] },
      { name: 'День 3: Полное тело', exercises: ['Становая тяга', 'Подтягивания', 'Жим стоя'] },
    ],
  },
];

const trainers = [
  { initials: 'АП', name: 'А. Петров', specialty: 'Силовые', color: 'bg-purple-500' },
  { initials: 'МС', name: 'М. Смирнова', specialty: 'Групповые', color: 'bg-blue-500' },
  { initials: 'ДК', name: 'Д. Козлов', specialty: 'Функциональный', color: 'bg-green-500' },
];

const MethodistProgramDetailScreen: React.FC<MethodistProgramDetailScreenProps> = ({ onNavigate }) => {
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]));

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekNumber)) {
        next.delete(weekNumber);
      } else {
        next.add(weekNumber);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('BACK')}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Силовая база</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700">Активна</span>
          </div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="px-4 pb-24">
        {/* Metrics Row */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">32</p>
              <p className="text-xs text-gray-500">клиента</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">4</p>
              <p className="text-xs text-gray-500">тренера</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">78%</p>
              <p className="text-xs text-gray-500">прогресс</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">4.6</p>
              <p className="text-xs text-gray-500">оценка</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-50 rounded-2xl p-4 mt-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Описание</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Базовая силовая программа для начинающих и среднего уровня. Фокус на основных мультисуставных
            движениях с прогрессией нагрузки каждые 2 недели.
          </p>
        </div>

        {/* Program Structure */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Структура программы</h2>

          {/* Week 1 (expandable with data) */}
          {programWeeks.map((week) => (
            <div key={week.number} className="mb-2">
              <button
                onClick={() => toggleWeek(week.number)}
                className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between"
              >
                <span className="font-medium text-gray-900">Неделя {week.number}</span>
                {expandedWeeks.has(week.number) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {expandedWeeks.has(week.number) && (
                <div className="mt-1 ml-4 space-y-2">
                  {week.days.map((day, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-sm font-medium text-gray-800">{day.name}</p>
                      <ul className="mt-1.5 space-y-1">
                        {day.exercises.map((exercise, eIdx) => (
                          <li key={eIdx} className="text-xs text-gray-500 flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-purple-400 rounded-full flex-shrink-0" />
                            {exercise}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Weeks 2-12 (collapsed, no data) */}
          {Array.from({ length: 11 }, (_, i) => i + 2).map((weekNum) => (
            <div key={weekNum} className="mb-2">
              <button
                onClick={() => toggleWeek(weekNum)}
                className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between"
              >
                <span className="font-medium text-gray-900">Неделя {weekNum}</span>
                {expandedWeeks.has(weekNum) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {expandedWeeks.has(weekNum) && (
                <div className="mt-1 ml-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">Содержание недели {weekNum}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Assigned Trainers */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Назначенные тренеры</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {trainers.map((trainer, idx) => (
              <div key={idx} className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-14 h-14 ${trainer.color} rounded-full flex items-center justify-center`}
                >
                  <span className="text-sm font-bold text-white">{trainer.initials}</span>
                </div>
                <p className="text-xs font-medium text-gray-900 mt-2">{trainer.name}</p>
                <p className="text-xs text-gray-500">{trainer.specialty}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Effectiveness Chart */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Эффективность программы</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs text-gray-500 mb-3">Прогресс клиентов по неделям, %</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={progressData}>
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Прогресс']}
                />
                <Bar dataKey="progress" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button className="w-full bg-purple-600 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors">
            <Edit className="w-4 h-4" />
            Редактировать
          </button>
          <button className="w-full bg-white text-purple-600 font-semibold py-3.5 rounded-2xl border-2 border-purple-600 flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors">
            <UserPlus className="w-4 h-4" />
            Назначить тренерам
          </button>
          <button className="w-full text-gray-500 font-medium py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <Archive className="w-4 h-4" />
            Архивировать
          </button>
        </div>
      </div>
    </div>
  );
};

export default MethodistProgramDetailScreen;
