import {
  formatSlotTime,
  formatDate,
  formatPrice,
  getAvailableSpots,
  checkBookingEligibility,
  generateWeekDates,
  getBookingStatusText,
  getBookingStatusColor,
  getServiceTypeBadgeVariant,
  getServiceTypeLabel,
  getBookingStatusBadgeVariant,
  formatBookingDateTime,
  isCancelDeadlinePassed,
} from '../utils';
import type { ScheduleSlot, Booking, ServiceType } from '../types';

const mockSlot: ScheduleSlot = {
  id: 'slot-1',
  serviceType: 'group',
  title: 'Test',
  date: '2026-03-01',
  startTime: '10:00',
  endTime: '11:00',
  trainerId: 'tr-1',
  trainerName: 'Trainer',
  room: 'Room A',
  capacity: 15,
  booked: 10,
  price: 0,
  currency: 'RUB',
  isFull: false,
  isWaitlistAvailable: false,
};

/** Create a local-midnight Date to avoid UTC offset issues */
function localDate(y: number, m: number, d: number): Date {
  return new Date(y, m - 1, d);
}

describe('formatSlotTime', () => {
  it('formats start-end time', () => {
    expect(formatSlotTime(mockSlot)).toBe('10:00 – 11:00');
  });

  it('handles different times', () => {
    const slot = { ...mockSlot, startTime: '08:30', endTime: '09:45' };
    expect(formatSlotTime(slot)).toBe('08:30 – 09:45');
  });
});

describe('formatDate', () => {
  it('formats a date string to Russian short format', () => {
    const result = formatDate('2026-03-01');
    // Should contain day number and month abbreviation
    expect(result).toContain('мар');
  });

  it('formats another date', () => {
    const result = formatDate('2026-01-15');
    expect(result).toContain('янв');
  });
});

describe('formatPrice', () => {
  it('formats RUB price with currency symbol', () => {
    const result = formatPrice(3500);
    expect(result).toContain('₽');
  });

  it('formats zero price', () => {
    const result = formatPrice(0);
    expect(result).toContain('0');
    expect(result).toContain('₽');
  });

  it('uses currency code for non-RUB', () => {
    const result = formatPrice(100, 'USD');
    expect(result).toContain('100');
    expect(result).toContain('USD');
  });

  it('formats large RUB price with locale separators', () => {
    const result = formatPrice(15000);
    expect(result).toContain('₽');
    // Should contain the number (possibly formatted with space/comma separators)
    expect(result).toMatch(/15/);
  });

  it('defaults to RUB when no currency specified', () => {
    const result = formatPrice(500);
    expect(result).toContain('₽');
  });
});

describe('getAvailableSpots', () => {
  it('returns remaining capacity', () => {
    expect(getAvailableSpots(mockSlot)).toBe(5);
  });

  it('returns 0 when fully booked', () => {
    expect(getAvailableSpots({ ...mockSlot, booked: 15 })).toBe(0);
  });

  it('returns 0 when overbooked', () => {
    expect(getAvailableSpots({ ...mockSlot, booked: 20 })).toBe(0);
  });

  it('returns full capacity when no bookings', () => {
    expect(getAvailableSpots({ ...mockSlot, booked: 0 })).toBe(15);
  });
});

