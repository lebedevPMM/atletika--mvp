import type { TeamMember, NewsItem, NotificationItem } from './types';

// === Team member helpers ===

const ROLE_LABELS: Record<TeamMember['role'], string> = {
  trainer: 'Тренер',
  instructor: 'Инструктор',
  spa: 'SPA-мастер',
  manager: 'Менеджер',
};

export function getRoleLabel(role: TeamMember['role']): string {
  return ROLE_LABELS[role];
}

export function getRoleBadgeVariant(role: TeamMember['role']): 'accent' | 'info' | 'warning' | 'success' {
  switch (role) {
    case 'trainer': return 'accent';
    case 'instructor': return 'info';
    case 'spa': return 'warning';
    case 'manager': return 'success';
    default: return 'info';
  }
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
}

// === News helpers ===

const NEWS_CATEGORY_LABELS: Record<NewsItem['category'], string> = {
  news: 'Новость',
  promo: 'Акция',
  event: 'Событие',
};

export function getNewsCategoryLabel(category: NewsItem['category']): string {
  return NEWS_CATEGORY_LABELS[category];
}

export function getNewsCategoryBadgeVariant(category: NewsItem['category']): 'info' | 'accent' | 'warning' {
  switch (category) {
    case 'news': return 'info';
    case 'promo': return 'accent';
    case 'event': return 'warning';
    default: return 'info';
  }
}

export function formatNewsDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHrs = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return 'Только что';
  if (diffMin < 60) return `${diffMin} мин назад`;
  if (diffHrs < 24) return `${diffHrs} ч назад`;
  if (diffDays < 7) return `${diffDays} дн назад`;

  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

// === Notification helpers ===

const NOTIFICATION_TYPE_LABELS: Record<NotificationItem['type'], string> = {
  booking: 'Запись',
  promo: 'Акция',
  system: 'Система',
  chat: 'Сообщение',
};

export function getNotificationTypeLabel(type: NotificationItem['type']): string {
  return NOTIFICATION_TYPE_LABELS[type];
}

export function getNotificationIcon(type: NotificationItem['type']): string {
  switch (type) {
    case 'booking': return '📅';
    case 'promo': return '🎁';
    case 'system': return '⚙️';
    case 'chat': return '💬';
    default: return '🔔';
  }
}

// === Chat helpers ===

export function formatMessageTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export function formatMessageDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  if (isToday) return 'Сегодня';

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
  if (isYesterday) return 'Вчера';

  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}
