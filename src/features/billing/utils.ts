import type { PaymentStatus, InvoiceStatus, InvoiceItem } from './types';

export function formatAmount(amount: number, currency: string): string {
  if (currency === 'RUB') return `${amount.toLocaleString('ru-RU')} \u20BD`;
  return `${amount} ${currency}`;
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export function formatDateFull(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function statusBadge(status: InvoiceStatus): { text: string; variant: 'warning' | 'success' | 'error' | 'info' } {
  switch (status) {
    case 'open':
      return { text: 'Открыт', variant: 'warning' };
    case 'paid':
      return { text: 'Оплачен', variant: 'success' };
    case 'overdue':
      return { text: 'Просрочен', variant: 'error' };
    case 'cancelled':
      return { text: 'Отменен', variant: 'info' };
    default:
      return { text: status, variant: 'info' };
  }
}

export function isPaymentComplete(status: PaymentStatus): boolean {
  return status === 'success' || status === 'failed';
}

export function isPayable(status: InvoiceStatus): boolean {
  return status === 'open' || status === 'overdue';
}

export function getInvoiceTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
