import { http, HttpResponse, delay } from 'msw';
import { MOCK_INVOICES } from '../data/billing';
import type { PaymentIntent } from '@/features/billing/types';

const payments = new Map<string, PaymentIntent>();
let paymentCounter = 0;

export const billingHandlers = [
  http.get('*/billing/invoices', async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    let invoices = [...MOCK_INVOICES];
    if (status) invoices = invoices.filter((i) => i.status === status);
    return HttpResponse.json(invoices);
  }),

  http.get('*/billing/invoices/:invoiceId', async ({ params }) => {
    await delay(300);
    const invoice = MOCK_INVOICES.find((i) => i.id === params.invoiceId);
    if (!invoice) return HttpResponse.json({ code: 'NOT_FOUND' }, { status: 404 });
    return HttpResponse.json(invoice);
  }),

  http.post('*/billing/payments', async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { invoiceId: string; method: string };
    const invoice = MOCK_INVOICES.find((i) => i.id === body.invoiceId);
    const id = `pay-${++paymentCounter}`;

    const payment: PaymentIntent = {
      id,
      invoiceId: body.invoiceId,
      amount: invoice?.amount || 0,
      currency: 'RUB',
      method: body.method as 'card' | 'sbp',
      status: 'pending',
      confirmationUrl:
        body.method === 'card' ? 'https://3ds-mock.example.com/confirm' : undefined,
      qrUrl: body.method === 'sbp' ? 'https://qr.nspk.ru/mock-payment-qr' : undefined,
      qrPayload:
        body.method === 'sbp'
          ? 'ST00012|Name=Atletika|Amount=' + (invoice?.amount || 0)
          : undefined,
    };

    payments.set(id, payment);
    // Auto-complete payment after 3 seconds
    setTimeout(() => {
      const p = payments.get(id);
      if (p) payments.set(id, { ...p, status: 'success' });
    }, 3000);

    return HttpResponse.json(payment, { status: 201 });
  }),

  http.get('*/billing/payments/:paymentId', async ({ params }) => {
    await delay(200);
    const payment = payments.get(params.paymentId as string);
    if (!payment) return HttpResponse.json({ code: 'NOT_FOUND' }, { status: 404 });
    return HttpResponse.json(payment);
  }),
];
