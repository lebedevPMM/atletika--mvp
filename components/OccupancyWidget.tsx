
import React from 'react';
import { Users, Activity, ChevronRight } from 'lucide-react';
import { ScreenName } from '../types';
import { useOccupancy, getOccupancyColor, getOccupancyLabel } from '../mocks/occupancy-engine';

interface OccupancyWidgetProps {
  onNavigate: (screen: ScreenName) => void;
}

const OccupancyWidget: React.FC<OccupancyWidgetProps> = ({ onNavigate }) => {
  const { data } = useOccupancy();

  const percent = Math.round((data.totalCurrent / data.totalCapacity) * 100);
  const color = getOccupancyColor(data.level);
  const label = getOccupancyLabel(data.level);
  const zoneCount = data.zones.length;

  return (
    <button
      onClick={() => onNavigate('club_occupancy')}
      className="w-full rounded-tk-lg shadow-tk-card overflow-hidden active:scale-[0.99] transition-all cursor-pointer group relative bg-t-bg-elevated border border-t-border"
      style={{ minHeight: 80 }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${color}, transparent 70%)` }}
      />

      <div className="relative z-10 p-4 flex items-center gap-4">
        {/* Left: Icon + live dot */}
        <div className="relative shrink-0">
          <div
            className="w-12 h-12 rounded-tk-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
          >
            <Users className="w-6 h-6" style={{ color }} />
          </div>
          {/* Live pulsing dot */}
          <span
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-t-bg-elevated"
            style={{ backgroundColor: color }}
          >
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{ backgroundColor: color, opacity: 0.6 }}
            />
          </span>
        </div>

        {/* Center: Info */}
        <div className="flex-1 min-w-0">
          {/* Top row: title + badge */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-t-text-muted">Загрузка зала</span>
            <span
              className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-tk-sm"
              style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}30` }}
            >
              LIVE
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-t-bg-surface overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out relative"
              style={{
                width: `${Math.max(2, percent)}%`,
                backgroundColor: color,
                boxShadow: `0 0 12px ${color}60, 0 0 4px ${color}40`,
              }}
            >
              {/* Shimmer animation */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                  animation: 'occupancy-shimmer 2s ease-in-out infinite',
                }}
              />
            </div>
          </div>

          {/* Bottom row: stats */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-t-text">{percent}%</span>
            <span className="text-[11px] font-semibold" style={{ color }}>{label}</span>
            <span className="text-[10px] text-t-text-muted flex items-center gap-0.5 ml-auto">
              <Activity className="w-3 h-3" />
              {zoneCount} зон
            </span>
          </div>
        </div>

        {/* Right: chevron */}
        <div className="shrink-0 p-2 rounded-tk-full bg-t-bg border border-t-border text-t-text-muted group-hover:bg-t-accent group-hover:text-white group-hover:border-t-accent transition-colors">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Keyframe for shimmer */}
      <style>{`
        @keyframes occupancy-shimmer {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </button>
  );
};

export default OccupancyWidget;
