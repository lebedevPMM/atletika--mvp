import type { BonusTransactionType } from './types';

const TYPE_LABELS: Record<BonusTransactionType, string> = {
  accrual: 'Начисление',
  redemption: 'Списание',
  expiry: 'Сгорание',
  referral: 'Реферал',
};

export function getTransactionTypeLabel(type: BonusTransactionType): string {
  return TYPE_LABELS[type];
}

export function getTransactionIcon(type: BonusTransactionType): string {
  switch (type) {
    case 'accrual': return '\u2795';
    case 'redemption': return '\uD83D\uDED2';
    case 'expiry': return '\u23F0';
    case 'referral': return '\uD83D\uDC65';
    default: return '\uD83D\uDC8E';
  }
}

export function formatBonusAmount(amount: number): string {
  const prefix = amount > 0 ? '+' : '';
  return `${prefix}${amount}`;
}

export function getTransactionColor(amount: number): 'success' | 'error' | 'warning' {
  if (amount > 0) return 'success';
  if (amount < 0) return 'error';
  return 'warning';
}
