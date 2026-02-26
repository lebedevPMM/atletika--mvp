import type { MembershipStatus } from './types';

export function getMembershipStatusText(status: MembershipStatus): string {
  switch (status) {
    case 'active': return 'Активен';
    case 'expired': return 'Истёк';
    case 'frozen': return 'Заморожен';
    case 'none': return 'Не подключён';
  }
}

export function getDaysLeftColor(daysLeft: number): 'success' | 'warning' | 'error' {
  if (daysLeft > 14) return 'success';
  if (daysLeft > 7) return 'warning';
  return 'error';
}

export function formatVisitsProgress(left: number | null, total: number | null): string {
  if (left === null || total === null) return 'Безлимит';
  return `${left} из ${total}`;
}

export function isQRAvailable(status: MembershipStatus): boolean {
  return status === 'active';
}
