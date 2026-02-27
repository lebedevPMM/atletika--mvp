import {
  getRoleLabel,
  getRoleBadgeVariant,
  formatRating,
  getInitials,
  getNewsCategoryLabel,
  getNewsCategoryBadgeVariant,
  formatNewsDate,
  getNotificationTypeLabel,
  getNotificationIcon,
  formatMessageTime,
  formatMessageDate,
} from '../utils';

// === getRoleLabel ===

describe('getRoleLabel', () => {
  it('returns "Тренер" for trainer', () => {
    expect(getRoleLabel('trainer')).toBe('Тренер');
  });

  it('returns "Инструктор" for instructor', () => {
    expect(getRoleLabel('instructor')).toBe('Инструктор');
  });

  it('returns "SPA-мастер" for spa', () => {
    expect(getRoleLabel('spa')).toBe('SPA-мастер');
  });

  it('returns "Менеджер" for manager', () => {
    expect(getRoleLabel('manager')).toBe('Менеджер');
  });
});

// === getRoleBadgeVariant ===

describe('getRoleBadgeVariant', () => {
  it('returns "accent" for trainer', () => {
    expect(getRoleBadgeVariant('trainer')).toBe('accent');
  });

  it('returns "info" for instructor', () => {
    expect(getRoleBadgeVariant('instructor')).toBe('info');
  });

  it('returns "warning" for spa', () => {
    expect(getRoleBadgeVariant('spa')).toBe('warning');
  });

  it('returns "success" for manager', () => {
    expect(getRoleBadgeVariant('manager')).toBe('success');
  });
});

// === formatRating ===

describe('formatRating', () => {
  it('formats integer to one decimal', () => {
    expect(formatRating(5)).toBe('5.0');
  });

  it('formats decimal to one place', () => {
    expect(formatRating(4.8)).toBe('4.8');
  });

  it('rounds to one decimal', () => {
    expect(formatRating(4.75)).toBe('4.8');
  });
});

// === getInitials ===

describe('getInitials', () => {
  it('returns initials from two-word name', () => {
    expect(getInitials('Игорь Смирнов')).toBe('ИС');
  });

  it('returns single initial for single word', () => {
    expect(getInitials('Игорь')).toBe('И');
  });

  it('handles extra spaces', () => {
    expect(getInitials('  Анна   Петрова  ')).toBe('АП');
  });

  it('returns empty string for empty input', () => {
    expect(getInitials('')).toBe('');
  });

  it('takes first two parts for three-word name', () => {
    expect(getInitials('Иван Петрович Сидоров')).toBe('ИП');
  });
});

// === getNewsCategoryLabel ===

describe('getNewsCategoryLabel', () => {
  it('returns "Новость" for news', () => {
    expect(getNewsCategoryLabel('news')).toBe('Новость');
  });

  it('returns "Акция" for promo', () => {
    expect(getNewsCategoryLabel('promo')).toBe('Акция');
  });

  it('returns "Событие" for event', () => {
    expect(getNewsCategoryLabel('event')).toBe('Событие');
  });
});

// === getNewsCategoryBadgeVariant ===

describe('getNewsCategoryBadgeVariant', () => {
  it('returns "info" for news', () => {
    expect(getNewsCategoryBadgeVariant('news')).toBe('info');
  });

  it('returns "accent" for promo', () => {
    expect(getNewsCategoryBadgeVariant('promo')).toBe('accent');
  });

  it('returns "warning" for event', () => {
    expect(getNewsCategoryBadgeVariant('event')).toBe('warning');
  });
});

// === formatNewsDate ===

describe('formatNewsDate', () => {
  it('returns "Только что" for less than 1 minute ago', () => {
    const now = new Date().toISOString();
    expect(formatNewsDate(now)).toBe('Только что');
  });

  it('returns minutes for less than 1 hour ago', () => {
    const thirtyMinAgo = new Date(Date.now() - 30 * 60_000).toISOString();
    expect(formatNewsDate(thirtyMinAgo)).toBe('30 мин назад');
  });

  it('returns hours for less than 1 day ago', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 3_600_000).toISOString();
    expect(formatNewsDate(twoHoursAgo)).toBe('2 ч назад');
  });

  it('returns days for less than 7 days ago', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 86_400_000).toISOString();
    expect(formatNewsDate(threeDaysAgo)).toBe('3 дн назад');
  });

  it('returns formatted date for 7+ days ago', () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 86_400_000).toISOString();
    const result = formatNewsDate(tenDaysAgo);
    // Should be something like "17 февр." — just verify it's not a relative string
    expect(result).not.toContain('назад');
    expect(result).not.toBe('Только что');
  });
});

// === getNotificationTypeLabel ===

describe('getNotificationTypeLabel', () => {
  it('returns "Запись" for booking', () => {
    expect(getNotificationTypeLabel('booking')).toBe('Запись');
  });

  it('returns "Акция" for promo', () => {
    expect(getNotificationTypeLabel('promo')).toBe('Акция');
  });

  it('returns "Система" for system', () => {
    expect(getNotificationTypeLabel('system')).toBe('Система');
  });

  it('returns "Сообщение" for chat', () => {
    expect(getNotificationTypeLabel('chat')).toBe('Сообщение');
  });
});

// === getNotificationIcon ===

describe('getNotificationIcon', () => {
  it('returns calendar emoji for booking', () => {
    expect(getNotificationIcon('booking')).toBe('📅');
  });

  it('returns gift emoji for promo', () => {
    expect(getNotificationIcon('promo')).toBe('🎁');
  });

  it('returns gear emoji for system', () => {
    expect(getNotificationIcon('system')).toBe('⚙️');
  });

  it('returns speech bubble for chat', () => {
    expect(getNotificationIcon('chat')).toBe('💬');
  });
});

// === formatMessageTime ===

describe('formatMessageTime', () => {
  it('formats ISO date to HH:MM', () => {
    const result = formatMessageTime('2026-02-27T14:30:00.000Z');
    // Locale-dependent, but should be a short time string
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });
});

// === formatMessageDate ===

describe('formatMessageDate', () => {
  it('returns "Сегодня" for today', () => {
    const today = new Date().toISOString();
    expect(formatMessageDate(today)).toBe('Сегодня');
  });

  it('returns "Вчера" for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(12, 0, 0, 0);
    expect(formatMessageDate(yesterday.toISOString())).toBe('Вчера');
  });

  it('returns formatted date for older dates', () => {
    const old = new Date();
    old.setDate(old.getDate() - 5);
    const result = formatMessageDate(old.toISOString());
    expect(result).not.toBe('Сегодня');
    expect(result).not.toBe('Вчера');
  });
});
