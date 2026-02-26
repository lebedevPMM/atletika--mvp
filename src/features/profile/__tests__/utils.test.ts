import {
  getInitials,
  formatMemberSince,
  formatBirthDate,
  isProfileComplete,
} from '../utils';
import type { UserProfile } from '../types';

// === getInitials ===

describe('getInitials', () => {
  it('returns first letters of first and last name', () => {
    expect(getInitials('Иван', 'Петров')).toBe('ИП');
  });

  it('handles single character names', () => {
    expect(getInitials('А', 'Б')).toBe('АБ');
  });

  it('uppercases lowercase input', () => {
    expect(getInitials('john', 'doe')).toBe('JD');
  });

  it('handles Latin characters', () => {
    expect(getInitials('Anna', 'Smith')).toBe('AS');
  });
});

// === formatMemberSince ===

describe('formatMemberSince', () => {
  it('formats ISO date to month and year in Russian', () => {
    const result = formatMemberSince('2023-03-15T00:00:00Z');
    expect(result).toContain('2023');
    // month name in Russian locale
    expect(result.length).toBeGreaterThan(4);
  });

  it('formats a different date correctly', () => {
    const result = formatMemberSince('2024-12-01T00:00:00Z');
    expect(result).toContain('2024');
  });
});

// === formatBirthDate ===

describe('formatBirthDate', () => {
  it('returns formatted date for a valid ISO string', () => {
    const result = formatBirthDate('1990-05-20T00:00:00Z');
    expect(result).toContain('1990');
    // should contain day
    expect(result).toContain('20');
  });

  it('returns "Не указана" for null', () => {
    expect(formatBirthDate(null)).toBe('Не указана');
  });

  it('formats another date correctly', () => {
    const result = formatBirthDate('2000-01-01T00:00:00Z');
    expect(result).toContain('2000');
  });
});

// === isProfileComplete ===

describe('isProfileComplete', () => {
  const baseProfile: UserProfile = {
    id: '1',
    firstName: 'Иван',
    lastName: 'Петров',
    phone: '+7 (999) 123-45-67',
    email: 'ivan@example.com',
    birthDate: '1990-05-20',
    avatarUrl: null,
    memberSince: '2023-03-15',
  };

  it('returns true for a complete profile', () => {
    expect(isProfileComplete(baseProfile)).toBe(true);
  });

  it('returns false when email is null', () => {
    expect(isProfileComplete({ ...baseProfile, email: null })).toBe(false);
  });

  it('returns false when birthDate is null', () => {
    expect(isProfileComplete({ ...baseProfile, birthDate: null })).toBe(false);
  });

  it('returns false when both email and birthDate are null', () => {
    expect(
      isProfileComplete({ ...baseProfile, email: null, birthDate: null }),
    ).toBe(false);
  });
});
