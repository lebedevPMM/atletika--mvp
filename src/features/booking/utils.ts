import type { ScheduleSlot, Booking, ServiceType } from './types';

const DAYS_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

export function formatSlotTime(slot: ScheduleSlot): string {
  return `${slot.startTime} – ${slot.endTime}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${DAYS_SHORT[date.getDay()]}, ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
}

export function getAvailableSpots(slot: ScheduleSlot): number {
  return Math.max(0, slot.capacity - slot.booked);
}

export function checkBookingEligibility(slot: ScheduleSlot): { eligible: boolean; reason?: string } {
  if (slot.isFull && !slot.isWaitlistAvailable) {
    return { eligible: false, reason: 'Все места заняты' };
  }
  const slotDate = new Date(`${slot.date}T${slot.startTime}`);
  if (slotDate < new Date()) {
    return { eligible: false, reason: 'Занятие уже началось' };
  }
  return { eligible: true };
}

export function formatPrice(price: number, currency: string = 'RUB'): string {
  if (currency === 'RUB') {
    return `${price.toLocaleString('ru-RU')} ₽`;
  }
  return `${price} ${currency}`;
}

/** Format a local Date as YYYY-MM-DD without UTC conversion */
export function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function generateWeekDates(startDate?: Date): Array<{ date: string; label: string; isToday: boolean }> {
  const start = startDate || new Date();
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return {
      date: toLocalISODate(d),
      label: d.getTime() === today.getTime() ? 'Сегодня' : `${DAYS_SHORT[d.getDay()]}, ${d.getDate()}`,
      isToday: d.getTime() === today.getTime(),
    };
  });
}

// ===== Schedule utilities (S7.1-S7.3) =====

const STATUS_TEXT: Record<Booking['status'], string> = {
  confirmed: 'Подтверждено',
  waitlist: 'В очереди',
  cancelled: 'Отменено',
  completed: 'Завершено',
};

const STATUS_COLORS: Record<Booking['status'], string> = {
  confirmed: '#34C759',
  waitlist: '#FF9F0A',
  cancelled: '#8E8E93',
  completed: '#30B0C7',
};

const BADGE_VARIANTS: Record<ServiceType, string> = {
  group: 'info',
  pt: 'accent',
  spa: 'warning',
};

export function getBookingStatusText(status: Booking['status']): string {
  return STATUS_TEXT[status];
}

export function getBookingStatusColor(status: Booking['status']): string {
  return STATUS_COLORS[status];
}

export function getServiceTypeBadgeVariant(type: ServiceType): string {
  return BADGE_VARIANTS[type];
}

export function formatBookingDateTime(date: string, startTime: string, endTime: string): string {
  const d = new Date(date);
  return `${DAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} · ${startTime}\u2013${endTime}`;
}

export function getServiceTypeLabel(type: ServiceType): string {
  switch (type) {
    case 'group': return 'Групповое';
    case 'pt': return 'Персональное';
    case 'spa': return 'SPA';
    default: return type;
  }
}

export function getBookingStatusBadgeVariant(status: Booking['status']): 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case 'confirmed': return 'success';
    case 'waitlist': return 'warning';
    case 'cancelled': return 'error';
    case 'completed': return 'info';
    default: return 'info';
  }
}

export function isCancelDeadlinePassed(cancelDeadline?: string): boolean {
  if (!cancelDeadline) return false;
  return new Date(cancelDeadline) < new Date();
}
