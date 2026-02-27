import {
  getSessionTypeLabel,
  getSessionTypeShort,
  getSessionBadgeVariant,
  getMembershipBadgeVariant,
  getMembershipLabel,
  formatLastVisit,
  formatSessionTime,
  isSessionActive,
  getAttendanceRatio,
  sortSessionsByTime,
} from '../utils';
import type { TrainerSession } from '../types';

// === getSessionTypeLabel ===

describe('getSessionTypeLabel', () => {
  it('returns "Персональная" for pt', () => {
    expect(getSessionTypeLabel('pt')).toBe('Персональная');
  });

  it('returns "Групповое" for group', () => {
    expect(getSessionTypeLabel('group')).toBe('Групповое');
  });

  it('returns "СПА-процедура" for spa', () => {
    expect(getSessionTypeLabel('spa')).toBe('СПА-процедура');
  });
});

// === getSessionTypeShort ===

describe('getSessionTypeShort', () => {
  it('returns "ПТ" for pt', () => {
    expect(getSessionTypeShort('pt')).toBe('ПТ');
  });

  it('returns "Груп." for group', () => {
    expect(getSessionTypeShort('group')).toBe('Груп.');
  });

  it('returns "СПА" for spa', () => {
    expect(getSessionTypeShort('spa')).toBe('СПА');
  });
});

// === getSessionBadgeVariant ===

describe('getSessionBadgeVariant', () => {
  it('returns "accent" for pt', () => {
    expect(getSessionBadgeVariant('pt')).toBe('accent');
  });

  it('returns "info" for group', () => {
    expect(getSessionBadgeVariant('group')).toBe('info');
  });

  it('returns "warning" for spa', () => {
    expect(getSessionBadgeVariant('spa')).toBe('warning');
  });
});

// === getMembershipBadgeVariant ===

describe('getMembershipBadgeVariant', () => {
  it('returns "success" for active', () => {
    expect(getMembershipBadgeVariant('active')).toBe('success');
  });

  it('returns "warning" for frozen', () => {
    expect(getMembershipBadgeVariant('frozen')).toBe('warning');
  });

  it('returns "error" for expired', () => {
    expect(getMembershipBadgeVariant('expired')).toBe('error');
  });
});

// === getMembershipLabel ===

describe('getMembershipLabel', () => {
  it('returns "Активен" for active', () => {
    expect(getMembershipLabel('active')).toBe('Активен');
  });

  it('returns "Заморожен" for frozen', () => {
    expect(getMembershipLabel('frozen')).toBe('Заморожен');
  });

  it('returns "Истёк" for expired', () => {
    expect(getMembershipLabel('expired')).toBe('Истёк');
  });
});

// === formatLastVisit ===

describe('formatLastVisit', () => {
  it('formats a January date', () => {
    expect(formatLastVisit('2025-01-15')).toBe('15 янв');
  });

  it('formats a December date', () => {
    expect(formatLastVisit('2025-12-03')).toBe('3 дек');
  });

  it('formats a June date', () => {
    expect(formatLastVisit('2025-06-22')).toBe('22 июн');
  });
});

// === formatSessionTime ===

describe('formatSessionTime', () => {
  it('formats time range with dash', () => {
    expect(formatSessionTime('10:00', '11:00')).toBe('10:00 — 11:00');
  });

  it('handles different time values', () => {
    expect(formatSessionTime('08:30', '09:45')).toBe('08:30 — 09:45');
  });
});

// === isSessionActive ===

describe('isSessionActive', () => {
  it('returns true for scheduled', () => {
    expect(isSessionActive('scheduled')).toBe(true);
  });

  it('returns true for in_progress', () => {
    expect(isSessionActive('in_progress')).toBe(true);
  });

  it('returns false for completed', () => {
    expect(isSessionActive('completed')).toBe(false);
  });

  it('returns false for cancelled', () => {
    expect(isSessionActive('cancelled')).toBe(false);
  });
});

// === getAttendanceRatio ===

describe('getAttendanceRatio', () => {
  it('formats count and max', () => {
    expect(getAttendanceRatio(8, 15)).toBe('8 из 15');
  });

  it('formats zero values', () => {
    expect(getAttendanceRatio(0, 10)).toBe('0 из 10');
  });

  it('returns dash for undefined count', () => {
    expect(getAttendanceRatio(undefined, 15)).toBe('—');
  });

  it('returns dash for undefined max', () => {
    expect(getAttendanceRatio(8, undefined)).toBe('—');
  });

  it('returns dash when both undefined', () => {
    expect(getAttendanceRatio(undefined, undefined)).toBe('—');
  });
});

// === sortSessionsByTime ===

describe('sortSessionsByTime', () => {
  const makeSession = (time: string): TrainerSession => ({
    id: `s-${time}`,
    time,
    endTime: '23:59',
    type: 'pt',
    title: `Session ${time}`,
    location: 'Room A',
    status: 'scheduled',
  });

  it('sorts sessions by time ascending', () => {
    const sessions = [makeSession('14:00'), makeSession('09:00'), makeSession('11:30')];
    const sorted = sortSessionsByTime(sessions);
    expect(sorted.map((s) => s.time)).toEqual(['09:00', '11:30', '14:00']);
  });

  it('returns empty array for empty input', () => {
    expect(sortSessionsByTime([])).toEqual([]);
  });

  it('returns same order for already sorted input', () => {
    const sessions = [makeSession('08:00'), makeSession('10:00'), makeSession('12:00')];
    const sorted = sortSessionsByTime(sessions);
    expect(sorted.map((s) => s.time)).toEqual(['08:00', '10:00', '12:00']);
  });

  it('does not mutate original array', () => {
    const sessions = [makeSession('14:00'), makeSession('09:00')];
    const original = [...sessions];
    sortSessionsByTime(sessions);
    expect(sessions.map((s) => s.time)).toEqual(original.map((s) => s.time));
  });
});
