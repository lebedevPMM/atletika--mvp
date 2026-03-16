import React, { useState } from 'react';
import { ScreenName } from '../types';
import { getHeatmapForWeek, getOccupancyColorFromPercent } from '../mocks/occupancy-engine';
import {
  ArrowLeft,
  Activity,
  Percent,
  UserCheck,
  UserPlus,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface MethodistAnalyticsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const attendanceData = [
  { day: 'Пн', value: 185 },
  { day: 'Вт', value: 210 },
  { day: 'Ср', value: 195 },
  { day: 'Чт', value: 220 },
  { day: 'Пт', value: 240 },
  { day: 'Сб', value: 178 },
  { day: 'Вс', value: 120 },
];

const popularClasses = [
  { name: 'Силовая', count: 156 },
  { name: 'Йога', count: 128 },
  { name: 'Кардио', count: 112 },
  { name: 'Пилатес', count: 95 },
  { name: 'Бокс', count: 78 },
];

const trainerLoad = [
  { name: 'Петров А.', value: 32, color: '#7C3AED' },
  { name: 'Смирнова М.', value: 28, color: '#8B5CF6' },
  { name: 'Козлов Д.', value: 24, color: '#A78BFA' },
  { name: 'Николаева О.', value: 20, color: '#C4B5FD' },
  { name: 'Другие', value: 36, color: '#E9D5FF' },
];

// Heatmap data derived from the occupancy engine curves
const weekHeatmap = getHeatmapForWeek([7, 9, 12, 15, 18, 20]);

function getHeatmapTextColor(value: number): string {
  // Dark text on light backgrounds (green shades), white on dark (orange/red)
  return value > 60 ? 'text-white' : 'text-gray-900';
}

const MethodistAnalyticsScreen: React.FC<MethodistAnalyticsScreenProps> = ({ onNavigate }) => {
  const [period, setPeriod] = useState<'Неделя' | 'Месяц' | 'Квартал'>('Месяц');

  const metrics = [
    {
      label: 'Посещаемость',
      value: '1,247',
      change: 12,
      positive: true,
      icon: Activity,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Средняя загрузка',
      value: '73%',
      change: 5,
      positive: true,
      icon: Percent,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Удержание',
      value: '82%',
      change: 2,
      positive: false,
      icon: UserCheck,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Новые клиенты',
      value: '34',
      change: 8,
      positive: true,
      icon: UserPlus,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="bg-white min-h-screen pb-24 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-5 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => onNavigate('BACK')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Аналитика клуба</h1>
        </div>

        {/* Period toggle chips */}
        <div className="flex gap-2">
          {(['Неделя', 'Месяц', 'Квартал'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 active:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        {/* Key metrics — 2x2 grid */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="bg-gray-50 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${m.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${m.iconColor}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{m.value}</div>
                <div className="text-xs text-gray-500 mb-1">{m.label}</div>
                <div className={`flex items-center gap-1 text-xs font-medium ${m.positive ? 'text-green-600' : 'text-red-500'}`}>
                  {m.positive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {m.positive ? '+' : '-'}{m.change}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Attendance chart */}
        <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Посещаемость по дням</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '13px',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#7C3AED"
                strokeWidth={2}
                fill="url(#purpleGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Popular classes — horizontal BarChart */}
        <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Популярные занятия</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={popularClasses} layout="vertical">
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#374151' }}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="count" fill="#7C3AED" radius={[0, 6, 6, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Peak hours heatmap — data from occupancy engine */}
        <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Пиковые часы</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-xs text-gray-400 font-medium pb-2 text-left w-12"></th>
                  {weekHeatmap.days.map((day) => (
                    <th key={day} className="text-xs text-gray-400 font-medium pb-2 text-center px-1">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weekHeatmap.hours.map((time, rowIdx) => (
                  <tr key={time}>
                    <td className="text-xs text-gray-500 font-medium pr-2 py-1">{time}</td>
                    {weekHeatmap.data[rowIdx].map((val, colIdx) => (
                      <td key={colIdx} className="p-0.5">
                        <div
                          className={`w-full aspect-square rounded-md flex items-center justify-center text-[10px] font-medium ${getHeatmapTextColor(val)}`}
                          style={{ backgroundColor: getOccupancyColorFromPercent(val) }}
                        >
                          {val}%
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trainer workload — PieChart */}
        <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Нагрузка тренеров</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={trainerLoad}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={75}
                dataKey="value"
                stroke="none"
              >
                {trainerLoad.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '13px',
                }}
                formatter={(value: number, name: string) => [`${value} ч`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-1">
            {trainerLoad.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-gray-600">{entry.name}</span>
                <span className="text-xs font-medium text-gray-900">{entry.value}ч</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MethodistAnalyticsScreen;
