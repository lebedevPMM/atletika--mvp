import {
  formatSlotTime,
  formatDate,
  formatPrice,
  getAvailableSpots,
  checkBookingEligibility,
  generateWeekDates,
} from '../utils';
import type { ScheduleSlot } from '../types';

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
});
