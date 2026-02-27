import { getReviewTypeLabel, getReviewTypeIcon, formatStars, getRatingLabel } from '../utils';

describe('getReviewTypeLabel', () => {
  it('returns Тренер for trainer', () => expect(getReviewTypeLabel('trainer')).toBe('Тренер'));
  it('returns Занятие for class', () => expect(getReviewTypeLabel('class')).toBe('Занятие'));
  it('returns Клуб for club', () => expect(getReviewTypeLabel('club')).toBe('Клуб'));
});

describe('getReviewTypeIcon', () => {
  it('returns icon for trainer', () => expect(getReviewTypeIcon('trainer')).toBe('👤'));
  it('returns icon for class', () => expect(getReviewTypeIcon('class')).toBe('🏋️'));
  it('returns icon for club', () => expect(getReviewTypeIcon('club')).toBe('🏢'));
});

describe('formatStars', () => {
  it('formats 5 stars', () => expect(formatStars(5)).toBe('★★★★★'));
  it('formats 3 stars', () => expect(formatStars(3)).toBe('★★★☆☆'));
  it('formats 0 stars', () => expect(formatStars(0)).toBe('☆☆☆☆☆'));
  it('formats 1 star', () => expect(formatStars(1)).toBe('★☆☆☆☆'));
});

describe('getRatingLabel', () => {
  it('returns Отлично for 5', () => expect(getRatingLabel(5)).toBe('Отлично'));
  it('returns Хорошо for 4', () => expect(getRatingLabel(4)).toBe('Хорошо'));
  it('returns Нормально for 3', () => expect(getRatingLabel(3)).toBe('Нормально'));
  it('returns Плохо for 2', () => expect(getRatingLabel(2)).toBe('Плохо'));
  it('returns Ужасно for 1', () => expect(getRatingLabel(1)).toBe('Ужасно'));
});
