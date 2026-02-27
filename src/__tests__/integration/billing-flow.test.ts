/**
 * Integration test: Billing Flow
 *
 * Verifies the complete billing sequence:
 *   getInvoices -> getInvoice -> createPayment -> getPaymentStatus (poll)
 *
 * Also tests:
 *   - Payment failure flow
 *   - SBP payment flow (QR-based)
 *   - 3DS card payment flow
 *   - Filtering invoices by status
 *   - Payment status polling transitions
 */

jest.mock('@/shared/api/client', () => ({
  api: {
    get: jest.fn().mockResolvedValue({}),
    post: jest.fn().mockResolvedValue({}),
  },
}));

import { api } from '@/shared/api/client';
import { billingApi } from '@/features/billing/api';
import type { Invoice, PaymentIntent, InvoiceItem } from '@/features/billing/types';

const mockGet = api.get as jest.Mock;
const mockPost = api.post as jest.Mock;

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const invoiceItems: InvoiceItem[] = [
  { name: 'Абонемент Premium', quantity: 1, price: 5000 },
  { name: 'Персональная тренировка', quantity: 2, price: 3000 },
];

const openInvoice: Invoice = {
  id: 'inv-1',
  title: 'Счёт за март 2026',
  description: 'Абонемент + доп. услуги',
  amount: 11000,
  currency: 'RUB',
  status: 'open',
  dueDate: '2026-03-15',
  createdAt: '2026-03-01T10:00:00Z',
  items: invoiceItems,
};

const overdueInvoice: Invoice = {
  id: 'inv-2',
  title: 'Счёт за февраль 2026',
  amount: 5000,
  currency: 'RUB',
  status: 'overdue',
  dueDate: '2026-02-15',
  createdAt: '2026-02-01T10:00:00Z',
  items: [{ name: 'Абонемент Standard', quantity: 1, price: 5000 }],
};

const paidInvoice: Invoice = {
  ...openInvoice,
  id: 'inv-3',
  title: 'Счёт за январь 2026',
  status: 'paid',
  paidAt: '2026-01-10T15:00:00Z',
};

const cardPaymentPending: PaymentIntent = {
  id: 'pay-1',
  invoiceId: 'inv-1',
  amount: 11000,
  currency: 'RUB',
  method: 'card',
  status: 'pending',
  confirmationUrl: 'https://bank.example.com/3ds/confirm?id=pay-1',
};

const cardPaymentProcessing: PaymentIntent = {
  ...cardPaymentPending,
  status: 'processing',
};

const cardPaymentSuccess: PaymentIntent = {
  ...cardPaymentPending,
  status: 'success',
  confirmationUrl: undefined,
};

const cardPaymentFailed: PaymentIntent = {
  ...cardPaymentPending,
  status: 'failed',
  confirmationUrl: undefined,
};

const sbpPaymentPending: PaymentIntent = {
  id: 'pay-2',
  invoiceId: 'inv-2',
  amount: 5000,
  currency: 'RUB',
  method: 'sbp',
  status: 'pending',
  qrUrl: 'https://qr.nspk.ru/pay?id=sbp-123',
  qrPayload: 'https://qr.nspk.ru/AS10003W72XZ24L5B?type=02&bank=100000000001&sum=500000&cur=RUB',
};

