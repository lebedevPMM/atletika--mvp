import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingApi } from './api';
import type { PaymentMethod } from './types';
import { analytics } from '@/features/analytics/tracker';

export function useInvoices(status?: string) {
  return useQuery({
    queryKey: ['invoices', { status }],
    queryFn: () => billingApi.getInvoices(status),
  });
}

export function useInvoice(invoiceId: string) {
  return useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => billingApi.getInvoice(invoiceId),
    enabled: !!invoiceId,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, method }: { invoiceId: string; method: PaymentMethod }) =>
      billingApi.createPayment(invoiceId, method),
    onSuccess: (payment) => {
      analytics.track({
        name: 'billing_pay_result',
        params: { success: true, method: payment.method, amount: payment.amount },
      });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function usePaymentStatus(paymentId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => billingApi.getPaymentStatus(paymentId),
    enabled: !!paymentId && enabled,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'success' || data?.status === 'failed') return false;
      return 2000; // Poll every 2s while pending/processing
    },
  });
}
