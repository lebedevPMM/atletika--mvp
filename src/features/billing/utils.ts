import type { PaymentStatus, InvoiceStatus, InvoiceItem } from './types';

export function formatAmount(amount: number, currency: string): string {
  if (currency === 'RUB') return `${amount.toLocaleString('ru-RU')} \u20BD`;
  return `${amount} ${currency}`;
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