const sbpPaymentSuccess: PaymentIntent = {
  ...sbpPaymentPending,
  status: 'success',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Billing Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes the full invoice -> pay -> success flow (card)', async () => {
    // Step 1: List invoices
    mockGet.mockResolvedValueOnce([openInvoice, overdueInvoice]);

    const invoices = await billingApi.getInvoices();

    expect(mockGet).toHaveBeenCalledWith('billing/invoices', undefined);
    expect(invoices).toHaveLength(2);
    expect(invoices[0].status).toBe('open');
    expect(invoices[1].status).toBe('overdue');

    // Step 2: Get invoice detail
    mockGet.mockResolvedValueOnce(openInvoice);

    const invoice = await billingApi.getInvoice('inv-1');

    expect(mockGet).toHaveBeenCalledWith('billing/invoices/inv-1');
    expect(invoice.amount).toBe(11000);
    expect(invoice.items).toHaveLength(2);
    expect(invoice.items[0].name).toBe('Абонемент Premium');

    // Step 3: Create card payment
    mockPost.mockResolvedValueOnce(cardPaymentPending);

    const payment = await billingApi.createPayment('inv-1', 'card');

    expect(mockPost).toHaveBeenCalledWith('billing/payments', {
      invoiceId: 'inv-1',
      method: 'card',
    });
    expect(payment.status).toBe('pending');
    expect(payment.confirmationUrl).toContain('3ds');

    // Step 4: Poll payment status — pending -> processing -> success
    mockGet.mockResolvedValueOnce(cardPaymentProcessing);
    const poll1 = await billingApi.getPaymentStatus('pay-1');
    expect(poll1.status).toBe('processing');

    mockGet.mockResolvedValueOnce(cardPaymentSuccess);
    const poll2 = await billingApi.getPaymentStatus('pay-1');
    expect(poll2.status).toBe('success');

    // Verify the payment status endpoint was called correctly
    expect(mockGet).toHaveBeenCalledWith('billing/payments/pay-1');

    // Verify total call counts
    expect(mockGet).toHaveBeenCalledTimes(4);  // invoices, invoice detail, 2x payment status
    expect(mockPost).toHaveBeenCalledTimes(1); // createPayment
  });

  it('completes the full invoice -> pay -> failed flow (card)', async () => {
    // Step 1: Get invoice
    mockGet.mockResolvedValueOnce(openInvoice);
    const invoice = await billingApi.getInvoice('inv-1');
    expect(invoice.status).toBe('open');

    // Step 2: Create payment
    mockPost.mockResolvedValueOnce(cardPaymentPending);
    const payment = await billingApi.createPayment('inv-1', 'card');
    expect(payment.status).toBe('pending');

    // Step 3: Poll -> processing -> failed
    mockGet.mockResolvedValueOnce(cardPaymentProcessing);
    const poll1 = await billingApi.getPaymentStatus('pay-1');
    expect(poll1.status).toBe('processing');

    mockGet.mockResolvedValueOnce(cardPaymentFailed);
    const poll2 = await billingApi.getPaymentStatus('pay-1');
    expect(poll2.status).toBe('failed');

    // After failure, invoice should still be open (unchanged)
    mockGet.mockResolvedValueOnce(openInvoice);
    const recheckInvoice = await billingApi.getInvoice('inv-1');
    expect(recheckInvoice.status).toBe('open');
  });

  it('completes SBP (QR) payment flow', async () => {
    // Step 1: Get overdue invoice
    mockGet.mockResolvedValueOnce(overdueInvoice);
    const invoice = await billingApi.getInvoice('inv-2');
    expect(invoice.status).toBe('overdue');
    expect(invoice.amount).toBe(5000);

    // Step 2: Create SBP payment
    mockPost.mockResolvedValueOnce(sbpPaymentPending);
    const payment = await billingApi.createPayment('inv-2', 'sbp');

    expect(mockPost).toHaveBeenCalledWith('billing/payments', {
      invoiceId: 'inv-2',
      method: 'sbp',
    });
    expect(payment.status).toBe('pending');
    expect(payment.qrUrl).toBeDefined();
    expect(payment.qrPayload).toBeDefined();
    expect(payment.confirmationUrl).toBeUndefined(); // SBP has no 3DS

    // Step 3: Poll -> success
    mockGet.mockResolvedValueOnce(sbpPaymentSuccess);
    const pollResult = await billingApi.getPaymentStatus('pay-2');
    expect(pollResult.status).toBe('success');
  });

  it('filters invoices by status', async () => {
    // Open invoices only
    mockGet.mockResolvedValueOnce([openInvoice]);
    const openInvoices = await billingApi.getInvoices('open');

    expect(mockGet).toHaveBeenCalledWith('billing/invoices', { status: 'open' });
    expect(openInvoices).toHaveLength(1);
    expect(openInvoices[0].status).toBe('open');

    // Paid invoices only
    mockGet.mockResolvedValueOnce([paidInvoice]);
    const paidInvoices = await billingApi.getInvoices('paid');

    expect(mockGet).toHaveBeenCalledWith('billing/invoices', { status: 'paid' });
    expect(paidInvoices).toHaveLength(1);
    expect(paidInvoices[0].paidAt).toBeDefined();
  });

  it('handles payment creation failure (server error)', async () => {
    // Invoice fetch succeeds
    mockGet.mockResolvedValueOnce(openInvoice);
    await billingApi.getInvoice('inv-1');

    // Payment creation fails
    mockPost.mockRejectedValueOnce(new Error('Payment gateway unavailable'));

    await expect(
      billingApi.createPayment('inv-1', 'card'),
    ).rejects.toThrow('Payment gateway unavailable');

    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  it('handles network error during payment status polling', async () => {
    // Payment created successfully
    mockPost.mockResolvedValueOnce(cardPaymentPending);
    await billingApi.createPayment('inv-1', 'card');

    // First poll succeeds
    mockGet.mockResolvedValueOnce(cardPaymentProcessing);
    const poll1 = await billingApi.getPaymentStatus('pay-1');
    expect(poll1.status).toBe('processing');

    // Second poll fails with network error
    mockGet.mockRejectedValueOnce(new Error('Network timeout'));
    await expect(
      billingApi.getPaymentStatus('pay-1'),
    ).rejects.toThrow('Network timeout');

    // Third poll succeeds (retry scenario)
    mockGet.mockResolvedValueOnce(cardPaymentSuccess);
    const poll3 = await billingApi.getPaymentStatus('pay-1');
    expect(poll3.status).toBe('success');
  });

  it('verifies complete call sequence order via call indices', async () => {
    // Full happy path: list -> detail -> pay -> poll -> success
    mockGet.mockResolvedValueOnce([openInvoice]);     // call 1: list
    mockGet.mockResolvedValueOnce(openInvoice);        // call 2: detail
    mockPost.mockResolvedValueOnce(cardPaymentPending);// call 3: create payment
    mockGet.mockResolvedValueOnce(cardPaymentSuccess); // call 4: poll status

    await billingApi.getInvoices();
    await billingApi.getInvoice('inv-1');
    await billingApi.createPayment('inv-1', 'card');
    await billingApi.getPaymentStatus('pay-1');

    // Verify GET calls in order
    expect(mockGet).toHaveBeenNthCalledWith(1, 'billing/invoices', undefined);
    expect(mockGet).toHaveBeenNthCalledWith(2, 'billing/invoices/inv-1');
    expect(mockGet).toHaveBeenNthCalledWith(3, 'billing/payments/pay-1');

    // Verify POST call
    expect(mockPost).toHaveBeenNthCalledWith(1, 'billing/payments', {
      invoiceId: 'inv-1',
      method: 'card',
    });
  });
});
