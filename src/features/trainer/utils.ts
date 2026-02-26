import type { TrainerSession, TrainerClient } from './types';

export function getSessionTypeLabel(type: TrainerSession['type']): string {
  switch (type) {
    case 'pt': return 'Персональная';
    case 'group': return 'Групповое';
    case 'spa': return 'СПА';
  }
}

export function getSessionTypeShort(type: TrainerSession['type']): string {
  switch (type) {
    case 'pt': return 'ПТ';
    case 'group': return 'Груп.';
    case 'spa': return 'СПА';
  }
}

export function formatSessionTime(time: string, endTime: string): string {
  return `${time} — ${endTime}`;
}

export function getClientInitials(client: Pick<TrainerClient, 'firstName' | 'lastName'>): string {
  return `${client.firstName.charAt(0)}${client.lastName.charAt(0)}`.toUpperCase();
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
