
import React, { useState, useCallback } from 'react';
import {
  ChevronLeft,
  RefreshCw,
  Users,
  TrendingUp,
  Clock,
  Activity,
  Zap,
  Droplets,
  Sparkles,
  Dumbbell,
  HeartPulse,
} from 'lucide-react';
import { ScreenName } from '../types';
import { useOccupancy, getOccupancyColor, getOccupancyLabel } from '../mocks/occupancy-engine';
import { OccupancyLevel } from '../types/occupancy';

interface ClubOccupancyScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

/** Map zone id to a lucide icon */
function ZoneIcon({ zoneId, color }: { zoneId: string; color: string }) {
  const cls = 'w-5 h-5';
  switch (zoneId) {
    case 'gym':    return <Dumbbell className={cls} style={{ color }} />;
    case 'cardio': return <HeartPulse className={cls} style={{ color }} />;
    case 'group':  return <Users className={cls} style={{ color }} />;
    case 'pool':   return <Droplets className={cls} style={{ color }} />;
    case 'spa':    return <Sparkles className={cls} style={{ color }} />;
    default:       return <Activity className={cls} style={{ color }} />;
  }
}

const ClubOccupancyScreen: React.FC<ClubOccupancyScreenProps> = ({ onNavigate }) => {
  const { data, loading, refresh } = useOccupancy();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const percent = Math.round((data.totalCurrent / data.totalCapacity) * 100);
  const color = getOccupancyColor(data.level);
  const label = getOccupancyLabel(data.level);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  }, [refresh]);

  // Time since update
  const timeSinceUpdate = () => {
    const diff = Date.now() - new Date(data.timestamp).getTime();
    if (diff < 60_000) return 'только что';
    const mins = Math.floor(diff / 60_000);
    return `${mins} мин. назад`;
  };

  // Find the max predicted value for chart scaling
  const maxPredicted = Math.max(...data.hourlyForecast.map(f => Math.max(f.predicted, f.actual ?? 0)), 1);

  const currentHour = new Date().getHours();

  return (
    <div className="min-h-screen bg-t-bg text-t-text pb-24 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-t-bg/80 backdrop-blur-[var(--t-backdrop-blur)] border-b border-t-border/50 transition-colors">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('BACK' as ScreenName)}
              className="p-2 -ml-2 rounded-tk-full hover:bg-t-bg-elevated transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-t-text" />
            </button>
            <div>
              <h1 className="text-lg font-black uppercase italic tracking-wider text-t-text">Загрузка клуба</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Live badge */}
            <span
              className="px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded-tk-sm flex items-center gap-1"
              style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}30` }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: color }} />
              </span>
              LIVE
            </span>
            <button
              onClick={handleRefresh}
              className="p-2 rounded-tk-full hover:bg-t-bg-elevated transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-t-text-muted ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">

        {/* Hero Card: Current Occupancy */}
        <section className="bg-t-bg-elevated rounded-tk-lg border border-t-border shadow-tk-card overflow-hidden relative">
          {/* Color accent bar at top */}
          <div className="h-1" style={{ backgroundColor: color }} />

          <div className="p-6">
            {/* Big number */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter" style={{ color }}>{percent}</span>
                  <span className="text-2xl font-bold text-t-text-muted">%</span>
                </div>
                <p className="text-sm font-bold mt-1" style={{ color }}>{label}</p>
              </div>

              {/* Circular gauge */}
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  {/* Background ring */}
                  <circle
                    cx="40" cy="40" r="34"
                    stroke="var(--t-border)"
                    strokeWidth="6"
                    fill="none"
                    opacity="0.3"
                  />
                  {/* Progress ring */}
                  <circle
                    cx="40" cy="40" r="34"
                    stroke={color}
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - percent / 100)}`}
                    style={{
                      transition: 'stroke-dashoffset 1s ease-out',
                      filter: `drop-shadow(0 0 6px ${color}60)`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Users className="w-5 h-5" style={{ color }} />
                  <span className="text-[10px] font-bold text-t-text-muted mt-0.5">
                    {data.totalCurrent}/{data.totalCapacity}
                  </span>
                </div>
              </div>
            </div>

            {/* Full-width bar */}
            <div className="w-full h-3 rounded-full bg-t-bg-surface overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out relative"
                style={{
                  width: `${Math.max(2, percent)}%`,
                  backgroundColor: color,
                  boxShadow: `0 0 16px ${color}50`,
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                    animation: 'occ-shimmer 2.5s ease-in-out infinite',
                  }}
                />
              </div>
            </div>

            {/* Update time */}
            <div className="flex items-center gap-1.5 mt-3 text-[10px] text-t-text-muted">
              <Clock className="w-3 h-3" />
              Обновлено: {timeSinceUpdate()}
            </div>
          </div>
        </section>

        {/* Best Time Recommendation */}
        <section className="bg-t-bg-elevated rounded-tk-lg border border-t-border shadow-tk-card p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-tk-lg flex items-center justify-center shrink-0 bg-t-accent/10 border border-t-accent/20">
            <Zap className="w-5 h-5 text-t-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-t-accent mb-0.5">Рекомендация</p>
            <p className="text-sm font-semibold text-t-text leading-snug">{data.bestTimeToVisit}</p>
          </div>
        </section>

        {/* Hourly Chart */}
        <section>
          <h2 className="text-sm font-black uppercase tracking-wider text-t-text mb-3 px-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-t-accent" />
            Загрузка по часам
          </h2>

          <div className="bg-t-bg-elevated rounded-tk-lg border border-t-border shadow-tk-card p-4 overflow-hidden">
            {/* Bar chart: horizontal bars */}
            <div className="space-y-1.5">
              {data.hourlyForecast.map((entry) => {
                const isPast = entry.hour < currentHour;
                const isCurrent = entry.hour === currentHour;
                const isPeak = data.peakHours.some(p => entry.hour >= p.start && entry.hour < p.end);
                const displayVal = entry.actual ?? entry.predicted;
                const barWidth = Math.max(2, (displayVal / maxPredicted) * 100);
                const barColor = getOccupancyColor(
                  displayVal <= 15 ? 'empty' :
                  displayVal <= 35 ? 'quiet' :
                  displayVal <= 60 ? 'moderate' :
                  displayVal <= 80 ? 'busy' : 'packed'
                );

                return (
                  <div key={entry.hour} className="flex items-center gap-2">
                    {/* Hour label */}
                    <span className={`text-[11px] font-mono w-10 text-right shrink-0 ${isCurrent ? 'font-black text-t-accent' : 'text-t-text-muted'}`}>
                      {entry.hour}:00
                    </span>

                    {/* Bar */}
                    <div className="flex-1 h-5 rounded-sm bg-t-bg-surface overflow-hidden relative">
                      {/* Predicted (background, lighter) */}
                      {!isPast && !isCurrent && (
                        <div
                          className="absolute inset-y-0 left-0 rounded-sm"
                          style={{
                            width: `${Math.max(2, (entry.predicted / maxPredicted) * 100)}%`,
                            backgroundColor: barColor,
                            opacity: 0.25,
                          }}
                        />
                      )}
                      {/* Actual / current bar */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-sm transition-all duration-700"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: barColor,
                          opacity: isPast ? 0.6 : 1,
                          boxShadow: isCurrent ? `0 0 10px ${barColor}50` : 'none',
                        }}
                      />
                      {/* Current hour indicator line */}
                      {isCurrent && (
                        <div className="absolute inset-y-0 right-0 left-0 flex items-center pointer-events-none">
                          <div
                            className="h-full w-0.5 rounded-full animate-pulse"
                            style={{
                              marginLeft: `${barWidth}%`,
                              backgroundColor: barColor,
                              boxShadow: `0 0 8px ${barColor}`,
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Percentage label */}
                    <span className={`text-[10px] font-bold w-8 text-right shrink-0 ${isCurrent ? 'text-t-accent' : isPast ? 'text-t-text-muted' : 'text-t-text-secondary'}`}>
                      {displayVal}%
                    </span>

                    {/* Peak indicator */}
                    <span className="w-4 shrink-0 text-center">
                      {isPeak && <span className="text-[9px]" style={{ color: '#ef4444' }}>!</span>}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-t-border">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-2 rounded-sm bg-t-accent" />
                <span className="text-[10px] text-t-text-muted">Факт</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-2 rounded-sm bg-t-accent opacity-25" />
                <span className="text-[10px] text-t-text-muted">Прогноз</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-red-500 font-bold">!</span>
                <span className="text-[10px] text-t-text-muted">Пиковый час</span>
              </div>
            </div>
          </div>
        </section>

        {/* Peak Hours */}
        {data.peakHours.length > 0 && (
          <section className="bg-red-500/10 rounded-tk-lg border border-red-500/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-red-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">Пиковые часы</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.peakHours.map((peak, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-sm font-bold rounded-tk-md bg-red-500/10 border border-red-500/20 text-red-400"
                >
                  {peak.start}:00 — {peak.end}:00
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Zone Breakdown */}
        <section>
          <h2 className="text-sm font-black uppercase tracking-wider text-t-text mb-3 px-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-t-accent" />
            Загрузка по зонам
          </h2>

          <div className="space-y-2.5">
            {data.zones.map((zone) => {
              const zonePercent = zone.capacity > 0 ? Math.round((zone.current / zone.capacity) * 100) : 0;
              const zoneColor = getOccupancyColor(zone.level);
              const zoneLabel = getOccupancyLabel(zone.level);

              return (
                <div
                  key={zone.zoneId}
                  className="bg-t-bg-elevated rounded-tk-lg border border-t-border shadow-tk-card p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-9 h-9 rounded-tk-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${zoneColor}15`, border: `1px solid ${zoneColor}25` }}
                    >
                      <ZoneIcon zoneId={zone.zoneId} color={zoneColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-t-text">{zone.zoneName}</span>
                        <span className="text-sm font-black" style={{ color: zoneColor }}>{zonePercent}%</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[10px] text-t-text-muted">{zone.current} из {zone.capacity} чел.</span>
                        <span className="text-[10px] font-semibold" style={{ color: zoneColor }}>{zoneLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Zone bar */}
                  <div className="w-full h-2 rounded-full bg-t-bg-surface overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.max(2, zonePercent)}%`,
                        backgroundColor: zoneColor,
                        boxShadow: `0 0 8px ${zoneColor}40`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Color Legend */}
        <section className="bg-t-bg-elevated rounded-tk-lg border border-t-border shadow-tk-card p-4">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-t-text-muted mb-3">Шкала загрузки</h3>
          <div className="flex items-center justify-between gap-1">
            {(['empty', 'quiet', 'moderate', 'busy', 'packed'] as OccupancyLevel[]).map((level) => (
              <div key={level} className="flex flex-col items-center gap-1">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{
                    backgroundColor: getOccupancyColor(level),
                    boxShadow: `0 0 8px ${getOccupancyColor(level)}40`,
                  }}
                />
                <span className="text-[8px] font-bold text-t-text-muted text-center leading-tight">
                  {getOccupancyLabel(level).split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes occ-shimmer {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ClubOccupancyScreen;
