import {
  formatAmount,
  isPaymentComplete,
  isPayable,
  getInvoiceTotal,
} from '../utils';
import type { PaymentStatus, InvoiceStatus, InvoiceItem } from '../types';

// === formatAmount ===

describe('formatAmount', () => {
  it('formats RUB amount with rouble sign', () => {
    const result = formatAmount(5500, 'RUB');
    expect(result).toContain('5');
    expect(result).toContain('500');
    expect(result).toContain('\u20BD');
  });

  it('formats large RUB amount with locale grouping', () => {
    const result = formatAmount(1250000, 'RUB');
    expect(result).toContain('\u20BD');
    // locale grouping may vary, but digits must be present
    expect(result).toMatch(/1.*250.*000/);
  });

  it('formats zero amount', () => {
    const result = formatAmount(0, 'RUB');
    expect(result).toContain('0');
    expect(result).toContain('\u20BD');
  });

  it('formats non-RUB currency with currency code', () => {
    const result = formatAmount(100, 'USD');
    expect(result).toBe('100 USD');
  });

  it('formats non-RUB currency with different code', () => {
    const result = formatAmount(250, 'EUR');
    expect(result).toBe('250 EUR');
  });
});

// === isPaymentComplete ===

describe('isPaymentComplete', () => {
  it('returns true for success status', () => {
    expect(isPaymentComplete('success')).toBe(true);
  });

  it('returns true for failed status', () => {
    expect(isPaymentComplete('failed')).toBe(true);
  });

  it('returns false for pending status', () => {
    expect(isPaymentComplete('pending')).toBe(false);
  });

  it('returns false for processing status', () => {
    expect(isPaymentComplete('processing')).toBe(false);
  });
});

// === isPayable ===

describe('isPayable', () => {
  it('returns true for open invoice', () => {
    expect(isPayable('open')).toBe(true);
  });

  it('returns true for overdue invoice', () => {
    expect(isPayable('overdue')).toBe(true);
  });

  it('returns false for paid invoice', () => {
    expect(isPayable('paid')).toBe(false);
  });

  it('returns false for cancelled invoice', () => {
    expect(isPayable('cancelled')).toBe(false);
  });
});

// === getInvoiceTotal ===

describe('getInvoiceTotal', () => {
  it('calculates total for a single item', () => {
    const items: InvoiceItem[] = [{ name: 'Абонемент', quantity: 1, price: 5500 }];
    expect(getInvoiceTotal(items)).toBe(5500);
  });

  it('calculates total for multiple items', () => {
    const items: InvoiceItem[] = [
      { name: 'Абонемент', quantity: 1, price: 5500 },
      { name: 'Полотенце', quantity: 2, price: 300 },
    ];
    expect(getInvoiceTotal(items)).toBe(6100);
  });

  it('returns 0 for empty array', () => {
    expect(getInvoiceTotal([])).toBe(0);
  });

  it('handles items with quantity > 1', () => {
    const items: InvoiceItem[] = [
      { name: 'Персональная тренировка', quantity: 4, price: 3500 },
    ];
    expect(getInvoiceTotal(items)).toBe(14000);
  });
});
