import {
  getMembershipStatusText,
  getDaysLeftColor,
  formatVisitsProgress,
  isQRAvailable,
} from '../utils';

describe('getMembershipStatusText', () => {
  it('returns "Активен" for active', () => {
    expect(getMembershipStatusText('active')).toBe('Активен');
  });

  it('returns "Истёк" for expired', () => {
    expect(getMembershipStatusText('expired')).toBe('Истёк');
  });

  it('returns "Заморожен" for frozen', () => {
    expect(getMembershipStatusText('frozen')).toBe('Заморожен');
  });

  it('returns "Не подключён" for none', () => {
    expect(getMembershipStatusText('none')).toBe('Не подключён');
  });
});

describe('getDaysLeftColor', () => {
  it('returns "error" when daysLeft is 0', () => {
    expect(getDaysLeftColor(0)).toBe('error');
  });

  it('returns "error" when daysLeft is 1', () => {
    expect(getDaysLeftColor(1)).toBe('error');
  });

  it('returns "error" when daysLeft is 7', () => {
    expect(getDaysLeftColor(7)).toBe('error');
  });

  it('returns "warning" when daysLeft is 8', () => {
    expect(getDaysLeftColor(8)).toBe('warning');
  });

  it('returns "warning" when daysLeft is 14', () => {
    expect(getDaysLeftColor(14)).toBe('warning');
  });

  it('returns "success" when daysLeft is 15', () => {
    expect(getDaysLeftColor(15)).toBe('success');
  });
});

describe('formatVisitsProgress', () => {
  it('returns "Безлимит" when both null', () => {
    expect(formatVisitsProgress(null, null)).toBe('Безлимит');
  });

  it('returns formatted string for 3 of 8', () => {
    expect(formatVisitsProgress(3, 8)).toBe('3 из 8');
  });

  it('returns formatted string for 0 of 5', () => {
    expect(formatVisitsProgress(0, 5)).toBe('0 из 5');
  });
});

describe('isQRAvailable', () => {
  it('returns true for active', () => {
    expect(isQRAvailable('active')).toBe(true);
  });

  it('returns false for expired', () => {
    expect(isQRAvailable('expired')).toBe(false);
  });

  it('returns false for frozen', () => {
    expect(isQRAvailable('frozen')).toBe(false);
  });

  it('returns false for none', () => {
    expect(isQRAvailable('none')).toBe(false);
  });
});
