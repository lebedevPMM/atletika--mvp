import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, TrendingUp, Calendar, Clock, Zap, Award, ArrowUpRight, BarChart2, Filter, XCircle, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type ActivityType = 'all' | 'gym' | 'group' | 'pt' | 'spa';

const StatsScreen: React.FC<StatsScreenProps> = ({ onNavigate }) => {
  const [activePeriod, setActivePeriod] = useState<'week' | 'month' | 'year'>('month');
  const [filterType, setFilterType] = useState<ActivityType>('all');

  const stats = {
    totalVisits: 14,
    thisMonth: 12,
    streak: 8,
    favoriteDay: 'Среда',
    favoriteTime: '19:00',
    totalMinutes: 840
  };

  const chartData = [
    { name: 'Май', visits: 18 },
    { name: 'Июн', visits: 22 },
    { name: 'Июл', visits: 15 },
    { name: 'Авг', visits: 24 },
    { name: 'Сен', visits: 12 },
    { name: 'Окт', visits: 0 },
  ];

  // Mock Visits Data
  const allVisits = [
    { id: 1, date: '10 Сен', time: '19:00', title: 'Тренажерный зал', type: 'gym', duration: '90 мин', calories: 450, status: 'visited' },
    { id: 2, date: '08 Сен', time: '11:00', title: 'Бассейн', type: 'gym', duration: '45 мин', calories: 300, status: 'visited' },
    { id: 3, date: '05 Сен', time: '18:30', title: 'Йога Flow', type: 'group', duration: '60 мин', calories: 210, status: 'visited' },
    { id: 4, date: '01 Сен', time: '10:00', title: 'Персональная (Иван К.)', type: 'pt', duration: '60 мин', calories: 500, status: 'visited' },
    { id: 5, date: '28 Авг', time: '19:00', title: 'CrossFit', type: 'group', duration: '0 мин', calories: 0, status: 'missed' },
    { id: 6, date: '25 Авг', time: '14:00', title: 'Спортивный массаж', type: 'spa', duration: '60 мин', calories: 0, status: 'visited' },
    { id: 7, date: '20 Авг', time: '18:00', title: 'Тренажерный зал', type: 'gym', duration: '0 мин', calories: 0, status: 'canceled' },
  ];

  const filteredVisits = allVisits.filter(v => {
    if (filterType === 'all') return true;
    return v.type === filterType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'visited': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'missed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'canceled': return <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'visited': return 'Посетил';
      case 'missed': return 'Пропуск';
      case 'canceled': return 'Отмена';
      default: return '';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Активность</h1>
      </div>

      <div className="p-4 space-y-6">

        {/* Streak Banner (Gamification) */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1 text-blue-200">
              <Zap className="w-4 h-4 fill-current" />
              <span className="text-xs font-bold uppercase tracking-wider">Текущая серия</span>
            </div>
            <p className="text-4xl font-extrabold tracking-tight">{stats.streak} <span className="text-xl font-medium opacity-80">недель</span></p>
            <p className="text-xs text-gray-400 mt-2 font-medium">Вы посещаете клуб без пропусков!</p>
          </div>
          <div className="relative z-10 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
            <Award className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        {/* Visits Chart */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              Посещения
            </h3>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {['week', 'month', 'year'].map(period => (
                <button
                  key={period}
                  onClick={() => setActivePeriod(period as any)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activePeriod === period ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  {period === 'week' ? 'Нед' : period === 'month' ? 'Мес' : 'Год'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                />
                <Tooltip
                  cursor={{ fill: '#f9fafb', radius: 8 }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="visits" radius={[6, 6, 6, 6]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === chartData.length - 2 ? '#2563eb' : '#e5e7eb'}
                      className="transition-all duration-500 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Behavioral Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-orange-50 rounded-xl text-orange-600">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-0.5 text-green-600 text-[10px] font-bold bg-green-50 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3" />
                12%
              </div>
            </div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">В среднем</p>
            <p className="text-xl font-extrabold text-gray-900">75 мин</p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">За месяц</p>
            <p className="text-xl font-extrabold text-gray-900">{stats.thisMonth}</p>
          </div>
        </div>

        {/* History Log */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 ml-1">История</h3>
            <div className="flex bg-white shadow-sm border border-gray-100 rounded-lg p-0.5">
              {(['all', 'gym', 'group', 'pt', 'spa'] as ActivityType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase transition-all ${filterType === t ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  {t === 'all' ? 'Все' : t === 'pt' ? 'ПТ' : t === 'gym' ? 'Зал' : t === 'spa' ? 'СПА' : 'Группы'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredVisits.length > 0 ? (
              filteredVisits.map((visit) => (
                <div key={visit.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.99] transition-transform">
                  <div className="flex items-center gap-4">
                    <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border border-gray-100 ${visit.status === 'visited' ? 'bg-gray-50' : 'bg-red-50'
                      }`}>
                      <span className={`text-[10px] font-bold uppercase ${visit.status === 'visited' ? 'text-gray-400' : 'text-red-400'
                        }`}>{visit.date.split(' ')[1]}</span>
                      <span className={`text-lg font-extrabold leading-none ${visit.status === 'visited' ? 'text-gray-900' : 'text-red-900'
                        }`}>{visit.date.split(' ')[0]}</span>
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${visit.status === 'canceled' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{visit.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span className="flex items-center gap-1 font-medium">
                          {getStatusIcon(visit.status)} {getStatusText(visit.status)}
                        </span>
                        {visit.status === 'visited' && (
                          <>
                            <span>•</span>
                            <span>{visit.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {visit.status === 'visited' && (
                    <div className="text-gray-300">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                  <Filter className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-gray-900">Нет посещений</p>
                <p className="text-xs text-gray-500 mt-1 max-w-[200px] mx-auto">
                  В выбранном периоде активность по этому фильтру не найдена.
                </p>
              </div>
            )}
          </div>

          {filteredVisits.length > 0 && (
            <button
              className="w-full mt-4 py-3 text-center text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Показать больше
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default StatsScreen;