describe('checkBookingEligibility', () => {
  it('returns eligible for available slot in the future', () => {
    const futureSlot = {
      ...mockSlot,
      date: '2099-12-31',
      startTime: '23:59',
    };
    const result = checkBookingEligibility(futureSlot);
    expect(result.eligible).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it('returns not eligible for full slot without waitlist', () => {
    const fullSlot = {
      ...mockSlot,
      date: '2099-12-31',
      startTime: '23:59',
      isFull: true,
      isWaitlistAvailable: false,
    };
    const result = checkBookingEligibility(fullSlot);
    expect(result.eligible).toBe(false);
    expect(result.reason).toBe('Все места заняты');
  });

  it('returns not eligible for past slot', () => {
    const pastSlot = {
      ...mockSlot,
      date: '2020-01-01',
      startTime: '10:00',
    };
    const result = checkBookingEligibility(pastSlot);
    expect(result.eligible).toBe(false);
    expect(result.reason).toBe('Занятие уже началось');
  });

  it('returns eligible for full slot with waitlist available', () => {
    const fullWithWaitlist = {
      ...mockSlot,
      date: '2099-12-31',
      startTime: '10:00',
      isFull: true,
      isWaitlistAvailable: true,
    };
    const result = checkBookingEligibility(fullWithWaitlist);
    expect(result.eligible).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it('returns not eligible for past full slot even with waitlist', () => {
    const pastFullSlot = {
      ...mockSlot,
      date: '2020-01-01',
      startTime: '10:00',
      isFull: true,
      isWaitlistAvailable: true,
    };
    const result = checkBookingEligibility(pastFullSlot);
    expect(result.eligible).toBe(false);
    expect(result.reason).toBe('Занятие уже началось');
  });
});

describe('generateWeekDates', () => {
  it('returns 7 dates', () => {
    const dates = generateWeekDates(localDate(2026, 3, 1));
    expect(dates).toHaveLength(7);
  });

  it('first date matches start date', () => {
    const dates = generateWeekDates(localDate(2026, 3, 1));
    expect(dates[0].date).toBe('2026-03-01');
  });

  it('dates are consecutive', () => {
    const dates = generateWeekDates(localDate(2026, 3, 1));
    expect(dates[1].date).toBe('2026-03-02');
    expect(dates[6].date).toBe('2026-03-07');
  });

  it('each entry has date, label, and isToday', () => {
    const dates = generateWeekDates(localDate(2026, 3, 1));
    for (const d of dates) {
      expect(d).toHaveProperty('date');
      expect(d).toHaveProperty('label');
      expect(d).toHaveProperty('isToday');
    }
  });

  it('defaults to today when no start date given', () => {
    const dates = generateWeekDates();
    expect(dates).toHaveLength(7);
    // First date should be today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    expect(dates[0].date).toBe(`${yyyy}-${mm}-${dd}`);
  });

  it('marks today with isToday true and label "Сегодня"', () => {
    const dates = generateWeekDates();
    expect(dates[0].isToday).toBe(true);
    expect(dates[0].label).toBe('Сегодня');
    // All other days should have isToday = false
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i].isToday).toBe(false);
    }
  });

  it('marks no day as today when starting from a past date', () => {
    const pastDate = localDate(2020, 1, 1);
    const dates = generateWeekDates(pastDate);
    for (const d of dates) {
      expect(d.isToday).toBe(false);
    }
  });

  it('labels non-today dates with day abbreviation and number', () => {
    const dates = generateWeekDates(localDate(2026, 3, 1));
    // 2026-03-01 is a Sunday, check second date (Monday)
    // If start date is not today, it gets day abbreviation label too
    expect(dates[1].label).toMatch(/Пн, 2/);
  });
});

// ===== New utility function tests (S7.1-S7.3) =====

describe('getBookingStatusText', () => {
  it('returns "Подтверждено" for confirmed', () => {
    expect(getBookingStatusText('confirmed')).toBe('Подтверждено');
  });

  it('returns "В очереди" for waitlist', () => {
    expect(getBookingStatusText('waitlist')).toBe('В очереди');
  });

  it('returns "Отменено" for cancelled', () => {
    expect(getBookingStatusText('cancelled')).toBe('Отменено');
  });

  it('returns "Завершено" for completed', () => {
    expect(getBookingStatusText('completed')).toBe('Завершено');
  });
});

describe('getBookingStatusColor', () => {
  it('returns a green-ish hex for confirmed', () => {
    const color = getBookingStatusColor('confirmed');
    expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('returns a yellow/orange hex for waitlist', () => {
    const color = getBookingStatusColor('waitlist');
    expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('returns a gray hex for cancelled', () => {
    const color = getBookingStatusColor('cancelled');
    expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('returns different colors for different statuses', () => {
    const confirmed = getBookingStatusColor('confirmed');
    const waitlist = getBookingStatusColor('waitlist');
    const cancelled = getBookingStatusColor('cancelled');
    const completed = getBookingStatusColor('completed');
    // All four should be distinct
    const unique = new Set([confirmed, waitlist, cancelled, completed]);
    expect(unique.size).toBe(4);
  });
});

describe('getServiceTypeBadgeVariant', () => {
  it('returns "info" for group', () => {
    expect(getServiceTypeBadgeVariant('group')).toBe('info');
  });

  it('returns "accent" for pt', () => {
    expect(getServiceTypeBadgeVariant('pt')).toBe('accent');
  });

  it('returns "warning" for spa', () => {
    expect(getServiceTypeBadgeVariant('spa')).toBe('warning');
  });
});

describe('formatBookingDateTime', () => {
  it('formats date with day of week, date and time range', () => {
    // 2026-03-02 is a Monday (Пн)
    const result = formatBookingDateTime('2026-03-02', '09:00', '10:00');
    expect(result).toContain('Пн');
    expect(result).toContain('2');
    expect(result).toContain('мар');
    expect(result).toContain('09:00');
    expect(result).toContain('10:00');
  });

  it('formats a weekend date correctly', () => {
    // 2026-03-01 is a Sunday (Вс)
    const result = formatBookingDateTime('2026-03-01', '14:00', '15:30');
    expect(result).toContain('Вс');
    expect(result).toContain('14:00');
    expect(result).toContain('15:30');
  });

  it('includes separator between date and time', () => {
    const result = formatBookingDateTime('2026-03-02', '09:00', '10:00');
    // Should use middle dot or similar separator
    expect(result).toMatch(/\d+\s+\S+\s+·\s+\d{2}:\d{2}/);
  });
});

describe('isCancelDeadlinePassed', () => {
  it('returns false when no deadline provided', () => {
    expect(isCancelDeadlinePassed(undefined)).toBe(false);
  });

  it('returns false for a deadline in the future', () => {
    const futureDeadline = new Date(Date.now() + 3600000).toISOString();
    expect(isCancelDeadlinePassed(futureDeadline)).toBe(false);
  });

  it('returns true for a deadline in the past', () => {
    const pastDeadline = new Date(Date.now() - 3600000).toISOString();
    expect(isCancelDeadlinePassed(pastDeadline)).toBe(true);
  });
});

// ===== S7 Review: New utility function tests =====

describe('getServiceTypeLabel', () => {
  it('returns "Групповое" for group', () => {
    expect(getServiceTypeLabel('group')).toBe('Групповое');
  });

  it('returns "Персональное" for pt', () => {
    expect(getServiceTypeLabel('pt')).toBe('Персональное');
  });

  it('returns "SPA" for spa', () => {
    expect(getServiceTypeLabel('spa')).toBe('SPA');
  });
});

describe('getBookingStatusBadgeVariant', () => {
  it('returns "success" for confirmed', () => {
    expect(getBookingStatusBadgeVariant('confirmed')).toBe('success');
  });

  it('returns "warning" for waitlist', () => {
    expect(getBookingStatusBadgeVariant('waitlist')).toBe('warning');
  });

  it('returns "error" for cancelled', () => {
    expect(getBookingStatusBadgeVariant('cancelled')).toBe('error');
  });

  it('returns "info" for completed', () => {
    expect(getBookingStatusBadgeVariant('completed')).toBe('info');
  });
});
