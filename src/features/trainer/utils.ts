import type { TrainerSession, TrainerClient } from './types';

export function getSessionTypeLabel(type: TrainerSession['type']): string {
  switch (type) {
    case 'pt': return 'Персональная';
    case 'group': return 'Групповое';
    case 'spa': return 'СПА-процедура';
  }
}

export function getSessionTypeShort(type: TrainerSession['type']): string {
  switch (type) {
    case 'pt': return 'ПТ';
    case 'group': return 'Груп.';
    case 'spa': return 'СПА';
  }
}

export function getSessionBadgeVariant(
  type: TrainerSession['type'],
): 'accent' | 'info' | 'warning' {
  switch (type) {
    case 'pt': return 'accent';
    case 'group': return 'info';
    case 'spa': return 'warning';
  }
}

export function getMembershipBadgeVariant(
  status: TrainerClient['membershipStatus'],
): 'success' | 'warning' | 'error' {
  switch (status) {
    case 'active': return 'success';
    case 'frozen': return 'warning';
    case 'expired': return 'error';
  }
}

export function getMembershipLabel(
  status: TrainerClient['membershipStatus'],
): string {
  switch (status) {
    case 'active': return 'Активен';
    case 'frozen': return 'Заморожен';
    case 'expired': return 'Истёк';
  }
}

const MONTH_NAMES_SHORT = [
  'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
  'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
];

export function formatLastVisit(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getDate()} ${MONTH_NAMES_SHORT[date.getMonth()]}`;
}

export function formatSessionTime(time: string, endTime: string): string {
  return `${time} — ${endTime}`;
}

export function isSessionActive(status: TrainerSession['status']): boolean {
  return status === 'scheduled' || status === 'in_progress';
}

export function getAttendanceRatio(count: number | undefined, max: number | undefined): string {
  if (count === undefined || max === undefined) return '—';
  return `${count} из ${max}`;
}

export function sortSessionsByTime(sessions: TrainerSession[]): TrainerSession[] {
  return [...sessions].sort((a, b) => a.time.localeCompare(b.time));
}
