import type { Invoice } from '@/features/billing/types';

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    title: 'Абонемент "Премиум"',
    description: 'Ежемесячный платеж',
    amount: 5500,
    currency: 'RUB',
    status: 'open',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    items: [
      { name: 'Абонемент Премиум (март)', quantity: 1, price: 5500 },
    ],
  },
  {
    id: 'inv-002',
    title: 'Персональная тренировка',
    amount: 3500,
    currency: 'RUB',
    status: 'open',
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    items: [
      { name: 'ПТ с Игорем Смирновым', quantity: 1, price: 3500 },
    ],
  },
  {
    id: 'inv-003',
    title: 'SPA-массаж',
    amount: 4500,
    currency: 'RUB',
    status: 'paid',
    dueDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    paidAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    items: [
      { name: 'Спортивный массаж', quantity: 1, price: 4500 },
    ],
  },
];
