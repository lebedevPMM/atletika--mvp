import { api } from '@/shared/api/client';
import { billingApi } from '../api';

jest.mock('@/shared/api/client', () => ({
  api: {
    get: jest.fn().mockResolvedValue({}),
    post: jest.fn().mockResolvedValue({}),
  },
}));

const mockGet = api.get as jest.Mock;
const mockPost = api.post as jest.Mock;

describe('billingApi', () => {
  beforeEach(() => jest.clearAllMocks());

  // --- GET endpoints ---

  describe('getInvoices', () => {
    it('calls billing/invoices without params when no status given', async () => {
      await billingApi.getInvoices();
      expect(mockGet).toHaveBeenCalledWith('billing/invoices', undefined);
    });

    it('calls billing/invoices with status filter', async () => {
      await billingApi.getInvoices('pending');
      expect(mockGet).toHaveBeenCalledWith('billing/invoices', { status: 'pending' });
    });
  });

  describe('getInvoice', () => {
    it('calls billing/invoices/:id', async () => {
      await billingApi.getInvoice('inv-123');
      expect(mockGet).toHaveBeenCalledWith('billing/invoices/inv-123');
    });
  });

  describe('getPaymentStatus', () => {
    it('calls billing/payments/:id', async () => {
      await billingApi.getPaymentStatus('pay-456');
      expect(mockGet).toHaveBeenCalledWith('billing/payments/pay-456');
    });
  });

  // --- POST endpoints ---

  describe('createPayment', () => {
    it('calls POST billing/payments with invoiceId and method', async () => {
      const method = { type: 'card', cardId: 'card-1' };
      await billingApi.createPayment('inv-123', method as any);
      expect(mockPost).toHaveBeenCalledWith('billing/payments', { invoiceId: 'inv-123', method });
    });
  });
});
