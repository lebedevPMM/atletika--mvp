import { http, HttpResponse, delay } from 'msw';
import {
  MOCK_DAY_OVERVIEW,
  MOCK_TRAINER_SESSIONS,
  MOCK_TRAINER_CLIENTS,
} from '../data/trainer';

export const trainerHandlers = [
  // Day overview
  http.get('*/trainer/day-overview', async () => {
    await delay(300);
    return HttpResponse.json(MOCK_DAY_OVERVIEW);
  }),

  // Schedule (date range)
  http.get('*/trainer/schedule', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const _from = url.searchParams.get('from');
    const _to = url.searchParams.get('to');
    // In mock, return all sessions regardless of date range
    return HttpResponse.json(MOCK_TRAINER_SESSIONS);
  }),

  // Single session
  http.get('*/trainer/sessions/:id', async ({ params }) => {
    await delay(200);
    const session = MOCK_TRAINER_SESSIONS.find((s) => s.id === params.id);
    if (!session) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Занятие не найдено' },
        { status: 404 },
      );
    }
    return HttpResponse.json(session);
  }),

  // Mark attendance
  http.post('*/trainer/sessions/:id/attend', async ({ params }) => {
    await delay(300);
    const session = MOCK_TRAINER_SESSIONS.find((s) => s.id === params.id);
    if (!session) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Занятие не найдено' },
        { status: 404 },
      );
    }
    return HttpResponse.json({ ...session, status: 'completed' });
  }),

  // Cancel session
  http.post('*/trainer/sessions/:id/cancel', async ({ params }) => {
    await delay(300);
    const session = MOCK_TRAINER_SESSIONS.find((s) => s.id === params.id);
    if (!session) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Занятие не найдено' },
        { status: 404 },
      );
    }
    return HttpResponse.json({ ...session, status: 'cancelled' });
  }),

  // Client list
  http.get('*/trainer/clients', async () => {
    await delay(300);
    return HttpResponse.json(MOCK_TRAINER_CLIENTS);
  }),

  // Single client
  http.get('*/trainer/clients/:id', async ({ params }) => {
    await delay(200);
    const client = MOCK_TRAINER_CLIENTS.find((c) => c.id === params.id);
    if (!client) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Клиент не найден' },
        { status: 404 },
      );
    }
    return HttpResponse.json(client);
  }),
];
