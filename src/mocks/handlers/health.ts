import { http, HttpResponse, delay } from 'msw';
import {
  MOCK_BONUS_BALANCE,
  MOCK_BONUS_HISTORY,
  MOCK_FREEZE_RULES,
  MOCK_FREEZE_HISTORY,
  MOCK_VISIT_STATS,
  MOCK_CONTRAINDICATIONS,
  MOCK_FAMILY,
  MOCK_DOCUMENTS,
  MOCK_FAVORITES,
} from '../data/health';

const contraindications = [...MOCK_CONTRAINDICATIONS];
const favorites = [...MOCK_FAVORITES];
let nextCiId = 4;

export const healthHandlers = [
  // Loyalty
  http.get('*/loyalty/balance', async () => {
    await delay(300);
    return HttpResponse.json(MOCK_BONUS_BALANCE);
  }),

  http.get('*/loyalty/history', async () => {
    await delay(300);
    return HttpResponse.json(MOCK_BONUS_HISTORY);
  }),

  // Freeze
  http.get('*/me/membership/freeze-rules', async () => {
    await delay(300);
    return HttpResponse.json(MOCK_FREEZE_RULES);
  }),

  http.get('*/me/membership/freeze-history', async () => {
    await delay(300);
    return HttpResponse.json(MOCK_FREEZE_HISTORY);
  }),

  http.post('*/me/membership/freeze', async () => {
    await delay(400);
    return new HttpResponse(null, { status: 201 });
  }),

  // Visit Stats
  http.get('*/me/stats/visits', async () => {
    await delay(300);
    return HttpResponse.json(MOCK_VISIT_STATS);
  }),

  // Contraindications
  http.get('*/me/contraindications', async () => {
    await delay(300);
    return HttpResponse.json(contraindications);
  }),

  http.post('*/me/contraindications', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { title: string; description: string; severity: string };
    const item = {
      id: `ci-${String(nextCiId++).padStart(3, '0')}`,
      title: body.title,
      description: body.description,
      severity: body.severity as 'high' | 'medium' | 'low',
      addedAt: new Date().toISOString(),
    };
    contraindications.push(item);
    return HttpResponse.json(item, { status: 201 });
  }),

  http.delete('*/me/contraindications/:id', async ({ params }) => {
    await delay(200);
    const idx = contraindications.findIndex((c) => c.id === params.id);
    if (idx !== -1) contraindications.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // Family
  http.get('*/me/family', async () => {
    await delay(300);
    return HttpResponse.json(MOCK_FAMILY);
  }),

  // Documents
  http.get('*/me/documents', async () => {
    await delay(300);
    return HttpResponse.json(MOCK_DOCUMENTS);
  }),

  // Favorites
  http.get('*/me/favorites', async () => {
    await delay(300);
    return HttpResponse.json(favorites);
  }),

  http.delete('*/me/favorites/:id', async ({ params }) => {
    await delay(200);
    const idx = favorites.findIndex((f) => f.id === params.id);
    if (idx !== -1) favorites.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
