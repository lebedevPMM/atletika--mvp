
export type OccupancyLevel = 'empty' | 'quiet' | 'moderate' | 'busy' | 'packed';

export interface ZoneOccupancy {
  zoneId: string;
  zoneName: string; // "Тренажёрный зал", "Кардио-зона", "Групповые", "Бассейн", "СПА"
  current: number;
  capacity: number;
  level: OccupancyLevel;
}

export interface ClubOccupancy {
  clubId: string;
  timestamp: string; // ISO
  totalCurrent: number;
  totalCapacity: number;
  level: OccupancyLevel;
  zones: ZoneOccupancy[];
  hourlyForecast: Array<{ hour: number; predicted: number; actual?: number }>;
  peakHours: Array<{ start: number; end: number }>; // e.g. [{start: 17, end: 20}]
  bestTimeToVisit: string; // "Сейчас самое свободное время" or "Лучше прийти после 20:00"
}
