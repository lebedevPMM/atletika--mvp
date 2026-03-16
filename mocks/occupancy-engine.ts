
import { useState, useEffect, useCallback } from 'react';
import { OccupancyLevel, ZoneOccupancy, ClubOccupancy } from '../types/occupancy';

// --- Constants ---
const TOTAL_CAPACITY = 120;
const CLUB_ID = 'club-001';

// --- Occupancy curves per day-of-week (0=Sun, 1=Mon ... 6=Sat) ---
// Values = percentage of total capacity (0-100) for each hour 0-23
export const HOURLY_CURVES: Record<number, number[]> = {
  // hour:  0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23
  0: [  2,  1,  1,  1,  1,  2,  5, 10, 22, 40, 50, 48, 42, 35, 28, 22, 18, 14, 10,  8,  5,  3,  2,  2], // Вс
  1: [  2,  1,  1,  1,  1,  3, 12, 42, 65, 50, 38, 32, 45, 40, 22, 20, 30, 55, 82, 85, 72, 50, 22,  5], // Пн
  2: [  2,  1,  1,  1,  1,  3, 10, 38, 60, 48, 35, 30, 42, 38, 20, 18, 28, 52, 78, 82, 70, 48, 20,  5], // Вт
  3: [  2,  1,  1,  1,  1,  3, 15, 45, 68, 55, 40, 35, 48, 42, 25, 22, 32, 58, 85, 88, 75, 55, 25,  5], // Ср
  4: [  2,  1,  1,  1,  1,  3, 12, 40, 62, 48, 36, 32, 44, 40, 22, 20, 30, 54, 80, 84, 70, 50, 22,  5], // Чт
  5: [  2,  1,  1,  1,  1,  3, 18, 48, 70, 55, 42, 38, 50, 45, 28, 25, 32, 48, 68, 72, 60, 40, 18,  5], // Пт
  6: [  2,  1,  1,  1,  1,  2,  5, 10, 28, 50, 60, 58, 48, 38, 32, 28, 22, 18, 14, 10,  8,  5,  3,  2], // Сб
};

// Zone configs: name, fraction of total capacity, peak bias (how much extra they get at peak)
const ZONE_CONFIGS = [
  { id: 'gym',      name: 'Тренажёрный зал', fraction: 0.35, peakBias: 1.3 },
  { id: 'cardio',   name: 'Кардио-зона',     fraction: 0.20, peakBias: 1.1 },
  { id: 'group',    name: 'Групповые',       fraction: 0.20, peakBias: 0.9 },
  { id: 'pool',     name: 'Бассейн',         fraction: 0.15, peakBias: 0.7 },
  { id: 'spa',      name: 'СПА',             fraction: 0.10, peakBias: 0.5 },
];

// --- Helpers ---

/** Deterministic pseudo-random noise based on seed */
function seededNoise(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x); // 0..1
}

/** Get the occupancy level from a percentage */
function getLevel(percent: number): OccupancyLevel {
  if (percent <= 15) return 'empty';
  if (percent <= 35) return 'quiet';
  if (percent <= 60) return 'moderate';
  if (percent <= 80) return 'busy';
  return 'packed';
}

/** Get CSS color for an occupancy level */
export function getOccupancyColor(level: OccupancyLevel): string {
  switch (level) {
    case 'empty':    return '#22c55e';
    case 'quiet':    return '#4ade80';
    case 'moderate': return '#f59e0b';
    case 'busy':     return '#f97316';
    case 'packed':   return '#ef4444';
  }
}

/** Get a Russian label for an occupancy level */
export function getOccupancyLabel(level: OccupancyLevel): string {
  switch (level) {
    case 'empty':    return 'Свободно';
    case 'quiet':    return 'Немного людей';
    case 'moderate': return 'Средняя загрузка';
    case 'busy':     return 'Много людей';
    case 'packed':   return 'Полная загрузка';
  }
}

/**
 * Generate a heatmap matrix for the week.
 * Returns { days, hours, data } where data[rowIdx][colIdx] = occupancy percentage.
 * Days: Пн–Вс, Hours: selected time slots from the curves.
 */
export function getHeatmapForWeek(
  hours: number[] = [7, 9, 12, 15, 18, 20]
): { days: string[]; hours: string[]; data: number[][] } {
  // Map day-of-week index (JS: 0=Sun) to display order Пн–Вс
  const dayOrder = [1, 2, 3, 4, 5, 6, 0]; // Mon=1, Tue=2 ... Sun=0
  const dayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const hourLabels = hours.map((h) => `${h}:00`);

  const data: number[][] = hours.map((hour) =>
    dayOrder.map((dayIdx) => {
      const curve = HOURLY_CURVES[dayIdx] || HOURLY_CURVES[1];
      return curve[hour] ?? 0;
    })
  );

  return { days: dayLabels, hours: hourLabels, data };
}

