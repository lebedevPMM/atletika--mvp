
import React, { useState } from 'react';
import { ScreenName, ActivityStatus } from '../types';
import { useTheme } from './ThemeContext';
import {
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Dumbbell,
  TrendingUp,
  MessageCircle,
  History,
  Camera,
  User,
  WifiOff,
  Loader2,
  Zap,
  Play
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PlanScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type TabType = 'workouts' | 'progress';

const PlanScreen: React.FC<PlanScreenProps> = ({ onNavigate }) => {
  const { isNeon } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('workouts');
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [hasPlan, setHasPlan] = useState(true);

  // React.useEffect(() => {
  //   // Simulate loading
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!hasPlan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6 flex flex-col items-center justify-center text-center transition-colors duration-300">
        <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-gray-200 dark:border-zinc-800">
          <CalendarIcon className="w-10 h-10 text-gray-400 dark:text-zinc-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Нет активного плана</h2>
        <p className="text-gray-500 dark:text-zinc-500 mb-8 max-w-xs text-sm">
          Ваш тренер еще не назначил программу тренировок.
        </p>
        <button
          onClick={() => onNavigate('chat_list')}
          className="bg-cyan-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-transform flex items-center gap-2 hover:bg-cyan-500"
        >
          <MessageCircle className="w-5 h-5" />
          Написать тренеру
        </button>
      </div>
    );
  }

  // Mock Data
  const planData = {
    title: "Похудение",
    subtitle: "Программа на 4 недели",
    trainer: "Алексей Смирнов",
    dateRange: "1 Сен - 28 Сен",
    progress: 35,
    currentWeek: 2,
    totalWeeks: 4,
    completedWorkouts: 4,
    totalWorkouts: 12
  };

  const activities = [
    {
      id: '1',
      type: 'pt',
      title: 'Персональная тренировка',
      date: 'Сегодня',
      time: '18:00',
      status: ActivityStatus.SCHEDULED,
      description: 'Ноги и Плечи'
    },
    {
      id: '2',
      type: 'checkpoint',
      title: 'Состав тела',
      date: 'Завтра',
      status: ActivityStatus.PENDING,
      description: 'Вес и фото'
    },
    {
      id: '3',
      type: 'workout',
      title: 'Кардио (Соло)',
      date: '12 Сен',
      time: '10:00',
      status: ActivityStatus.SCHEDULED,
      description: 'Беговая дорожка 40 мин'
    },
    {
      id: '4',
      type: 'workout',
      title: 'Силовая на всё тело',
      date: '10 Сен',
      status: ActivityStatus.COMPLETED,
      description: 'Выполнено'
    },
    {
      id: '5',
      type: 'workout',
      title: 'Йога Флоу',
      date: '08 Сен',
      status: ActivityStatus.MISSED,
      description: 'Пропущено'
    }
  ];

  const metricsHistory = [
    { date: '1 Сен', weight: 85.0, waist: 92 },
    { date: '8 Сен', weight: 84.2, waist: 91 },
    { date: '15 Сен', weight: 83.5, waist: 90.5 },
    { date: 'Сегодня', weight: 83.1, waist: 90 },
  ];

  const getLastDiff = (key: 'weight' | 'waist') => {
    const current = metricsHistory[metricsHistory.length - 1][key];
    const prev = metricsHistory[metricsHistory.length - 2][key];
    return (current - prev).toFixed(1);
  };


  return (
    <div
      className="pb-24 min-h-screen transition-colors duration-300"
      style={{ backgroundColor: isNeon ? 'var(--brand-bg-primary)' : undefined }}
    >
      {!isNeon && <div className="absolute inset-0 bg-gray-50 dark:bg-zinc-950 -z-10" />}
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-red-500/10 border-b border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 flex items-center gap-3 text-sm font-bold sticky top-0 z-50 backdrop-blur-md">
          <WifiOff className="w-4 h-4" />
          <span className="opacity-90">Офлайн режим</span>
        </div>
      )}

      {/* Header Section */}
      <div
        className="p-5 rounded-b-3xl shadow-lg relative z-10 transition-colors"
        style={isNeon ? {
          background: 'var(--brand-bg-card)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--brand-border)'
        } : undefined}
      >
        {!isNeon && <div className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-b-3xl border-b border-gray-200 dark:border-zinc-800 -z-10" />}
        <div className="flex justify-between items-start mb-6">
          <div>
            <span
              className="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md mb-2"
              style={isNeon ? {
                background: 'rgba(212, 255, 0, 0.1)',
                border: '1px solid rgba(212, 255, 0, 0.2)',
                color: 'var(--brand-accent)'
              } : undefined}
            >
              {!isNeon && <span className="bg-cyan-100 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 text-cyan-600 dark:text-cyan-400">Активный план</span>}
              {isNeon && 'Активный план'}
            </span>
            <h1
              className="text-2xl font-black leading-tight uppercase italic tracking-tighter transition-colors"
              style={{ color: isNeon ? 'var(--brand-text-primary)' : undefined }}
            >
              {planData.title}
            </h1>
            <p
              className="text-sm mt-1 font-medium"
              style={{ color: isNeon ? 'var(--brand-text-secondary)' : undefined }}
            >
              {planData.subtitle}
            </p>
          </div>
          <div className="text-right">
            <p
              className="text-[10px] uppercase font-bold tracking-wider"
              style={{ color: isNeon ? 'var(--brand-text-muted)' : undefined }}
            >
              Тренер
            </p>
            <p
              className="text-sm font-bold"
              style={{ color: isNeon ? 'var(--brand-text-secondary)' : undefined }}
            >
              {planData.trainer}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: isNeon ? 'var(--brand-text-secondary)' : undefined }}>
            <span>Прогресс (Неделя {planData.currentWeek}/{planData.totalWeeks})</span>
            <span style={{ color: isNeon ? 'var(--brand-accent)' : undefined }}>{planData.progress}%</span>
          </div>
          <div
            className="w-full rounded-full h-2 overflow-hidden"
            style={{
              background: isNeon ? 'rgba(255,255,255,0.05)' : undefined,
              border: isNeon ? '1px solid var(--brand-border)' : undefined
            }}
          >
            {!isNeon && <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-950 rounded-full border border-gray-200 dark:border-zinc-800" />}
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${planData.progress}%`,
                background: isNeon ? 'var(--brand-progress-gradient)' : 'var(--brand-accent)',
                boxShadow: isNeon ? 'var(--brand-accent-glow)' : '0 0 10px #06b6d4'
              }}
            ></div>
          </div>
        </div>

        {/* Date Range Badge */}
        <div
          className="flex items-center text-xs font-bold px-3 py-2 rounded-lg w-fit"
          style={isNeon ? {
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--brand-border)',
            color: 'var(--brand-text-secondary)'
          } : undefined}
        >
          {!isNeon && <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800" />}
          <CalendarIcon className="w-3.5 h-3.5 mr-2" style={{ color: isNeon ? 'var(--brand-text-muted)' : undefined }} />
          {planData.dateRange}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mt-6 mb-4">
        <div className="bg-white dark:bg-zinc-900 p-1 rounded-xl flex border border-gray-200 dark:border-zinc-800 transition-colors">
          <button
            onClick={() => setActiveTab('workouts')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'workouts'
              ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-zinc-700'
              : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300'
              }`}
          >
            Тренировки
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'progress'
              ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-zinc-700'
              : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300'
              }`}
          >
            Прогресс
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 space-y-4">
        {activeTab === 'workouts' ? (
          <>
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              <button
                onClick={() => onNavigate('workout_session')}
                className="col-span-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold opacity-80 mb-0.5 tracking-wider">Начать</p>
                    <h3 className="text-lg font-black italic">Уничтожение Ног</h3>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('booking_schedule')}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white p-4 rounded-xl shadow-sm active:scale-95 transition-all flex flex-col items-start justify-between h-24 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
              >
                <CalendarIcon className="w-5 h-5 mb-2 text-cyan-600 dark:text-cyan-500" />
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase font-bold tracking-wider">Запись</p>
                  <p className="text-sm font-bold">На сессию</p>
                </div>
              </button>
            </div>

            {/* BrainBlink Banner */}
            <div
              onClick={() => onNavigate('brain_blink_game')}
              className="mb-6 bg-gradient-to-r from-gray-900 to-black dark:from-zinc-900 dark:to-zinc-950 p-4 rounded-xl shadow-lg relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all border border-gray-800 dark:border-zinc-800 group"
            >
              <div className="absolute -top-4 -right-4 p-3 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                <Zap className="w-32 h-32 text-cyan-400" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-cyan-500 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Neuro</span>
                  <h3 className="text-white font-black italic text-lg tracking-tighter">BrainBlink</h3>
                </div>
                <p className="text-gray-400 dark:text-zinc-500 text-xs max-w-[200px]">
                  Когнитивная разминка. Включи фокус за 60 сек.
                </p>
                <div className="mt-3 flex items-center text-cyan-400 text-[10px] font-bold uppercase tracking-widest gap-1 group-hover:text-cyan-300 transition-colors">
                  <span>Начать сессию</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            <h3 className="text-sm font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mt-8 mb-4">Расписание</h3>
            <div className="space-y-3">
              {activities.map((item) => (
                <ActivityCard key={item.id} item={item} onNavigate={onNavigate} isOffline={isOffline} />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 transition-colors">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-1">Вес</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                    {metricsHistory[metricsHistory.length - 1].weight} <span className="text-sm font-sans font-normal text-gray-500 dark:text-zinc-600">кг</span>
                  </span>
                </div>
                <div className="mt-2 flex items-center text-[10px] font-bold text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-950/30 border border-green-200 dark:border-green-900 w-fit px-2 py-1 rounded-md">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {getLastDiff('weight')} кг
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 transition-colors">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-1">Талия</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                    {metricsHistory[metricsHistory.length - 1].waist} <span className="text-sm font-sans font-normal text-gray-500 dark:text-zinc-600">см</span>
                  </span>
                </div>
                <div className="mt-2 flex items-center text-[10px] font-bold text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-950/30 border border-green-200 dark:border-green-900 w-fit px-2 py-1 rounded-md">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {getLastDiff('waist')} см
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 mt-2 transition-colors">
              <h4 className="text-xs font-bold text-gray-400 dark:text-zinc-400 uppercase tracking-wider mb-6">Динамика веса</h4>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metricsHistory}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#71717a' }}
                      dy={10}
                    />
                    <YAxis
                      hide={true}
                      domain={['dataMin - 1', 'dataMax + 1']}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                      itemStyle={{ color: '#fff', fontWeight: 600, fontSize: '12px' }}
                      labelStyle={{ color: '#a1a1aa', fontSize: '10px', marginBottom: '4px' }}
                      formatter={(value) => [`${value} кг`]}
                    />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorWeight)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <button
              onClick={() => onNavigate('measurements')}
              className="w-full mt-4 py-3 border border-dashed border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 text-gray-500 dark:text-zinc-400 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              + Внести замеры
            </button>

            {/* Actions */}
            <div className="space-y-3 mt-4">
              <button
                disabled={isOffline}
                onClick={() => onNavigate('chat_list')}
                className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 font-bold py-3 rounded-xl flex items-center justify-center shadow-sm active:bg-gray-50 dark:active:bg-zinc-800 disabled:opacity-50 hover:text-cyan-600 dark:hover:text-white hover:border-cyan-200 dark:hover:border-zinc-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2 text-cyan-600 dark:text-cyan-500" />
                Написать тренеру
              </button>
              <button
                onClick={() => console.log('History')}
                className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 font-bold py-3 rounded-xl flex items-center justify-center shadow-sm active:bg-gray-50 dark:active:bg-zinc-800 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-700 transition-colors"
              >
                <History className="w-5 h-5 mr-2 text-gray-400 dark:text-zinc-600" />
                История
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ActivityCard: React.FC<{ item: any, onNavigate: (s: ScreenName) => void, isOffline: boolean }> = ({ item, onNavigate, isOffline }) => {
  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case ActivityStatus.COMPLETED: return 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-500';
      case ActivityStatus.MISSED: return 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-500';
      case ActivityStatus.PENDING: return 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-500';
      case ActivityStatus.SCHEDULED: return 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-500';
      default: return 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: ActivityStatus) => {
    switch (status) {
      case ActivityStatus.COMPLETED: return 'Выполнено';
      case ActivityStatus.MISSED: return 'Пропущено';
      case ActivityStatus.PENDING: return 'Ожидает';
      case ActivityStatus.SCHEDULED: return 'Запланировано';
      default: return '';
    }
  };

  const isPending = item.status === ActivityStatus.PENDING || item.status === ActivityStatus.SCHEDULED;

  const handleClick = () => {
    if (isOffline) return;
    if (!isPending) return;
    if (item.type === 'checkpoint') {
      onNavigate('measurements');
    } else if (item.type === 'pt') {
      onNavigate('booking_pt_details');
    } else {
      onNavigate('booking_class_details');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center gap-4 transition-colors ${isPending ? 'active:bg-gray-50 dark:active:bg-zinc-800 cursor-pointer' : ''}`}
    >
      {/* Time Column (Left Anchor) */}
      <div className="flex flex-col items-center justify-center min-w-[3.5rem] bg-gray-50 dark:bg-zinc-800 rounded-lg py-2 h-full transition-colors">
        <span className="text-lg font-mono font-bold text-gray-900 dark:text-white leading-none">{item.time || "--:--"}</span>
        <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 mt-1">{item.date.split(' ')[0]}</span>
      </div>

      {/* Content Column */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-900 dark:text-white text-base truncate pr-2">{item.title}</h4>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusColor(item.status)}`}>
            {getStatusLabel(item.status)}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-zinc-500 truncate mt-0.5">{item.description}</p>

        {item.type === 'checkpoint' && (
          <div className="mt-2 flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-500 font-bold uppercase">
            <AlertCircle className="w-3 h-3" />
            Требуется действие
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanScreen;