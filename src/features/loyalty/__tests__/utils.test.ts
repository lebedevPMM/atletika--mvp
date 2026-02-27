import {
  getTransactionTypeLabel,
  getTransactionIcon,
  formatBonusAmount,
  getTransactionColor,
} from '../utils';

// === getTransactionTypeLabel ===

describe('getTransactionTypeLabel', () => {
  it('returns "Начисление" for accrual', () => {
    expect(getTransactionTypeLabel('accrual')).toBe('Начисление');
  });

  it('returns "Списание" for redemption', () => {
    expect(getTransactionTypeLabel('redemption')).toBe('Списание');
  });

  it('returns "Сгорание" for expiry', () => {
    expect(getTransactionTypeLabel('expiry')).toBe('Сгорание');
  });

  it('returns "Реферал" for referral', () => {
    expect(getTransactionTypeLabel('referral')).toBe('Реферал');
  });
});

// === getTransactionIcon ===

describe('getTransactionIcon', () => {
  it('returns ➕ for accrual', () => {
    expect(getTransactionIcon('accrual')).toBe('➕');
  });

  it('returns 🛒 for redemption', () => {
    expect(getTransactionIcon('redemption')).toBe('🛒');
  });

  it('returns ⏰ for expiry', () => {
    expect(getTransactionIcon('expiry')).toBe('⏰');
  });

  it('returns 👥 for referral', () => {
    expect(getTransactionIcon('referral')).toBe('👥');
  });
});

// === formatBonusAmount ===

describe('formatBonusAmount', () => {
  it('adds + prefix for positive', () => {
    expect(formatBonusAmount(100)).toBe('+100');
  });

  it('no prefix for negative (already has minus)', () => {
    expect(formatBonusAmount(-50)).toBe('-50');
  });

  it('no prefix for zero', () => {
    expect(formatBonusAmount(0)).toBe('0');
  });
});

// === getTransactionColor ===

describe('getTransactionColor', () => {
  it('returns "success" for positive', () => {
    expect(getTransactionColor(100)).toBe('success');
  });

  it('returns "error" for negative', () => {
    expect(getTransactionColor(-50)).toBe('error');
  });

  it('returns "warning" for zero', () => {
    expect(getTransactionColor(0)).toBe('warning');
  });
});
