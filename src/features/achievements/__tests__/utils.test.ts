import { getStatusLabel, getCategoryLabel, getCategoryIcon, formatProgress } from '../utils';

describe('getStatusLabel', () => {
  it('returns Получено for unlocked', () => expect(getStatusLabel('unlocked')).toBe('Получено'));
  it('returns В процессе for in_progress', () => expect(getStatusLabel('in_progress')).toBe('В процессе'));
  it('returns Заблокировано for locked', () => expect(getStatusLabel('locked')).toBe('Заблокировано'));
  it('returns Секретное for secret', () => expect(getStatusLabel('secret')).toBe('Секретное'));
});

describe('getCategoryLabel', () => {
  it('returns Серии for streak', () => expect(getCategoryLabel('streak')).toBe('Серии'));
  it('returns Количество for total', () => expect(getCategoryLabel('total')).toBe('Количество'));
  it('returns Разнообразие for variety', () => expect(getCategoryLabel('variety')).toBe('Разнообразие'));
  it('returns Время for time', () => expect(getCategoryLabel('time')).toBe('Время'));
  it('returns Социальные for social', () => expect(getCategoryLabel('social')).toBe('Социальные'));
  it('returns Секретные for secret', () => expect(getCategoryLabel('secret')).toBe('Секретные'));
  it('returns raw value for unknown', () => expect(getCategoryLabel('foo')).toBe('foo'));
});

describe('getCategoryIcon', () => {
  it('returns 🔥 for streak', () => expect(getCategoryIcon('streak')).toBe('🔥'));
  it('returns 💪 for total', () => expect(getCategoryIcon('total')).toBe('💪'));
  it('returns 🎯 for variety', () => expect(getCategoryIcon('variety')).toBe('🎯'));
  it('returns 🌅 for time', () => expect(getCategoryIcon('time')).toBe('🌅'));
  it('returns 👥 for social', () => expect(getCategoryIcon('social')).toBe('👥'));
  it('returns 🔒 for secret', () => expect(getCategoryIcon('secret')).toBe('🔒'));
  it('returns 🏆 for unknown', () => expect(getCategoryIcon('other')).toBe('🏆'));
});

describe('formatProgress', () => {
  it('formats progress', () => expect(formatProgress(5, 10)).toBe('5/10'));
  it('formats zero', () => expect(formatProgress(0, 100)).toBe('0/100'));
  it('formats complete', () => expect(formatProgress(10, 10)).toBe('10/10'));
});