/** Get the occupancy color directly from a percentage value */
export function getOccupancyColorFromPercent(percent: number): string {
  return getOccupancyColor(getLevel(percent));
}

/** Interpolate between the current hour curve value and the next hour */
function interpolateOccupancy(day: number, hour: number, minute: number): number {
  const curve = HOURLY_CURVES[day] || HOURLY_CURVES[1];
  const current = curve[hour] ?? 0;
  const next = curve[(hour + 1) % 24] ?? 0;
  const t = minute / 60;
  return current + (next - current) * t;
}

/** Generate a full ClubOccupancy snapshot for the current moment */
function generateOccupancy(now: Date): ClubOccupancy {
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const seed = day * 10000 + hour * 100 + Math.floor(minute / 5); // changes every 5 min

  const basePercent = interpolateOccupancy(day, hour, minute);
  const noise = (seededNoise(seed) - 0.5) * 10; // +/- 5%
  const totalPercent = Math.max(0, Math.min(100, Math.round(basePercent + noise)));
  const totalCurrent = Math.round((totalPercent / 100) * TOTAL_CAPACITY);

  // Generate zones
  const zones: ZoneOccupancy[] = ZONE_CONFIGS.map((zone, i) => {
    const zoneCapacity = Math.round(TOTAL_CAPACITY * zone.fraction);
    const zoneSeed = seed * 100 + i * 7;
    const zoneNoise = (seededNoise(zoneSeed) - 0.5) * 14;
    const zonePercent = Math.max(0, Math.min(100, Math.round(basePercent * zone.peakBias + zoneNoise)));
    const zoneCurrent = Math.min(zoneCapacity, Math.round((zonePercent / 100) * zoneCapacity));
    return {
      zoneId: zone.id,
      zoneName: zone.name,
      current: zoneCurrent,
      capacity: zoneCapacity,
      level: getLevel(zonePercent),
    };
  });

  // Hourly forecast for 6:00 - 23:00
  const curve = HOURLY_CURVES[day] || HOURLY_CURVES[1];
  const hourlyForecast = [];
  for (let h = 6; h <= 23; h++) {
    const predicted = curve[h] ?? 0;
    const entry: { hour: number; predicted: number; actual?: number } = { hour: h, predicted };
    if (h < hour) {
      // Past hours: generate "actual" data with some noise
      const pastSeed = day * 10000 + h * 100 + 30;
      const pastNoise = (seededNoise(pastSeed) - 0.5) * 12;
      entry.actual = Math.max(0, Math.min(100, Math.round(predicted + pastNoise)));
    } else if (h === hour) {
      entry.actual = totalPercent;
    }
    hourlyForecast.push(entry);
  }

  // Peak hours (find contiguous hours above 70%)
  const peakHours: Array<{ start: number; end: number }> = [];
  let peakStart: number | null = null;
  for (let h = 6; h <= 23; h++) {
    const val = curve[h] ?? 0;
    if (val >= 70 && peakStart === null) {
      peakStart = h;
    } else if (val < 70 && peakStart !== null) {
      peakHours.push({ start: peakStart, end: h });
      peakStart = null;
    }
  }
  if (peakStart !== null) {
    peakHours.push({ start: peakStart, end: 23 });
  }

  // Best time to visit recommendation
  let bestTimeToVisit: string;
  if (totalPercent <= 30) {
    bestTimeToVisit = 'Сейчас самое свободное время';
  } else {
    // Find the next quiet hour
    const futureQuiet = hourlyForecast.find(f => f.hour > hour && f.predicted <= 30);
    if (futureQuiet) {
      bestTimeToVisit = `Лучше прийти после ${futureQuiet.hour}:00`;
    } else {
      // Find quietest remaining hour
      const future = hourlyForecast.filter(f => f.hour > hour);
      if (future.length > 0) {
        const quietest = future.reduce((a, b) => a.predicted < b.predicted ? a : b);
        bestTimeToVisit = `Самое тихое время сегодня — ${quietest.hour}:00 (~${quietest.predicted}%)`;
      } else {
        bestTimeToVisit = 'Завтра утром будет свободнее';
      }
    }
  }

  return {
    clubId: CLUB_ID,
    timestamp: now.toISOString(),
    totalCurrent,
    totalCapacity: TOTAL_CAPACITY,
    level: getLevel(totalPercent),
    zones,
    hourlyForecast,
    peakHours,
    bestTimeToVisit,
  };
}

// --- Hook ---

export function useOccupancy() {
  const [data, setData] = useState<ClubOccupancy>(() => generateOccupancy(new Date()));
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    setLoading(true);
    // Simulate a tiny network delay
    setTimeout(() => {
      setData(generateOccupancy(new Date()));
      setLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    // Auto-update every 30 seconds
    const interval = setInterval(() => {
      setData(generateOccupancy(new Date()));
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, refresh };
}
