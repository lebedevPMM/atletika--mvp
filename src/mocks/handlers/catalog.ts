import { http, HttpResponse, delay } from 'msw';
import { MOCK_CATEGORIES, MOCK_ITEMS, MOCK_PURCHASES } from '../data/catalog';

export const catalogHandlers = [
  http.get('*/catalog/categories', async () => {
    await delay(300);
    return HttpResponse.json(MOCK_CATEGORIES);
  }),

  http.get('*/catalog/items', async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    let items = [...MOCK_ITEMS];
    if (category) items = items.filter((i) => i.categoryId === category);
    return HttpResponse.json(items);
  }),

  http.get('*/me/purchases', async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    let purchases = [...MOCK_PURCHASES];
    if (status) purchases = purchases.filter((p) => p.status === status);
    return HttpResponse.json(purchases);
  }),
];
