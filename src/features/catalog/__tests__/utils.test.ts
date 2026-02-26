import {
  getPurchaseTypeLabel,
  isPurchaseActive,
  getPurchaseProgress,
  isExpiringSoon,
} from '../utils';

describe('getPurchaseTypeLabel', () => {
  it('returns "ПТ" for pt_pack', () => {
    expect(getPurchaseTypeLabel('pt_pack')).toBe('ПТ');
  });

  it('returns "СПА" for spa_pack', () => {
    expect(getPurchaseTypeLabel('spa_pack')).toBe('СПА');
  });

  it('returns "Разовая" for single', () => {
    expect(getPurchaseTypeLabel('single')).toBe('Разовая');
  });

  it('returns "Билет" for ticket', () => {
    expect(getPurchaseTypeLabel('ticket')).toBe('Билет');
  });

  it('returns "Доп. опция" for addon', () => {
    expect(getPurchaseTypeLabel('addon')).toBe('Доп. опция');
  });
});

describe('isPurchaseActive', () => {
  it('returns true for active', () => {
    expect(isPurchaseActive('active')).toBe(true);
  });

  it('returns false for expired', () => {
    expect(isPurchaseActive('expired')).toBe(false);
  });

  it('returns false for used', () => {
    expect(isPurchaseActive('used')).toBe(false);
  });

  it('returns false for refunded', () => {
    expect(isPurchaseActive('refunded')).toBe(false);
  });
});

describe('getPurchaseProgress', () => {
  it('returns correct ratio for normal values', () => {
    expect(getPurchaseProgress(3, 8)).toBeCloseTo(0.375);
  });

  it('returns 0 when total is 0', () => {
    expect(getPurchaseProgress(0, 0)).toBe(0);
  });

  it('returns 0 when all sessions used', () => {
    expect(getPurchaseProgress(0, 5)).toBe(0);
  });

  it('returns 1 when all sessions remain', () => {
    expect(getPurchaseProgress(10, 10)).toBe(1);
  });
});

describe('isExpiringSoon', () => {
  it('returns false for date far in the future', () => {
    const future = new Date(Date.now() + 30 * 86400000).toISOString();
    expect(isExpiringSoon(future)).toBe(false);
  });

  it('returns true for date within 7 days', () => {
    const soon = new Date(Date.now() + 3 * 86400000).toISOString();
    expect(isExpiringSoon(soon)).toBe(true);
  });

  it('returns false for expired date', () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    expect(isExpiringSoon(past)).toBe(false);
  });

  it('returns true for date exactly within threshold', () => {
    // 6 days from now — within 7 day threshold
    const within = new Date(Date.now() + 6 * 86400000).toISOString();
    expect(isExpiringSoon(within, 7)).toBe(true);
  });

  it('returns false for date at exactly the threshold boundary', () => {
    // 8 days from now — outside 7 day threshold
    const outside = new Date(Date.now() + 8 * 86400000).toISOString();
    expect(isExpiringSoon(outside, 7)).toBe(false);
  });

  it('respects custom daysThreshold', () => {
    const within14 = new Date(Date.now() + 10 * 86400000).toISOString();
    expect(isExpiringSoon(within14, 14)).toBe(true);
    expect(isExpiringSoon(within14, 7)).toBe(false);
  });
});
