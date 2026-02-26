import type { ScheduleSlot } from './types';

export function formatSlotTime(slot: ScheduleSlot): string {
  return `${slot.startTime} – ${slot.endTime}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
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

export function generateWeekDates(startDate?: Date): Array<{ date: string; label: string; isToday: boolean }> {
  const start = startDate || new Date();
  start.setHours(0, 0, 0, 0);
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().split('T')[0],
      label: d.getTime() === today.getTime() ? 'Сегодня' : `${days[d.getDay()]}, ${d.getDate()}`,
      isToday: d.getTime() === today.getTime(),
    };
  });
}
