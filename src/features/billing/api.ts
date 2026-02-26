import { api } from '@/shared/api/client';
import type { Invoice, PaymentIntent, PaymentMethod } from './types';

export const billingApi = {
  getInvoices: (status?: string) =>
    api.get<Invoice[]>('billing/invoices', status ? { status } : undefined),
  getInvoice: (invoiceId: string) =>
    api.get<Invoice>(`billing/invoices/${invoiceId}`),
  createPayment: (invoiceId: string, method: PaymentMethod) =>
    api.post<PaymentIntent>('billing/payments', { invoiceId, method }),
  getPaymentStatus: (paymentId: string) =>
    api.get<PaymentIntent>(`billing/payments/${paymentId}`),
};
